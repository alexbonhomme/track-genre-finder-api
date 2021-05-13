import { Injectable } from '@nestjs/common';
import { Client } from 'disconnect';
import { EasyconfigService } from 'nestjs-easyconfig';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DiscogsService {
  private discogsApi;

  constructor(config: EasyconfigService) {
    this.discogsApi = new Client('TracksUserAgent/1.0', {
      consumerKey: config.get('DISCOGS_CLIENT_ID'),
      consumerSecret: config.get('DISCOGS_CLIENT_SECRET'),
    });
  }

  fetchGenres(name: string, artist: string): Observable<string[]> {
    return from(
      this.discogsApi.database().search({
        type: 'release',
        release_title: name,
        artist,
      }),
    ).pipe(
      map(({ results }) => {
        if (results.length === 0) {
          return [];
        }

        return results[0].genre;
      }),
    );
  }
}
