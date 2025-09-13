import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import store from "../../redux/store/store";
import {
  OnChangeCustomerProductEntryInput,
  SetCustomerProductEntryItemList,
  RemoveCustomerProductEntryItem,
  SetCustomersList,
  ResetFilters
} from "../../redux/state-slice/customerproduct-slice";
import {
  CustomerDropDownRequest,
  CreateCustomerProductEntryRequest,
  FacultyDropdownRequest,
  DepartmentDropdownRequest,
  SectionDropdownRequest
} from "../../APIRequest/CustomerProductAPIRequest";
import { BsCartCheck, BsTrash } from "react-icons/bs";
import { SuccessToast, ErrorToast, IsEmpty } from "../../helper/FormHelper";

const CustomerProductCreate = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [category, setCategory] = useState("");

  const EntryFormValue = useSelector(
    (state) => state.customerProductEntry.EntryFormValue
  );
  const EntryItemList = useSelector(
    (state) => state.customerProductEntry.list
  );
  const customers = useSelector(
    (state) => state.customerProductEntry.customers
  );

  const productNameRef = useRef();
  const qtyRef = useRef();
  const unitPriceRef = useRef();
  const addressRef = useRef();
  const payslipRef = useRef();
  const dateRef = useRef();

  // ---------------- Initial Load: Faculties ----------------
  useEffect(() => {
    (async () => {
      const faculties = await FacultyDropdownRequest();
      setFacultyList(faculties || []);
    })();
  }, []);

  // ---------------- Category Change ----------------
  const onCategoryChange = async (value) => {
    setCategory(value);

    // reset form states in redux
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "category", Value: value }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "facultyId", Value: "" }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "departmentId", Value: "" }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "sectionId", Value: "" }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "CustomerID", Value: "" }));

    // reset lists
    setDepartmentList([]);
    setSectionList([]);
    store.dispatch(SetCustomersList([]));

    // if Officer → load sections
    if (value === "Officer") {
      const sections = await SectionDropdownRequest();
      setSectionList(sections || []);
    }
  };

  // ---------------- Faculty Change ----------------
  const onFacultyChange = async (facultyId) => {
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "facultyId", Value: facultyId }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "departmentId", Value: "" }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "sectionId", Value: "" }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "CustomerID", Value: "" }));

    setDepartmentList([]);
    setSectionList([]);
    store.dispatch(SetCustomersList([]));

    if (category === "Dean" && facultyId) {
      const list = await CustomerDropDownRequest("Dean", facultyId, null, null);
      store.dispatch(SetCustomersList(list || []));
    } else if (["Teacher", "Chairman"].includes(category) && facultyId) {
      const depts = await DepartmentDropdownRequest(facultyId);
      setDepartmentList(depts || []);
    }
  };

  // ---------------- Department Change ----------------
  const onDepartmentChange = async (deptId) => {
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "departmentId", Value: deptId }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "CustomerID", Value: "" }));
    store.dispatch(SetCustomersList([]));

    if (["Teacher", "Chairman"].includes(category) && EntryFormValue.facultyId && deptId) {
      const list = await CustomerDropDownRequest(category, EntryFormValue.facultyId, deptId, null);
      store.dispatch(SetCustomersList(list || []));
    }
  };

  // ---------------- Section Change ----------------
  const onSectionChange = async (sectionId) => {
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "sectionId", Value: sectionId }));
    store.dispatch(OnChangeCustomerProductEntryInput({ Name: "CustomerID", Value: "" }));
    store.dispatch(SetCustomersList([]));

    if (category === "Officer" && sectionId) {
      const list = await CustomerDropDownRequest("Officer", null, null, sectionId);
      store.dispatch(SetCustomersList(list || []));
    }
  };

  // ---------------- Add Product to Cart ----------------
  const OnAddCart = () => {
    const productName = productNameRef.current.value;
    const qtyValue = parseInt(qtyRef.current.value, 10);
    const unitPriceValue = parseFloat(unitPriceRef.current.value);

    if (IsEmpty(productName)) return ErrorToast("Enter Product Name");
    if (!qtyValue || qtyValue <= 0) return ErrorToast("Qty Required");
    if (!unitPriceValue || unitPriceValue <= 0) return ErrorToast("Unit Price Required");

    const newItem = {
      ProductName: productName,
      Qty: qtyValue,
      UnitCost: unitPriceValue,
      Total: qtyValue * unitPriceValue,
    };

    store.dispatch(SetCustomerProductEntryItemList(newItem));

    productNameRef.current.value = "";
    qtyRef.current.value = "";
    unitPriceRef.current.value = "";
  };

  // ---------------- Remove Product from Cart ----------------
  const removeCart = (index) => {
    store.dispatch(RemoveCustomerProductEntryItem(index));
  };

  // ---------------- Create Entry ----------------
  const CreateNewEntry = async () => {
    if (!EntryFormValue.CustomerID) return ErrorToast("Select Customer");
    if (IsEmpty(payslipRef.current.value)) return ErrorToast("Payslip Number Required");
    if (IsEmpty(addressRef.current.value)) return ErrorToast("Purchase Address Required");
    if (IsEmpty(dateRef.current.value)) return ErrorToast("Purchase Date Required");
    if (EntryItemList.length === 0) return ErrorToast("At least 1 product required");

    const payload = {
      CustomerID: EntryFormValue.CustomerID,
      PayslipNumber: payslipRef.current.value,
      PurchaseAddress: addressRef.current.value,
      PurchaseDate: dateRef.current.value,
      Items: EntryItemList,
      Total: EntryFormValue.TotalAmount,
    };

    const res = await CreateCustomerProductEntryRequest(payload);
    if (res) {
      SuccessToast("Entry Created Successfully");
      store.dispatch(ResetFilters());
      payslipRef.current.value = "";
      addressRef.current.value = "";
      dateRef.current.value = "";
      setCategory("");
      setDepartmentList([]);
      setSectionList([]);
    }
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">

          {/* Left Form */}
          <div className="col-12 col-md-4 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5>Create Customer Product Entry</h5>
                <hr />

                {/* Category */}
                <div className="mb-2">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                  >
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
                    <select
                      className="form-select form-select-sm"
                      value={EntryFormValue.facultyId || ""}
                      onChange={(e) => onFacultyChange(e.target.value)}
                    >
                      <option value="">Select Faculty</option>
                      {facultyList.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Department */}
                {["Teacher", "Chairman"].includes(category) &&
                  departmentList.length > 0 && (
                    <div className="mb-2">
                      <label className="form-label">Department</label>
                      <select
                        className="form-select form-select-sm"
                        value={EntryFormValue.departmentId || ""}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                      >
                        <option value="">Select Department</option>
                        {departmentList.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* Section */}
                {category === "Officer" && sectionList.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Section</label>
                    <select
                      className="form-select form-select-sm"
                      value={EntryFormValue.sectionId || ""}
                      onChange={(e) => onSectionChange(e.target.value)}
                    >
                      <option value="">Select Section</option>
                      {sectionList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Customer */}
                {customers && customers.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Customer</label>
                    <select
                      className="form-select form-select-sm"
                      value={EntryFormValue.CustomerID || ""}
                      onChange={(e) =>
                        store.dispatch(
                          OnChangeCustomerProductEntryInput({
                            Name: "CustomerID",
                            Value: e.target.value,
                          })
                        )
                      }
                    >
                      <option value="">Select Customer</option>
                      {customers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.CustomerName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payslip */}
                <div className="mb-2">
                  <label className="form-label">Payslip Number</label>
                  <input ref={payslipRef} type="text" className="form-control form-control-sm" />
                </div>

                {/* Address */}
                <div className="mb-2">
                  <label className="form-label">Purchase Address</label>
                  <input ref={addressRef} type="text" className="form-control form-control-sm" />
                </div>

                {/* Date */}
                <div className="mb-2">
                  <label className="form-label">Purchase Date</label>
                  <input ref={dateRef} type="date" className="form-control form-control-sm" />
                </div>

                {/* Total Amount */}
                <div className="mb-2">
                  <label className="form-label">Total</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={EntryFormValue.TotalAmount || 0}
                    readOnly
                  />
                </div>

                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={CreateNewEntry}
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Cart */}
          <div className="col-12 col-md-8 col-lg-8 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="row">
                  <div className="col-4 mb-2">
                    <label className="form-label">Product Name</label>
                    <input ref={productNameRef} type="text" className="form-control form-control-sm" />
                  </div>
                  <div className="col-3 mb-2">
                    <label className="form-label">Qty</label>
                    <input ref={qtyRef} type="number" className="form-control form-control-sm" min={1} />
                  </div>
                  <div className="col-3 mb-2">
                    <label className="form-label">Unit Price</label>
                    <input ref={unitPriceRef} type="number" className="form-control form-control-sm" min={1} />
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
                      {EntryItemList && EntryItemList.length > 0 ? (
                        EntryItemList.map((item, i) => (
                          <tr key={i}>
                            <td>{item.ProductName}</td>
                            <td>{item.Qty}</td>
                            <td>{item.UnitCost}</td>
                            <td>{item.Total}</td>
                            <td>
                              <button
                                onClick={() => removeCart(i)}
                                className="btn btn-outline-danger btn-sm"
                              >
                                <BsTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No items added
                          </td>
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

export default CustomerProductCreate;
