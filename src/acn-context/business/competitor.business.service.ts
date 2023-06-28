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

	async deleteCompetitor(id: number) {
		return this.competitorEntityService.deleteCompetitor(id);
	}
}