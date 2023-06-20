const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const badgeRoutes = require('./routes/badge.route');

const app = express();
app.use(express.static('.'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            secure: false,
        }
    })
);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {

    res.render('login.ejs', {isAuthenticated: req.session.isAuthenticated});
});

app.use('/auth', authRoutes);
app.use('/', badgeRoutes);

const port = 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
