import { Sequelize } from "sequelize";
// const { Sequelize } = require('sequelize')
// import { Sequelize } from "@sequelize/core";
// import { MariaDbDialect } from "@sequelize/mariadb";

// const { Sequelize } = require("@sequelize/core");
// const { MariaDbDialect } = require('@sequelize/mariadb')

// const sequelize = new Sequelize({
//     dialect: 'mariadb',        // Using MariaDB as the dialect
//     database: 'puressence',    // Name of your database
//     username: 'root',          // Correct key is 'username' not 'user'
//     password: '00012368',      // Your password
//     host: 'localhost',         // Host where your DB is running
//     port: 3307,                // Port to connect to the MariaDB server
//     dialectOptions: {
//         allowPublicKeyRetrieval: true,  // Required for some MariaDB setups
//         // You can add other dialect options like 'ssl' here if needed
//     },
//     showWarnings: true,        // Show warnings in the console (optional)
//     connectTimeout: 1000,      // Timeout for the connection in ms
//     logging: console.log,      // Log SQL queries to the console for debugging (optional)
// });

const sequelize = new Sequelize('pureessence', 'root', 'ali3627516', {
    host: 'localhost',
    dialect: 'mysql'
})

// const sequelize = new Sequelize('purEssence_', 'AliAhmad', '8Tj7ul85$', {
//     host: 'localhost',
//     dialect: 'mysql'
// })

sequelize.authenticate()
    .then(() => console.log('Connection Established!'))
    .catch(err => console.error('Unable to connect to the database:', err))

// module.exports = sequelize;
export default sequelize;