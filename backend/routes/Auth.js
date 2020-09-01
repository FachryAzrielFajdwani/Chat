const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { init, checknotAuth } = require("../utils/passport-api");
const { Auth: db } = require("../data");
const { Captcha, checkCaptcha } = require("../utils/captcha");

init(passport, db);

router.get("/", (req, res) => res.redirect(req.baseUrl + "/masuk"));

router.get("/daftar", checknotAuth, (req, res) =>
  res.render("Auth/daftar", {
    baseUrl: req.baseUrl,
    respon: req.flash("respon"),
    captcha: new Captcha(2).generate()
  })
);

router.get("/masuk", checknotAuth, (req, res) =>
  res.render("Auth/masuk", {
    baseUrl: req.baseUrl,
    respon: req.flash("respon"),
    captcha: new Captcha(2).generate()
  })
);

router.post(
  "/masuk",
  checknotAuth,
  passport.authenticate("local", {
    successRedirect: "/message",
    failureRedirect: "/auth/masuk",
    failureFlash: true,
  })
);

router.post("/daftar", checknotAuth, checkCaptcha, async (req, res) => {
  try {
    const { nama, pw } = req.body;

    const isUserExist = async (nama) =>
      (await db.findOne({ nama })) ?? false;

    if (await isUserExist(nama)) {
      req.flash("respon", "Pengguna telah terdaftar!");
      return res.redirect(req.baseUrl + "/daftar");
    } else {
      const hash = bcrypt.genSaltSync(12);
      const password = bcrypt.hashSync(pw, hash);
      await db.insert({
        nama,
        password,
      });
      return res.redirect(req.baseUrl + "/masuk");
    }
  } catch {
    return res.redirect(req.baseUrl + "/daftar");
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy((e) => res.redirect("/"));
  req.logOut();
});

module.exports = router;
