import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema()
export class Clinique {
  @Prop({ required: true })
  nom: string; // Nom de la clinique

  @Prop({ required: true })
  region: string; // Région où se trouve la clinique

  @Prop({ required: true, type: Number })
  latitude: number; // Latitude de la clinique

  @Prop({ required: true, type: Number })
  longitude: number; // Longitude de la clinique

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Référence à l'utilisateur ayant ajouté la clinique
}

export const CliniqueSchema = SchemaFactory.createForClass(Clinique);
