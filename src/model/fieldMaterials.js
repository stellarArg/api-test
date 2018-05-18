import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FieldMaterialsSchema = new Schema({
    stateId: Number,
    departamentId: Number,
    departamentName: String,
    localityId: Number,
    localityName: String,
    agglomerate: Number,
    entityId: Number,
    entityName: String,
    ups: Number,
    area: Number,
    fraction: Number,
    radio: Number,
    block: Number,
    side: Number,
    listNumber: Number,
    street: String,
    streetNumber: String,
    floor: String,
    department: String,
    room: String,
    type: String,
    sector: String,
    building: String,
    entry: String,
    description: String,
    additionalDescription: String,
    subCoordinator: {type: ObjectId},
    supervisor: {type: ObjectId},
    pollster: {type: ObjectId},
    mark: {type: String},
    group: {type: Number}
}, {collection: 'fieldMaterials', timestamps: true});

const FieldMaterials = Mongoose.model('FieldMaterials', FieldMaterialsSchema);

export default FieldMaterials;
