import { Request } from 'express';
import { User } from '../../users/types';

export interface AuthenticatedRequest extends Request {
  user: Pick<User, 'id' | 'username'>;
}
