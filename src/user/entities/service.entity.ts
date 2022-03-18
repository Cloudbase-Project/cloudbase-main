import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ServiceList } from '../types/ServiceList';

export type ServiceDocument = Service & Document;

@Schema({
  timestamps: true, // adds createdAt and updatedAt fields automatically
  toJSON: {
    transform: (doc: any, ret) => {
      // Remove fields when converting to JSON.
      // Eg: Remove password fields etc.
      delete ret.__v;
    },
  },
})
export class Service {
  @Prop({ required: true, enum: ServiceList })
  name: ServiceList;

  @Prop({ required: true, default: false })
  enabled: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
