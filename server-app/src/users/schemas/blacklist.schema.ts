import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlackListDocument = BlackList & Document;

@Schema()
export class BlackList {
  @Prop({ required: true })
  refresh_token: string;
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
