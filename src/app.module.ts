import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcnContextModule } from './acn-context/acn-context.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		AcnContextModule,
	],
	controllers: [
		AppController,

	],
	providers: [AppService],
})
export class AppModule { }
