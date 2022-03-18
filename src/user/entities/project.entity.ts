import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ServiceList } from '../types/ServiceList';
import { Service } from './service.entity';

export type ProjectDocument = Project & Document;

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
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  services: [Service];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
