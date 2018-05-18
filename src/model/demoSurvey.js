import Mongoose from 'mongoose';

import enums from '../common/enums';

const Schema = Mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DemoSurveySchema = new Schema({
    address: {type: ObjectId, ref: 'Address', required: true},
    dwellings: [],
    dwellingResponse: {type: Number},
    surveyAddressState: {type: Number, default: enums.surveyAddressState.OPENED}
}, {collection: 'demoSurveys', timestamps: true});

const DemoSurveys = Mongoose.model('DemoSurveys', DemoSurveySchema);

export default DemoSurveys;
