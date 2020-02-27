"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    eventId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required(),
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required(),
    comment: Joi.string().required()
  });

  Joi.assert(payload, schema);
}

async function getEvent(eventId) {
  const connection = await mysqlPool.getConnection();
  const getEventQuery = `SELECT id, user_id, title, tag, content, location, event_at, created_at, updated_at
    FROM events
    WHERE
      id = ?
      AND deleted_at IS NULL`;
  const [eventData] = await connection.execute(getEventQuery, [eventId]);
  connection.release();

  if (eventData.length < 1) {
    return null;
  }

  return eventData[0];
}

async function addCommentToEvent(req, res, next) {
  // /api/events/37664a0b-0811-4005-8a26-db41b93825a8/tags
  const { eventId } = req.params;
  const { userId } = req.claims;
  const commentData = { ...req.body };
  const commentId = uuidV4();
  const payload = {
    eventId,
    userId,
    ...commentData
  };

  try {
    await validate(payload);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  try {
    const event = await getEvent(eventId);

    if (!event) {
      return res.status(404).send();
    }

    // Associate tags to the given event
    const sqlAddComments = "INSERT INTO events_comments SET ?";
    const { comment } = commentData;
    const commentRow = {
      id: commentId,
      event_id: eventId,
      user_id: userId,
      comment: comment,
      created_at: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19)
    };

    const connection = await mysqlPool.getConnection();
    try {
      await connection.query(sqlAddComments, commentRow);
      connection.release();
    } catch (e) {
      console.error(e);
      connection.release();
      /**
       * If the error is because the tag was already added, no problem, in other
       * case, return an error
       */
      if (e.code !== "ER_DUP_ENTRY") {
        return res.status(500).send({
          message: e.message
        });
      }
    }

    return res.status(204).send();
  } catch (e) {
    console.error(e);

    return res.status(500).send({
      message: e.message
    });
  }
}

module.exports = addCommentToEvent;
