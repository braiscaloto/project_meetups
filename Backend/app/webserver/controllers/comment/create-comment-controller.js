"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
  const schema = Joi.object({
    content: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required()
  });

  Joi.assert(payload, schema);
}

async function createComment(req, res, next) {
  const commentData = { ...req.body };
  const { eventId } = req.params;
  const { userId } = req.claims;

  try {
    await validate(commentData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const { content } = commentData;

  const commentId = uuidV4();
  const comment = {
    id: commentId,
    content,
    user_id: userId,
    event_id: eventId,
    created_at: now
  };

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateComment = "INSERT INTO events_comments SET ?";
      await connection.query(sqlCreateComment, comment);

      connection.release();

      res.header("Location", `${httpServerDomain}/api/comments/${commentId}`);
      return res.status(201).send();
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = createComment;
