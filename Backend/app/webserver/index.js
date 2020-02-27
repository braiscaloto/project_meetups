'use strict';

const express = require('express');
const cors = require('cors');

const {
  accountRouter,
  attendeeRouter,
  authRouter,
  commentRouter,
  eventRouter,
  likeRouter,
  tagRouter,
  userRouter
} = require('./routes');

const app = express();
app.use(cors());
app.use((req, res, next) => {
  const accessControlAllowHeaders = ['Origin', 'Location'];

  res.header(
    'Access-Control-Expose-Headers',
    accessControlAllowHeaders.join(',')
  );
  next();
});

app.use(express.json());
app.use('/api', accountRouter);
app.use('/api', attendeeRouter);
app.use('/api', authRouter);
app.use('/api', commentRouter);
app.use('/api', eventRouter);
app.use('/api', likeRouter);
app.use('/api', tagRouter);
app.use('/api', userRouter);

let server = null;
async function listen(port) {
  if (server) {
    return server;
  }

  try {
    server = await app.listen(port);
    return server;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function close() {
  if (server) {
    await server.close();
    server = null;
  } else {
    console.error('Can not close a non started server');
  }
}

module.exports = {
  listen,
  close
};
