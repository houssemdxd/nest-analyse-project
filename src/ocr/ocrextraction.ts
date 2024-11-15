import { Injectable } from '@nestjs/common';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
@Injectable()
export class OCRServiceextraction {
  private fileManager: GoogleAIFileManager;
  private genAI: GoogleGenerativeAI;

  constructor( 
  ) {
    this.fileManager = new GoogleAIFileManager(process.env.API_KEY);
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
  }

  async analyzeImage(mediaPath: string, imageName: string) {
    try {
      // Upload the image
      const uploadResult = await this.fileManager.uploadFile(
        `${mediaPath}/${imageName}`,
        {
          mimeType: "image/jpeg",
          displayName: "Jetpack drawing",
        },
      );

      console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

      // Get the generative model and analyze the image
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        "before anything give a titile to the provided paper don't forget i json without a  title will not be accpted in the game : I'm playing myster paper game the i should extract text from the image that extract the keys and their information and return them plesae return a json object and don't use \n return a json like it is a real object json and its mantadory that there is a title of every document so we should have title as a key and the title is the type of the docment like {title:medical prescription} and of course must change if the type of the document change just remerber you should always return json always another time please return a valid json representtaion don use /n aldo dont use ```json like comment because i don't want any comment analyse all the data dont put just title put many keys and values as you can ",
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
      ]);
console.log(result.response.text())
 // Upload and analyze image logic here...
 const parsedResult = JSON.parse(result.response.text()); // Assuming this is a JSON string

 // Make sure to return only the inner object and not a string or error
 return parsedResult.result ? parsedResult.result : parsedResult; // Ensure that we always return an object
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
}
