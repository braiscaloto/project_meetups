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
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required(),
    tag: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function getEvent(eventId, userId) {
  const connection = await mysqlPool.getConnection();
  const getEventQuery = `SELECT id, title, content, location, event_at created_at, updated_at
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

async function addTagToEvent(req, res, next) {
  // /api/events/37664a0b-0811-4005-8a26-db41b93825a8/tags
  const { eventId } = req.params;
  const { userId } = req.claims;
  const tagData = { ...req.body };
  const payload = {
    eventId,
    userId,
    ...tagData
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

    // Associate tags to the given event
    const sqlAddTags = "INSERT INTO events_tags SET ?";
    const tagId = tagData.tag;

    const tagRow = {
      event_id: eventId,
      tag_id: tagId,
      created_at: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19)
    };

    const connection = await mysqlPool.getConnection();
    try {
      await connection.query(sqlAddTags, tagRow);
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

module.exports = addTagToEvent;
