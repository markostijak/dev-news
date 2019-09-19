export class User {

  public id: string;
  public role: string;
  public email: string;
  public status: string;
  public picture: string;
  public username: string;
  public lastName: string;
  public firstName: string;

  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

}
