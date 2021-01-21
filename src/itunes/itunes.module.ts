import { HttpModule, Module } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesController } from './itunes.controller';

@Module({
  imports: [HttpModule],
  providers: [ItunesService],
  controllers: [ItunesController],
})
export class ItunesModule {}
