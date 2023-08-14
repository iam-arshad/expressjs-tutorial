const bcrypt = require('bcrypt');

// A utility function to hash a password
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// A utility function to compare a plain password with a hashed password
async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

function setLoggedInUserAndCookie(req, res, user) {
    // Set a session variable to indicate the user is logged in
    req.session.loggedIn = true;
    req.session.userId = user.id;

    // Store a value in a cookie(insensitive data in cookies)
    res.cookie('username', user.username);
}

module.exports = {
    hashPassword,
    comparePassword,
    setLoggedInUserAndCookie
};
