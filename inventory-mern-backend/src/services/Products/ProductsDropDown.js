const ProductsModel = require('../../models/Products/ProductsModel');
const PurchasesProductsModel = require('../../models/Purchases/PurchasesProductsModel');
const SalesProductsModel = require('../../models/Sales/SalesProductsModel');

async function ProductsDropDown(userEmail) {
  if (!userEmail) throw new Error("Email is required");

  const products = await ProductsModel.find({ UserEmail: userEmail }, { _id: 1, Name: 1 }).lean();

  const purchased = await PurchasesProductsModel.aggregate([
    { $match: { UserEmail: userEmail } },
    { $group: { _id: "$ProductID", totalPurchased: { $sum: "$Qty" } } }
  ]);

  const sold = await SalesProductsModel.aggregate([
    { $match: { UserEmail: userEmail } },
    { $group: { _id: "$ProductID", totalSold: { $sum: "$Qty" } } }
  ]);

  const purchasedMap = purchased.reduce((acc, p) => { acc[p._id.toString()] = p.totalPurchased; return acc; }, {});
  const soldMap = sold.reduce((acc, s) => { acc[s._id.toString()] = s.totalSold; return acc; }, {});

  return products.map(p => ({
    _id: p._id,
    Name: p.Name,
    Stock: (purchasedMap[p._id.toString()] || 0) - (soldMap[p._id.toString()] || 0)
  }));
}

module.exports = ProductsDropDown;
