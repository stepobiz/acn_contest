import { Injectable } from "@nestjs/common";
import { TelegramCommonService } from "./common.service";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { CompetitorDto } from "../dto/competitor.dto";

@Injectable({})
export class TelegramStatsService {
	constructor(
		private telegramCommonService: TelegramCommonService,
		private competitorBusinessService: CompetitorBusinessService,
	) { }


	async groupStat1(ctx: Context<Update.CallbackQueryUpdate>) {
		try {
			await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.callbackQuery.from.id); }
			catch (e) { return; }

			let message = "Inserisci il gruppo del concorso di vuoi sapere i partecipanti:\n";
			let askMessage = await ctx.reply(message);

			this.telegramCommonService.setUserContext(competitor.telegramId, {
				contextName: "group_stat",
				askMessage: askMessage
			});
		} catch (error) {
			console.log("ERRORE groupStat1", error);
		}
	}

	async groupStat2(ctx: Context<Update.MessageUpdate>, textMessage: Message.TextMessage) {
		try {
			await ctx.deleteMessage(ctx.message.message_id); // non lo fa

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.message.from.id); }
			catch (e) { return; }

			let contextGroup = textMessage.text.toUpperCase();
			{
				if (!(contextGroup.startsWith("A")
					|| contextGroup.startsWith("B")
					|| contextGroup.startsWith("C")
					|| contextGroup.startsWith("D")
					|| contextGroup.startsWith("E")
					|| contextGroup.startsWith("F")
					|| contextGroup.startsWith("G"))) {
					let message = "Inserisci un'opzione valida (a,b,c,d,e,f,g):\n";
					await ctx.reply(message);
					return;
				}
			}

			let competitors: number = await this.competitorBusinessService.countCompetitors({
				contextGroupContains: contextGroup
			});

			let message = `Nel gruppo sono presenti ${competitors} persone che hanno detto di far parte del gruppo di concorso ${contextGroup}.`;
			await ctx.reply(message);

			this.telegramCommonService.removeUserContext(competitor.telegramId);
		} catch (error) {
			console.log("ERRORE groupStat2", error);
		}
	}
}