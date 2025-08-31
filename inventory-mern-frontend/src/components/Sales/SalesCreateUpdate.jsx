import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import store from "../../redux/store/store";
import {
  OnChangeSaleInput,
  SetSaleItemList,
  RemoveSaleItem
} from "../../redux/state-slice/sale-slice";
import {
  CustomerDropDownRequest,
  ProductDropDownRequest,
  CreateSaleRequest,
  FacultyDropdownRequest,
  DepartmentDropdownRequest,
  SectionDropdownRequest
} from "../../APIRequest/SaleAPIRequest";
import { BsCartCheck, BsTrash } from "react-icons/bs";
import { ErrorToast, IsEmpty } from "../../helper/FormHelper";

const SalesCreateUpdate = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [category, setCategory] = useState("");

  const SaleFormValue = useSelector(state => state.sale.SaleFormValue);
  const ProductDropDown = useSelector(state => state.sale.ProductDropDown);
  const SaleItemList = useSelector(state => state.sale.SaleItemList);

  const productRef = useRef();
  const qtyRef = useRef();
  const unitPriceRef = useRef();

  // ---------------- Initial Load ----------------
  useEffect(() => {
    (async () => {
      await ProductDropDownRequest();
      const faculties = await FacultyDropdownRequest();
      setFacultyList(faculties);
    })();
  }, []);

  // ---------------- Category Change ----------------
  const onCategoryChange = (value) => {
    setCategory(value);
    store.dispatch(OnChangeSaleInput({ Name: "Category", Value: value }));

    store.dispatch(OnChangeSaleInput({ Name: "FacultyID", Value: "" }));
    store.dispatch(OnChangeSaleInput({ Name: "DepartmentID", Value: "" }));
    store.dispatch(OnChangeSaleInput({ Name: "SectionID", Value: "" }));
    store.dispatch(OnChangeSaleInput({ Name: "CustomerID", Value: "" }));

    setDepartmentList([]);
    setSectionList([]);
    setCustomerList([]);

    if (value === "Officer") {
      (async () => {
        const sections = await SectionDropdownRequest();
        setSectionList(sections);
      })();
    }
  };

  // ---------------- Faculty Change ----------------
  const onFacultyChange = async (facultyId) => {
    store.dispatch(OnChangeSaleInput({ Name: "FacultyID", Value: facultyId }));
    store.dispatch(OnChangeSaleInput({ Name: "DepartmentID", Value: "" }));
    store.dispatch(OnChangeSaleInput({ Name: "SectionID", Value: "" }));
    store.dispatch(OnChangeSaleInput({ Name: "CustomerID", Value: "" }));

    setDepartmentList([]);
    setSectionList([]);
    setCustomerList([]);

    if (category === "Dean" && facultyId) {
      const customers = await CustomerDropDownRequest(category, facultyId, null, null);
      setCustomerList(customers);
    } else if (["Teacher", "Chairman"].includes(category) && facultyId) {
      const depts = await DepartmentDropdownRequest(facultyId);
      setDepartmentList(depts);
    }
  };

  // ---------------- Department Change ----------------
  const onDepartmentChange = async (deptId) => {
    store.dispatch(OnChangeSaleInput({ Name: "DepartmentID", Value: deptId }));
    store.dispatch(OnChangeSaleInput({ Name: "CustomerID", Value: "" }));

    setCustomerList([]);

    if (["Teacher", "Chairman"].includes(category) && SaleFormValue.FacultyID && deptId) {
      const customers = await CustomerDropDownRequest(category, SaleFormValue.FacultyID, deptId, null);
      setCustomerList(customers);
    }
  };

  // ---------------- Section Change ----------------
  const onSectionChange = async (sectionId) => {
    store.dispatch(OnChangeSaleInput({ Name: "SectionID", Value: sectionId }));
    store.dispatch(OnChangeSaleInput({ Name: "CustomerID", Value: "" }));

    setCustomerList([]);
    if (category === "Officer" && sectionId) {
      const customers = await CustomerDropDownRequest(category, null, null, sectionId);
      setCustomerList(customers);
    }
  };

  // ---------------- Add Product to Cart ----------------
  const OnAddCart = () => {
    const productValue = productRef.current.value;
    const productName = productRef.current.selectedOptions[0]?.text;
    const qtyValue = qtyRef.current.value;
    const unitPriceValue = unitPriceRef.current.value;

    if (IsEmpty(productValue)) return ErrorToast("Select Product");
    if (IsEmpty(qtyValue)) return ErrorToast("Qty Required");
    if (IsEmpty(unitPriceValue)) return ErrorToast("Unit Price Required");

    store.dispatch(SetSaleItemList({
      ProductID: productValue,
      ProductName: productName,
      Qty: qtyValue,
      UnitCost: unitPriceValue,
      Total: parseInt(qtyValue) * parseInt(unitPriceValue)
    }));
  };

  // ---------------- Remove Product from Cart ----------------
  const removeCart = (i) => store.dispatch(RemoveSaleItem(i));

  // ---------------- Create Sale ----------------
  const CreateNewSale = async () => {
    if (!SaleFormValue.CustomerID) return ErrorToast("Select Customer");
    const res = await CreateSaleRequest(SaleFormValue, SaleItemList);
    if (res) alert("Sale Created Successfully");
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">

          {/* Left Form */}
          <div className="col-12 col-md-4 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5>Create Sales</h5>
                <hr />

                {/* Category */}
                <div className="mb-2">
                  <label className="form-label">Category</label>
                  <select className="form-select form-select-sm" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Dean">Dean</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Chairman">Chairman</option>
                    <option value="Officer">Officer</option>
                  </select>
                </div>

                {/* Faculty */}
                {["Dean", "Teacher", "Chairman"].includes(category) && (
                  <div className="mb-2">
                    <label className="form-label">Faculty</label>
                    <select className="form-select form-select-sm" onChange={(e) => onFacultyChange(e.target.value)}>
                      <option value="">Select Faculty</option>
                      {facultyList.map(f => <option key={f._id} value={f._id}>{f.Name}</option>)}
                    </select>
                  </div>
                )}

                {/* Department */}
                {["Teacher", "Chairman"].includes(category) && departmentList.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Department</label>
                    <select className="form-select form-select-sm" onChange={(e) => onDepartmentChange(e.target.value)}>
                      <option value="">Select Department</option>
                      {departmentList.map(d => <option key={d._id} value={d._id}>{d.Name}</option>)}
                    </select>
                  </div>
                )}

                {/* Section */}
                {category === "Officer" && sectionList.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Section</label>
                    <select className="form-select form-select-sm" onChange={(e) => onSectionChange(e.target.value)}>
                      <option value="">Select Section</option>
                      {sectionList.map(s => <option key={s._id} value={s._id}>{s.Name}</option>)}
                    </select>
                  </div>
                )}

                {/* Customer */}
                {customerList.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Customer</label>
                    <select className="form-select form-select-sm" onChange={(e) => store.dispatch(OnChangeSaleInput({ Name: "CustomerID", Value: e.target.value }))}>
                      <option value="">Select Customer</option>
                      {customerList.map(c => <option key={c._id} value={c._id}>{c.CustomerName}</option>)}
                    </select>
                  </div>
                )}

                {/* Other Sale Fields */}
                {["VatTax", "Discount", "OtherCost", "ShippingCost", "GrandTotal", "Note"].map((field, idx) => (
                  <div className="mb-2" key={idx}>
                    <label className="form-label">{field}</label>
                    <input type="number" className="form-control form-control-sm" onChange={(e) => store.dispatch(OnChangeSaleInput({ Name: field, Value: e.target.value }))} />
                  </div>
                ))}

                <button className="btn btn-sm btn-success mt-2" onClick={CreateNewSale}>Create</button>
              </div>
            </div>
          </div>

          {/* Right Product Cart */}
          <div className="col-12 col-md-8 col-lg-8 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="row">
                  <div className="col-6 mb-2">
                    <label className="form-label">Select Product</label>
                    <select ref={productRef} className="form-select form-select-sm">
                      <option value="">Select Product</option>
                      {ProductDropDown.map(p => <option key={p._id} value={p._id}>{p.Name}</option>)}
                    </select>
                  </div>
                  <div className="col-2 mb-2">
                  
                    <input ref={qtyRef} className="form-control form-control-sm" type="number" />
                  </div>
                  <div className="col-2 mb-2">
                    <label className="form-label">Unit Price</label>
                    <input ref={unitPriceRef} className="form-control form-control-sm" type="number" />
                  </div>
                  <div className="col-2 d-flex align-items-end mb-2">
                    <button onClick={OnAddCart} className="btn btn-success btn-sm w-100">
                      <BsCartCheck />
                    </button>
                  </div>
                </div>

                {/* Cart Table */}
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr className="table-light">
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SaleItemList.map((item, i) => (
                        <tr key={i}>
                          <td>{item.ProductName}</td>
                          <td>{item.Qty}</td>
                          <td>{item.UnitCost}</td>
                          <td>{item.Total}</td>
                          <td>
                            <button onClick={() => removeCart(i)} className="btn btn-outline-danger btn-sm">
                              <BsTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {SaleItemList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">No items added</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
};

export default SalesCreateUpdate;
