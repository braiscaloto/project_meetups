"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    eventId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required(),
    tagId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function getEvent(eventId, userId) {
  const connection = await mysqlPool.getConnection();
  const getEventQuery = `SELECT id, title, content,  created_at, updated_at
    FROM events
    WHERE user_id = ?
      AND id = ?
      AND deleted_at IS NULL`;
  const [eventData] = await connection.execute(getEventQuery, [
    userId,
    eventId
  ]);
  connection.release();

  if (eventData.length < 1) {
    return null;
  }

  return eventData[0];
}

async function deleteTagFromEvent(req, res, next) {
  // /api/events/37664a0b-0811-4005-8a26-db41b93825a8/tags
  const { eventId, tagId } = req.params;
  const { userId } = req.claims;

  const payload = {
    eventId,
    tagId
  };

  try {
    await validate(payload);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  try {
    const event = await getEvent(eventId, userId);

    if (!event) {
      return res.status(404).send();
    }

    const sqlDeleteTag = `DELETE
      FROM events_tags
      WHERE event_id = ?
        AND tag_id = ?`;

    const connection = await mysqlPool.getConnection();
    try {
      await connection.execute(sqlDeleteTag, [eventId, tagId]);
      connection.release();
    } catch (e) {
      console.error(e);
      connection.release();
      return res.status(500).send({
        message: e.message
      });
    }

    return res.status(204).send();
  } catch (e) {
    console.error(e);

    return res.status(500).send({
      message: e.message
    });
  }
}

module.exports = deleteTagFromEvent;
