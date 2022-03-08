import express from "express";
import passport from "passport";
import "../middleware/googleAuth.js";
import "../middleware/localAuth.js";
import { createUserRules } from '../middleware/createUserRules.js';
import { createUserValidate } from "../middleware/createUserValidate.js";
import { createUser } from '../controllers/userController.js';

// Router for all things authentication related

const router = express.Router()

// Native Login
router.post("/login", passport.authenticate('local'), (req,res) => {
  res.status(200).json(true);
});

// Native Register
router.post("/register", createUserRules, createUserValidate, createUser, passport.authenticate('local'), (req,res) => {
  res.status(200).json(true);
});

// Google Login and Register
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google API Callback
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect('https://maxbraun1.github.io/pear-client/feed');
});

// Logout
router.get('/logout', (req,res) => {
  req.logout();
  res.json(true)
})

// Client get Logged in Status
router.get('/loggedStatus', (req,res) => {
  if (req.user) {
    res.json(req.user.id);
  } else {
    res.json(false);
  }
})

export default router