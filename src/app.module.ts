import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItunesModule } from './itunes/itunes.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [ItunesModule, SpotifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
