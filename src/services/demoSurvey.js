import {DemoSurvey} from '../model';

export default class DemoSurveyService {
    static fetch() {
        return DemoSurvey.find().populate('address').lean().exec();
    }
}
