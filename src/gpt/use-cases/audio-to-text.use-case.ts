import * as fs from 'fs' 
import OpenAI from "openai"

interface Options {
    prompt?: string,
    audioFile: Express.Multer.File
}

export const audioToTextUseCase = async (openai: OpenAI, options:Options) => {

    const {prompt, audioFile} = options

    // console.log({prompt, audioFile})

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path),
        prompt: prompt, //mismo idioma del augio
        language: 'es',
        // response_format: 'srt',// 'vtt'
        response_format: 'verbose_json'
    })

    console.log(response)

    return response
}