import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItunesModule } from './itunes/itunes.module';

@Module({
  imports: [ItunesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
