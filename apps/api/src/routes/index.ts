import { Router } from 'express';

import { BaseResponseBuilder } from '../common/http/base-response.builder';
import { storeContextMiddleware } from '../common/middlewares/store-context.middleware';
import { authRouter } from '../modules/auth/auth.routes';
import { adminCategoryRouter, publicCategoryRouter } from '../modules/categories/category.routes';
import { healthRouter } from '../modules/health/health.routes';
import { mediaRouter } from '../modules/media/media.routes';
import { adminProductRouter, publicProductRouter } from '../modules/products/product.routes';
import { adminRequestRouter, publicRequestRouter } from '../modules/requests/request.routes';
import { shortlistRouter } from '../modules/shortlist/shortlist.routes';
import { storeRouter } from '../modules/stores/store.routes';
import { tagRouter } from '../modules/tags/tag.routes';
import { userRouter } from '../modules/users/user.routes';
import { attributeRouter } from '../modules/attributes/attribute.routes';
import { visibilityRouter } from '../modules/visibility/visibility.routes';

export const router = Router();
const v1Router = Router();
const adminRouter = Router();

router.get('/', (_request, response) => {
  response.json(BaseResponseBuilder.success({ service: 'vistora-api', version: 'v1' }, 'Vistora API ready'));
});

router.use('/health', healthRouter);

v1Router.use(storeContextMiddleware);
v1Router.use('/auth', authRouter);
v1Router.use('/products', publicProductRouter);
v1Router.use('/categories', publicCategoryRouter);
v1Router.use('/shortlist', shortlistRouter);
v1Router.use('/requests', publicRequestRouter);

adminRouter.use('/products', adminProductRouter);
adminRouter.use('/categories', adminCategoryRouter);
adminRouter.use('/requests', adminRequestRouter);
adminRouter.use('/users', userRouter);
adminRouter.use('/store', storeRouter);
adminRouter.use('/media', mediaRouter);
adminRouter.use('/tags', tagRouter);
adminRouter.use('/attributes', attributeRouter);
adminRouter.use('/visibility-rules', visibilityRouter);

v1Router.use('/admin', adminRouter);
router.use('/api/v1', v1Router);
