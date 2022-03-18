import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationException } from 'src/utils/exception/ApplicationException';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { createProjectDTO } from './dtos/createProject.dto';
import { ServiceList } from './types/ServiceList';
import { Service, ServiceDocument } from './entities/service.entity';

@Injectable()
export class userService {
  private readonly logger = new Logger('userService');

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    @InjectModel('Project')
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel('Service')
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async createProject(createProjectDTO: createProjectDTO, userId: string) {
    const user = await this.getUser(userId);
    const project = await this.projectModel.create({
      ...createProjectDTO,
      services: [],
    });
    user.projects.push(project);
    await user.save();
    return user;
  }

  async getProject(projectId: string, userId: string) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new ApplicationException('No such project exists', 400);
    }
    return project;
  }
}
