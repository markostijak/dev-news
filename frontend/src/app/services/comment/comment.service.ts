import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {AuthenticationService} from '../authentication/authentication.service';
import {Comment} from '../../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private _user: User;
  private _httpClient: HttpClient;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
  }

  public createComment(post: Post, comment: Comment): Observable<Comment> {
    return of({} as Comment);
  }

}
