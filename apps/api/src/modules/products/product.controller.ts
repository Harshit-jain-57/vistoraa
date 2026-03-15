import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseResponseBuilder } from '../../common/http/base-response.builder';
import { productService } from './product.service';

export class ProductController {
  public async listPublic(request: Request, response: Response): Promise<Response> {
    const result = await productService.listPublicProducts(request.storeContext!.id, request.query as never);
    return response
      .status(StatusCodes.OK)
      .json(BaseResponseBuilder.paginated(result.data, result.pagination, 'Products fetched successfully'));
  }

  public async getPublicBySlug(request: Request, response: Response): Promise<Response> {
    const product = await productService.getPublicProduct(request.storeContext!.id, request.params.slug as string);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(product, 'Product fetched successfully'));
  }

  public async listAdmin(request: Request, response: Response): Promise<Response> {
    const result = await productService.listAdminProducts(
      request.storeContext!.id,
      request.query as never,
      request.auth!.role,
    );
    return response
      .status(StatusCodes.OK)
      .json(BaseResponseBuilder.paginated(result.data, result.pagination, 'Products fetched successfully'));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const product = await productService.createProduct(request.storeContext!.id, request.auth!.userId, request.body);
    return response.status(StatusCodes.CREATED).json(BaseResponseBuilder.success(product, 'Product created successfully'));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const product = await productService.updateProduct(
      request.storeContext!.id,
      request.params.id as string,
      request.auth!.userId,
      request.body,
      request.auth!.role,
    );
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(product, 'Product updated successfully'));
  }

  public async archive(request: Request, response: Response): Promise<Response> {
    await productService.archiveProduct(request.storeContext!.id, request.params.id as string, request.auth!.userId);
    return response.status(StatusCodes.OK).json(BaseResponseBuilder.success(null, 'Product archived successfully'));
  }
}

export const productController = new ProductController();
