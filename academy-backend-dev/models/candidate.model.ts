import {Candidate} from 'interfaces';
import {Schema, model} from 'mongoose';

const CandidateSchema = new Schema<Candidate>({
  firstName: {type: String, minlength: 2, maxlength: 20, required: true, trim: true},
  lastName: {type: String, minlength: 2, maxlength: 20, required: true, trim: true},
  email: {type: String, required: true, unique: true, trim: true}
});

export const Candidates = model('candidates', CandidateSchema);
