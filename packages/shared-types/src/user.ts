export enum Role {
  USER = 'USER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export interface User {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
