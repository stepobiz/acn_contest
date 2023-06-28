import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Context, Telegraf } from "telegraf";
import { message } from 'telegraf/filters';

@Injectable()
export class TelegramService {
	constructor(
		private config: ConfigService,
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
		let user: any;
		let newUser: boolean = false;

		try {
			user = await this.getUser(ctx.chat.id);
		} catch (e) {
			switch (e) {
				case "user_not_found":
					// Utente alla prima visita
					user = await this.newUser(ctx);
					newUser = true;		
					break;
				default:
					throw e
			}
		}

		// Controlla se utente non era attivo
		if(!user.active) {
			user.active = true;
			//this.userService.createUpdateUser(user);
		}

		if(ctx.message.text == '/start') {
			if(newUser) {
				// Utente alla prima visita
				this.bot.telegram.sendMessage(ctx.chat.id, `Benvenuto ${user.telegramFirstName}! E' un piacere averti tra i nostri utenti.`)	
			} else {
				this.bot.telegram.sendMessage(ctx.chat.id, `Bentornato ${user.telegramFirstName}.`)
			}
			
			//this.defaultAction(user);
			return;
		}

		this.bot.telegram.sendMessage(ctx.chat.id, `Hey ${user.telegramFirstName}, non riesco ad interpretare il tuo comando.`);
		//this.defaultAction(user);
	}

	private async newUser(ctx: any): Promise<any> {
		let user: any = {
			active: false,
			telegramId: ctx.from.id,
			telegramFirstName: ctx.from.first_name,
			telegramLastName: ctx.from.last_name,
		}
		return user;
		//return await this.userService.createUpdateUser(user);
	}


}