import { IsOptional, IsString } from "class-validator"

export class AudioToTexDto{

    @IsString()
    @IsOptional()
    readonly prompt: string
}