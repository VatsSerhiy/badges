const {CosmosClient} = require("@azure/cosmos");
const {DB_ENDPOINT, DB_KEY, DB_ID,DB_CONTAINER} = require('../config');

const cosmosClient = new CosmosClient({endpoint: DB_ENDPOINT, key: DB_KEY});

exports.findBadgeByNumber = async (number, callback) => {
    const container = cosmosClient.database(DB_ID).container(DB_CONTAINER);

    const querySpec = {
        query: 'SELECT * FROM badges WHERE badges.id = @number',
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

exports.saveInfoToDB =  async (id, img) => {
    const container = cosmosClient.database(DB_ID).container(DB_CONTAINER);
    const newItem = {
        id,
        img
    };

    const {resource: createdItem} = await container.items.create(newItem);
    return createdItem;
}