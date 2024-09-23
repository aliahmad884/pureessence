import { Model, DataTypes } from "sequelize";
import sequelize from "./dbConnection.js";
class Product extends Model {
    constructor(
        id = null,
        titleName = null,
        shortDesc = null,
        breif = null,
        titleImg = null,
        productImages = null,
        stock = null,
        ingredients = null,
        suggestUse = null,
        nutFact = null,
        advis = null,
        info = null,
        reviews = null,
        category = null,
        price = null) {
        super();
        this.Id = id;
        this.TitleName = titleName;
        this.ShortDesc = shortDesc;
        this.Breif = breif;
        this.TitleImg = titleImg;
        this.ProductImages = productImages;
        this.Stock = stock;
        this.Ingredients = ingredients;
        this.SuggestUse = suggestUse;
        this.NutFact = nutFact;
        this.Advise = advis;
        this.Information = info;
        this.Reviews = reviews;
        this.Category = category;
        this.Price = price;
    }

}

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
    Breif: {
        type: DataTypes.TEXT
    },
    TitleImg: {
        type: DataTypes.TEXT
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

export default Product;

class Category extends Model {
    constructor(id = null, categoryName = null, products = null) {
        super();
        this.Id = id;
        this.CategoryName = categoryName;
        this.Products = products;
    }
}

Category.init({
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CategoryName: {
        type: DataTypes.STRING
    },
    Products: {
        type: DataTypes.JSON
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: false
})


class Blogs extends Model {
    constructor(id = null, title = null, titleImg = null, comments = null, blogContent = null, date = null) {
        super();
        this.Id = id;
        this.Title = title;
        this.TitleImg = titleImg;
        this.Comments = comments;
        this.BlogContent = blogContent;
        this.Date = date;
    }
}
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

// (async () => {
//     try {
//         await sequelize.sync({ force: false }); // Set to false to avoid dropping and re-creating tables
//         console.log('Table synced successfully!');
//     } catch (error) {
//         console.error('Error syncing table:', error);
//     }
// })();

export { Category, Blogs }