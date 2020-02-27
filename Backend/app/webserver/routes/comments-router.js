"use strict";

const express = require("express");
const checkAccountSession = require("../controllers/account/check-account-session");
const createComment = require("../controllers/comment/create-comment-controller");
const deleteComment = require("../controllers/comment/delete-comment-controller");
const getComment = require("../controllers/comment/get-comment-controller");
const getComments = require("../controllers/comment/get-comments-controller");

const router = express.Router();

router.get("/comments/:eventId", checkAccountSession, getComments);
router.post("/comments", checkAccountSession, createComment);
router.get("/comments/:commentId", checkAccountSession, getComment);
router.delete("/comments/:commentId", checkAccountSession, deleteComment);

module.exports = router;
