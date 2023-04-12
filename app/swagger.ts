import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My Api-Expertise',
      version: '1.0.0',
      description: 'My Api-Expertise description',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Dev server',
      },
    ],
  },
  apis: ['**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
