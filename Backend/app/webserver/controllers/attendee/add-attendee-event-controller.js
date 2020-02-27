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
      .required()
  });

  Joi.assert(payload, schema);
}

async function getEvent(eventId) {
  const connection = await mysqlPool.getConnection();
  const getEventQuery = `SELECT id, title, content, user_id,  created_at, updated_at
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

async function addAttendeeToEvent(req, res, next) {
  // /api/events/37664a0b-0811-4005-8a26-db41b93825a8/attendees
  const { eventId } = req.params;
  const { userId } = req.claims;
  const payload = {
    eventId,
    userId
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

    // Associate attendees to the given event
    const sqlAddAttendees = "INSERT INTO attendees SET ?";

    const attendeeRow = {
      event_id: eventId,
      user_id: userId,
      created_at: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19)
    };

    const connection = await mysqlPool.getConnection();
    try {
      await connection.query(sqlAddAttendees, attendeeRow);
      connection.release();
    } catch (e) {
      console.error(e);
      connection.release();

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

module.exports = addAttendeeToEvent;
