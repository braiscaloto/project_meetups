'use strict';

const express = require('express');
const addTagToEvent = require('../controllers/event/add-tag-event-controller');
const checkAccountSession = require('../controllers/account/check-account-session');
const createEvent = require('../controllers/event/create-event-controller');
const deleteEvent = require('../controllers/event/delete-event-controller');
const getEvent = require('../controllers/event/get-event-controller');
const getEvents = require('../controllers/event/get-events-controller');
const getAllEvents = require('../controllers/event/get-all-events-controller');
const deleteTagFromEvent = require('../controllers/event/delete-tag-event-controller');
const updateEvent = require('../controllers/event/update-event-controller');
const addCommentToEvent = require('../controllers/event/add-comment-event-controller');
const router = express.Router();

router.get('/events', checkAccountSession, getEvents);
router.get('/allevents', getAllEvents);
router.post('/events', checkAccountSession, createEvent);
router.get('/events/:eventId', checkAccountSession, getEvent);
router.put('/events/:eventId', checkAccountSession, updateEvent);
router.delete('/events/:eventId', checkAccountSession, deleteEvent);
router.post('/events/:eventId/tags', checkAccountSession, addTagToEvent);
router.post(
  '/events/:eventId/comments',
  checkAccountSession,
  addCommentToEvent
);
router.delete(
  '/events/:eventId/tags/:tagId',
  checkAccountSession,
  deleteTagFromEvent
);

module.exports = router;
