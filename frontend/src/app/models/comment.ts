import {User} from './user';
import {Links} from './hal';
import {Post} from './post';

export class Comment {
  id: string;
  slug: string;
  content: string;
  fullSlug: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  replies: Comment[];
  post: Post | string;
  parent: Comment | string;
  _links: Links;
}
