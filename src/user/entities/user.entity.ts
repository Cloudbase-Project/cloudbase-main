import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RegisteredVia } from '../types/RegisteredVia';
import { Roles } from '../types/roles';
import { Document } from 'mongoose';
import { Service } from './service.entity';
import { Project } from './project.entity';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // adds createdAt and updatedAt fields automatically
  toJSON: {
    transform: (doc: any, ret) => {
      // Remove fields when converting to JSON.
      // Eg: Remove password fields etc.
      delete ret.__v;
      delete ret.password;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Roles, required: true, default: Roles.USER })
  role: Roles;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Prop({ enum: RegisteredVia, required: true })
  registeredVia: RegisteredVia;

  @Prop()
  projects: [Project];
}

export const UserSchema = SchemaFactory.createForClass(User);
