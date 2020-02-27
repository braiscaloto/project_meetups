"use strict";

const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");
const sendgridMail = require("@sendgrid/mail");
const uuidV4 = require("uuid/v4");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(email, name) {
  const msg = {
    to: email,
    from: "meetech@tech-center.com",
    subject: "Welcome to Meetech",
    text: `Welcome ${name} to meetech, enjoy creating your events!`,
    html: `<strong>Welcome ${name} to meetch, enjoy creating your events!</strong>`
  };

  const data = await sendgridMail.send(msg);
  console.log(data);

  return data;
}

async function validateSchema(payload) {
  const schema = Joi.object({
    name: Joi.string()
      .min(4)
      .max(16)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  });

  Joi.assert(payload, schema);
}

async function createAccount(req, res, next) {
  const accountData = { ...req.body };
  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const now = new Date();
  const createdAt = now
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);
  const userId = uuidV4();
  const securePassword = await bcrypt.hash(accountData.password, 10);

  let connection;
  try {
    connection = await mysqlPool.getConnection(); // 1
    await connection.query("INSERT INTO users SET ?", {
      // 2
      id: userId,
      name: accountData.name,
      email: accountData.email,
      password: securePassword,
      created_at: createdAt
    });
    connection.release();

    res.status(201).send();

    try {
      await sendWelcomeEmail(accountData.email, accountData.name);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).send();
    }

    return res.status(500).send();
  }
}

module.exports = createAccount;
