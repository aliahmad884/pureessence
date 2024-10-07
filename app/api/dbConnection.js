import { Sequelize } from "sequelize";

const sequelize = new Sequelize('pureessence', 'root', 'ali3627516', {
    host: 'localhost',
    dialect: 'mysql'
})

// const sequelize = new Sequelize('purEssence_', 'AliAhmad', '8Tj7ul85$', {
//     host: 'localhost',
//     dialect:'mysql'
// })

sequelize.authenticate()
    .then(() => console.log('Connection Established!'))
    .catch(err => console.error('Unable to connect to the database:', err))

module.exports = sequelize;