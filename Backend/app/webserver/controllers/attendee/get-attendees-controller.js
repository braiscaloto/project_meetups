"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getAttendees(req, res, next) {
  const { eventId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT *
      FROM attendees
      WHERE event_id = ?`;
    const [rows] = await connection.execute(sqlQuery, [eventId]);
    connection.release();

    const attendees = rows.map(attendee => {
      return {
        ...attendee,
        createdAt: attendee.created_at,
        user_id: undefined,
        created_at: undefined
      };
    });

    return res.status(200).send(attendees);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getAttendees;
