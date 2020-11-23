const express = require(`express`);
const passport = require(`passport`);

const router = express.Router();

const authController = require(`../controllers/auth`);

// ---------------------- GOOGLE AUTH ----------------------

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`/${req.user ? req.user.profileId : ""}`);
  }
);

// ---------------------- END OF GOOGLE AUTH ----------------------


// ---------------------- PASSPORT LOCAL ----------------------

router.post("/login", authController.postLogin);

router.post(`/register`, authController.postRegister);

router.get("/logout", authController.getLogout);

// ---------------------- END OF PASSPORT LOCAL ----------------------


// ---------------------- FORGOT PASSWORD ----------------------

router.post(`/forgot`, authController.postForgot);

router.get(`/forgot/:token`, authController.getForgotToken);

router.post(`/forgot/:token`, authController.postForgotToken);

// ---------------------- END OF FORGOT PASSWORD ----------------------


// ---------------------- ACCOUNT CONFIRMATION ----------------------

router.get(`/confirm/:token`, authController.getConfirmToken);

// ---------------------- END OF ACCOUNT CONFIRMATION ----------------------

module.exports = router;
