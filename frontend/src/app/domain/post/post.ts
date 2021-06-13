import {User} from '../user/user';
import {Embedded, Links} from '../utils/hal';
import {Comment} from '../comment/comment';
import {Community} from '../community/community';

export class Post {
  public alias: string;
  public title: string;
  public content: string;
  public createdBy: User;
  public createdAt: string;
  public updatedAt: string;
  public comments: Comment[];
  public community: Community;
  public commentsCount: number = 0;
  public _links: Links;
  public _embedded: Embedded<User & Community>;
}
