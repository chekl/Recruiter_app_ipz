'use strict';

module.exports = {
  apps: [
    {
      name: 'PKServer',
      script: 'npm',
      args: "run start:pm2",
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
};
