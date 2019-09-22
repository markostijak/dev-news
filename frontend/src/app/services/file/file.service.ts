import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public uploadImage(image: File): Observable<string> {
    if (!image) {
      return of(null);
    }

    const form = new FormData();
    form.set('file', image);
    return this._httpClient.post('api/v1/files/image', form) as Observable<string>;
  }

}
