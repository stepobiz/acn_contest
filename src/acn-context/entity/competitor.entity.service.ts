import { Injectable } from "@nestjs/common";
import { CompetitorDto } from "../dto/competitor.dto";
import { PrismaService } from "../repository/prisma.service";
import { QueryParamsTools } from "../tools/query-params.class";

@Injectable({})
export class CompetitorEntityService {
	constructor(
		private prisma: PrismaService,
	) {}

	async insertCompetitor(competitorDto: CompetitorDto) {
		let prismaRequestArgs: any = {};
		// Fileds
		prismaRequestArgs['data'] = {
			active: competitorDto.active,
			telegramId: competitorDto.telegramId,
			telegramFirstName: competitorDto.telegramFirstName,
			telegramLastName: competitorDto.telegramLastName,
			username: competitorDto.username,
			password: competitorDto.password,
			idToken: competitorDto.idToken,
			accessToken: competitorDto.accessToken,
			refreshToken: competitorDto.refreshToken,
			email: competitorDto.email,
			contextGroup: competitorDto.contextGroup,
			sQuizValutation: competitorDto.sQuizValutation,
		};
		// Relations
		return await this.prisma.competitor.create(prismaRequestArgs);
	}

	async updateCompetitor(competitorDto: CompetitorDto) {
		return await this.prisma.competitor.update({
			where: {
				id: competitorDto.id,
			},
			data: {
				active: competitorDto.active,
				telegramId: competitorDto.telegramId,
				telegramFirstName: competitorDto.telegramFirstName,
				telegramLastName: competitorDto.telegramLastName,
				username: competitorDto.username,
				password: competitorDto.password,
				idToken: competitorDto.idToken,
				accessToken: competitorDto.accessToken,
				refreshToken: competitorDto.refreshToken,
				email: competitorDto.email,
				contextGroup: competitorDto.contextGroup,
				sQuizValutation: competitorDto.sQuizValutation,
			},
		});
	}

	// Get
	async getCompetitors(filters: any): Promise<CompetitorDto[]> {
		let prismaRequestArgs: any = {};
		// Pagination
		if(filters.size !== undefined && filters.page !== undefined) {
			prismaRequestArgs = { ...QueryParamsTools.getPrismaPaginationObject(filters) };
		}
		// Filter
		{
			prismaRequestArgs['where'] = QueryParamsTools.getPrismaWhereObject(filters);
		}
		// Join
		{
		}
		// Order
		if(filters.orderBy !== undefined) {
			prismaRequestArgs['orderBy'] = QueryParamsTools.getPrismaOrderByArray(filters);
		}
		return await this.prisma.competitor.findMany(prismaRequestArgs);
	}

	// Count
	async countCompetitors(filters: any): Promise<number> {
		let prismaRequestArgs: any = {};
		// Filter
		{
			prismaRequestArgs['where'] = QueryParamsTools.getPrismaWhereObject(filters);
		}
		return await this.prisma.competitor.count(prismaRequestArgs);
	}

	async getCompetitor(id: number): Promise<CompetitorDto> {
		return await this.prisma.competitor.findUnique({
			where: {
				id: id,
			},
		})
	}

	async deleteCompetitor(id: number) {
		return await this.prisma.competitor.delete({
			where: {
				id: id,
			}
		});
	}
}