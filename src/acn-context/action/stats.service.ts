import { Injectable } from "@nestjs/common";
import { CompetitorBusinessService } from "../business/competitor.business.service";
import { Canvas, Image, createCanvas, loadImage } from "canvas";

@Injectable({})
export class StatsService {
	constructor(
		private competitorBusinessService: CompetitorBusinessService,
	) { }

	async getStats() {
		let groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
		let stats: any[] = []

		let totalCompetitor = 0;
		let competitorWithGroup = 0;

		// Prendi il numero dei competitors
		{
			let nCompetitors = await this.competitorBusinessService.countCompetitors({});
			stats.push({
				name: "Membri bot",
				value: nCompetitors
			});
			totalCompetitor = nCompetitors
		}

		// Prendi il numero dei competitors con gruppo
		{
			let nCompetitors = await this.competitorBusinessService.countCompetitors({
				contextGroupIn: groups
			});
			stats.push({
				name: "Utenti con gruppo concorso",
				value: nCompetitors
			});

			competitorWithGroup = nCompetitors
		}

		// Prendi il numero dei competitors con autovalutazione
		{
			let nCompetitors = await this.competitorBusinessService.countCompetitors({
				sQuizValutationGt: 0
			});
			stats.push({
				name: "Utenti con autovalutazione",
				value: nCompetitors
			});
		}

		// Calcola numero utenti silenti
		{
			stats.push({
				name: "Utenti silenti",
				value: totalCompetitor-competitorWithGroup
			});
		}

		// Pec Ricevute, da sviluppare
		{
			stats.push({
				name: "PEC Ricevute",
				value: 2
			});
		}

		for(let group of groups) {
			let nCompetitors = await this.competitorBusinessService.countCompetitors({
				contextGroupEquals: group
			});
			stats.push({
				name: "Gruppo " + group,
				value: nCompetitors
			});
		}

		return stats;
	}

	async createStatImage() {
		let stats = await this.getStats();

		let x = 300;
		let y = 400;

		const canvas: Canvas = createCanvas(x, y);
		{
			const ctx = canvas.getContext('2d');

			{
				let image: Image = await loadImage('assets/images/acn.jpg');
				let scaleFactor = 1.3;
				ctx.drawImage(image, 0, 0, image.width * scaleFactor, image.height * scaleFactor)
			}


			let line = 0;

			ctx.font = 'bold 20px Impact'
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			line = 30;
			ctx.fillText('Statitiche bot', x / 2, line, x)

			let interLine = 30;

			for (let stat of stats) {
				line = line + interLine;

				ctx.font = '15px Impact'
				ctx.textAlign = "start";
				ctx.fillStyle = "#00ff00";
				ctx.fillText(stat.name, 10, line)

				ctx.font = 'bold 20px Impact'
				ctx.textAlign = "center";
				ctx.fillStyle = "#ff0000";
				ctx.fillText(stat.value, x - 40, line)
			}


		}


		//ctx.rotate(0)

		// Draw line under text
		/*
		var text = ctx.measureText('Awesome!')
		ctx.strokeStyle = 'rgba(0,0,0,0.5)'
		ctx.beginPath()
		ctx.lineTo(50, 102)
		ctx.lineTo(50 + text.width, 102)
		ctx.stroke()
		*/

		// Draw cat with lime helmet




		return '<img src="' + canvas.toDataURL() + '" />';
	}
}