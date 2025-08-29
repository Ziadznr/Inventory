const ParentModel = require('../../models/Purchases/PurchasesModel');
const ChildsModel = require('../../models/Purchases/PurchasesProductsModel');
const ProductsModel = require('../../models/Products/ProductsModel');

const CreateParentChildsService = require('../../services/common/CreateParentChildsService');
const ListOneJoinService = require('../../services/common/ListOneJoinService');
const DeleteParentChildsService = require('../../services/common/DeleteParentChildsService');
const PurchasesReportService = require('../../services/report/PurchaseReportService');
const PurchaseSummeryService = require('../../services/summery/PurchaseSummeryService');
const mongoose = require('mongoose');

// ---------------- CREATE PURCHASE ----------------
exports.CreatePurchases = async (req, res) => {
    try {
        let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'PurchaseID');

        if (Result.status === 'success' && Result.data?.Childs?.length > 0) {
            // Increment stock for purchased products
            for (const child of Result.data.Childs) {
                await ProductsModel.findByIdAndUpdate(
                    child.ProductID,
                    { $inc: { Stock: child.Qty } }, 
                    { new: true }
                );
            }
        }

        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ---------------- UPDATE PURCHASE ----------------
exports.UpdatePurchase = async (req, res) => {
    try {
        const purchaseID = req.params.id;
        const newChilds = req.body.Childs; // New purchased quantities

        const oldChilds = await ChildsModel.find({ PurchaseID: purchaseID });

        // Adjust stock based on quantity difference
        for (const oldChild of oldChilds) {
            const newChild = newChilds.find(c => c.ProductID === oldChild.ProductID.toString());
            if (newChild) {
                const diff = newChild.Qty - oldChild.Qty;
                if (diff !== 0) {
                    await ProductsModel.findByIdAndUpdate(
                        oldChild.ProductID,
                        { $inc: { Stock: diff } },
                        { new: true }
                    );
                }
            }
        }

        // Update parent & child records
        let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'PurchaseID');
        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ---------------- LIST PURCHASES ----------------
exports.PurchasesList = async (req, res) => {
    try {
        let SearchRgx = { '$regex': req.params.searchKeyword, '$options': 'i' };
        let JoinStage = { $lookup: { from: 'suppliers', localField: 'SupplierID', foreignField: '_id', as: 'suppliers' } };
        let SearchArray = [
            { Note: SearchRgx },
            { 'suppliers.Name': SearchRgx },
            { 'suppliers.Address': SearchRgx },
            { 'suppliers.Phone': SearchRgx },
            { 'suppliers.Email': SearchRgx }
        ];
        let Result = await ListOneJoinService(req, ParentModel, SearchArray, JoinStage);
        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ---------------- DELETE PURCHASE ----------------
exports.PurchasesDelete = async (req, res) => {
    try {
        const purchaseID = req.params.id;
        const childProducts = await ChildsModel.find({ PurchaseID: purchaseID });

        // Decrease stock before deleting
        for (const child of childProducts) {
            await ProductsModel.findByIdAndUpdate(
                child.ProductID,
                { $inc: { Stock: -child.Qty } }, 
                { new: true }
            );
        }

        // Delete parent & child records
        let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'PurchaseID');
        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ---------------- PURCHASES REPORT ----------------
exports.PurchasesByDate = async (req, res) => {
    try {
        let Result = await PurchasesReportService(req);
        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// ---------------- PURCHASE SUMMARY ----------------
exports.PurchaseSummery = async (req, res) => {
    try {
        let Result = await PurchaseSummeryService(req);
        res.status(200).json(Result);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
