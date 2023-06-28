import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Context, Telegraf } from "telegraf";
import { message } from 'telegraf/filters';
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { CompetitorDto } from "../dto/competitor.dto";

@Injectable()
export class TelegramService {
	constructor(
		private config: ConfigService,
		private competitorBusinessService: CompetitorBusinessService,
	) { this.startBot(); }

	private bot: Telegraf;

	private async startBot() {
		this.bot = new Telegraf(this.config.get('BOT_TOKEN'));

		this.bot.start((ctx) => this.onStart(ctx));

		this.bot.command('login', (ctx: any) => this.onLogin(ctx));

		this.bot.on(message('text'), context => this.onMessage(context));

		this.bot.launch()
	}

	private onStart(context: any) {
		console.log('On start', context);
		this.sendMessage(context.update.message.from.id, "welcome");
	}

	private onLogin(ctx: any) {
		this.sendMessage(ctx.update.message.from.id, "login");
	}

	private onMessage1(context: any) {
		let text = context.update.message.text
		context.reply('Hai scritto: ' + text)
	}




	async sendMessage(chatId: number, message: string) {
		await this.bot.telegram.sendMessage(chatId, message);
		//await this.bot.telegram.replyWithSticker('123123jkbhj6b');
	}












	async getUser(id: number) {

	}


	private async onMessage(ctx: any) {
		let competitor: CompetitorDto;
		let newUser: boolean = false;

		try {
			let a = "a ctx.chat.id";
			competitor = await this.competitorBusinessService.getCompetitorByTelegramId(a);
		} catch (e) {
			switch (e) {
				case "user_not_found":
					// Utente alla prima visita
					competitor = await this.newCompetitor(ctx);
					newUser = true;		
					break;
				default:
					throw e
			}
		}

		console.log("asd", competitor);

		// Controlla se utente non era attivo
		if(!competitor.active) {
			competitor.active = true;
			//this.userService.createUpdateUser(user);
		}

		if(ctx.message.text == '/start') {
			if(newUser) {
				// Utente alla prima visita
				this.bot.telegram.sendMessage(ctx.chat.id, `Benvenuto ${competitor.telegramFirstName}! E' un piacere averti tra i nostri utenti.`)	
			} else {
				this.bot.telegram.sendMessage(ctx.chat.id, `Bentornato ${competitor.telegramFirstName}.`)
			}
			
			//this.defaultAction(user);
			return;
		}

		this.bot.telegram.sendMessage(ctx.chat.id, `Hey ${competitor.telegramFirstName}, non riesco ad interpretare il tuo comando.`);
		//this.defaultAction(user);
	}

	private async newCompetitor(ctx: any): Promise<any> {
		let competitor: CompetitorDto = {
			active: true,
			telegramId: ctx.from.id,
			telegramFirstName: ctx.from.first_name,
			telegramLastName: ctx.from.last_name,
		}
		return competitor;
		//return await this.userService.createUpdateUser(user);
	}


}