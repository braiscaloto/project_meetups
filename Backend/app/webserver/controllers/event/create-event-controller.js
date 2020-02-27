"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(60)
      .required(),
    content: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required(),
    tag: Joi.string()
      .trim()
      .min(1)
      .max(60)
      .required(),
    location: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    event_at: Joi.required()
  });

  Joi.assert(payload, schema);
}

async function createEvent(req, res, next) {
  const eventData = { ...req.body };
  const { userId } = req.claims;

  try {
    await validate(eventData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const { title, content, location, tag, event_at } = eventData;

  const eventId = uuidV4();
  const event = {
    id: eventId,
    title,
    content,
    location,
    tag,
    event_at,
    user_id: userId,
    created_at: now
  };

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateEvent = "INSERT INTO events SET ?";
      await connection.query(sqlCreateEvent, event);

      // eventData.tags.forEach(async tagId => {
      //   const sqlAddTag = "INSERT INTO events_tags SET ?";
      //   try {
      //     await connection.query(sqlAddTag, {
      //       event_id: eventId,
      //       tag_id: tagId,
      //       created_at: now
      //     });
      //   } catch (e) {
      //     console.error(e);
      //   }
      // });

      connection.release();

      res.header("Location", `${httpServerDomain}/api/events/${eventId}`);
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

module.exports = createEvent;
