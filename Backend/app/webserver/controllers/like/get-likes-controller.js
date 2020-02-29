"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getLikes(req, res, next) {
  const { eventId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT *
      FROM likes
      WHERE event_id = ?`;
    const [rows] = await connection.execute(sqlQuery, [eventId]);
    connection.release();

    const likes = rows.map(like => {
      return {
        ...like
      };
    });

    return res.status(200).send(likes);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getLikes;
