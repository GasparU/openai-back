import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import type { Response } from 'express';
import {TextToAudioDto} from './dtos/text-to-audio.dto';


@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() ortographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(ortographyDto);
  }

  // (Paso 1) Este codigo viene a ser el post o get de cada ruta. Aqui se llama al servicio para poder
  // traer los componentes que van a ser utilizados. Recordar cambiar el nombre de los componentes.
  // EL NOMBRE DE LA RUTA ES LO QUE ESTA DENTRO DEL PARENTESIS ('pros-cons-discusser')
  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  // Nombre general : Nombre del DTO
  translateText(@Body() translateDto: TranslateDto) {
    // Esta linea corresponde al servicio gpt.service
    return this.gptService.translateText(translateDto);
  }

  @Post('text-to-audio')
  textToAudio(
    @Body() textToAudioDto: TextToAudioDto,

    )
     {
 
    return this.gptService.textToAudio(textToAudioDto);

    // res.setHeader('Content-Type', 'audio/mp3')
    // res.status(HttpStatus.OK)
    // res.sendFile(filePath )
  }
}
