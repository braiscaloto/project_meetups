'use strict';

const express = require('express');
const createAccount = require('../controllers/account/create-account-controller');
const deleteAccount = require('../controllers/account/delete-account-controller');
const checkAccountSession = require('../controllers/account/check-account-session');
const updateAccount = require('../controllers/account/update-account-controller');
const getAccount = require('../controllers/account/get-account-controller');
const router = express.Router();

router.post('/accounts', createAccount);
router.delete('/accounts', checkAccountSession, deleteAccount);
router.put('/accounts', checkAccountSession, updateAccount);
router.get('/accounts/:userId', checkAccountSession, getAccount);

module.exports = router;
