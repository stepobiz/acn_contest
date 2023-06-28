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
	telegram?: string;

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
	group?: string;

    @ApiProperty({
		type: Object,
		required: false
	})
	@IsOptional()
	@IsObject()
	sQuizValutation?: any;


}