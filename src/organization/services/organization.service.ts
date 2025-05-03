import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from '../schemas/organization';
import { Model } from 'mongoose';
import { CacheService } from 'src/common/services/cache.service';
import { OrganizationDto } from '../dtos/organization-dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>,
    private readonly cacheService: CacheService,
  ) {}

  async createOrganization(organizationDto: OrganizationDto) {
    const { organization_name } = organizationDto;
    const org = new this.organizationModel({
      organization_name,
    });

    return await this.cacheService.writeDataWithStore({
      query: () => org.save(),
      cacheKey: ['id'],
      ttl: 36000,
    });
  }

  async updateOrganization(orgDto: OrganizationDto, id: string) {
    const res = await this.organizationModel
      .findOneAndUpdate({
        _id: id,
        $set: { ...orgDto },
      })
      .exec();
    this.cacheService.setData(id, res);
    return res;
  }

  async getOrganizationById(id: string) {
    return this.cacheService.getQueryWithCacheStore<Organization>({
      query: () => this.organizationModel.findById(id),
      cacheKey: {
        getKey: 'id',
        setKey: ['id'],
      },
    });
  }
}
