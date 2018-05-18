import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const SyncLogSchema = new Schema({
    user: {type: String, required: true, ref: 'User'},
    received: {type: Number},
    edited: {type: Number},
    visited: {type: Number},
    closed: {type: Number},
    sent: {type: Number},
    created: {type: Number}
}, {collection: 'syncLog', timestamps: true});

const SyncLog = Mongoose.model('SyncLogs', SyncLogSchema);

export default SyncLog;
