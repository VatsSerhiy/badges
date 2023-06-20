const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/auth.route');
const badgeRoutes = require('./routes/badge.route');

const app = express();
app.use(express.static('.'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'bages', // Замініть на ваше секретне значення
    resave: false,
    saveUninitialized: true,
    rolling: true,
}));

app.get('/', (req, res) => {
    if (req.session.username !== undefined) {
        res.render('index.ejs');
    } else {
        res.redirect('/login');
    }
});

app.use("/", authRoutes);
app.use("/", badgeRoutes);

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
