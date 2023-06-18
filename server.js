const express = require('express');
const {CosmosClient} = require('@azure/cosmos');
const bodyParser = require('body-parser');
const session = require('express-session');

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

const endpoint = 'https://vats9121.documents.azure.com:443/';
const key = 'ZQaFbra6rPUyfMwfIhHDJQbcFM4Q6qeWFSMXY0Vsj6BUq62olYVwqYrWpwRhBBKolDi98dGnwIorACDbSih8PA==';
const databaseId = 'Vats';
const containerId = 'VatsItems';

const cosmosClient = new CosmosClient({endpoint, key});

app.get('/', (req, res) => {
    if (req.session.username !== undefined) {
        res.render('index.ejs');
    } else {
        res.redirect('/login')
    }
});

app.get('/findBadge', (req, res) => {
    const number = req.query.numberOfBadge;
    if (number === undefined) {
        if (req.session.username !== undefined) {
            res.render('findBadge2.ejs', {item: false, token: true})
        } else {
            res.render('findBadge2.ejs', {item: false, token: false})
        }
    } else {
        if (req.session.username !== undefined) {
            findBadgeByNumber(number, function (element) {
                res.render('findBadge2.ejs', {item: element, token: true})
            });
        } else {
            findBadgeByNumber(number, function (element) {
                res.render('findBadge2.ejs', {item: element, token: false})
            });
        }
    }
});

app.post('/save', (req, res) => {
    const data = req.body;
    const number = data.number;
    const fullname = data.fullname;
    const course = data.course;
    const date = data.date;
    const end_date = data.end_date;
    saveInfoToDB(number, fullname, course, date, end_date);
});

app.get('/save', (req, res) => {
    res.redirect('/findBadge')
});

// РЕЄСТРАЦІЯ
app.get('/registration', (req, res) => {
    req.session.destroy();
    res.render('registration.ejs')
});

app.post('/registration', async (req, res) => {
    const {login, fullname, password} = req.body;
    await saveUserToDB(fullname, login, password);
    res.redirect('/login');
});

// АВТОРИЗАЦІЯ
app.get('/login', (req, res) => {
    req.session.destroy();
    const paramValue = req.query.loginError;
    if (paramValue !== undefined) {
        res.render('login.ejs', {item: true})
    } else {
        res.render('login.ejs', {item: false})
    }
});

app.post('/login', async (req, res) => {
    const {login, password} = req.body;
    await checkUser(login, password, function (element) {
        if (element) {
            req.session.username = element.username;
            res.redirect('/');
        } else {
            res.redirect('/login?loginError')
        }
    });
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
});

async function saveInfoToDB(number, fullname, course, date, end_date) {
    const container = cosmosClient.database(databaseId).container(containerId);
    const newItem = {
        number: number,
        course: course,
        fullname: fullname,
        first_date: date,
        last_date: end_date
    };

    const {resource: createdItem} = await container.items.create(newItem);
    console.log('Info has been saved to the database.');
}

async function findBadgeByNumber(number, callback) {
    const container = cosmosClient.database(databaseId).container(containerId);
    const querySpec = {
        query: 'SELECT * FROM badges WHERE badges.number = @number',
        parameters: [
            {
                name: '@number',
                value: number
            }
        ]
    };

    const {resources: results} = await container.items.query(querySpec).fetchAll();
    if (results.length > 0) {
        callback(results[0]);
    } else {
        callback(null);
    }
}

async function saveUserToDB(fullname, login, password) {
    const container = cosmosClient.database(databaseId).container('users');
    const newUser = {
        username: login,
        fullname: fullname,
        password: password
    };

    const {resource: createdItem} = await container.items.create(newUser);
    console.log('User has been saved to the database.');
}

async function checkUser(login, password, callback) {
    const container = cosmosClient.database(databaseId).container('users');
    const querySpec = {
        query: 'SELECT * FROM users WHERE users.username = @login AND users.password = @password',
        parameters: [
            {
                name: '@login',
                value: login
            },
            {
                name: '@password',
                value: password
            }
        ]
    };

    const {resources: results} = await container.items.query(querySpec).fetchAll();
    if (results.length > 0) {
        callback(results[0]);
    } else {
        callback(null);
    }
}
