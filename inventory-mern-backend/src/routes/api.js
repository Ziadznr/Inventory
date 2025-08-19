const express=require('express')
const AuthVerifyMiddleware=require('../middlewares/AuthVerifyMiddleware.js')
const UsersController=require('../controllers/Users/UsersController')
const ChairmansController=require('../controllers/Chairmans/ChairmansController.js')
const BrandsController=require('../controllers/Brands/BrandsController.js')
const CategoriesController=require('../controllers/Categories/CategoriesController.js')
const CustomersController=require('../controllers/Customers/CustomersController.js')    
const SuppliersController=require('../controllers/Suppliers/SuppliersController.js')
const ExpenseTypesController=require('../controllers/Expenses/ExpenseTypesController.js')
const ExpensesController=require('../controllers/Expenses/ExpensesController.js')
const ProductsController=require('../controllers/Products/ProductsController.js')
const PurchasesController=require('../controllers/Purchases/PurchasesController.js')
const SalesController=require('../controllers/Sales/SalesController.js')
const ReturnsController=require('../controllers/Returns/ReturnsController.js') 
const DepartmentController = require('../controllers/Departments/DepartmentController');


const router=express.Router();

// User Profile
router.post("/Registration",UsersController.Registration)
router.post("/Login",UsersController.Login)
router.post("/ProfileUpdate",AuthVerifyMiddleware,UsersController.ProfileUpdate)
router.get("/ProfileDetails",AuthVerifyMiddleware,UsersController.ProfileDetails)
router.get("/RecoverVerifyEmail/:email",UsersController.RecoverVerifyEmail)
router.get("/RecoverVerifyOTP/:email/:otp",UsersController.RecoverVerifyOTP)
router.post("/RecoverResetPass",UsersController.RecoverResetPass)

// Chairmans Profile
router.post("/ChairmanRegistration",ChairmansController.ChairmanRegistration)
router.post("/ChairmanLogin",ChairmansController.ChairmanLogin)
router.post("/ChairmanProfileUpdate",AuthVerifyMiddleware,ChairmansController.ChairmanProfileUpdate)
router.get("/ChairmanProfileDetails",AuthVerifyMiddleware,ChairmansController.ChairmanProfileDetails)
router.get("/ChairmanRecoverVerifyEmail/:email",ChairmansController.ChairmanRecoverVerifyEmail)
router.get("/ChairmanRecoverVerifyOTP/:email/:otp",ChairmansController.ChairmanRecoverVerifyOTP)
router.post("/ChairmanRecoverResetPass",ChairmansController.ChairmanRecoverResetPass)
router.get("/PublicDepartments", ChairmansController.PublicDepartments);


// Brands
router.post("/CreateBrand",AuthVerifyMiddleware,BrandsController.CreateBrand)
router.post("/UpdateBrand/:id",AuthVerifyMiddleware,BrandsController.UpdateBrand)
router.get("/BrandList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,BrandsController.BrandList)
router.get("/BrandDropDown",AuthVerifyMiddleware,BrandsController.BrandDropDown)
router.get("/DeleteBrand/:id",AuthVerifyMiddleware,BrandsController.DeleteBrand)
router.get("/BrandDetailsByID/:id",AuthVerifyMiddleware,BrandsController.BrandDetailsByID)

// Categories
router.post("/CreateCategories",AuthVerifyMiddleware,CategoriesController.CreateCategories)
router.post("/UpdateCategories/:id",AuthVerifyMiddleware,CategoriesController.UpdateCategories)
router.get("/CategoriesList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,CategoriesController.CategoriesList)
router.get("/CategoriesDropDown",AuthVerifyMiddleware,CategoriesController.CategoriesDropdown)
router.get("/DeleteCategories/:id",AuthVerifyMiddleware,CategoriesController.DeleteCategories)
router.get("/CategoriesDetailsByID/:id",AuthVerifyMiddleware,CategoriesController.CategoriesDetailsByID)

// Departments
router.post('/CreateDepartment', DepartmentController.CreateDepartment);
router.get('/DepartmentList/:pageNo/:perPage/:searchKeyword', DepartmentController.ListDepartments);
router.delete('/delete/:id', DepartmentController.DeleteDepartment);


// Customers
router.post("/CreateCustomers",AuthVerifyMiddleware,CustomersController.CreateCustomers)
router.post("/UpdateCustomers/:id",AuthVerifyMiddleware,CustomersController.UpdateCustomers)
router.get("/CustomersList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,CustomersController.CustomersList)
router.get("/CustomersDropdown",AuthVerifyMiddleware,CustomersController.CustomersDropdown)
router.get("/DeleteCustomer/:id",AuthVerifyMiddleware,CustomersController.DeleteCustomer)
router.get("/CustomerDetailsByID/:id",AuthVerifyMiddleware,CustomersController.CustomerDetailsByID)


// Suppliers
router.post("/CreateSuppliers",AuthVerifyMiddleware,SuppliersController.CreateSuppliers)
router.post("/UpdateSuppliers/:id",AuthVerifyMiddleware,SuppliersController.UpdateSuppliers)
router.get("/SuppliersList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,SuppliersController.SuppliersList)
router.get("/SuppliersDropdown",AuthVerifyMiddleware,SuppliersController.SuppliersDropdown)
router.get("/DeleteSupplier/:id",AuthVerifyMiddleware,SuppliersController.DeleteSupplier)
router.get("/SupplierDetailsByID/:id",AuthVerifyMiddleware,SuppliersController.SupplierDetailsByID)

// Expense Types
router.post("/CreateExpenseTypes",AuthVerifyMiddleware,ExpenseTypesController.CreateExpenseTypes)
router.post("/UpdateExpenseTypes/:id",AuthVerifyMiddleware,ExpenseTypesController.UpdateExpenseTypes)
router.get("/ExpenseTypesList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,ExpenseTypesController.ExpenseTypesList)
router.get("/ExpenseTypesDropdown",AuthVerifyMiddleware,ExpenseTypesController.ExpenseTypesDropdown)
router.get("/DeleteExpenseType/:id",AuthVerifyMiddleware,ExpenseTypesController.DeleteExpenseType) 
router.get("/ExpenseTypesDetailsByID/:id",AuthVerifyMiddleware,ExpenseTypesController.ExpenseTypesDetailsByID)   

// Expenses
router.post("/CreateExpense",AuthVerifyMiddleware,ExpensesController.CreateExpense)
router.post("/UpdateExpense/:id",AuthVerifyMiddleware,ExpensesController.UpdateExpense)
router.get("/ExpensesList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,ExpensesController.ExpensesList)
router.get("/DeleteExpenses/:id",AuthVerifyMiddleware,ExpensesController.DeleteExpenses)
router.post("/ExpenseByDate",AuthVerifyMiddleware,ExpensesController.ExpenseByDate)
router.get("/ExpensesSummery",AuthVerifyMiddleware,ExpensesController.ExpensesSummery)
router.get("/ExpensesDetailsByID/:id",AuthVerifyMiddleware,ExpensesController.ExpensesDetailsByID)

// Products
router.post("/CreateProduct",AuthVerifyMiddleware,ProductsController.CreateProduct)
router.post("/UpdateProduct/:id",AuthVerifyMiddleware,ProductsController.UpdateProduct)
router.get("/ProductsList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,ProductsController.ProductsList)
router.get("/DeleteProduct/:id",AuthVerifyMiddleware,ProductsController.DeleteProduct)
router.get("/ProductDetailsByID/:id",AuthVerifyMiddleware,ProductsController.ProductDetailsByID)
router.get("/ProductsDropDown",AuthVerifyMiddleware,ProductsController.ProductsDropDown);

// Purchases
router.post("/CreatePurchases",AuthVerifyMiddleware,PurchasesController.CreatePurchases)
router.get("/PurchasesList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,PurchasesController.PurchasesList)
router.get("/PurchasesDelete/:id",AuthVerifyMiddleware,PurchasesController.PurchasesDelete)
router.post("/PurchasesByDate",AuthVerifyMiddleware,PurchasesController.PurchasesByDate)
router.get("/PurchaseSummery",AuthVerifyMiddleware,PurchasesController.PurchaseSummery)

// Sales
router.post("/CreateSales",AuthVerifyMiddleware,SalesController.CreateSales)
router.get("/SalesList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,SalesController.SalesList)
router.get("/SalesDelete/:id",AuthVerifyMiddleware,SalesController.SalesDelete)
router.post("/SalesByDate",AuthVerifyMiddleware,SalesController.SalesByDate)
router.get("/SalesSummery",AuthVerifyMiddleware,SalesController.SaleSummery)

// Returns  
router.post("/CreateReturns",AuthVerifyMiddleware,ReturnsController.CreateReturns)
router.get("/ReturnsList/:pageNo/:perPage/:searchKeyword",AuthVerifyMiddleware,ReturnsController.ReturnsList)
router.get("/ReturnsDelete/:id",AuthVerifyMiddleware,ReturnsController.ReturnsDelete)
router.post("/ReturnByDate",AuthVerifyMiddleware,ReturnsController.ReturnByDate)
router.get("/ReturnSummery",AuthVerifyMiddleware,ReturnsController.ReturnSummery)

module.exports=router;
