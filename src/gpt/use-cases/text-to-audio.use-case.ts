import * as path from 'path'
import * as fs from 'fs'
import OpenAI from 'openai';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI,{ prompt, voice = 'nova' }: Options) => {

  const voices = {
    'nova': 'nova',
    'alloy': 'alloy',
    'ash': 'ash',
    'coral': 'coral',
    'echo': 'echo',
    'fable': 'fable',
    'onyx': 'onyx',
    'sage': 'sage',
    'shimmer': 'shimmer'
  };

  const selectedVoice = voices[voice] 

  const folderPath = path.resolve(__dirname, '../../../generated/audios')
  const speechFile = path.resolve( `${folderPath}/${new Date().getTime()}.mp3`)

  await fs.mkdirSync(folderPath,{recursive: true});

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  })
  console.log(mp3)

  const buffer = Buffer.from( await mp3.arrayBuffer())
  await fs.writeFileSync(speechFile, buffer)

  return speechFile
};
