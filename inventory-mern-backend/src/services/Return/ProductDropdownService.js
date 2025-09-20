const SalesModel = require("../../models/Sales/SalesModel");
const SalesProductsModel = require("../../models/Sales/SalesProductsModel");
const CustomersProductEntryModel = require("../../models/Customers/CustomersProductEntryModel");
const ProductsModel = require("../../models/Products/ProductsModel"); // 🔹 your products collection

/**
 * Get products for dropdown based on customer and slip
 * @param {String} customerId - MongoDB ObjectId of customer
 * @param {String} slipNo - SlipNo (Sales) or PayslipNumber (CustomerProductEntry)
 * @returns {Array} - List of products with _id, ProductName, Qty, UnitPrice, Total
 */
const ProductDropdownService = async (customerId, slipNo) => {
  try {
    console.log("📌 ProductDropdownService called with:", { customerId, slipNo });

    if (!customerId || !slipNo) return [];

    let products = [];

    // ----------------- Check Sales -----------------
    const sale = await SalesModel.findOne({ CustomerID: customerId, SlipNo: slipNo }).lean();
    if (sale) {
      console.log("📌 Sale found:", sale);

      const saleProducts = await SalesProductsModel.find({ SaleID: sale._id }).lean();
      console.log("📌 Products from SalesProductsModel:", saleProducts);

      products = await Promise.all(saleProducts.map(async (p) => {
        let productName = p.ProductName;

        // If ProductName is empty, fetch from ProductsModel using ProductID
        if (!productName && p.ProductID) {
          const prod = await ProductsModel.findById(p.ProductID).lean();
          productName = prod?.Name || "Unknown Product";
        }

        return {
          _id: p._id,
          ProductName: productName || "Unknown Product",
          Qty: p.Qty,
          UnitPrice: p.UnitCost,
          Total: p.Total
        };
      }));

      if (products.length > 0) {
        console.log("📌 Products fetched from Sales:", products);
        return products;
      } else {
        console.warn("⚠️ Sale exists but no products found");
      }
    } else {
      console.info("ℹ️ No sale found with this slip");
    }

    // ----------------- Check Customer Product Entry -----------------
    const entry = await CustomersProductEntryModel.findOne({ CustomerID: customerId, PayslipNumber: slipNo }).lean();
    console.log("📌 Customer Product Entry found:", entry);

    if (entry && entry.Products && entry.Products.length > 0) {
      products = entry.Products.map(p => ({
        _id: p._id,
        ProductName: p.ProductName,
        Qty: p.Qty,
        UnitPrice: p.UnitPrice,
        Total: p.Total
      }));

      console.log("📌 Products fetched from CustomerProductEntry:", products);
      return products;
    } else {
      console.info("ℹ️ No customer product entry found with this slip");
    }

    console.log("📌 Returning empty array, no products found");
    return [];
  } catch (error) {
    console.error("ProductDropdownService Error:", error);
    return [];
  }
};

module.exports = ProductDropdownService;
