import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Link, LinkAware} from './hal';
import {tap} from 'rxjs/operators';

export interface Options {
  params?: {
    [key: string]: string;
  };
  headers?: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RestTemplate {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  private static toHttpParams(options: Options): HttpParams {
    if (!options || !options.params) {
      return null;
    }

    return Object.entries(options.params)
      .filter(([key, value]) => value)
      .reduce((httpParams, [key, value]) => httpParams.set(key, value), new HttpParams());
  }

  private static toHttpHeaders(options: Options): HttpHeaders {
    if (!options || !options.headers) {
      return null;
    }

    return Object.entries(options.headers)
      .filter(([key, value]) => value)
      .reduce((httpHeaders, [key, value]) => httpHeaders.set(key, value), new HttpHeaders());
  }

  public get(link: string | Link, params?: any): Observable<Object> {
    return this.httpClient.get(LinkAware.createUrl(link), {
      params: RestTemplate.toHttpParams({params: params})
    });
  }

  public put(link: string | Link, body: any, options?: Options): Observable<Object> {
    return this.httpClient.put(LinkAware.createUrl(link), body, {
      headers: RestTemplate.toHttpHeaders(options),
      params: RestTemplate.toHttpParams(options)
    });
  }

  public patch(link: string | Link, body: any, options?: Options): Observable<Object> {
    return this.httpClient.patch(LinkAware.createUrl(link), body, {
      headers: RestTemplate.toHttpHeaders(options),
      params: RestTemplate.toHttpParams(options)
    });
  }

  public post(link: string | Link, body: any, options?: Options): Observable<Object> {
    return this.httpClient.post(LinkAware.createUrl(link), body, {
      headers: RestTemplate.toHttpHeaders(options),
      params: RestTemplate.toHttpParams(options)
    });
  }

  public delete(link: string | Link): Observable<any> {
    return this.httpClient.delete(LinkAware.createUrl(link));
  }

}
