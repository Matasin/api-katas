import { 
  users,
 } from './dataset';
import { User } from './types';

const Resolvers = {
  Query: {
    users: () => users,
    user: (parent: any, args: any) => users.find(user => user.id === args.id),
  },
  User: {
    someAttribute: (user: User) => user.data.someAttribute,
  },
};

export default Resolvers;
