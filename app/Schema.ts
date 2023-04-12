import { gql } from 'apollo-server-express';

const Schema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    isVerified: Boolean!
    someAttribute: String
  }
  
  type Query {
    users: [User]
    user(id: ID!): User
  }
`;

export default Schema;
