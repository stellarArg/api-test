import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const AppInformationSchema = new Schema({
    version: {type: String},
    date: {type: String}
}, {collection: 'appInformation', timestamps: true});

const AppInformation = Mongoose.model('AppInformation', AppInformationSchema);

export default AppInformation;
