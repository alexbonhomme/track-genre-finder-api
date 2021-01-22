import { HttpService, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class DeezerService {
  constructor(private http: HttpService) {}

  fetchGenres(name: string, artist: string): Observable<string[]> {
    const query = `track:"${name}" artist:"${artist}"`;
    const url = `https://api.deezer.com/search?q=${encodeURI(query)}`;

    return this.http.get(url).pipe(
      map(({ data }) => data.data.filter((track) => track.type === 'track')),
      mergeMap((trackCollection) => {
        if (trackCollection.length === 0) {
          return of([]);
        }

        return this.fetchAlbum(trackCollection[0].album.id).pipe(
          map(({ data }) => data.genres.data.map((genre) => genre.name)),
        );
      }),
    );
  }

  fetchAlbum(id: number): Observable<any> {
    const url = `https://api.deezer.com/album/${id}`;

    return this.http.get(url);
  }
}
