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

	private userArgument = {};

	private async startBot() {
		this.bot = new Telegraf(this.config.get('BOT_TOKEN'));

		this.bot.start((ctx) => this.onStart(ctx));

		// i comandi con lo /
		//this.bot.command('login', (ctx: any) => this.onLogin(ctx));

		// le azioni sono date da i bottoni
		this.bot.action('register', (ctx: any) => this.actionRegister(ctx));
		this.bot.action('me', (ctx: any) => this.actionMe(ctx));
		this.bot.action('add_group', (ctx: any) => this.actionAddGroup1(ctx));
		this.bot.action('s_quiz_valutation', (ctx: any) => this.actionSQuizValutation1(ctx));

		this.bot.on(message('text'), context => this.onMessage(context));

		this.bot.launch();
	}

	async sendMessage(chatId: number, message: string) {
		await this.bot.telegram.sendMessage(chatId, message);
	}

	protected async onStart(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		this.start(competitor);
	}

	protected async actionRegister(ctx: any) {
		let competitor: CompetitorDto = await this.newCompetitor(ctx);
		this.start(competitor);
	}

	protected async actionMe(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
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
		await this.sendMessage(competitor.telegramId, message);

		let loggedUserActionMessage = "Cosa altro puoi fare:";
		this.loggedUserAction(competitor, loggedUserActionMessage);
	}

	protected async actionAddGroup1(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		this.userArgument[competitor.telegramId] = "add_group";

		let message = "Inserisci il gruppo del concorso di cui fai parte:\n";
		await this.sendMessage(competitor.telegramId, message);
	}


	protected async actionAddGroup2(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		let contextGroup = ctx.update.message.text.toUpperCase();
		{
			if(!(contextGroup.startsWith("A") 
			|| contextGroup.startsWith("B") 
			|| contextGroup.startsWith("C") 
			|| contextGroup.startsWith("D") 
			|| contextGroup.startsWith("E") 
			|| contextGroup.startsWith("F") 
			|| contextGroup.startsWith("G") )) {
				let message = "Inserisci un'opzione valida (a,b,c,d,e,f,g):\n";
				await this.sendMessage(competitor.telegramId, message);
				return;
			}
		}
		competitor.contextGroup = contextGroup;
		competitor = await this.competitorBusinessService.editCompetitor(competitor);

		let message = "Gruppo salvato con successo.\n";
		this.userArgument[competitor.telegramId] = undefined;
		let loggedUserActionMessage = message + "Cosa altro puoi fare:";
		this.loggedUserAction(competitor, loggedUserActionMessage);
	}





	protected async actionSQuizValutation1(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		this.userArgument[competitor.telegramId] = "s_quiz_valutation";

		let message = "Inserisci l'autovalutazione del concorso:\n";
		await this.sendMessage(competitor.telegramId, message);
	}

	protected async actionSQuizValutation2(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		let sQuizValutation: number = +ctx.update.message.text;
		{
			//Controlli
		}
		competitor.sQuizValutation = sQuizValutation;
		competitor = await this.competitorBusinessService.editCompetitor(competitor);

		let message = "Autovalutazione salvata con successo.\n";
		this.userArgument[competitor.telegramId] = undefined;
		let loggedUserActionMessage = message + "Cosa altro puoi fare:";
		this.loggedUserAction(competitor, loggedUserActionMessage);
	}





	protected async onMessage(ctx: any) {
		let competitor: CompetitorDto;
		try { competitor = await this.getCompetitor(ctx); }
		catch (e) { return; }

		switch (this.userArgument[competitor.telegramId]) {
			case "add_group": await this.actionAddGroup2(ctx); return;
			case "s_quiz_valutation": await this.actionSQuizValutation2(ctx); return;
			default: break;
		}

		let message = `Ciao ${competitor.telegramFirstName},`;
		message += "\n";
		message += "non ho capito la tua richiesta, ecco cosa puoi fare:\n";

		this.loggedUserAction(competitor, message);
	}











	private async start(competitor: CompetitorDto) {
		await this.sleep(100);

		let message = `Ciao ${competitor.telegramFirstName},`;
		message += "\n";
		message += "Benvenuto su questa piattaforma che ci aiuterà a condividere informazioni ed aggiornamenti in merito al concorso ACN 60 diplomati.\n";
		message += "Le funzionalità sono in sviluppo.\n";
		message += "Ecco cosa puoi fare per ora:\n";

		this.loggedUserAction(competitor, message);
	}



	private async loggedUserAction(competitor: CompetitorDto, message: string) {
		let actions = [
			[
				{
					text: "Mie informazioni",
					callback_data: 'me'
				}
			],
			[{
				text: "Inserimento gruppo",
				callback_data: 'add_group'
			},
			{
				text: "Inserimento autovalutazione test",
				callback_data: 's_quiz_valutation'
			}],
		];
		await this.bot.telegram.sendMessage(competitor.telegramId, message, {
			reply_markup: {
				inline_keyboard: actions
			}
		})
	}





	private async getCompetitor(ctx: any) {
		let competitor: CompetitorDto;
		try {
			competitor = await this.competitorBusinessService.getCompetitorByTelegramId(ctx.chat.id);
		} catch (e) {
			switch (e) {
				case "user_not_found":
					let message = `Ciao ${ctx.from.first_name},`;
					message += "\nNon sei ancora un nostro utente, se vuoi puoi registrarti cliccando sul tasto in basso!\n"
					message += "\nRegistrati solo se hai partecipato al concorso!\n";
					message += "\nTutti i dati in merito a proiezioni e graduatorie verranno condivisi, pertanto se non si vogliono condividere vi prego di non registrarvi.";
					message += "\nPer nessun motivo verranno mai usati i contatti per scopi economici, ma solo per trasmettere notifiche nell'ambito di questa piattaforma.";
					message += "\nQuesta nota vale come informativa sulla privacy dei dati trattati dalla presente piattaforma.\n";
					message += "\nRegistrandoti accetti queste condizioni ed eventuali suoi aggiornamenti.";

					this.bot.telegram.sendMessage(ctx.chat.id, message, {
						reply_markup: {
							inline_keyboard: [
								[{
									text: "Accetta e registrati",
									callback_data: 'register'
								}],
							]
						}
					})
					throw "user_not_found";
				default:
					throw e
			}
		}
		return competitor;
	}

	private async newCompetitor(ctx: any): Promise<any> {
		let competitor: CompetitorDto = {
			active: true,
			telegramId: ctx.from.id,
			telegramFirstName: ctx.from.first_name,
			telegramLastName: ctx.from.last_name,
		}
		return await this.competitorBusinessService.createCompetitor(competitor);
	}

	private sleep(milliseconds: number) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved');
			}, milliseconds);
		});
	}
}