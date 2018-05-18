import {SyncController} from '../../controllers';

export default router => {
    router.post('/',
        SyncController.isDemoUser,
        SyncController.filterIncorrectSurveys,
        SyncController.saveStagingSurvey,
        SyncController.saveSurveyAddress,
        SyncController.syncSurveyAddress
    );

    return router;
};
