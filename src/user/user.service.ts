import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationException } from 'src/utils/exception/ApplicationException';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { createProjectDTO } from './dtos/createProject.dto';
import { ServiceList } from './types/ServiceList';
import { Service, ServiceDocument } from './entities/service.entity';
import mongoose from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, of } from 'rxjs';

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
    private httpService: HttpService,
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

    let resp = await lastValueFrom(
      this.httpService.post(
        `${process.env.CLOUDBASE_AUTHENTICATION_URL}/config/`,
        { projectId: project.id, owner: userId },
      ),
    );

    console.log('response from auth create project : ', resp.data);

    resp = await lastValueFrom(
      this.httpService.post(`${process.env.CLOUDBASE_SERVERLESS_URL}/config/`, {
        projectId: project.id,
        owner: userId,
      }),
    );
    console.log('resp from serverless : ', resp.data);

    resp = await lastValueFrom(
      this.httpService.post(
        `${process.env.CLOUDBASE_STATIC_SITE_HOSTING_URL}/config/`,
        {
          projectId: project.id,
          owner: userId,
        },
      ),
    );
    console.log('resp from static site hosting : ', resp.data);

    resp = await lastValueFrom(
      this.httpService.post(
        `${process.env.CLOUDBASE_IMAGE_RESIZE_URL}/config/`,
        {
          projectId: project.id,
          owner: userId,
        },
      ),
    );
    console.log('resp from image resize : ', resp.data);

    user.projects.push(project);
    await user.save();
    return user;
  }

  async getProject(projectId: string, userId: string) {
    const user = await this.userModel.findOne({
      id: userId,
      'projects._id': new mongoose.Types.ObjectId(projectId),
    });
    if (!user) {
      throw new ApplicationException('No such project exists', 400);
    }
    console.log(user.projects);

    return user;
  }

  async toggleService(
    projectId: string,
    userId: string,
    serviceName: ServiceList,
    token: string,
  ) {
    let project = await this.projectModel.findById(projectId);
    const user = await this.userModel.findOne({
      id: userId,
      'projects._id': new mongoose.Types.ObjectId(projectId),
    });
    if (!project) {
      throw new ApplicationException('No such project exists', 400);
    }
    if (!user) {
      throw new ApplicationException('You cannot perform this action', 401);
    }

    for (const service of project.services) {
      if (service.name === serviceName) {
        const updatedProject = await this.projectModel.updateOne(
          // @ts-ignore
          { 'services._id': service._id },
          {
            $set: {
              'services.$.enabled': !service.enabled,
            },
          },
        );
        // TODO: send internal request to that service
        this.sendRequestToService(serviceName, token, projectId);
        const resp = await lastValueFrom(
          this.httpService.post(
            `${process.env.CLOUDBASE_AUTHENTICATION_URL}/config/${projectId}`,
            {},
            { headers: { owner: token } },
          ),
        );

        console.log('resp from authentication service : ', resp.data);

        const p = await this.projectModel.findById(projectId);
        return p;
      }
    }

    const resp = await lastValueFrom(
      this.httpService.post(
        `${process.env.CLOUDBASE_AUTHENTICATION_URL}/config/${projectId}`,
        {},
        { headers: { owner: token } },
      ),
    );

    console.log('resp from authentication service : ', resp.data);

    const service = await this.serviceModel.create({
      name: serviceName,
      enabled: true,
    });
    project.services.push(service);

    await project.save();

    return project;
  }

  async sendRequestToService(
    serviceName: ServiceList,
    token: string,
    projectId: string,
  ) {
    switch (serviceName) {
      case ServiceList.AUTHENTICATION: {
        const resp = await lastValueFrom(
          this.httpService.post(
            `${process.env.CLOUDBASE_AUTHENTICATION_URL}/config/${projectId}`,
            {},
            { headers: { owner: token } },
          ),
        );

        console.log('resp from authentication service : ', resp.data);
        break;
      }
      case ServiceList.SERVERLESS: {
        const resp = await lastValueFrom(
          this.httpService.post(
            `${process.env.CLOUDBASE_SERVERLESS_URL}/config/${projectId}`,
            {},
            { headers: { owner: token } },
          ),
        );

        console.log('resp from serverless service : ', resp.data);
        break;
      }
      case ServiceList.STATIC_SITE_HOSTING: {
        const resp = await lastValueFrom(
          this.httpService.post(
            `${process.env.CLOUDBASE_STATIC_SITE_HOSTING_URL}/config/${projectId}`,
            {},
            { headers: { owner: token } },
          ),
        );

        console.log('resp from static site hosting service : ', resp.data);
        break;
      }

      case ServiceList.IMAGE_RESIZE: {
        const resp = await lastValueFrom(
          this.httpService.post(
            `${process.env.CLOUDBASE_IMAGE_RESIZE_URL}/config/${projectId}`,
            {},
            { headers: { owner: token } },
          ),
        );

        console.log('resp from image resize service : ', resp.data);
        break;
      }
    }
  }
}
