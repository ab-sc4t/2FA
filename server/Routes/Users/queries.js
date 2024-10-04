import express from "express";
import { models } from "../../database/index.js";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from 'dotenv';
import speakeasy from "speakeasy";
import nodemailer from "nodemailer"

dotenv.config({ path: "../../.env" });

const router = express.Router();
router.use(bodyParser.json());


router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));

router.use(passport.initialize());
router.use(passport.session());

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.OTP_EMAIL,
        pass: process.env.OTP_EMAIL_PASS,
    },
    debug: true,
    logger: true
});

function sendOTPEmail(email, otp) {
    console.log("logging Email in sentOTPEmail: ", email);

    const mailOptions = {
        from: process.env.OTP_EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.get("/", async (req, res) => {
    try {
        const allUsers = await models.Users.findAll();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/user', async (req, res) => {
    if (req.session.userID) {
        try {
            const user = await models.Users.findByPk(req.session.userID);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving user' });
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

router.get('/check-session', (req, res) => {
    if (req.session.userID) {
        console.log("Logged In");
        res.status(200).json({ loggedIn: true, message: "LOGGED IN" });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

router.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session Contents:', req.session);
    next();
});

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});

router.post('/verify-otp', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }

    const { otp } = req.body;
    const verified = speakeasy.totp.verify({
        secret: process.env.OTP_SECRET,
        encoding: 'base32',
        token: otp
    });

    console.log(req.session.otp);
    console.log(otp);

    if (req.session.otp === otp) {
        console.log("OTP IS CORRECT");
        res.json({ redirect: '/' });
    } else {
        res.status(401).send('Invalid OTP. Please try again.');
    }
});

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: process.env.GOOGLE_USERPROFILE_URL,
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const email = profile._json.email;
        const firstname = profile._json.given_name || 'Unknown';
        const lastname = profile._json.family_name || 'Unknown';

        let user = await models.Users.findOne({ where: { email } });

        if (!user) {
            user = await models.Users.create({
                email,
                firstname,
                lastname,
            });
        } else {
            await user.update({ firstname, lastname });
        }
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: 'base32'
        });
        cb(null, { user, otp });
    } catch (error) {
        console.error("Error handling Google login", error);
        cb(error, null);
    }
}));

router.get("/auth/google", passport.authenticate("google", {
    scope: ["email", "profile"],
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    if (req.user) {
        req.session.userID = req.user.user.id;
        req.session.otp = req.user.otp;
        console.log("EMAIL ENTERED: ", req.user.user.email);
        sendOTPEmail(req.user.user.email, req.user.otp);
        res.redirect('http://localhost:3000/verify-otp');
    } else {
        res.redirect('/login');
    }
});

passport.serializeUser((user, done) => {
    console.log('Serializing user ID:', user.user.id);
    done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await models.Users.findByPk(id);
        console.log('Deserialized user:', user);
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});

export default router;