import { Sequelize } from "sequelize";

const sequelize = new Sequelize('pureessence', 'root', 'ali3627516', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate()
    .then(() => console.log('Connection Established!'))
    .catch(err => console.error('Unable to connect to the database:', err))

export default sequelize;