import { Injectable } from "@nestjs/common";
import { CompetitorDto } from "../dto/competitor.dto";
import { TelegramCommonService } from "./common.service";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { Update } from "telegraf/typings/core/types/typegram";
import { Context } from "telegraf";

@Injectable({})
export class TelegramUserService {
	constructor(
		private telegramCommonService: TelegramCommonService,
		private competitorBusinessService: CompetitorBusinessService,
	) {}

	async actionRegister(ctx: Context<Update.CallbackQueryUpdate>) {
		ctx.deleteMessage(ctx.callbackQuery.message.message_id);

		let competitor: CompetitorDto = {
			active: true,
			telegramId: ctx.from.id,
			telegramFirstName: ctx.from.first_name,
			telegramLastName: ctx.from.last_name,
		}
		try {
			competitor = await this.competitorBusinessService.createCompetitor(competitor);
			let message = `Ciao ${competitor.telegramFirstName},`;
			message += "\n";
			message += "Benvenuto su questa piattaforma che ci aiuterà a condividere informazioni ed aggiornamenti in merito al concorso ACN 60 diplomati.\n";
			message += "Ecco cosa puoi fare:\n";
			this.telegramCommonService.loggedUserAction(ctx, competitor, message);
		} catch (e) {
			switch (e) {
				case "already_registred": {
					console.log("già registrato");
					ctx.reply("già registrato");
				} return;
				default: console.log("Errore grave", e); throw e;
			}
		}
	}

	async actionMe(ctx: Context<Update.CallbackQueryUpdate>) {
		await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

		let competitor: CompetitorDto;
		try { competitor = await this.telegramCommonService.getCompetitor(ctx.callbackQuery.from.id); }
		catch (e) { return; }

		let message = "Qui le tue informazioni:\n";
		message += JSON.stringify({
			id: competitor.id,
			id_telegram: competitor.telegramId,
			nome: competitor.telegramFirstName,
			cognome: competitor.telegramLastName,
			gruppo: competitor.contextGroup,
			autovalutazione: competitor.sQuizValutation,
		});
		await ctx.reply(message);
	}


}