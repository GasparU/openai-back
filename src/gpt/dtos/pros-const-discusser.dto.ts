import { IsString } from "class-validator";

// (Paso 2.) Aqui se crea el dto con el componente adecuado. No olvidar exportarlo en el index
export class ProsConsDiscusserDto {

    @IsString()
    readonly prompt: string;
    
  }