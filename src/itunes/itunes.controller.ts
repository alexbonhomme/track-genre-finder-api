import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SearchTrackDto } from 'src/models/search-track.dto';
import { Track } from 'src/models/track';
import { ItunesService } from './itunes.service';

@Controller('itunes')
export class ItunesController {
  constructor(private itunesService: ItunesService) {}

  @Post('search')
  @HttpCode(200)
  searchTrack(@Body() searchTrackDto: SearchTrackDto): Observable<Track[]> {
    return this.itunesService.searchTrack(
      searchTrackDto.name,
      searchTrackDto.artist,
    );
  }
}
