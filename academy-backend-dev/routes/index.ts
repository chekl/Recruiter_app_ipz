import express from 'express';

import vacanciesRouter from './vacancies.routes';
import questionsRouter from './questions.routes';
import topicsRouter from './topics.routes';
import questionTypesRouter from './question-types.routes';
import authRouter from './auth.routes';
import usersRouter from './users.routes';
import vacancyTypesRouter from './vacancy-types.routes';
import candidateRouter from './candidate.routes';
import applicationsRouter from './applications.routes';

const router = express.Router();

router.get('/hc', (req, res) => res.json({status: 'ok'}));

router.use('/vacancies', vacanciesRouter);
router.use('/applications', applicationsRouter);
router.use('/questions', questionsRouter);
router.use('/topics', topicsRouter);
router.use('/question-types', questionTypesRouter);
router.use('/auth', authRouter);
router.use('/vacancy-types', vacancyTypesRouter);
router.use('/candidates', candidateRouter);
router.use('', usersRouter);

export default router;
