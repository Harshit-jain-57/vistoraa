import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { categoryService } from './category.service';

export class CategoryController {
  public async listPublic(request: Request, response: Response): Promise<Response> {
    const categories = await categoryService.listPublicCategories(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(categories, 'Categories fetched successfully'));
  }

  public async listAdmin(request: Request, response: Response): Promise<Response> {
    const categories = await categoryService.listAdminCategories(request.storeContext!.id);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(categories, 'Categories fetched successfully'));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const category = await categoryService.createCategory(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(category, 'Category created successfully'));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const category = await categoryService.updateCategory(
      request.storeContext!.id,
      request.params.id as string,
      request.auth!.userId,
      request.body,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(category, 'Category updated successfully'));
  }
}

export const categoryController = new CategoryController();
