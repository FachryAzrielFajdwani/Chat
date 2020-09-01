const data = {
    num: "012345678",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz"
};

const salt = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let captcha = null;

class Captcha {
    constructor(len) {
        this.captcha = [];
        this.length = len;
    }

    generate() {
        for (let i = 0; i < this.length; i++)
            this.captcha.push(salt[Math.floor(Math.random() * salt.length)]);
        
        captcha = this.captcha.join("")
        return captcha;
    }
}

function checkCaptcha(req, res, next) {
    if (req.body.captcha === captcha)
        return next();

    req.flash("respon", "Captcha salah");
    return res.redirect(req.originalUrl);
}

module.exports = { Captcha, checkCaptcha };




