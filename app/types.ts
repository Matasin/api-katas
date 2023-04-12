export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  data: {
    someAttribute: string;
  };
};
