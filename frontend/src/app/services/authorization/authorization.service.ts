import {Injectable} from '@angular/core';
import {Community} from '../../models/community';
import {Post} from '../../models/post';
import {Comment} from '../../models/comment';
import {Authentication, AuthenticationService} from '../authentication/authentication.service';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private _authentication: Authentication;

  constructor(authenticationService: AuthenticationService) {
    authenticationService.authentication.subscribe(authentication => {
      this._authentication = authentication;
    });
  }

  public hasPermission(entity: Community | Post | Comment, permission: string): boolean {
    if (!this.authenticated()) {
      return false;
    }

    const principal: User = this.authentication.principal;
    return entity.createdBy.username === principal.username;
  }

  public canEdit(entity: Community | Post | Comment): boolean {
    return this.hasPermission(entity, 'update');
  }

  public canDelete(entity: Community | Post | Comment): boolean {
    return this.hasPermission(entity, 'delete');
  }

  public canCreate(entity?: Community | Post | Comment): boolean {
    if (entity) {
      return this.hasPermission(entity, 'write');
    } else {
      return this.authenticated();
    }
  }

  public canView(resource?: object): boolean {
    return this._authentication.authenticated;
  }

  private authenticated(): boolean {
    return this._authentication.authenticated || false;
  }

  public get authentication(): Authentication {
    return this._authentication;
  }

}
