import {PollstersController} from '../../controllers';

export default router => {
    router.get('/:stateId', PollstersController.getPollstersByState);
    router.get('/:id/pollster', PollstersController.getPollsterByDate);
    return router;
};
