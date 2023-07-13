import { Injectable } from "@nestjs/common";
import { TelegramCommonService } from "./common.service";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { CompetitorDto } from "../dto/competitor.dto";
import { Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

@Injectable({})
export class TelegramUserGroupService {
	constructor(
		private telegramCommonService: TelegramCommonService,
		private competitorBusinessService: CompetitorBusinessService,
	) { }

	async actionAddGroup1(ctx: Context<Update.CallbackQueryUpdate>) {
		try {
			await ctx.deleteMessage(ctx.callbackQuery.message.message_id);

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.callbackQuery.from.id); }
			catch (e) { return; }

			let message = "Inserisci il gruppo del concorso di cui fai parte:\n";
			let askMessage = await ctx.reply(message);

			this.telegramCommonService.setUserContext(competitor.telegramId, {
				contextName: "add_group",
				askMessage: askMessage
			});
		} catch (error) {
			console.log("ERRORE actionAddGroup1", error);
		}
	}

	async actionAddGroup2(ctx: Context<Update.MessageUpdate>, textMessage: Message.TextMessage) {
		try {
			await ctx.deleteMessage(ctx.message.message_id); // non lo fa

			let competitor: CompetitorDto;
			try { competitor = await this.telegramCommonService.getCompetitor(ctx.message.from.id); }
			catch (e) { return; }

			let contextGroup = textMessage.text.toUpperCase().replace(" ", "");
			{
				if (!(contextGroup == "A"
					|| contextGroup == "B"
					|| contextGroup == "C"
					|| contextGroup == "D"
					|| contextGroup == "E"
					|| contextGroup == "F"
					|| contextGroup == "G")) {
					let message = "Inserisci un'opzione valida (a,b,c,d,e,f,g):\n";
					await ctx.reply(message);
					return;
				}

				competitor.contextGroup = contextGroup;
				competitor = await this.competitorBusinessService.editCompetitor(competitor);
			}

			let message = `Gruppo ${contextGroup} salvato con successo.`;
			await ctx.reply(message);

			this.telegramCommonService.removeUserContext(competitor.telegramId);

			this.telegramCommonService.messageToGroup(ctx, `Nuovo utente nel gruppo ${contextGroup} registrato.`);
		} catch (error) {
			console.log("ERRORE actionAddGroup2", error);
		}
	}
}