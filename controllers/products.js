require("express-async-errors");
const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    company: "liddy",
  })
    .sort({
      name: 1,
      price: -1,
    })
    .select("name company")
    .skip(1)
    .limit(2);
  res.status(200).json({
    products,
  });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObj = {};
  featured && (queryObj.featured = featured === "true" ? true : false);
  company && (queryObj.company = company);
  name &&
    (queryObj.name = {
      $regex: name,
      $options: "i",
    });
  // Numeric filters section
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|<=|>=|=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      // console.log(first)
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
      console.log("queryObj is:", queryObj);
    });
  }
  let result = Product.find(queryObj);
  // Sort
  if (sort) {
    const sortField = sort.split(",").join(" ");
    result = result.sort(sortField);
  } else {
    result = result.sort("createdAt");
  }
  // Fields
  if (fields) {
    const newFields = fields.split(",").join(" ");
    result = result.select(newFields); // select lets only some properites of the object to be shown
  }
  //  Pagination
  const page = Number(req.query) || 1; // if user don't pass a page number, load page number 1
  const limit = Number(req.query) || 10; // if user don't set limit, default limit for a page is 10
  const skip = (page - 1) * limit; // skip the items to load items for the page number entered

  result = result.limit(limit).skip(skip);

  const products = await result;
  res.status(200).json({
    products,
    nBhits: products.length,
  });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
