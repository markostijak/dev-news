import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {AuthenticationAware} from '../authentication/authentication-aware';
import {Authentication} from '../authentication/authentication';
import {Community} from '../community/community';
import {Post} from '../post/post';
import {User} from '../user/user';
import {Comment} from '../comment/comment';

@Injectable({
  providedIn: 'root'
})
export class Authorization extends AuthenticationAware {

  constructor(authentication$: Observable<Authentication>) {
    super(authentication$);
  }

  public hasPermission(entity: Community | Post | Comment, permission: string): boolean {
    if (!this.authenticated) {
      return false;
    }

    const principal: User = this.authentication.principal;
    return entity._links.createdBy.href.includes(principal._links.self.href);
  }

  public canEdit(entity: Community | Post | Comment): boolean {
    return this.hasPermission(entity, 'UPDATE');
  }

  public canDelete(entity: Community | Post | Comment): boolean {
    return this.hasPermission(entity, 'DELETE');
  }

  public canCreate(entity?: Community | Post | Comment): boolean {
    if (entity) {
      return this.hasPermission(entity, 'WRITE');
    } else {
      return this.authenticated;
    }
  }

  public canView(resource?: object): boolean {
    return this.authenticated;
  }

}
