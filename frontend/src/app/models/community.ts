export class Community {

  private _id: string;
  private _logo: string;
  private _title: string;
  private _description: string;
  private _members: number = 0;

  constructor(id: string, title: string, description: string, logo: string, members: number) {
    this._id = id;
    this._title = title;
    this._logo = logo || null;
    this._members = members || 0;
    this._description = description || '';
  }

  get logo(): string {
    return this._logo;
  }

  set logo(value: string) {
    this._logo = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get members(): number {
    return this._members;
  }

  set members(value: number) {
    this._members = value;
  }

}
