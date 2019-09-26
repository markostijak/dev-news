import {User} from './user';
import {Community} from './community';
import {Links} from './hal';
import {Comment} from './comment';

export class Post {

  public id: string;
  public alias: string;
  public title: string;
  public content: string;
  public createdBy: User;
  public createdAt: string;
  public updatedAt: string;
  public comments: Comment[];
  public commentsCount: number = 0;
  public community: Community;
  public _links: Links;

}
