import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Generate salt for hashing passwords
const salt = bcrypt.genSaltSync(10);

//Authenticates the user by comparing the provided username and password with the users' data.
function authenticateUser(username, password) {
    return userData.some(user => user.username === username && bcrypt.compareSync(password, user.password));
}

//Creates a JWT token for the given username.
function createToken(username) {
    return jwt.sign({ username }, process.env.SECRET, { expiresIn: '1h' });
}


//Encrypts the provided password using bcrypt.
function encryptPassword(password) {
    return bcrypt.hashSync(password, salt);
}

export { authenticateUser, createToken, encryptPassword };
