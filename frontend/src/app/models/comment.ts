import {User} from './user';

export class Comment {
  id: string;
  content: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}
