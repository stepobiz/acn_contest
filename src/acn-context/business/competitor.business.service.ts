import { Injectable } from "@nestjs/common";
import { CompetitorDto } from "../dto/competitor.dto";
import { CompetitorEntityService } from "../entity/competitor.entity.service";

@Injectable({})
export class CompetitorBusinessService {
	constructor(
		private competitorEntityService: CompetitorEntityService,
	) {}

	async createCompetitor(competitorDto: CompetitorDto) {
		return this.competitorEntityService.insertCompetitor(competitorDto);
	}

	async editCompetitor(competitorDto: CompetitorDto) {
		return this.competitorEntityService.updateCompetitor(competitorDto);
	}

	async searchCompetitors(filters: any): Promise<CompetitorDto[]> {
		return this.competitorEntityService.getCompetitors(filters);
	}

	async countCompetitors(filters: any): Promise<number> {
		return this.competitorEntityService.countCompetitors(filters);
	}

	async getCompetitor(id: number): Promise<CompetitorDto> {
		return this.competitorEntityService.getCompetitor(id);
	}

	async getCompetitorByTelegramId(telegramId: string): Promise<CompetitorDto> {
		let competitors: CompetitorDto[] = await this.searchCompetitors({
			telegramIdEquals: telegramId
		});

		if(competitors.length == 0) throw "user_not_found";
		if(competitors.length > 1) throw "multiple_user";

		return competitors[0];
	}

	async deleteCompetitor(id: number) {
		return this.competitorEntityService.deleteCompetitor(id);
	}
}