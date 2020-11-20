const express = require(`express`);
const passport = require(`passport`);
const bcrypt = require(`bcrypt`);
const async = require(`async`);
const crypto = require(`crypto`);
const mailer = require(`../config/mailer`);
const nodemailer = require(`nodemailer`);
const path = require(`path`);
const p = path.join(__dirname, "../views");

const User = require(`../models/User`);

const router = express.Router();

// ---------------------- GOOGLE AUTH ----------------------

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

// ---------------------- END OF GOOGLE AUTH ----------------------

// ---------------------- PASSPORT LOCAL ----------------------

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: `/${req.user ? req.user._id : ""}`,
    failureRedirect: "/",
    failureFlash: "Invalid username or password.",
  })(req, res, next);
});

router.post(`/register`, async (req, res, next) => {
  const { email, password, givenName, familyName } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({
        isSuccessful: false,
        message: "Email is already registered.",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      crypto.randomBytes(20, async (error, buf) => {
        const token = buf.toString("hex");

        const user = new User({
          email,
          password: hashedPassword,
          givenName,
          familyName,
          displayName: `${givenName} ${familyName}`,
          accountActivationToken: token,
          accountActivationExpires: Date.now() + 3600000,
        });

        await user.save();

        mailer(user, "CONFIRMATION", (operationResult) => {
          res.json(operationResult);
        });
      });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

// ---------------------- END OF PASSPORT LOCAL ----------------------

// ---------------------- FORGOT PASSWORD ----------------------

router.post(`/forgot`, (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        crypto.randomBytes(20, (error, buf) => {
          const token = buf.toString("hex");
          done(error, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }).then((user) => {
          if (!user) {
            res.json({
              isSuccessful: false,
              message: "Email was not found.",
            });
          } else if (user && !user.isActive) {
            res.json({
              isSuccessful: false,
              message: "Account is not activated.",
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            return user.save((error) => {
              done(error, user);
            });
          }
        });
      },
      (user, done) => {
        mailer(user, "PASSWORD_RESET", (operationResult) => {
          res.json(operationResult);
        });
      },
    ],
    (error) => {
      if (error) return next(error);
    }
  );
});

router.get(`/forgot/:token`, async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    console.log(`Reset token has expired or it is invalid.`);
    res.redirect(`/`);
  } else {
    res.render("passwordReset", {
      user: user,
    });
  }
});

router.post(`/forgot/:token`, (req, res, next) => {
  async.waterfall(
    [
      (done) => {
        User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() },
        }).then((user) => {
          if (!user) {
            console.log(`Reset token has expired or it is invalid.`);
            res.redirect(`/`);
          } else {
            bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
              user.password = hashedPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save((error) => {
                done(error, user);
              });
            });
          }
        });
      },
      (user, done) => {
        mailer(user, "PASSWORD_RESET_SUCCESSFUL", (operationResult) => {
          res.json(operationResult);
        })
      },
    ],
    (error) => {
      res.redirect(`/`);
    }
  );
});

// ---------------------- END OF FORGOT PASSWORD ----------------------

// ---------------------- ACCOUNT CONFIRMATION ----------------------

router.get(`/confirm/:token`, async (req, res) => {
  const user = await User.findOne({
    accountActivationToken: req.params.token,
    accountActivationExpires: { $gt: Date.now() },
  });
  if (!user) {
    console.log(`Oops. Token is invalid.`);
    res.redirect(`/`);
  } else {
    user.isActive = true;
    await user.save();
    req.login(user, (e) => {
      if (e) {
        return console.log(e);
      }
      res.redirect(`/success`);
    });
  }
});

// ---------------------- END OF ACCOUNT CONFIRMATION ----------------------

module.exports = router;
