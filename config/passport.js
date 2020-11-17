const bcrypt = require(`bcrypt`);
const User = require(`../models/User`);

const LocalStrategy = require(`passport-local`).Strategy;
const GoogleStrategy = require(`passport-google-oauth20`).Strategy;

module.exports = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) {
          done(null, false, { message: "User not found" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Wrong pasword" });
        }
        if(!user.isActive) {
          return done(null, false, { message: "Account is not activated." });
        }
        return done(null, user, { message: "Logged in." });
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID:
          "288488088369-kegvhvpfte9u1m72hjd342kanhcrpc8e.apps.googleusercontent.com",
        clientSecret: "ZFOu-h0A1OSQNHXGRbDt7kNn",
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
          email: profile.emails[0].value,
          givenName: profile.name.givenName,
          familyName: profile.name.familyName,
          displayName: profile.displayName,
          isActive: true
        };

        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
