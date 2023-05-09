import formidable from 'formidable';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

export const config = {
  api : {
    bodyParser : false
  }
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const form = formidable({ multiples: true, keepExtensions: true });

export default async function handler(req, res) {
  const fileContent = await new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      resolve(fs.createReadStream(files.file.filepath));
    });
  });

  const response = await openai.createTranscription(fileContent, 'whisper-1');
  const transcription = response.data.text;

  res.status(200).json({ transcription: transcription });
}
