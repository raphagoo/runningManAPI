import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const RaceSchema = new Schema({
    name: {
        type: String,
        required: 'name required'
    },
    distance: {
        type: Number,
    },
    time: {
        type: Number
    },
    date: {
        type: Date,
    },
    startPosLat: {
        type: Number,
        required: 'Start position lattitude required'
    },
    startPosLong: {
        type: Number,
        required: 'Start position longitude required'
    },
    endPosLat: {
        type: Number
    },
    endPosLong: {
        type: Number
    },
    inProgress: {
        type: Boolean,
        default: true
    }
});
RaceSchema.plugin(require('mongoose-autopopulate'));
