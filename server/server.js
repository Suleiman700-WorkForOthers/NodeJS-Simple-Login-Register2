const express = require('express');
const cors = require('cors')
const { check, validationResult} = require("express-validator")
const bcrypt = require('bcrypt');
const mongoose = require('./database')
const jwt = require("jsonwebtoken");
const jwtSecret = "mysecretkey";

// schemas and models
const { loginSchema } = require("./schemas")
const LoginModel = mongoose.model('User', loginSchema, 'users');

const app = express();
app.use(cors());
app.use(express.json());


app.get("/",(request, response) => {
    response.send("hello from server")
});

app.post("/auth/register",[
        check('fullname', 'Fullname is invalid').isLength({ min: 1 }),
        check('email', 'Email is invalid').isEmail(),
        check('password', 'Password is invalid').isLength( { min: 1 }),
    ],
    async (request, response) => {
    const fullname = request.body.fullname
    const email = request.body.email
    const password = request.body.password

    const errors = validationResult(request);

    // response have no errors
    if (errors.isEmpty()) {

        // check if email is already in use
        LoginModel.findOne({email}, (error, result) => {
            // email already in use
            if (result != null) {
                return response.status(409).json({errors: [{'msg': 'This email address is already in use'}]});
            }
            else {
                // hash user password
                bcrypt.hash(password, 10, (error, hash) => {
                    if (!error) {
                        // Store the hash in your database
                        const hashedPassword = hash

                        // create user
                        LoginModel.create({ fullname, email, password: hashedPassword }, (error, result) => {
                            // user created
                            if (result != null) {
                                return response.status(200).json({errors: []});
                            }
                            else {
                                return response.status(500).json({errors: [{'msg': 'An error occurred while creating account'}]});
                            }
                        })

                    }
                    else {
                        console.error(error);
                    }
                });
            }
        })
    }
    // response have errors
    else {
        return response.status(400).json({errors: errors.array()});
    }
}
);

app.post("/auth/login",[
        check('email', 'Email is invalid').isEmail(),
        check('password', 'Password is invalid').isLength( { min: 1 }),
    ],
    async (request, response) => {
        const errors = []

        const email = request.body.email
        const password = request.body.password

        const requestErrors = validationResult(request);

        // response have no errors
        if (requestErrors.isEmpty()) {

            // create the model
            const LoginModel = mongoose.model('User', loginSchema, 'users');

            LoginModel.findOne({email}, (error, userData) => {
                if (error) {
                    console.error(error);
                    return response.status(400).json({errors: error});
                }
                else {
                    // user found with that email
                    if (userData !== null) {
                        // try to verify user password
                        const hashedPassword = userData['password']
                        bcrypt.compare(password, hashedPassword, (error, compareResult) => {
                            // invalid password
                            if (!compareResult) {
                                // store error
                                const error = {msg: 'Incorrect username or password'}
                                return response.status(401).json({errors: [error]});
                            }
                            // valid password
                            else {
                                const payload = {
                                    id: userData['_id'],
                                    email: userData['email'],
                                };
                                const options = { expiresIn: '2d' };
                                const token = jwt.sign(payload, jwtSecret, options);
                                return response.status(200).json({errors: [], token});
                            }
                        });
                    }
                    else {
                        // store error
                        const error = {msg: 'Incorrect username or password'}
                        return response.status(401).json({errors: [error]});
                    }
                }
            });
        }
        // response have errors
        else {
            return response.status(400).json({errors: requestErrors.array()});
        }
    });

app.post("/auth/is-logged", (request, response) => {
    const res = {
        'state': false,
        'userData': {}
    }

    // extract the token from the request header
    const token = request.headers['authorization'].split(' ')[1]

    // verify the token
    jwt.verify(token, jwtSecret, (error, decoded) => {
        if (!error) {
            // update flag
            res['state'] = true

            // If the token is valid, the decoded payload will contain the original encrypted payload
            const decodedEmail = decoded['email']

            // get user data
            const LoginModel = mongoose.model('User', loginSchema, 'users');

            LoginModel.findOne({email: decodedEmail}, (error, userData) => {
                // user data found
                if (userData != null) {
                    res['userData'] = userData
                    return response.status(200).json(res);
                }
                else {
                    res['state'] = false
                    return response.status(500).json(res);
                }
            })
        }
        else {
            return response.status(401).json(res);
        }
    });
})

app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
})