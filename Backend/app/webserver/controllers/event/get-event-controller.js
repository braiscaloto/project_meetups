"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

/**
 *
 * @param {Object} payload  { eventId: "a valid uuid" }
 */
async function validate(payload) {
  const schema = Joi.object({
    eventId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

function hydrateEventTags(rows) {
  const eventHydrated = rows.reduce((acc, rawEvent) => {
    // const tag = rawEvent.tagId
    //   ? {
    //       tagId: rawEvent.tagId,
    //       tag: rawEvent.tag
    //     }
    //   : undefined;

    const eventProcesado = acc.id !== undefined;

    if (!eventProcesado) {
      return {
        ...acc,
        ...rawEvent,
        createdAt: rawEvent.created_at,
        eventAt: rawEvent.event_at,
        updatedAt: rawEvent.updated_at,
        tag: rawEvent.tag,
        created_at: undefined,
        updated_at: undefined
      };
    }

    return {
      ...acc
    };
  }, {});

  return eventHydrated;
}

async function getEvent(req, res, next) {
  const { eventId } = req.params;

  try {
    const payload = {
      eventId
    };
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT title,
      content, location, tag, user_id, created_at, event_at, updated_at 
      FROM events 
      WHERE
        id = ?
        AND deleted_at IS NULL`;
    const [rows] = await connection.execute(sqlQuery, [eventId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).send();
    }

    const event = hydrateEventTags(rows);
    return res.send(event);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getEvent;
