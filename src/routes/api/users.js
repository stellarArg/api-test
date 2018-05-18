import {UsersController} from '../../controllers';

export default router => {
    router.get('/', UsersController.users);
    router.get('/find', UsersController.find);
    router.get('/findById', UsersController.findById);
    router.get('/profile', UsersController.profile);
    router.post('/', UsersController.saveHierarchy);
    
    return router;
};
