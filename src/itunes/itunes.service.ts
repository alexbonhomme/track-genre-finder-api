import { HttpService, Injectable } from '@nestjs/common';
import { delay, map, mergeMap, retryWhen } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Track } from 'src/models/track';

@Injectable()
export class ItunesService {
  constructor(private http: HttpService) {}

  searchTrack(name: string, artist?: string): Observable<Track[]> {
    const query = `${name} ${artist}`.replace(/ /g, '+');
    const url = `https://itunes.apple.com/search?entity=song&term=${encodeURI(query)}`;

    let retries = 0;

    return this.http.get(url).pipe(
      retryWhen((errors) => errors.pipe(
        delay(1000 * (retries + 1)),
        mergeMap(error => {
          if (retries < 3) {
            retries += 1;

            return of(error)
          } else {
            return throwError(error)
          }
        }),
      )),
      map(({ data }) => {
        return data.results.map((song) => {
          return {
            name: song.trackName,
            artistName: song.artistName,
            genre: {
              itunes: song.primaryGenreName,
            },
            albumName: song.collectionName,
            coverUrl: song.artworkUrl100,
          };
        });
      }),
    );
  }
}
