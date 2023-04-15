import http from 'http';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import type { DocumentNode } from 'graphql';

import Schema from './Schema';
import Resolvers from './Resolvers';
import { users } from './dataset';
import { User } from './types';

async function startApolloServer(schema: DocumentNode, resolvers: typeof Resolvers) {
  const app = express();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(Schema, Resolvers);

// - REST - 

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.get('/users', (_, res: Response) => {
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/users', (req: Request, res: Response) => {
  const { name, email, isVerified, data } = req.body;
  if (!name || !email || isVerified === undefined || !data) {
    res.status(400).send('Name, email, isVerified, and data are required');
    return;
  }
  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    isVerified,
    data,
  };
  users.push(newUser);
  res.json(newUser);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, isVerified, data } = req.body;
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if (isVerified !== undefined) {
    user.isVerified = isVerified;
  }
  if (data) {
    user.data = data;
  }
  res.json(user);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    res.status(404).send('User not found');
    return;
  }
  users.splice(userIndex, 1);
  res.sendStatus(204);
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server documentation running on http://localhost:${PORT}/api-docs`);

});
