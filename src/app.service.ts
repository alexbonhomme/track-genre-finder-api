import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Track } from './models/track';
import { ItunesService } from './itunes/itunes.service';
import { SpotifyService } from './spotify/spotify.service';

@Injectable()
export class AppService {
  constructor(
    private readonly itunesService: ItunesService,
    private readonly spotifyService: SpotifyService,
  ) {}

  analyze(name: string, artist: string): Observable<Track> {
    return this.itunesService.searchTrack(name, artist).pipe(
      catchError((error) => {
        // avoid blocking analays of big playlists
        if (error.code === 403) {
          return of([]);
        }

        throw error;
      }),
      mergeMap((trackCollection) => {
        // if not found on itunes, fetch from spotify
        if (trackCollection.length === 0) {
          return this.spotifyService.searchTrack(name, artist);
        }

        return of(trackCollection);
      }),
      mergeMap((trackCollection) => {
        if (trackCollection.length === 0) {
          return of(undefined);
        }

        // get the first one only to not kill spotify API
        const track = trackCollection[0];

        // return forkJoin(
        //   trackCollection.map(track =>
        //     this.fetchGenresFromSpotify(track.artistName).pipe(
        //       map(genres => {
        //         track.genre.spotify = genres;

        //         return track;
        //       })
        //     )
        //   )
        // );

        return this.fetchGenresFromSpotify(track.artistName).pipe(
            map(genres => {
              track.genre.spotify = genres;

              return track;
            })
          );
        }
      ),
      // removes track not found
      // filter(track => !!track)
    );
  }

  private fetchGenresFromSpotify(artistName: string): Observable<string> {
    return this.spotifyService.searchArtist(artistName).pipe(
      map((collection: any) => {
        if (collection.length === 0) {
          return '';
        }

        return collection[0].genres.join(', ');
      })
    );
  }
}
