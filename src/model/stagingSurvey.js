import Mongoose from 'mongoose';

import enums from '../common/enums';

const Mixed = Mongoose.Schema.Types.Mixed;
const Schema = Mongoose.Schema;
const ObjectId = Schema.ObjectId;

const StagingSurveySchema = new Schema({
    address: {type: ObjectId, ref: 'Address'},
    dwellings: {type: Mixed},
    dwellingResponse: {type: Number},
    pollster: {type: ObjectId, required: true},
    surveyAddressState: {type: Number, default: enums.surveyAddressState.OPENED},
    valid: {type: Number, default: enums.validationState.INCOMPLETE}
}, {collection: 'stagingSurveys', timestamps: true});

const StagingSurvey = Mongoose.model('StagingSurvey', StagingSurveySchema);

export default StagingSurvey;
