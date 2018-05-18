import {MonitoringController} from '../../controllers';

export default router => {
    router.get('/general', MonitoringController.getGeneralMonitoring);
    router.get('/response', MonitoringController.getResponseMonitoring);
    return router;
};
