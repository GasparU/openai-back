import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import OpenAI from 'openai';
import { ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import {translateUseCase} from './use-cases/translate.use-case';
import {textToAudioUseCase} from './use-cases/text-to-audio.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEI,
  });

  // Solo va a llamar casos de uso

  async orthographyCheck(OrthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: OrthographyDto.prompt,
    });
  }

  // ( Paso 3) Se crea el componente con el servicio adecuado y se jala el case (casos)
  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translateText({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) { 
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

}
 