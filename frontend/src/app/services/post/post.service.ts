import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {Post} from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _user: User;
  private _httpClient: HttpClient;
  private _newPost: BehaviorSubject<Post>;

  constructor(httpClient: HttpClient, authenticationService: AuthenticationService) {
    this._httpClient = httpClient;
    this._newPost = new BehaviorSubject<Post>(null);
    authenticationService.authentication.subscribe(authentication => {
      this._user = authentication.principal;
    });
  }

  public publish(post: Post): void {
    this._newPost.next(post);
  }

  public newPost(): Observable<Post> {
    return this._newPost.asObservable();
  }

}
