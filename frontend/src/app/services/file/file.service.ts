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

  public uploadImage(image: File | Blob): Observable<string> {
    if (!image) {
      return of(null);
    }

    const form = new FormData();
    form.append('file', image);

    return this._httpClient.post('/api/v1/files/image', form) as Observable<string>;
  }

  public uploadDataUrl(dataUrl: string): Observable<string> {
    if (!dataUrl) {
      return of(null);
    }

    return this.uploadImage(this.dataUrlToBlob(dataUrl));
  }

  private dataUrlToBlob(dataUrl): Blob {
    const array = dataUrl.split(','),
      contentType = array[0].match(/:(.*?);/)[1],
      base64 = array[1];

    const sliceSize = 1024;
    const byteCharacters = atob(base64);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {type: contentType});
  }

}
