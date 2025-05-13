export interface User {
  username: string;
  image?: string;
  bio?: string;
}

export interface CurrentUser extends User {
  email: string;
  token: string;
}

export interface Author extends User {
  following: boolean;
}

type UserVariant = 'current' | 'author';

export interface UserProps {
  variant: UserVariant;
  user?: CurrentUser | Author | null;
  createdAt?: string;
  style?: React.CSSProperties;
}
