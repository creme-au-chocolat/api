import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// TODO : Create class from other class, to enable better testing
@Schema()
export class Tag extends Document {
  @Prop()
  name: string;

  @Prop()
  tagged: number;

  @Prop()
  uri: string;

  @Prop()
  id: number;

  @Prop()
  category: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
