"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

async function validateSchema(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    content: Joi.string()
      .trim()
      .min(1)
      .max(65536)
      .required(),
    location: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    event_at: Joi.substring(0, 19)
      .replace("T", " ")
      .requiered(),
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
    tags: Joi.array().items(Joi.string().guid({ version: ["uuidv4"] }))
  });

  Joi.assert(payload, schema);
}

/**
 * Create a new tag if does not exist
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Object} Tag created
 */
async function updateEvent(req, res, next) {
  const { eventId } = req.params;
  const { userId } = req.claims;
  const eventData = {
    ...req.body,
    eventId,
    userId
  };

  try {
    await validateSchema(eventData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const sqlUpdateEvent = `UPDATE events
      SET title = ?,
        content = ?,
        location = ?,
        tag = ?,
        event_at = ?,
      WHERE id = ?
        AND user_id = ?`;

    await connection.query(sqlUpdateEvent, [
      eventData.title,
      eventData.content,
      eventData.location,
      eventData.event_at,
      eventData.tag,
      eventId,
      userId
    ]);
    connection.release();

    return res.status(204).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send({
      message: e.message
    });
  }
}

module.exports = updateEvent;
