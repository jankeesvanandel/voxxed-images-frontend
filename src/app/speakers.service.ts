import { Observable } from 'rxjs';
import { Speaker } from './model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeakersService {

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<Speaker[]> {
    return this.httpClient.get<string[]>('/api/lienify/speakers/all').pipe(
      map(speakers => {
        return Object.entries(speakers).map(([key, value]) => {
          return { id: key, name: value };
        });
      })
    );
  }

}
