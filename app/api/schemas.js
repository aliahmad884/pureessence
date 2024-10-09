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

class Cart extends Model { }
Cart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING
    },
    imgUrl: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    qty: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: false
});

class Order extends Model { }
Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING
    },
    product: {
        type: DataTypes.JSON
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    orderDate: {
        type: DataTypes.DATE
    },
    paymentMethod: {
        type: DataTypes.STRING
    },
    shippingDetails: {
        type: DataTypes.JSON
    },
    orderType: {
        type: DataTypes.STRING
    },
    orderStatus: {
        type: DataTypes.JSON
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'order',
    timestamps: false
});

class Invoice extends Model { }
Invoice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uniquUrl:{
        type:DataTypes.TEXT
    },
    billing: {
        type: DataTypes.JSON
    },
    items: {
        type: DataTypes.JSON
    },
    date: {
        type: DataTypes.DATE
    },
}, {
    sequelize,
    tableName: 'invoice',
    modelName: 'Invoice',
    timestamps: false
});

class NewsLetter extends Model { }
NewsLetter.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING
    }
}, {

    sequelize,
    tableName: 'newsletter',
    modelName: 'NewsLetter',
    timestamps: false
});




(async () => {
    try {
        await Invoice.sync({ force: true }); // Set to false to avoid dropping and re-creating tables
        console.log('Table synced successfully!');
    } catch (error) {
        console.error('Error syncing table:', error);
    }
})();

module.exports = { Pages, Blogs, Product, RegisterUser, Cart, Order, Invoice, NewsLetter };