import express from "express";
import { models } from "../../database/index.js";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from 'dotenv';
import speakeasy from "speakeasy";
import nodemailer from "nodemailer"

const router = express.Router();
router.use(bodyParser.json());


router.use(session({
    secret: "TESTINGSESSION",
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
        user: "pixelpadproject@gmail.com",
        pass: "birs wmox yfpz bgqi",
    },
    debug: true,  
    logger: true  
});

function sendOTPEmail(email, otp) {
    console.log("logging Email in sentOTPEmail: ", email);
    
    const mailOptions = {
        from: 'pixelpadproject@gmail.com',
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

router.get("/user", async (req, res) => {
    try {
        const user = await models.Users.findByPk();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Error receiving user" })
    }
})

passport.use(new GoogleStrategy({
    clientID: "582912135616-72h3153u90772d93clrjk7gqtdu7r3m4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async (request, accessToken, refreshToken, profile, done) => {
        try{
            const email = profile_json.email;
            const firstname = profile_json.given_name || "unknown";
            const lastname = profile_json.family_name || "unknown";
            let user = await models.Users.findOne({where: {email}})
            if (!user){
                user = await models.Users.create({email, firstname, lastname})
            } else{
                await user.update({firstname, lastname});
            }
            const otp = speakeasy.totp({
                secret: "OTPSESSION",
                encoding: 'base32',
                digit: 4,
            });
            cb(null,{user, otp});
        } catch (error){
            console.log("Error handling google login", error);
            cb(error, null);
            
        }
    }  
));

router.get("/auth/google", passport.authenticate("google", {
    scope: ["email", "profile"],
}));

router.get("/auth/google/callback", passport.authenticate("google",{
    failureRedirect: "/login",
}),(req, res)=>{
    if (req.user) {
        req.session.userID = req.user.user.id;
        req.session.otp = req.user.otp; 
        console.log("EMAIL ENTERED: ", req.user.user.email);
        
        sendOTPEmail(req.user.user.email, req.user.otp);
        res.redirect('http://localhost:3000/verify-otp');
    } else {
        res.redirect('/login');
    }
})

export default router;