const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const MongoConnect = require(`connect-mongo`)(session);
const passport = require(`passport`);
const flash = require(`connect-flash`);

// const http = require(`http`);


// Passport Config
require(`./config/passport`)(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// View Engine
app.set('view engine', 'ejs');

// Express Static
app.use(express.static('public'));

// Body Parser
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

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
app.use(`/auth`, require(`./routes/auth`));
app.use(`/settings`, require(`./routes/settings`));	
app.use(`/`, require(`./routes/main`));


// MongoDB
mongoose.connect(
  "mongodb+srv://root:root@cluster.dhkmq.mongodb.net/rainbow?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => {
    console.log(`MongoDB is connected.`);
  }
);

// Server Startup
const server = app.listen(PORT, () => {
  console.log(`Server is up and running on the port ${PORT}.`);
});
// http.createServer(app).listen(3000);

// const io = require(`socket.io`)(http);

// io.on('connection', socket => {
//   console.log('connect');
// });
