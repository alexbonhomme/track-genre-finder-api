import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Track } from 'src/models/track';

const SpotifyWebApi = require('spotify-web-api-node');

@Injectable()
export class SpotifyService {
  private spotifyApi;
  private tokenExpiresAt;

  constructor(config: EasyconfigService) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: config.get('SPOTIFY_CLIENT_ID'),
      clientSecret: config.get('SPOTIFY_CLIENT_SECRET'),
    });
  }

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
      }),
    );
  }

  searchTrack(name: string, artist: string): Observable<Track[]> {
    const query = `track:${name} artist:${artist}`;

    return this.updateToken().pipe(
      mergeMap(() => from(this.spotifyApi.searchTracks(query))),
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
      }),
    );
  }

  searchArtist(name: string): Observable<any[]> {
    return this.updateToken().pipe(
      mergeMap(() => from(this.spotifyApi.searchArtists(name))),
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

  fetchGenresFromArtistName(name: string): Observable<string[]> {
    return this.searchArtist(name).pipe(
      map((collection: any) => {
        if (collection.length === 0) {
          return [];
        }

        return collection[0].genres;
      }),
    );
  }
}
