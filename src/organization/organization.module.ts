import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './schemas/organization';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: OrganizationSchema,
        name: Organization.name,
      },
    ]),
  ],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
