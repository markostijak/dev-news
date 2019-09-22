import {Links} from './hal';

export class User {

  public id: string;
  public role: string;
  public email: string;
  public status: string;
  public picture: string;
  public username: string;
  public lastName: string;
  public firstName: string;
  public _links: Links;

}
