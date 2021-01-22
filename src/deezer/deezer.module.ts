import { HttpModule, Module } from '@nestjs/common';
import { DeezerService } from './deezer.service';

@Module({
  imports: [HttpModule],
  providers: [DeezerService],
  exports: [DeezerService],
})
export class DeezerModule {}
