
const
  mongoose = require('mongoose'),
  Bluebird = require('bluebird');

const Schema = mongoose.Schema;


const SegmentSchema = new Schema({

  name: { type: String, required: true },

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' }
});

const Segment = mongoose.model('Segment', SegmentSchema);

Bluebird.promisifyAll(Segment);
Bluebird.promisifyAll(Segment.prototype);


module.exports = Segment;
