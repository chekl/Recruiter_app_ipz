import {Topic} from 'interfaces';
import {Schema, model} from 'mongoose';

const TopicsSchema = new Schema<Topic>(
  {
    name: {type: String, maxlength: 50, required: true, unique: true}
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const Topics = model('topics', TopicsSchema);
