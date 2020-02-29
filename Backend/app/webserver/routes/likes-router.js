"use strict";

const express = require("express");
const addLikeToEvent = require("../controllers/like/add-like-event-controller");
const checkAccountSession = require("../controllers/account/check-account-session");
const getLike = require("../controllers/like/get-like-controller");
const getLikes = require("../controllers/like/get-likes-controller");
const deleteLikeFromEvent = require("../controllers/like/delete-like-event-controller");

const router = express.Router();

router.get("/likes/:eventId/likes", checkAccountSession, getLikes);
router.get("/likes/:eventId", checkAccountSession, getLike);
router.post("/events/:eventId/likes", checkAccountSession, addLikeToEvent);
router.delete(
  "/events/:eventId/likes",
  checkAccountSession,
  deleteLikeFromEvent
);

module.exports = router;
