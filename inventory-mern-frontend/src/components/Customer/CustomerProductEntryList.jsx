import React, { Fragment, useEffect, useState, useRef, useMemo } from "react";
import { CustomerProductEntryListRequest } from "../../APIRequest/CustomerProductAPIRequest";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { NumericFormat as CurrencyFormat } from "react-number-format";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CustomerProductEntryList = () => {
  const [searchKeyword, setSearchKeyword] = useState("0");
  const [perPage, setPerPage] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  

  const rawList = useSelector((state) => state.customerProductEntry.list);
  const DataList = useMemo(() => rawList || [], [rawList]);

  const Total = useMemo(
    () => DataList.reduce((acc, item) => acc + (item.Total || 0), 0),
    [DataList]
  );

  const invoiceRef = useRef();
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch data
  useEffect(() => {
    CustomerProductEntryListRequest(pageNo, perPage, searchKeyword);
  }, [pageNo, perPage, searchKeyword]);

  const handlePageClick = (event) => setPageNo(event.selected + 1);

  const perPageOnChange = async (e) => {
    const value = parseInt(e.target.value);
    setPerPage(value);
    setPageNo(1);
    await CustomerProductEntryListRequest(1, value, searchKeyword);
  };

  const searchKeywordOnChange = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value.length === 0 ? "0" : value);
    if (value.length === 0) {
      setPageNo(1);
      await CustomerProductEntryListRequest(1, perPage, "0");
    }
  };

  const searchData = async () => {
    setPageNo(1);
    await CustomerProductEntryListRequest(1, perPage, searchKeyword);
  };

  const TextSearch = (e) => {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.style.display = row.innerText
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
        ? ""
        : "none";
    });
  };

  const DetailsPopUp = (item) => {
    console.log("Details:", item);
  };

  const generateInvoicePDF = async (entry) => {
    setSelectedEntry(entry);
    invoiceRef.current.style.display = "block";
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`CustomerEntry_${entry.CustomerName || "Entry"}.pdf`);

    invoiceRef.current.style.display = "none";
    setSelectedEntry(null);
  };

  const sortedData = useMemo(
    () => [...DataList].sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)),
    [DataList]
  );

  return (
    <Fragment>
      <div className="container-fluid my-5">
        {/* Filters */}
        <div className="row mb-3">
          <div className="col-4">
            <h5>Customer Product Entries</h5>
          </div>
          <div className="col-2">
            <input
              onKeyUp={TextSearch}
              placeholder="Text Filter"
              className="form-control form-control-sm"
            />
          </div>
          <div className="col-2">
            <select
              onChange={perPageOnChange}
              className="form-control mx-2 form-select-sm form-select"
              value={perPage}
            >
              {[20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} Per Page
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <div className="input-group mb-3">
              <input
                onChange={searchKeywordOnChange}
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
              />
              <button onClick={searchData} className="btn btn-success btn-sm mb-0">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive table-section">
          <table className="table table-striped table-bordered">
            <thead className="sticky-top bg-white">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Faculty</th>
                <th>Department</th>
                <th>Section</th>
                <th>Payslip</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Available Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Purchase Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                (() => {
                  let entryCounter = 0;
                  return sortedData.map((item, i) => {
                    entryCounter++;
                    return Array.isArray(item.Products) && item.Products.length > 0
                      ? item.Products.map((p, idx) => (
                          <tr key={`${i}-${idx}`}>
                            {idx === 0 && (
                              <>
                                <td rowSpan={item.Products.length}>{entryCounter}</td>
                                <td rowSpan={item.Products.length}>{item.CustomerName}</td>
                                <td rowSpan={item.Products.length}>{item.Category}</td>
                                <td rowSpan={item.Products.length}>{item.FacultyName}</td>
                                <td rowSpan={item.Products.length}>{item.DepartmentName}</td>
                                <td rowSpan={item.Products.length}>{item.SectionName}</td>
                                <td rowSpan={item.Products.length}>{item.PayslipNumber}</td>
                              </>
                            )}
                            <td>{p.ProductName}</td>
                            <td>{p.Qty}</td>
                            <td>{p.AvailableQty ?? p.Qty}</td>
                            <td>
                              <CurrencyFormat
                                value={p.UnitPrice}
                                displayType="text"
                                thousandSeparator
                                prefix="$"
                              />
                            </td>
                            <td>
                              <CurrencyFormat
                                value={p.Total}
                                displayType="text"
                                thousandSeparator
                                prefix="$"
                              />
                            </td>
                            {idx === 0 && (
                              <>
                                <td rowSpan={item.Products.length}>
                                  {moment(item.PurchaseDate).format("DD-MM-YYYY")}
                                </td>
                                <td rowSpan={item.Products.length}>
                                  <button
                                    onClick={() => DetailsPopUp(item)}
                                    className="btn btn-outline-success btn-sm me-2"
                                  >
                                    <AiOutlineEye size={15} />
                                  </button>
                                  
  <button
    onClick={() => generateInvoicePDF(item)}
    className="btn btn-outline-primary btn-sm"
  >
    PDF
  </button>

                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      : null;
                  });
                })()
              ) : (
                <tr>
                  <td colSpan="14" className="text-center text-muted">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5">
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={Math.ceil(Total / perPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-4"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item disabled"
            breakLinkClassName="page-link"
            activeClassName="active"
            disabledClassName="disabled"
          />
        </div>

        {/* Hidden Invoice */}
        <div
          id="invoice"
          ref={invoiceRef}
          style={{
            display: "none",
            padding: 50,
            fontFamily: "'Kalpurush', sans-serif",
            minHeight: "100vh",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {selectedEntry && (
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
                <img
                  src="/patuakhali-science-technology-university-logo-png_seeklogo-432827.png"
                  alt="Logo"
                  style={{ width: 100, height: 100 }}
                />
                <div style={{ textAlign: "center", flex: 1, marginLeft: 20 }}>
                  <h6 style={{ margin: 0, fontWeight: "bold", color: "#871003", fontSize: 26 }}>
                    Patuakhali Science and Technology University
                  </h6>
                  <div style={{ height: 15 }} />
                  <h2 style={{ margin: 0, fontSize: 20 }}>
                    পটুয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                  </h2>
                  <p style={{ margin: 0, fontSize: 14 }}>দুমকি, পটুয়াখালী-৮৬৬০</p>
                </div>
              </div>

              <hr style={{ marginBottom: 25 }} />

              <div style={{ textAlign: "right", marginBottom: 25 }}>
                <p style={{ fontSize: 14 }}>
                  Issue Date: {moment(selectedEntry.CreatedDate).format("DD-MM-YYYY")}
                </p>
              </div>

              <div style={{ marginBottom: 25 }}>
                <h3>Customer Details:</h3>
                <p>Name: {selectedEntry.CustomerName || "-"}</p>
                <p>Mobile No: {selectedEntry.Phone || "-"}</p>
                <p>Email: {selectedEntry.Email || "-"}</p>
                <p>Category: {selectedEntry.Category || "-"}</p>
                {["chairman", "teacher", "dean"].includes(selectedEntry.Category?.toLowerCase()) && (
                  <p>Faculty: {selectedEntry.FacultyName || "-"}</p>
                )}
                {["chairman", "teacher"].includes(selectedEntry.Category?.toLowerCase()) && (
                  <p>Department: {selectedEntry.DepartmentName || "-"}</p>
                )}
                {selectedEntry.Category?.toLowerCase() === "officer" && (
                  <p>Section: {selectedEntry.SectionName || "-"}</p>
                )}
                <p>Payslip: {selectedEntry.PayslipNumber || "-"}</p>
              </div>

              <h3>Products:</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 25 }}>
                <thead>
                  <tr style={{ backgroundColor: "#16a089", color: "white" }}>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Purchase Date</th>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Product</th>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Qty</th>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Available Qty</th>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Unit Price</th>
                    <th style={{ border: "1px solid #000", padding: 8 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedEntry.Products) &&
                    selectedEntry.Products.map((p, idx) => (
                      <tr key={idx}>
                        {idx === 0 && (
                          <td
                            rowSpan={selectedEntry.Products.length}
                            style={{ border: "1px solid #000", padding: 8, verticalAlign: "top" }}
                          >
                            {moment(selectedEntry.PurchaseDate).format("DD-MM-YYYY")}
                          </td>
                        )}
                        <td style={{ border: "1px solid #000", padding: 8 }}>{p.ProductName}</td>
                        <td style={{ border: "1px solid #000", padding: 8 }}>{p.Qty}</td>
                        <td style={{ border: "1px solid #000", padding: 8 }}>
                          {p.AvailableQty ?? p.Qty}
                        </td>
                        <td style={{ border: "1px solid #000", padding: 8 }}>
                          ${p.UnitPrice?.toLocaleString() || 0}
                        </td>
                        <td style={{ border: "1px solid #000", padding: 8 }}>
                          ${p.Total?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div style={{ marginBottom: 35 }}>
                <p>Other Cost: ${selectedEntry.OtherCost || 0}</p>
                <h3>Grand Total: ${selectedEntry.Total || 0}</h3>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 50 }}>
                <div>
                  <p>_________________________</p>
                  <p>Authorized Signature</p>
                </div>
                <div>
                  <p>_________________________</p>
                  <p>Teacher/Officer Signature</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerProductEntryList;
