const express = require('express');
const router = express.Router();
const data = require('../data');
const signupData = data.signup;
const xss = require('xss');
const moment = require('moment');

const ErrorCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
router.get('/', async (req, res) => {
    res.render('pages/signup');
});
router.post('/signup', async (req, res) => {
    const firstname = xss(req.body.firstname.trim());
    const lastname = xss(req.body.lastname.trim());
    const email = xss(req.body.email.trim());
    let dob = xss(req.body.dateOfBirth.trim());
    const city = xss(req.body.city.trim());
    const state = xss(req.body.state.trim());
    const username = xss(req.body.username.trim());
    const password = xss(req.body.password.trim());

    dob = moment(dob).format('MM/DD/YYYY');
    console.log(dob);
    try {
        const createUser = await signupData.createUser(
            firstname,
            lastname,
            email,
            dob,
            city,
            state,
            username,
            password
        );
        res.redirect('/login');
    } catch (error) {
        res.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).render(
            'pages/signup',
            {
                title: 'Signup',
                hasErrors: true,
                error: error.message || 'Internal Server Error',
            }
        );
    }
});
module.exports = router;
