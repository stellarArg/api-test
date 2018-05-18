import {ReviewController} from '../../controllers';

export default router => {

    router.get('/states', ReviewController.getStates);
    router.get('/stateInfo', ReviewController.getAdditionalInfo);
    router.get('/surveys', ReviewController.getSurveys);
    router.get('/survey/:id/:stateId/surveyDetails', ReviewController.getSurvey);
    router.post('/approve', ReviewController.approveSurvey);
    router.post('/reassign', ReviewController.reassign);
    router.post('/reopen', ReviewController.reopenSurvey);

    return router;
};
