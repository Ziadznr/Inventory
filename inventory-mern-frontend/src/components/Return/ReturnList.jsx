import React, { Fragment, useEffect, useState } from 'react';
import { ReturnListRequest } from "../../APIRequest/ReturnAPIRequest";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";

const ReturnList = () => {
    const [searchKeyword, setSearchKeyword] = useState("0");
    const [perPage, setPerPage] = useState(20);

    const DataList = useSelector(state => state.return.List || []);
    const Total = useSelector(state => state.return.ListTotal || 0);

    useEffect(() => {
        (async () => {
            await ReturnListRequest(1, perPage, searchKeyword);
        })();
    }, []);

    const handlePageClick = async (event) => {
        await ReturnListRequest(event.selected + 1, perPage, searchKeyword);
    };

    const searchData = async () => {
        await ReturnListRequest(1, perPage, searchKeyword);
    };

    const perPageOnChange = async (e) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        await ReturnListRequest(1, value, searchKeyword);
    };

    const searchKeywordOnChange = async (e) => {
        const value = e.target.value;
        setSearchKeyword(value.length === 0 ? "0" : value);
        if (value.length === 0) await ReturnListRequest(1, perPage, "0");
    };

    const TextSearch = (e) => {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        });
    };

    const DetailsPopUp = (item) => {
        console.log("Return Details:", item);
    };

    return (
        <Fragment>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row mb-3">
                                        <div className="col-4"><h5>Return List</h5></div>
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

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="table-responsive table-section">
                                                <table className="table table-sm table-bordered">
                                                    <thead className="sticky-top bg-white">
                                                        <tr>
                                                            <th>Customer Name</th>
                                                            <th>Category</th>
                                                            <th>Faculty</th>
                                                            <th>Department</th>
                                                            <th>Section</th>
                                                            <th>Sale Date</th>
                                                            <th>Return Date</th>
                                                            <th>Reason</th>
                                                            <th>Products</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {DataList.length > 0 ? (
                                                        DataList.map((item, i) => {
                                                            const customer = item.CustomerData || {};
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{customer.CustomerName || "-"}</td>
                                                                    <td>{customer.Category || "-"}</td>
                                                                    <td>{customer.FacultyName || "-"}</td>
                                                                    <td>{customer.DepartmentName || "-"}</td>
                                                                    <td>{customer.SectionName || "-"}</td>
                                                                    <td>{item.GivenDate ? moment(item.GivenDate).format('MMMM Do YYYY') : "-"}</td>
                                                                    <td>{item.CreatedDate ? moment(item.CreatedDate).format('MMMM Do YYYY') : "-"}</td>
                                                                    <td>{item.Reason || "-"}</td>
                                                                    <td>
                                                                        {item.Products && item.Products.length > 0 ? (
                                                                            <ul className="mb-0">
                                                                                {item.Products.map((p, idx) => (
                                                                                    <li key={idx}>{p.ProductName} - Qty: {p.Qty}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : "-"}
                                                                    </td>
                                                                    <td>
                                                                        <button onClick={() => DetailsPopUp(item)} className="btn btn-outline-light text-success p-2 mb-0 btn-sm ms-2">
                                                                            <AiOutlineEye size={15} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className="text-center text-muted">No data found</td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="col-12 mt-3">
                                            <nav aria-label="Page navigation example">
                                                <ReactPaginate
                                                    previousLabel="<"
                                                    nextLabel=">"
                                                    pageClassName="page-item"
                                                    pageLinkClassName="page-link"
                                                    previousClassName="page-item"
                                                    previousLinkClassName="page-link"
                                                    nextClassName="page-item"
                                                    nextLinkClassName="page-link"
                                                    breakLabel="..."
                                                    breakClassName="page-item"
                                                    breakLinkClassName="page-link"
                                                    pageCount={Math.ceil(Total / perPage)}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick}
                                                    containerClassName="pagination"
                                                    activeClassName="active"
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

export default ReturnList;
