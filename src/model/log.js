import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const LogSchema = new Schema({
    user: {type: String, required: true, ref: 'User'},
    action: {type: String, required: true},
    collectionName: {type: String, required: true},
    query: {
        update: {type: Schema.Types.Mixed},
        filters: {type: Schema.Types.Mixed}
    },
    message: {type: String}
}, {collection: 'log', timestamps: true});

const Log = Mongoose.model('Log', LogSchema);

export default Log;
