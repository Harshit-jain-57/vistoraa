import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { userService } from './user.service';

export class UserController {
  public async listUsers(request: Request, response: Response): Promise<Response> {
    const users = await userService.listUsers(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(users, 'Users fetched successfully'));
  }

  public async createUser(request: Request, response: Response): Promise<Response> {
    const user = await userService.createUser(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(user, 'User created successfully'));
  }
}

export const userController = new UserController();
