// Dependencies
const bcrypt = require(`bcrypt`);
const crypto = require(`crypto`);
const async = require(`async`);
const passport = require(`passport`);
const customAlphabet  = require(`nanoid`).customAlphabet;

// Mailer function
const mailer = require(`../config/mailer`);

// User model
const User = require(`../models/User`);

/* ------------ PASSPORT LOCAL CONTROLLERS ------------ */
// POST => /login
exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: `/${req.user ? req.user.profileId : ""}`,
    failureRedirect: "/",
    failureFlash: "Invalid username or password.",
  })(req, res, next);
};

// POST => /register
exports.postRegister = async (req, res) => {
  const { email, password, givenName, familyName } = req.body;
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
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
          profileId: nanoid(),
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
    console.log(error);
  }
};

// GET => /logout
exports.getLogout = (req, res) => {
  req.logOut();
  res.redirect("/");
};
/* ------------ END OF PASSPORT LOCAL CONTROLLERS ------------ */

/* ------------ FORGOT PASSWORD CONTROLLERS ------------ */
// POST => /forgot
exports.postForgot = (req, res) => {
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
};

// GET => /forgot/:token
exports.getForgotToken = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    console.log(`Reset token has expired or it is invalid.`);
    res.redirect(`/`);
  } else {
    res.render("start-page/password-reset", {
      user: user,
    });
  }
};

// POST => /forgot/:token
exports.postForgotToken = (req, res) => {
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
          res.redirect(`/`);
        });
      },
    ],
    (error) => {
      res.redirect(`/`);
    }
  );
};
/* ------------ END OF FORGOT PASSWORD CONTROLLERS ------------ */

/* ------------ CONFIRMATION CONTROLLER ------------ */
// GET => /confirm/:token
exports.getConfirmToken = async (req, res) => {
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
      res.redirect(`/${req.user ? req.user._id : ""}`);
    });
  }
};
/* ------------ END OF CONFIRMATION CONTROLLER ------------ */