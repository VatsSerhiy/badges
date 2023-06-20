const {CosmosClient} = require("@azure/cosmos");
const {DB_ENDPOINT, DB_KEY, DB_ID} = require('../config');

const cosmosClient = new CosmosClient({endpoint: DB_ENDPOINT, key: DB_KEY});

exports.saveUserToDB = async (fullname, login, password) => {
    const container = cosmosClient.database(DB_ID).container('users');
    const newUser = {
        username: login,
        fullname: fullname,
        password: password
    };

    const {resource: createdItem} = await container.items.create(newUser);
    console.log('User has been saved to the database.');
}

exports.checkUser = async (login, password, callback) => {
    const container = cosmosClient.database(DB_ID).container('users');

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