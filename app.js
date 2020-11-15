const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const MongoConnect = require(`connect-mongo`)(session);
const passport = require(`passport`);
const colors = require(`colors`);

// Passport Config
require(`./config/passport`)(passport);

const app = express();

// View Engine
app.set('view engine', 'pug');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static("public"));

// Express Sessions
app.use(
  session({
    secret: "My Lovely Bird",
    resave: false,
    saveUninitialized: false,
    store: new MongoConnect({
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(`/`, require(`./routes/main`));
app.use(`/auth`, require(`./routes/auth`));

// MongoDB
mongoose.connect(
  "mongodb://127.0.0.1:27017/auth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`MongoDB is connected.`.cyan);
  }
);

// Server Startup
app.listen(3000, () => {
  console.log(`Server is up and running.`.cyan);
});
