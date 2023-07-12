import { Module } from '@nestjs/common';
import { PrismaService } from './repository/prisma.service';

import { CompetitorBusinessService } from './business/competitor.business.service';
import { CompetitorEntityService } from './entity/competitor.entity.service';
import { CompetitorController } from './web/rest/competitor.controller';
import { TelegramService } from './web/telegram.service';
import { TelegramUserService } from './telegram/user.service';
import { TelegramCommonService } from './telegram/common.service';
import { TelegramUserGroupService } from './telegram/user-group.service';
import { TelegramSQuizValutationService } from './telegram/s-quiz-valutation.service';

@Module({
	providers: [
		PrismaService,

		CompetitorBusinessService,
		CompetitorEntityService,

		TelegramService,
		TelegramCommonService,
		TelegramUserService,
		TelegramUserGroupService,
		TelegramSQuizValutationService,

	],
	controllers: [
		CompetitorController,

	]
})
export class AcnContextModule { }
