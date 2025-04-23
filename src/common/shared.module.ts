import { Global, Module } from '@nestjs/common';
import { RequestContextService } from 'src/request-context.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  providers: [RequestContextService, CacheService],
  exports: [RequestContextService, CacheService],
})
export class SharedModule {}
