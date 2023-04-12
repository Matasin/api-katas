import { User } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    isVerified: true,
    data: {
      someAttribute: 'Some Value'
    }
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    isVerified: false,
    data: {
      someAttribute: 'Another Value'
    }
  },
];
