import {FieldMaterialsController} from '../../controllers';

export default router => {
    router.get('/general', FieldMaterialsController.getFieldMaterials);
    router.get('/', FieldMaterialsController.getFieldMaterials);
    return router;
};
