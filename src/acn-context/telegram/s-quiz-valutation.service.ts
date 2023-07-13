import { Injectable } from "@nestjs/common";
import { TelegramCommonService } from "./common.service";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { CompetitorDto } from "../dto/competitor.dto";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { Context } from "telegraf";

@Injectable({})
export class TelegramSQuizValutationService {
	constructor(
		private telegramCommonService: TelegramCommonService,
		private competitorBusinessService: CompetitorBusinessService,
	) { }

	async actionSQuizValutation1(ctx: Context<Update.CallbackQueryUpdate>) {
		try {
			await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.callbackQuery.from.id); }
			catch (e) { return; }

			let message = "Inserisci l'autovalutazione del concorso:\n";
			let askMessage = await ctx.reply(message);

			this.telegramCommonService.setUserContext(competitor.telegramId, {
				contextName: "s_quiz_valutation",
				askMessage: askMessage
			});
		} catch (error) {
			console.log("ERRORE actionSQuizValutation1", error);
		}
	}

	async actionSQuizValutation2(ctx: Context<Update.MessageUpdate>, textMessage: Message.TextMessage) {
		try {
			await ctx.deleteMessage(ctx.message.message_id); // non lo fa

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.message.from.id); }
			catch (e) { return; }

			let sQuizValutation: number = +textMessage.text.replace(",", ".");
			{
				//Controlli
				if (isNaN(sQuizValutation)) {
					await ctx.reply("Scrivimi un numero");
					return;
				}

				competitor.sQuizValutation = sQuizValutation;
				competitor = await this.competitorBusinessService.editCompetitor(competitor);
			}

			let message = `Autovalutazione: ${sQuizValutation} salvato con successo.`;
			await ctx.reply(message);

			this.telegramCommonService.removeUserContext(competitor.telegramId);
		} catch (error) {
			console.log("ERRORE actionSQuizValutation2", error);
		}
	}



}