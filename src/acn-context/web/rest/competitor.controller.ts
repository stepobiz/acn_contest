import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompetitorBusinessService } from "../../business/competitor.business.service";
import { CompetitorDto } from "../../dto/competitor.dto";
import { StatsService } from "src/acn-context/action/stats.service";
import { writeFileSync } from "fs";

@ApiTags('competitor')
@Controller('acn/context')
export class CompetitorController {
	constructor(
		private competitorBusinessService: CompetitorBusinessService,
		private statsService: StatsService,
	) { }

	@Post('competitors')
	@ApiResponse({ status: 201, description: 'The record has been successfully created.' })
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	createCompetitor(@Body() competitorDto: CompetitorDto) {
		if (competitorDto.id !== undefined) {
			throw new BadRequestException("not insert id in creation");
		}
		return this.competitorBusinessService.createCompetitor(competitorDto);
	}

	@Put('competitors')
	@ApiResponse({ status: 201, description: 'The record has been successfully updated.' })
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	updateCompetitor(@Body() competitorDto: CompetitorDto) {
		if (competitorDto.id === undefined) {
			throw new BadRequestException("id is required in update");
		}
		return this.competitorBusinessService.editCompetitor(competitorDto);
	}

	@Get('competitors')
	@ApiResponse({ status: 200, description: 'List of competitors.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	getAllCompetitors(@Query() queryParams): Promise<any> {
		let filters: any = queryParams;
		return this.competitorBusinessService.searchCompetitors(filters);
	}

	@Get('competitors/count')
	@ApiResponse({ status: 200, description: 'Count of competitors.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	getCompetitorsCount(@Query() queryParams): Promise<number> {
		let filters: any = queryParams;
		return this.competitorBusinessService.countCompetitors(filters);
	}

	@Get('competitors/:id')
	@ApiResponse({ status: 200, description: 'Competitor detail.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	async getCompetitor(@Param('id') id: number): Promise<CompetitorDto> {
		let competitorDto: CompetitorDto = await this.competitorBusinessService.getCompetitor(+id);
		if (competitorDto === null) throw new NotFoundException();
		return competitorDto;
	}

	@Delete('competitors/:id/delete')
	@ApiResponse({ status: 200, description: 'Competitor deleted.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	deleteCompetitor(@Param('id') id: number) {
		return this.competitorBusinessService.deleteCompetitor(+id);
	}


	@Get('test')
	async test(): Promise<String> {
		let canvas = await this.statsService.createStatImage();

		const buffer = canvas.toBuffer("image/png");
		writeFileSync("assets/images/stats.jpg", buffer);

		return '<img src="' + canvas.toDataURL() + '" />';
	}
}