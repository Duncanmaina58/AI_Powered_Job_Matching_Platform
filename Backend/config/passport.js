import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { OIDCStrategy as MicrosoftStrategy } from "passport-azure-ad";
import User from "../models/User.js";

/* =====================
   GOOGLE STRATEGY
===================== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        // 🔹 Find existing user
        let user = await User.findOne({ email });

        // 🔹 If user does not exist, create one
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: Math.random().toString(36).slice(-8), // random password
            role: "jobseeker", // default role for Google signup
          });
        }

        // ✅ Return user to Passport
        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
      }
    }
  )
);

/* =====================
   SERIALIZATION
===================== */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* =====================
   MICROSOFT STRATEGY (Optional)
===================== */
// Uncomment when ready
// passport.use(
//   new MicrosoftStrategy(
//     {
//       identityMetadata: `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`,
//       clientID: process.env.MICROSOFT_CLIENT_ID,
//       clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//       redirectUrl: process.env.MICROSOFT_CALLBACK_URL,
//       responseType: "code",
//       responseMode: "query",
//       scope: ["profile", "email", "openid"],
//     },
//     async (iss, sub, profile, accessToken, refreshToken, done) => {
//       try {
//         const email = profile._json.preferred_username;
//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName || email,
//             email,
//             password: "microsoft-auth",
//             role: "jobseeker",
//           });
//         }
//         return done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

export default passport;
