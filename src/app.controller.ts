import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { SearchTrackDto } from './models/search-track.dto';
import { Track } from './models/track';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('analyze')
  @HttpCode(200)
  analyzeTrack(@Body() searchTrackDto: SearchTrackDto): Observable<Track> {
    const { name, artist } = searchTrackDto;

    return this.appService.analyze(name, artist);
  }
}
