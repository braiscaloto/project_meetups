"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getComments(req, res, next) {
  const { eventId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT *
      FROM events_comments
      WHERE event_id = ?`;
    const [rows] = await connection.execute(sqlQuery, [eventId]);
    connection.release();

    const comments = rows.map(comment => {
      return {
        ...comment,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        event_id: eventId,
        user_id: undefined,
        created_at: undefined,
        updated_at: undefined
      };
    });

    return res.status(200).send(comments);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getComments;
