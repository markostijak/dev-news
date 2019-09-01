import {Post} from './post';
import {NavigationItem} from '../services/navigation/navigation.service';

export class Community implements NavigationItem {

  private _id: string;
  private _logo: string;
  private _posts: Post[];
  private _alias: string;
  private _title: string;
  private _members: number;
  private _postsCount: number = 0;
  private _description: string;

  constructor(
    id: string, logo: string, posts: Post[], alias: string, title: string, members: number, postsCount: number, description: string) {

    this._id = id;
    this._logo = logo;
    this._posts = posts;
    this._alias = alias;
    this._title = title;
    this._members = members;
    this._postsCount = postsCount;
    this._description = description;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get logo(): string {
    return this._logo;
  }

  set logo(value: string) {
    this._logo = value;
  }

  get posts(): Post[] {
    return this._posts;
  }

  set posts(value: Post[]) {
    this._posts = value;
  }

  get alias(): string {
    return this._alias;
  }

  set alias(value: string) {
    this._alias = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get members(): number {
    return this._members;
  }

  set members(value: number) {
    this._members = value;
  }

  get postsCount(): number {
    return this._postsCount;
  }

  set postsCount(value: number) {
    this._postsCount = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

}
