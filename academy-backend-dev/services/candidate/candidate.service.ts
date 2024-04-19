import {candidateRepository} from 'repositories';
import {Candidate} from 'interfaces';
import {validateCreateCandidate} from 'services/candidate/candidate.validate';

class CandidateService {
  async getCandidateByEmail(email: string) {
    return candidateRepository.findOne({email: email});
  }

  async createCandidate(payload: Candidate) {
    const data = await validateCreateCandidate(payload);

    const candidate = await candidateRepository.findOne({email: data.email}).lean();

    if (candidate) return candidate;

    return await candidateRepository.createOne(data);
  }
}

export default new CandidateService();
