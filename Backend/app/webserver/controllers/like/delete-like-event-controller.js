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
    likeId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function getEvent(eventId) {
  const connection = await mysqlPool.getConnection();
  const getEventQuery = `SELECT id, title, content,  user_id, created_at, updated_at
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

async function deleteLikeFromEvent(req, res, next) {
  // /api/events/37664a0b-0811-4005-8a26-db41b93825a8/tags
  const { eventId, likeId } = req.params;
  //const { userId } = req.claims;

  const payload = {
    eventId,
    likeId
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

    const sqlDeleteLike = `DELETE
      FROM likes
      WHERE event_id = ?
        AND user_id = ?`;

    const connection = await mysqlPool.getConnection();
    try {
      await connection.execute(sqlDeleteLike, [eventId, likeId]);
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

module.exports = deleteLikeFromEvent;
