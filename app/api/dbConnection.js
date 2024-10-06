import { Sequelize } from "sequelize";

const sequelize = new Sequelize('wecarhir_pureEssence', 'wecarhir_aliahmad884', 'ali3627516', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate()
    .then(() => console.log('Connection Established!'))
    .catch(err => console.error('Unable to connect to the database:', err))

module.exports = sequelize;