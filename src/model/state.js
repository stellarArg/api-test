import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const StateSchema = new Schema({
    _id: Number,
    name: String
}, {collection: 'states', timestamps: true});

const State = Mongoose.model('State', StateSchema);

export default State;
