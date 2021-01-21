import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SearchArtistDto } from 'src/models/search-artist.dto';
import { SearchTrackDto } from 'src/models/search-track.dto';
import { Track } from 'src/models/track';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  @Post('search')
  @HttpCode(200)
  searchTrack(@Body() searchTrackDto: SearchTrackDto): Observable<Track[]> {
    return this.spotifyService.searchTrack(
      searchTrackDto.name,
      searchTrackDto.artist,
    );
  }

  @Post('search/artist')
  @HttpCode(200)
  searchArtist(@Body() searchArtistDto: SearchArtistDto): Observable<Track[]> {
    return this.spotifyService.searchArtist(searchArtistDto.name);
  }
}
