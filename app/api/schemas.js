import { Model, DataTypes } from 'sequelize';
const sequelize = require('./dbConnection.js')

class Product extends Model { }
Product.init({
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TitleName: {
        type: DataTypes.STRING
    },
    ShortDesc: {
        type: DataTypes.STRING
    },
    Brief: {
        type: DataTypes.TEXT
    },
    TitleImg: {
        type: DataTypes.STRING
    },
    ProductImages: {
        type: DataTypes.JSON
    },
    Stock: {
        type: DataTypes.INTEGER
    },
    Ingredients: {
        type: DataTypes.JSON
    },
    SuggestUse: {
        type: DataTypes.TEXT
    },
    NutFact: {
        type: DataTypes.TEXT
    },
    Advise: {
        type: DataTypes.TEXT
    },
    Information: {
        type: DataTypes.TEXT
    },
    Reviews: {
        type: DataTypes.JSON
    },
    Category: {
        type: DataTypes.STRING
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2)
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: false
});


class Pages extends Model { }

Pages.init({
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CategoryName: {
        type: DataTypes.STRING
    },
    BannerImg: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'Pages',
    tableName: 'pages',
    timestamps: false
})


class Blogs extends Model { }
Blogs.init({
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Title: {
        type: DataTypes.STRING
    },
    TitleImg: {
        type: DataTypes.STRING
    },
    Comments: {
        type: DataTypes.JSON
    },
    BlogContent: {
        type: DataTypes.TEXT
    },
    Date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Blogs',
    tableName: 'blogs',
    timestamps: false
});

class RegisterUser extends Model { }
RegisterUser.init({
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    FirstName: {
        type: DataTypes.STRING
    },
    LastName: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
    Password: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'RegisterUser',
    tableName: 'registerUser',
    timestamps: false
});




// (async () => {
//     try {
//         await sequelize.sync({ force: false }); // Set to false to avoid dropping and re-creating tables
//         console.log('Table synced successfully!');
//     } catch (error) {
//         console.error('Error syncing table:', error);
//     }
// })();

module.exports = { Pages, Blogs, Product, RegisterUser }