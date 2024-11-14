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
"before anything try tro return a valid json onbject please this  don't use any speacial cractere or return to the line or a commun or anything just a json provide a title for this id and also calculate the age and give some tips how i can take a better photo and haircut style retunr it at json format plaese don't use   /n like {title: fifeiofher,descriptipn:you should do a short hair cat } and also give all the informatio like all  but not about hair style i need about all the fiemds please dont use  '`', \`` and just give a little in the descripyion filed that it and focus on the ducument extracted information just put them in the appropriette feilds",        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
      ]);

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
