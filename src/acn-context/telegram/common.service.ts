import { Injectable } from "@nestjs/common";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { CompetitorDto } from "../dto/competitor.dto";
import { Update } from "telegraf/typings/core/types/typegram";
import { Context } from "telegraf";

@Injectable()
export class TelegramCommonService {

	constructor(
		private competitorBusinessService: CompetitorBusinessService,
	) { }

	private userContext = {};

	setUserContext(userId: number, context: any) {
		this.userContext[userId] = context;
	}

	removeUserContext(userId: number) {
		let haveContext = true;
		if(this.userContext[userId] === undefined) haveContext = false;
		//
		this.userContext[userId] = undefined;
		return haveContext;
	}

	getUserContext(userId: number) {
		return this.userContext[userId];
	}





	async getCompetitor(telegramId: number) {
		let competitor: CompetitorDto;
		try {
			competitor = await this.competitorBusinessService.getCompetitorByTelegramId(telegramId);
		} catch (e) {
			throw e;
		}
		return competitor;
	}

	sendRegistrationMessage(ctx: Context<Update.MessageUpdate>) {
		let message = `Ciao ${ctx.update.message.from.first_name},`;
		message += "\nNon sei ancora un nostro utente, se vuoi puoi registrarti cliccando sul tasto in basso!\n"
		message += "\nRegistrati solo se hai partecipato al concorso!\n";
		message += "\nTutti i dati in merito a proiezioni e graduatorie verranno condivisi, pertanto se non si vogliono condividere vi prego di non registrarvi.";
		message += "\nPer nessun motivo verranno mai usati i contatti per scopi economici, ma solo per trasmettere notifiche nell'ambito di questa piattaforma.";
		message += "\nQuesta nota vale come informativa sulla privacy dei dati trattati dalla presente piattaforma.\n";
		message += "\nRegistrandoti accetti queste condizioni ed eventuali suoi aggiornamenti.";

		ctx.telegram.sendMessage(ctx.update.message.from.id, message, {
			reply_markup: {
				inline_keyboard: [
					[{
						text: "Accetta e registrati",
						callback_data: 'register'
					}],
				]
			}
		})
	}

	async loggedUserAction(ctx, competitor: CompetitorDto, message: string) {
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
		await ctx.telegram.sendMessage(competitor.telegramId, message, {
			reply_markup: {
				inline_keyboard: actions
			}
		})
	}













	sleep(milliseconds: number) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved');
			}, milliseconds);
		});
	}
}