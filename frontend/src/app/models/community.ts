import {Post} from './post';
import {NavigationItem} from '../services/navigation/navigation.service';
import {Links} from './hal';
import {User} from './user';

export class Community implements NavigationItem {

  public id: string;
  public logo: string;
  public posts: Post[];
  public alias: string;
  public title: string;
  public membersCount: number = 0;
  public postsCount: number = 0;
  public description: string;
  public createdBy: User;
  public _links: Links;
}
