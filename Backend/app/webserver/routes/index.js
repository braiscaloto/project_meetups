"use strict";

const accountRouter = require("./account-router");
const attendeeRouter = require("./attendees-router");
const authRouter = require("./auth-router");
const commentRouter = require("./comments-router");
const eventRouter = require("./events-router");
const likeRouter = require("./likes-router");
const tagRouter = require("./tag-router");
const userRouter = require("./user-router");

module.exports = {
  accountRouter,
  attendeeRouter,
  authRouter,
  commentRouter,
  eventRouter,
  likeRouter,
  tagRouter,
  userRouter
};
