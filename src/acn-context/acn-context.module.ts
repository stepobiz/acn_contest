import { Module } from '@nestjs/common';
import { PrismaService } from './repository/prisma.service';

import { CompetitorBusinessService } from './business/competitor.business.service';
import { CompetitorEntityService } from './entity/competitor.entity.service';
import { CompetitorController } from './web/rest/competitor.controller';

@Module({
	providers: [
		PrismaService,

		CompetitorBusinessService,
		CompetitorEntityService,

	],
	controllers: [
		CompetitorController,

	]
})
export class AcnContextModule { }
