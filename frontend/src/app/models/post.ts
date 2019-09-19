import {User} from './user';
import {Community} from './community';

export class Post {

  public id: string;
  public title: string;
  public content: string;
  public createdBy: User;
  public createdAt: string;
  public updatedAt: string;
  public community: Community;
  public commentsCount: number = 0;
}
