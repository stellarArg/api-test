import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const SurveySectionSchema = new Schema({
    _id: {type: String, required:true},
    structure: [],
    version: {type: Number}
}, {collection: 'surveySections', timestamps: true});

const SurveySections = Mongoose.model('SurveySections', SurveySectionSchema);

export default SurveySections;
