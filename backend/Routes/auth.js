const express = require('express')
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

var fetchuser = require('../Middleware/fetchuser')

var jwt = require('jsonwebtoken');
const JWT_SECRET = 'tusharisabadb$oy';




//  Create a User using: "/api/auth/createuser". No login required

router.post('/createuser',
    [
        body('name', 'Enter a valid Name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'please type minimum 5 characters or string password').isLength({ min: 5 }),


    ],

    async (req, res) => {
        let success = false;
        const errors = validationResult(req);  // Get validation errors

        // If validation fails, send errors and stop further execution
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });  // Return errors and exit the function
        }

        // check whether the user with this email exist already

        try {



            let user = await User.findOne({ email: req.body.email })
            // console.log(user)
            if (user) {
                return res.status(400).json({ success, error: "Sorry a user with email is already exist" })

            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
            })
            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true;
            res.json({ success, authtoken })
            // console.log(jwtData)

            //         res.json(user)
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some error occcured")
        }

    })


// authenticate a user using: post "/api/auth/login".No login required
router.post('/login',
    [

        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot blank').exists(),
    ],


    async (req, res) => {
        let success = false;
        const errors = validationResult(req);  // Get validation errors

        // If validation fails, send errors and stop further execution
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });  // Return errors and exit the function
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                success = false;
                return res.status(400).json({ errors: "please try login with correct credentials" });

            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: "please try to login with corrrect credentials" });

            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true;
            res.json({ success, authtoken })
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error")
        }
    })

// Route 3 Get logged in user Details using : POST "/api/auth/getuser" .login required

router.post('/getuser', fetchuser,


    async (req, res) => {

        try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)


        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error")
        }
    })






module.exports = router;