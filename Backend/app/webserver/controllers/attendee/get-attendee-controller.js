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

async function getAttendee(req, res, next) {
  const eventId = req.params.eventId;
  const userId = req.claims.userId;

  const payload = {
    eventId,
    userId
  };

  try {
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const connection = await mysqlPool.getConnection();
    const getAttendeeQuery = `SELECT event_id, created_at
      FROM attendees 
      WHERE user_id = ?`;
    const [results] = await connection.execute(getAttendeeQuery, [userId]);
    connection.release();
    if (results.length < 1) {
      return res.status(404).send();
    }

    const [attendeeData] = results;

    return res.send({
      data: attendeeData
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: e.message
    });
  }
}

module.exports = getAttendee;
