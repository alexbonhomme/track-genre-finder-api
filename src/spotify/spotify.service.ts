import { Injectable } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Track } from 'src/models/track';

const SpotifyWebApi = require('spotify-web-api-node');

@Injectable()
export class SpotifyService {
  private spotifyApi = new SpotifyWebApi({
    clientId: 'f6ebc72815c048c3acd8a4edbb8a9765',
    clientSecret: '833dd66c51d74f7d944033d2a5428b7d',
  });
  private tokenExpiresAt;

  private updateToken(): Observable<any> {
    if (Date.now() < this.tokenExpiresAt) {
      return of(undefined);
    }

    // Retrieve an access token.
    return from(this.spotifyApi.clientCredentialsGrant()).pipe(
      map(({ body }) => {
        this.tokenExpiresAt = Date.now() + body['expires_in'] * 1000;

        // Save the access token so that it's used in future calls
        this.spotifyApi.setAccessToken(body['access_token']);
      })
    );
  }

  searchTrack(name: string, artist: string): Observable<Track[]> {
    const query = `track:${name} artist:${artist}`;

    return this.updateToken().pipe(
      mergeMap(() =>
        from(this.spotifyApi.searchTracks(query))
      ),
      map(({ body }) => {
        return body.tracks.items.map((track) => {
          return {
            name: track.name,
            artistName: track.artists.map((el) => el.name).join(', '),
            genre: {},
            albumName: track.album.name,
            coverUrl: track.album.images[0].url,
          };
        });
      })
    );
  }

  searchArtist(name: string): Observable<any[]> {
    return this.updateToken().pipe(
      mergeMap(() =>
        from(this.spotifyApi.searchArtists(name))
      ),
      map(({ body }) => body.artists.items),
      // map(({ body }) => {
      //   return body.tracks.items.map((track) => {
      //     return {
      //       name: track.name,
      //       artistName: track.artists.map((el) => el.name).join(', '),
      //       genre: {},
      //       albumName: track.album.name,
      //       coverUrl: track.album.images[0].url,
      //     };
      //   });
      // })
    );
  }
}
