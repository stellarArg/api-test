import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserHierarchySchema = new Schema({
    _id: {type: ObjectId, required: true},
    subCoordinator: {type: Schema.Types.ObjectId},
    supervisor: {type: ObjectId}
}, {collection: 'usersHierarchy', timestamps: true});

const UserHierarchy = Mongoose.model('UserHierarchy', UserHierarchySchema);

export default UserHierarchy;
