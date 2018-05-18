import {SyncController} from '../../controllers';

export default router => {
    router.post('/sync',
        SyncController.isDemoUser,
        SyncController.filterIncorrectSurveys,
        SyncController.saveStagingSurvey,
        SyncController.saveSurveyAddress,
        SyncController.syncSurveyAddress
    );
    return router;
};
