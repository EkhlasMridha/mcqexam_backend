import { Module } from '@nestjs/common';
import { HashingProvider } from './services/hashing.provider';
import { BcryptProvider } from './services/bcrypt.provider';

@Module({
    providers: [{
        provide:HashingProvider,
        useClass:BcryptProvider
      }],
      exports:[HashingProvider]
})
export class UtilityModule {}
