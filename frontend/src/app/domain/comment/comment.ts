import {User} from '../user/user';
import {Post} from '../post/post';
import {Embedded, Links} from '../utils/hal';

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
  _embedded: Embedded<User>;
}
