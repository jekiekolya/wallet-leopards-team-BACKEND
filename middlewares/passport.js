const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const { Conflict } = require('http-errors');

const { User } = require('../models');
const { categoriesList } = require('../src');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

const defaultAvatarURL =
  'https://res.cloudinary.com/dpvkleqce/image/upload/v1674652226/wallet_leopards/zn7ur1gmwynrbmnqgzkj.png';

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { emails, name, photos } = profile;

    const email = emails[0].value;
    const userPhoto = photos[0].value;
    const userName = name.givenName;

    const avatarURL = !userPhoto ? defaultAvatarURL : userPhoto;
    const categories = [...categoriesList];

    if (!email || !userName) {
      throw new Conflict(
        "Content of request conflicted with server's parameters"
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }

    const hashPassword = await bcrypt.hash(uniqid(), 10);

    const newUser = await User.create({
      firstName: userName,
      email,
      password: hashPassword,
      avatarURL,
      categories,
      verify: true,
      verificationToken: 'null',
    });

    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

passport.serializeUser(async function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  const findUser = await User.findById(user.id);

  done(null, findUser);
});

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use('google', googleStrategy);

module.exports = passport;
