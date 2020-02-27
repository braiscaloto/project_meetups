"use strict";

const express = require("express");
const addAttendeeToEvent = require("../controllers/attendee/add-attendee-event-controller");
const checkAccountSession = require("../controllers/account/check-account-session");
const getAttendee = require("../controllers/attendee/get-attendee-controller");
const getAttendees = require("../controllers/attendee/get-attendees-controller");
const deleteAttendeeFromEvent = require("../controllers/attendee/delete-attendee-event-controller");

const router = express.Router();

router.get("/attendees/:eventId/attendees", checkAccountSession, getAttendees);
router.get("/attendees/:eventId", checkAccountSession, getAttendee);
router.post(
  "/events/:eventId/attendees",
  checkAccountSession,
  addAttendeeToEvent
);
router.delete(
  "/events/:eventId/attendees/:attendeeId",
  checkAccountSession,
  deleteAttendeeFromEvent
);

module.exports = router;
