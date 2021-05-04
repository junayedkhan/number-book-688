const express = require("express")
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const bcryptjs = require('bcryptjs');
const router = express.Router()
const private_key = "mailsender713"
const user_key = "appsite.com"

// model
const register_model = require("../models/register")
const data = require('./../models/data')

// nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mailsender713@gmail.com',
        pass: '(*mailsender/*+*+)'
    }
});

// auth
const is_authenticated = (req, res, next) => {
    if (req.session.isAuth) {
        return next()
    }
    res.redirect('/login')
}

const allready_authenticated = (req, res, next) => {
    if (req.session.isAuth) {
        return res.redirect('/')
    }
    next()
}


// home route handle
router.get('/', is_authenticated, async (req, res) => {
    const post_home = await data.find({}).lean()
    res.render('home', {
        post_home
    })
})

// login route handle
router.get('/login', allready_authenticated, (req, res) => {
    res.render('login')
})

// register route handle
router.get('/register', (req, res) => {
    res.render('register')
})


// register post request handle //
router.post('/register', async (req, res) => {

    const {
        name,
        email,
        password,
        confirm_password
    } = req.body;

    if (name == "") {
        req.flash("error", "plasse enter your name")
        return res.redirect("/register")
    }
    if (email == "") {
        req.flash("error", "plasse enter your email")
        return res.redirect("/register")
    }
    // const user = await register_model.findOne({email})
    // if(user){
    //     req.flash("error", "email Already Exist !")
    //     return res.redirect("/register")
    // }
    if (password == "") {
        req.flash("error", "plasse enter your password")
        return res.redirect("/register")
    }
    if (confirm_password == "") {
        req.flash("error", "plasse enter your confirm password")
        return res.redirect("/register")
    }
    if (password.length > 4) {
        req.flash("error", "password must be 4 character")
        return res.redirect("/register")
    }
    if (password !== confirm_password) {
        req.flash("error", "password not macth !")
        return res.redirect("/register")
    } else {

        var token = jwt.sign({
            name,
            email
        }, private_key, {
            expiresIn: "10m"
        })
        var client_url = 'http://' + req.headers.host

        const output = `
        <h2>Please click on below link to activate your account</h2>
        <p>${client_url}/activate/${token}</p>
        <p><b>NOTE: </b> The above activation link expires in 10 minutes.</p>
        `;

        var mailOptions = {
            from: 'mailsender713@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            generateTextFromHTML: true,
            html: output
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {

                console.log(error);
                req.flash("error", "Something went wrong on our end. Please register again.")
                return res.redirect("/register")

            } else {

                console.log('Email sent: ' + info.response);
                req.flash("error", "Activation link sent to email ID. Please activate to log in.")
                return res.redirect("/register")

            }
        });

    }


})


router.get('/activate/:token', async (req, res) => {

    const token = req.params.token
    jwt.verify(token, private_key, async (err, decoded) => {
        if (err) {
            req.flash(
                'error',
                'Incorrect or expired link! Please register again.'
            );
            res.redirect('/register');
        } else {
            const {
                name,
                email
            } = decoded

            const hash_password = await bcryptjs.hash(password, 10)

            const new_user = await new register_model({
                name,
                email,
                password: hash_password,
            }).save()

            if (new_user) {
                console.log(new_user);
                req.flash("error", "your now registered plasse login")
                res.redirect('/login')
            } else {
                req.flash("error", "Account activation error!")
                res.redirect('/register')
            }

        }
    })

})

router.post('/login', allready_authenticated, async (req, res) => {
    const {
        email,
        password
    } = req.body

    if (email == "") {
        req.flash("error", "plasse enter your email")
        return res.redirect("/login")
    }
    if (password == "") {
        req.flash("error", "plasse enter your password")
        return res.redirect("/login")
    }
    const user = await register_model.findOne({
        email
    })
    if (!user) {
        req.flash("error", "user not found !")
        res.redirect('/login')
    } else if (user && (await bcryptjs.compare(password, user.password))) {
        req.session.isAuth = true
        res.redirect('/')
    } else {
        req.flash("error", "password not macth !")
        res.redirect('/login')
    }

})

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/login')
})


// ================== crud operation ======================== //

router.get('/add', (req, res) => {
    res.render('add')
})

router.get('/edit/:id', async (req, res) => {
    const edit_post = await data.findOne({
        _id: req.params.id
    }).lean()
    res.render('edit', {
        edit_post
    })
})

router.post('/update', async (req, res) => {
    const {
        name,
        number,
        id
    } = req.body
    const update_data = await data.findById(id)
    if (update_data) {
        update_data.name = name
        update_data.number = number
        const save_data = await update_data.save()
        if (save_data) {
            res.redirect('/')
        } else {
            res.redirect('/edit')
        }
    }
})

router.get('/delete/:id', async (req, res) => {
    const deleted = await data.deleteOne({
        _id: req.params.id
    })
    if (deleted) {
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})

router.post('/add', async (req, res) => {
    const {
        name,
        number
    } = req.body
    const add_data = await data({
        name,
        number
    }).save()
    if (add_data) {
        res.redirect('/')
    } else {
        res.redirect('/add')
    }
})


module.exports = router