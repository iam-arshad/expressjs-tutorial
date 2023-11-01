const User= require("../database/schemas/users");
const {comparePasswords} = require("../utils/authUtils")

async function localStrategyVerifyFunction(username, password, done) {
    try {
        // fetch user from db
        const user = await User.findOne({ username: username });

        // if user not found
        if (!user) {
            // throw new Error("user not found");
            return done(null, false, { message: 'user not found' });
        }

        // comparePassword
        const passwordMatched = await comparePasswords(password, user.password)
        // if password not matched
        if (!passwordMatched) {
            console.log(username,password,passwordMatched);
            return done(null, false, { message: 'Incorrect password.' });
        }

        // if everything is okay
        return done(null, user);
    } catch (error) {
        // console.error(error.message,error.stack);
        return done(error);
    }
}

module.exports = { localStrategyVerifyFunction: localStrategyVerifyFunction }