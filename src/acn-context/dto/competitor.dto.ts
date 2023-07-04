import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Decimal } from "@prisma/client/runtime";


export class CompetitorDto {
	
	@ApiProperty({
		type: Number,
		required: false
	})
	@IsNumber()
	@IsOptional()
	id?: number;


    @ApiProperty({
		type: Boolean,
		required: false
	})
	@IsOptional()
	@IsBoolean()
	active?: boolean;

    @ApiProperty({
		type: Number,
		required: false
	})
	@IsOptional()
	@IsNumber()
	telegramId?: number;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	telegramFirstName?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	telegramLastName?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	username?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	password?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	idToken?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	accessToken?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	refreshToken?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	email?: string;

    @ApiProperty({
		type: String,
		required: false
	})
	@IsOptional()
	@IsString()
	contextGroup?: string;

    @ApiProperty({
		type: Number,
		required: false
	})
	@IsOptional()
	@IsNumber()
	sQuizValutation?: number;


}