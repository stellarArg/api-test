import {SurveySections} from '../model';

export default class SurveySectionsService {
    static fetch() {
        return SurveySections.find().exec();
    }
}
