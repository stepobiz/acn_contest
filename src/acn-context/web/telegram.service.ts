import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Context, Telegraf } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { message } from 'telegraf/filters';

import { CompetitorDto } from "../dto/competitor.dto";
import { TelegramCommonService } from "../telegram/common.service";
import { TelegramUserService } from "../telegram/user.service";
import { TelegramUserGroupService } from "../telegram/user-group.service";
import { TelegramSQuizValutationService } from "../telegram/s-quiz-valutation.service";
import { TelegramStatsService } from "../telegram/stats.service";

@Injectable()
export class TelegramService {
	constructor(
		private config: ConfigService,
		private telegramCommonService: TelegramCommonService,
		private telegramUserService: TelegramUserService,
		private telegramUserGroupService: TelegramUserGroupService,
		private telegramSQuizValutationService: TelegramSQuizValutationService,
		private telegramStatsService: TelegramStatsService,

	) { this.startBot(); }

	private bot: Telegraf;

	private async startBot() {
		const enableBot: boolean = JSON.parse(this.config.get('ENABLE_BOT'));
		if(!enableBot) {
			console.log("Bot non avviato");
			return;
		}

		console.log("Avvio Bot");

		this.bot = new Telegraf(this.config.get('BOT_TOKEN'));

		this.bot.start((ctx: Context<Update.MessageUpdate>) => this.onStart(ctx));

		// i comandi con lo /
		//this.bot.command('login', (ctx: any) => this.onLogin(ctx));


		// le azioni sono date da i bottoni
		this.bot.action('register', (ctx: Context<Update.CallbackQueryUpdate>) => this.telegramUserService.actionRegister(ctx));
		this.bot.action('me', (ctx: Context<Update.CallbackQueryUpdate>) => this.telegramUserService.actionMe(ctx));
		this.bot.action('add_group', (ctx: Context<Update.CallbackQueryUpdate>) => this.telegramUserGroupService.actionAddGroup1(ctx));
		this.bot.action('s_quiz_valutation', (ctx: Context<Update.CallbackQueryUpdate>) => this.telegramSQuizValutationService.actionSQuizValutation1(ctx));
		this.bot.action('group_stat', (ctx: Context<Update.CallbackQueryUpdate>) => this.telegramStatsService.groupStat1(ctx));


		this.bot.on(message('text'), (ctx: Context<Update.MessageUpdate>) => this.onMessage(ctx));

		this.bot.launch();

		console.log("Bot Avviato");
	}





	protected async onStart(ctx: Context<Update.MessageUpdate>) {
		let isPrivateMessage: boolean = true;
		let isLoggedUser: boolean = true;

		if(ctx.update.message.chat.id < 0) isPrivateMessage = false;

		let competitor: CompetitorDto;
		try { competitor = await this.telegramCommonService.getCompetitor(ctx.update.message.from.id); }
		catch (e) { isLoggedUser = false; }

		if(isLoggedUser) {
			if(!isPrivateMessage) {
				let message = `Ciao ${competitor.telegramFirstName}, ti ho inviato i comandi disponibili in privato!`;
				ctx.reply(message);
			}
			
			let message = `Ciao ${competitor.telegramFirstName},`;
			message += "\n";
			message += "Ecco cosa puoi fare:\n";
			this.telegramCommonService.loggedUserAction(ctx, competitor, message);
		} else {
			if(isPrivateMessage) {
				this.telegramCommonService.sendRegistrationMessage(ctx);
			} else {
				ctx.deleteMessage(ctx.update.message.message_id);
				let message = `Ciao ${ctx.update.message.from.first_name}, devi contattarmi in privato per abilitarmi a parlare con te @acn60_bot!`;
				ctx.reply(message);
			}
		}
	}

	private async onMessage(ctx: Context<Update.MessageUpdate>) {
		let isPrivateMessage: boolean = true;
		let isLoggedUser: boolean = true;

		if(ctx.update.message.chat.id < 0) isPrivateMessage = false;

		let competitor: CompetitorDto;
		try { competitor = await this.telegramCommonService.getCompetitor(ctx.message.from.id); }
		catch (e) { isLoggedUser = false; }

		let textMessage: Message.TextMessage = (ctx.update.message as Message.TextMessage)

		if(isPrivateMessage) {
			if(isLoggedUser) {

				let userContext = this.telegramCommonService.getUserContext(competitor.telegramId);
				if(userContext !== undefined) {
					switch (userContext.contextName) {
						case "add_group": await this.telegramUserGroupService.actionAddGroup2(ctx, textMessage); break;
						case "s_quiz_valutation": await this.telegramSQuizValutationService.actionSQuizValutation2(ctx, textMessage); break;
						case "group_stat": await this.telegramStatsService.groupStat2(ctx, textMessage); break;
						default: break;
					}
					await ctx.deleteMessage(userContext.askMessage.message_id);
					return;
				}

				let message = `Ciao ${competitor.telegramFirstName},`;
				message += "\n";
				message += "non ho capito la tua richiesta, ecco cosa puoi fare:\n";
		
				await this.telegramCommonService.loggedUserAction(ctx, competitor, message);
			} else {
				this.telegramCommonService.sendRegistrationMessage(ctx);
			}
		} else {
			// Qui i messaggi nel gruppo

			// censuro 
			if(textMessage.text.toUpperCase().includes("PORCO")) {
				ctx.deleteMessage(ctx.message.message_id);
			}
		}
	}












	




	


}