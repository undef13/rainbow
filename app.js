const express = require(`express`);
const app = express();
const http = require(`http`);

const mongoose = require(`mongoose`);
const session = require(`express-session`);
const MongoConnect = require(`connect-mongo`)(session);
const passport = require(`passport`);
const flash = require(`connect-flash`);

const server = http.createServer(app);
const io = require(`socket.io`)(server);
require("./config/sockets")(io);

// Passport Config
require(`./config/passport`)(passport);

// View Engine
app.set("view engine", "ejs");

// Express Static
app.use(express.static("public"));

// Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Static files
app.use(express.static("public"));

// Express Sessions
const sessions = session({
  secret: "My Lovely Bird",
  resave: false,
  saveUninitialized: false,
  store: new MongoConnect({
    mongooseConnection: mongoose.connection,
  }),
});

// Session in sockets
io.use((socket, next) => {
  sessions(socket.request, socket.request.res, next);
});

app.use(sessions);

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());

// Express flashes
app.use(flash());

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
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log(`MongoDB is connected.`);
  }
);

// PORT
const PORT = process.env.PORT || 3000;

// Server Startup
server.listen(PORT, () => {
  console.log(`Server is up and running on the port ${PORT}.`);
});
