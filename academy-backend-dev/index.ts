import app from './app';
import config from 'config';
import https, {Server} from 'https';
import fs from 'fs';
import {Express} from 'express';

import {getConnection} from '@utils/db';

const port = config.get<number>('server.port');

getConnection();

let server: Server | Express = app;

if (process.env.NODE_ENV === 'production') {
  server = https.createServer(
    {
      key: fs.readFileSync('../private.pem', 'utf8'),
      cert: fs.readFileSync('../public.pem', 'utf8')
    },
    app
  );
}

server.listen(port, () => {
  console.log(`Server is up and running on port number ${port}`);
});

export default server;
