var jwt = require('jsonwebtoken');
const JWT_SECRET = 'tusharisabadb$oy';
const fetchuser = (req, res, next) => {
    // Get the user from jwt token
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errro: "please authenticate using a valid token" })

    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next()

    } catch (error) {
        res.status(401).send({ errro: "please authenticate using a valid token" })

    }

}
 
module.exports = fetchuser;