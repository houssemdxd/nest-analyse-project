// schemas/ocr-data.schema.ts
import { Schema } from 'mongoose';

// Define an empty schema with `strict: false` to allow dynamic fields
export const OCRDataSchema = new Schema({}, { strict: false });
