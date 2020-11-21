const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const MongoConnect = require(`connect-mongo`)(session);
const passport = require(`passport`);
const colors = require(`colors`);
const flash = require(`connect-flash`);

// Passport Config
require(`./config/passport`)(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// View Engine
app.set('view engine', 'ejs');

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

// Express flashes
app.use(flash())

// Routes
app.use(`/`, require(`./routes/main`));
app.use(`/auth`, require(`./routes/auth`));

// MongoDB
mongoose.connect(
  "mongodb+srv://root:root@cluster.dhkmq.mongodb.net/rainbow?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`MongoDB is connected.`.cyan);
  }
);

// Server Startup
app.listen(PORT, () => {
  console.log(`Server is up and running on the port ${PORT}.`.cyan);
});
