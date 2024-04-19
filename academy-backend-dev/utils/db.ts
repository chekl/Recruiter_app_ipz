import mongoose from 'mongoose';
import config from 'config';
import * as process from 'process';

//Replace sharedSrv with srv to work with local database
const srv = config.get<string>('database.sharedSrv');
const origin = config.get<string>('server.origin');

mongoose.Promise = global.Promise;

async function getConnection() {
  const uri = srv;
  const options = {
    serverSelectionTimeoutMS: 3000
  };

  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connection.on('connected', () => console.log('Mongoose connection is CONNECTED'));
  mongoose.connection.on('error', err => console.error('Mongoose connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is DISCONNECTED'));

  await mongoose.connect(uri, options);
}

export {getConnection, origin};
