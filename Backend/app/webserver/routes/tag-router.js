'use strict';

const express = require('express');
const createTag = require('../controllers/tag/create-tag-controller');
const checkAccountSession = require('../controllers/account/check-account-session');
const getTag = require('../controllers/tag/get-tag-controller');
const getAllTags = require('../controllers/tag/get-all-tags-controller');

const router = express.Router();

router.post('/tags', checkAccountSession, createTag);
router.get('/tags', checkAccountSession, getAllTags);
router.get('/tags/:tagId', checkAccountSession, getTag);

module.exports = router;
