import {Links} from '../utils/hal';
import {Community} from '../community/community';

export class User {
  public id: string;
  public role: string;
  public email: string;
  public status: string;
  public picture: string;
  public username: string;
  public lastName: string;
  public firstName: string;
  public privileges: string[];
  public createdAt: string;
  public communities: Community[];
  public _links: Links;

}
