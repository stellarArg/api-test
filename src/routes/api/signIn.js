import {SignInController} from '../../controllers';

export default router => {
    router.post('/', SignInController.signIn);
    return router;
};
