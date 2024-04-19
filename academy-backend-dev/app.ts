import logger from 'morgan';
import cors from 'cors';
import {basename} from 'path';
import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {ErrorResponse} from '@utils/error';
import routes from './routes';
import {origin} from '@utils/db';
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(cors({origin: origin, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api', routes);
app.use('/docs', express.static(`${basename('docs')}`));

app.use((err: ErrorResponse, _req: Request, res: Response, next: any) => {
  const {http_code} = err;

  console.log(err);
  if (http_code) {
    res.status(http_code).json(err);
  } else {
    res.status(500).json({message: 'Internal Server Error'});
  }
});

export default app;
