"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    commentId: Joi.string()
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

async function getComment(req, res, next) {
  const commentId = req.params.commentId;
  const userId = req.claims.userId;

  const payload = {
    commentId,
    userId
  };

  try {
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const connection = await mysqlPool.getConnection();
    const getCommentQuery = `SELECT id, content, created_at, updated_at
      FROM comments 
      WHERE user_id = ?
        AND id = ?`;
    const [results] = await connection.execute(getCommentQuery, [
      userId,
      commentId
    ]);
    connection.release();
    if (results.length < 1) {
      return res.status(404).send();
    }

    const [commentData] = results;

    return res.send({
      data: commentData
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: e.message
    });
  }
}

module.exports = getComment;
