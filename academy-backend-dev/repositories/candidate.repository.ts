import BaseRepository from './base.repository';
import {Candidates} from 'models/candidate.model';
import {Candidate} from 'interfaces/candidate/candidate.interface';

export default class CandidateRepository extends BaseRepository<Candidate> {
  constructor() {
    super(Candidates);
  }
}
