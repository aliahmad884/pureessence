import { Model, DataTypes } from 'sequelize';
import sequelize from './dbConnection';
// const sequelize = require('./dbConnection.js')

export class Product extends Model { }
Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pName: {
        type: DataTypes.STRING
    },
    slug: {
        type: DataTypes.STRING
    },
    sDesc: {
        type: DataTypes.TEXT
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    pImages: {
        type: DataTypes.JSON
    },
    qty: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    },
    pageTitle: {
        type: DataTypes.TEXT
    },
    metaDesc: {
        type: DataTypes.TEXT
    },
    reviews: {
        type: DataTypes.JSON
    },
    category: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: false
});


export class Pages extends Model { }

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


export class Blogs extends Model { }
Blogs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bTitle: {
        type: DataTypes.STRING
    },
    bSlug: {
        type: DataTypes.STRING
    },
    bTitleImg: {
        type: DataTypes.STRING
    },
    bShortDesc: {
        type: DataTypes.TEXT
    },
    bAuthor: {
        type: DataTypes.STRING
    },
    bCategory: {
        type: DataTypes.STRING
    },
    blogHtml: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Blogs',
    tableName: 'blogs',
    timestamps: false
});

export class RegisterUser extends Model { }
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

export class Cart extends Model { }
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

export class Order extends Model { }
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

export class Invoice extends Model { }
Invoice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uniquUrl: {
        type: DataTypes.TEXT
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

export class NewsLetter extends Model { }
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

export class Versions extends Model { }
Versions.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING
    },
    version: {
        type: DataTypes.DECIMAL(13, 2)
    }
}, {
    sequelize,
    tableName: 'versions',
    modelName: 'Versions',
    timestamps: false
});



(async () => {
    try {
        await Product.sync({ force: true }); // Set to false to avoid dropping and re-creating tables
        console.log('Table synced successfully!');
    } catch (error) {
        console.error('Error syncing table:', error);
    }
})();

// module.exports = { Pages, Blogs, Product, RegisterUser, Cart, Order, Invoice, NewsLetter, Versions };