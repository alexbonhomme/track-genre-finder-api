import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItunesModule } from './itunes/itunes.module';
import { SpotifyModule } from './spotify/spotify.module';
import { DeezerModule } from './deezer/deezer.module';

@Module({
  imports: [
    EasyconfigModule.register({
      path: '.env',
    }),
    ItunesModule,
    SpotifyModule,
    DeezerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
