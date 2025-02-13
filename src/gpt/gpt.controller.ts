import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { GptService } from './gpt.service';
import {TextToAudioDto} from './dtos/text-to-audio.dto';
import { AudioToTexDto, OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import {diskStorage} from 'multer'
import { ImageGenerationDto } from './dtos/image-generation.dto';


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

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
    )
     {
 
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath )
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
    )
     {
 
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3')
    res.status(HttpStatus.OK)
    res.sendFile(filePath )
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (requestAnimationFrame, file, callback)=>{
          const fileExtension = file.originalname.split('.').pop()
          const fileName= `${ new Date().getTime()}.${fileExtension}`
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1000*1024*5, message: 'File is bigger than 5 mb'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto : AudioToTexDto,   
    )
     {
      console.log({audioToTextDto})
 
    return this.gptService.audioToText(file, audioToTextDto)
  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  ) {
    return await this.gptService.imageGeneration(imageGenerationDto)
  }

}
