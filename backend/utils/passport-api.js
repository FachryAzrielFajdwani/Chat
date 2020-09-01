const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const checkAuth = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/auth/masuk");
const checknotAuth = (req, res, next) =>
  req.isAuthenticated() ? res.redirect("/message") : next();

function init(passport, db) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "nama",
        passwordField: "pw",
      },
      async (nama, pw, done) => {
        const pengguna = await db.findOne({ nama });
        if (pengguna == null)
          return done(null, false, { message: "Nama anda tidak terdaftar" });
        try {
          return (await bcrypt.compare(pw, pengguna.password))
            ? done(null, pengguna)
            : done(null, false, { message: "Password/Nama salah" });
        } catch (e) {
          return done(e);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (_id, done) => {
    const user = await db.findOne({ _id });
    done(null, user);
  });
}

module.exports = { init, checkAuth, checknotAuth };
