import { Injectable } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Track } from './models/track';
import { ItunesService } from './itunes/itunes.service';
import { SpotifyService } from './spotify/spotify.service';
import { DeezerService } from './deezer/deezer.service';
import { DiscogsService } from './discogs/discogs.service';

@Injectable()
export class AppService {
  constructor(
    private readonly itunesService: ItunesService,
    private readonly spotifyService: SpotifyService,
    private readonly deezerService: DeezerService,
    private readonly discogsService: DiscogsService,
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
      mergeMap((trackCollection: Track[]) => {
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

        return forkJoin([
          this.spotifyService.fetchGenresFromArtistName(track.artistName),
          this.deezerService.fetchGenres(name, artist),
          this.discogsService.fetchGenres(name, artist),
        ]).pipe(
          map((genres) => {
            track.genre.spotify = genres[0].join(', ');
            track.genre.deezer = genres[1].join(', ');
            track.genre.discogs = genres[2].join(', ');

            return track;
          }),
        );
      }),
    );
  }
}
