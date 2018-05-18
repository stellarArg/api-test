import {ScheduledVisitsController} from '../../controllers';

export default router => {
    router.get('/', ScheduledVisitsController.fetchScheduledVisits);
    return router;
};
