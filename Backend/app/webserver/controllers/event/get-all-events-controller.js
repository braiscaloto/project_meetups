"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getAllEvents(req, res, next) {
  //const { eventId } = req.params;
  try {
    const sqlQuery = `SELECT id, title, content, location, tag, user_id,
      created_at, event_at, updated_at 
      FROM events 
      WHERE 
        deleted_at IS NULL
      ORDER BY created_at`;

    const connection = await mysqlPool.getConnection();
    const [eventsData] = await connection.execute(sqlQuery);
    connection.release();

    const eventsHydrated = eventsData.reduce((acc, rawEvent) => {
      const tag = rawEvent.tagId
        ? {
            id: rawEvent.tagId,
            name: rawEvent.tag
          }
        : undefined;

      const eventProcessed = acc[rawEvent.id];

      // if (!eventProcessed) {
      //   return {
      //     ...acc
      //     [rawEvent.id]: {...rawEvent}
      //       // tags: tag ? [tag] : [],
      //       // tagId: undefined,
      //       // tag: undefined

      //   };
      // }

      return {
        ...acc,
        [rawEvent.id]: {
          ...rawEvent
          // tags: [...eventProcessed.tags, tag],
          // tagId: undefined,
          // tag: undefined
        }
      };
    }, {});

    return res.status(200).send({
      data: Object.values(eventsHydrated)
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      message: e.message
    });
  }
}

module.exports = getAllEvents;
