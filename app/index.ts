import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

import Schema from './Schema';
import Resolvers from './Resolvers';

async function startApolloServer(schema: any, resolvers: any) {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }) as any;

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(Schema, Resolvers);
