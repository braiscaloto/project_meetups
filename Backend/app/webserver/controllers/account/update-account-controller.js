'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');
const bcrypt = require('bcrypt');

async function validate(data) {
  const schema = Joi.object({
    /*email: Joi.string()
      .email({ minDomainSegments: 2, tlds: false })
      .required(),*/
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: Joi.string()
      .max(45)
      .required()
  });

  Joi.assert(data, schema);
}

async function updateUser(req, res, next) {
  const { userId } = req.claims;
  const userData = {
    ...req.body
  };

  try {
    await validate(userData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  let actualPassword;
  try {
    connection = await mysqlPool.getConnection();
    const mysqlQuery = `SELECT password FROM users WHERE id=?`;
    const [rows] = await connection.execute(mysqlQuery, [userId]);
    connection.release();

    if (rows.length !== 1) {
      return res.status(404).send();
    }

    actualPassword = rows[0].password;
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }

  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    if (userData.newPassword !== undefined) {
      const isPasswordOk = await bcrypt.compare(
        userData.password,
        actualPassword
      );
      if (!isPasswordOk) {
        return res.status(401).send();
      }
      /*const queryUpdateUser = `UPDATE users
            SET name = ?,email = ?,password = ?,updated_at = ?
            WHERE id = ?`;*/

      const bcryptPassword = await bcrypt.hash(userData.newPassword, 10);

      await connection.query(`UPDATE users SET ?`, {
        name: userData.name,
        // email: userData.email,
        password: bcryptPassword,
        updated_at: now
      });
      connection.release();
      return res.status(204).send();
    } else {
      /*onst queryUpdateUser = `UPDATE users
            SET name = ?,email = ?,password = ?,updated_at = ?
            WHERE id = ?`;*/
      await connection.query(`UPDATE users SET ?`, {
        name: userData.name,
        // email: userData.email,
        password: bcryptPassword,
        updated_at: now
      });
      connection.release();
      return res.status(204).send();
    }
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

module.exports = updateUser;
