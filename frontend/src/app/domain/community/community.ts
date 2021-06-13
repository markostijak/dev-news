import {User} from '../user/user';
import {Embedded, Links} from '../utils/hal';

export class Community {
  public logo: string;
  public alias: string;
  public title: string;
  public membersCount: number = 0;
  public postsCount: number = 0;
  public description: string;
  public createdBy: User;
  public createdAt: string;
  public _links: Links;
  public _embedded: Embedded<User>;
}

