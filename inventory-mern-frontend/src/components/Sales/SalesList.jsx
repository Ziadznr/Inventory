import React, { Fragment, useEffect, useState } from 'react';
import { SaleListRequest } from "../../APIRequest/SaleAPIRequest";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import CurrencyFormat from "react-currency-format";
import moment from "moment/moment";

const SalesList = () => {
    const [searchKeyword, setSearchKeyword] = useState("0");
    const [perPage, setPerPage] = useState(20);

    const DataList = useSelector(state => state.sale.List || []);
    const Total = useSelector(state => state.sale.ListTotal || 0);

    useEffect(() => {
        (async () => {
            await SaleListRequest(1, perPage, searchKeyword);
        })();
    }, []);

    const handlePageClick = async (event) => {
        await SaleListRequest(event.selected + 1, perPage, searchKeyword);
    };

    const searchData = async () => {
        await SaleListRequest(1, perPage, searchKeyword);
    };

    const perPageOnChange = async (e) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        await SaleListRequest(1, value, searchKeyword);
    };

    const searchKeywordOnChange = async (e) => {
        const value = e.target.value;
        setSearchKeyword(value.length === 0 ? "0" : value);
        if (value.length === 0) await SaleListRequest(1, perPage, "0");
    };

    const TextSearch = (e) => {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        });
    };

    const DetailsPopUp = (item) => {
        console.log("Details for:", item);
    };

    return (
        <Fragment>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    {/* ------- Filters Row ------- */}
                                    <div className="row mb-3">
                                        <div className="col-4"><h5>Sales List</h5></div>
                                        <div className="col-2">
                                            <input onKeyUp={TextSearch} placeholder="Text Filter" className="form-control form-control-sm" />
                                        </div>
                                        <div className="col-2">
                                            <select onChange={perPageOnChange} className="form-control mx-2 form-select-sm form-select form-control-sm">
                                                <option value="20">20 Per Page</option>
                                                <option value="30">30 Per Page</option>
                                                <option value="50">50 Per Page</option>
                                                <option value="100">100 Per Page</option>
                                                <option value="200">200 Per Page</option>
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <div className="input-group mb-3">
                                                <input
                                                    onChange={searchKeywordOnChange}
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Search..."
                                                    aria-label="Search"
                                                />
                                                <button onClick={searchData} className="btn btn-success btn-sm mb-0" type="button">Search</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ------- Sales Table ------- */}
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="table-responsive table-section">
                                                <table className="table">
                                                   <thead className="sticky-top bg-white">
  <tr>
    <td>Customer Name</td>
    <td>Category</td>
    <td>Faculty</td>
    <td>Department</td>
    <td>Section</td>
    <td>Product</td>
    <td>Qty</td>
    <td>Total</td>
    <td>Other Cost</td>
    <td>Grand Total</td>
    <td>Date</td>
    <td>Action</td>
  </tr>
</thead>

<tbody>
  {DataList.length > 0 ? (
    DataList.map((item, i) => {
      const customer = item.CustomerData || {};
      return item.Products && item.Products.length > 0 ? (
        item.Products.map((p, idx) => (
          <tr key={`${i}-${idx}`}>
            <td>{customer.CustomerName || "-"}</td>
            <td>{customer.Category || "-"}</td>
            <td>{customer.FacultyName || "-"}</td>
            <td>{customer.DepartmentName || "-"}</td>
            <td>{customer.SectionName || "-"}</td>
            <td>{p.ProductName || "-"}</td>
            <td>{p.Qty}</td>
            <td>
              <CurrencyFormat value={p.Total} displayType={'text'} thousandSeparator prefix={'$'} />
            </td>
            {/* only show OtherCost + GrandTotal on first product row */}
            {idx === 0 ? (
              <>
                <td>
                  <CurrencyFormat value={item.OtherCost} displayType={'text'} thousandSeparator prefix={'$'} />
                </td>
                <td>
                  <CurrencyFormat value={item.GrandTotal} displayType={'text'} thousandSeparator prefix={'$'} />
                </td>
                <td>{moment(item.CreatedDate).format('DD-MM-YYYY')}</td>
                <td>
                  <button onClick={() => console.log(item)} className="btn btn-outline-light text-success p-2 mb-0 btn-sm ms-2">
                    <AiOutlineEye size={15} />
                  </button>
                </td>
              </>
            ) : (
              <>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </>
            )}
          </tr>
        ))
      ) : (
        <tr key={i}>
          <td>{customer.CustomerName || "-"}</td>
          <td>{customer.Category || "-"}</td>
          <td>{customer.FacultyName || "-"}</td>
          <td>{customer.DepartmentName || "-"}</td>
          <td>{customer.SectionName || "-"}</td>
          <td colSpan="3" className="text-center text-muted">No Products</td>
          <td>
            <CurrencyFormat value={item.OtherCost} displayType={'text'} thousandSeparator prefix={'$'} />
          </td>
          <td>
            <CurrencyFormat value={item.GrandTotal} displayType={'text'} thousandSeparator prefix={'$'} />
          </td>
          <td>{moment(item.CreatedDate).format('DD-MM-YYYY')}</td>
          <td>
            <button onClick={() => console.log(item)} className="btn btn-outline-light text-success p-2 mb-0 btn-sm ms-2">
              <AiOutlineEye size={15} />
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="12" className="text-center text-muted">No data found</td>
    </tr>
  )}
</tbody>


                                                </table>
                                            </div>
                                        </div>

                                        {/* ------- Pagination ------- */}
                                        <div className="col-12 mt-5">
                                            <nav aria-label="Page navigation example">
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


                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SalesList;
