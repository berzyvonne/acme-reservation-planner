const {
    client,
    createTables,
    createUser,
    createPlace
} = require('./db')

const init = async () => {
    console.log('connecting to db');
    await client.connect()
    console.log('connected to db');
    console.log('creating tables');
    await createTables()
    console.log('created tables');

    await Promise.all([
        createUser("Tim"),
        createUser("Scotty"),
        createUser("Rod"),
        createPlace("Cape Coral"),
        createPlace("North Fort Myers"),
        createPlace("Sanibel"),
        createPlace("Captiva"),
    ])

    console.log('data seeded');
}

init()