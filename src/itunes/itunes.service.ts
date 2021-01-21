import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Track } from 'src/models/track';

@Injectable()
export class ItunesService {
  constructor(private http: HttpService) {}

  searchTrack(name: string, artist?: string): Observable<Track[]> {
    const query = `${name} ${artist}`.replace(/ /g, '+');
    const url = `https://itunes.apple.com/search?entity=song&term=${encodeURI(query)}`;

    return this.http.get(url).pipe(
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
