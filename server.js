const http = require("http");
const express = require("express");
const helmet = require("helmet");
const socket = require("socket.io");
const passport = require("passport");
const flash = require("express-flash");
const createError = require("http-errors");
const methodOverride = require("method-override");
const { resolve } = require("path");
const noCache = require("nocache");
const session = require("express-session");
const cookie = require("cookie-parser");

const env = require("dotenv").config(resolve("./.env")).parsed;
const port = env.port ?? 5000;
const secret = env.kunci;
const app = express();

const { checkAuth } = require("./backend/utils/passport-api");
const { SessionData } = require("./backend/data");
const { Auth, Message } = require(resolve("./backend/routes"));

app.set("view engine", "ejs");
app.set("views", resolve("./frontend/views"));

const sess = {
  secret,
  name: "Session ID",
  cookie: { httpOnly: true },
  resave: false,
  saveUninitialized: false,
  store: SessionData(session),
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

app.use("/", express.static("./frontend/static"));

app.use(helmet());
app.use(noCache());
app.use(helmet.referrerPolicy({ policy: ["no-referrer", "same-origin"] }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie(secret));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_m"));

app.get("/", (req, res) => res.render("index"));
app.use("/auth", Auth);
app.use("/message", checkAuth, Message);

const server = http.createServer(app);
const io = socket(server);

app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.err = err;
  res.status(err.status);
  res.render("error");
});

server.listen(port, (_) => console.log(`Listening on port ${port}`));
