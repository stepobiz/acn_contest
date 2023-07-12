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
	) {}

	async actionAddGroup1(ctx: Context<Update.CallbackQueryUpdate>) {
		ctx.deleteMessage(ctx.callbackQuery.message.message_id);

		let competitor: CompetitorDto;
		try { competitor = await this.telegramCommonService.getCompetitor(ctx.callbackQuery.from.id); }
		catch (e) { return; }

		let message = "Inserisci il gruppo del concorso di cui fai parte:\n";
		let askMessage = await ctx.reply(message);

		this.telegramCommonService.setUserContext(competitor.telegramId, {
			contextName: "add_group",
			askMessage: askMessage
		});
	}

	async actionAddGroup2(ctx: Context<Update.MessageUpdate>, textMessage: Message.TextMessage) {
		ctx.deleteMessage(ctx.message.message_id); // non lo fa

		let competitor: CompetitorDto;
		try { competitor = await this.telegramCommonService.getCompetitor(ctx.message.from.id); }
		catch (e) { return; }

		let contextGroup = textMessage.text.toUpperCase();
		{
			if(!(contextGroup.startsWith("A") 
			|| contextGroup.startsWith("B") 
			|| contextGroup.startsWith("C") 
			|| contextGroup.startsWith("D") 
			|| contextGroup.startsWith("E") 
			|| contextGroup.startsWith("F") 
			|| contextGroup.startsWith("G") )) {
				let message = "Inserisci un'opzione valida (a,b,c,d,e,f,g):\n";
				await ctx.reply(message);
				return;
			}

			competitor.contextGroup = contextGroup;
			competitor = await this.competitorBusinessService.editCompetitor(competitor);
		}

		let message = `Gruppo ${contextGroup} salvato con successo.`;
		ctx.reply(message);

		this.telegramCommonService.removeUserContext(competitor.telegramId);
	}
}