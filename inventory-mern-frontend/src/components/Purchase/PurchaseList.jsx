import React, { Fragment, useEffect, useState } from 'react';
import { PurchaseListRequest } from "../../APIRequest/PurchaseAPIRequest";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

const PurchaseList = () => {
    const [searchKeyword, setSearchKeyword] = useState("0");
    const [perPage, setPerPage] = useState(20);

    useEffect(() => {
        (async () => {
            await PurchaseListRequest(1, perPage, searchKeyword);
        })();
    }, []);

    const DataList = useSelector((state) => state.purchase.List);
    const Total = useSelector((state) => state.purchase.ListTotal);

    const handlePageClick = async (event) => {
        await PurchaseListRequest(event.selected + 1, perPage, searchKeyword);
    };

    const searchData = async () => {
        await PurchaseListRequest(1, perPage, searchKeyword);
    };

    const perPageOnChange = async (e) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        await PurchaseListRequest(1, value, searchKeyword);
    };

    const searchKeywordOnChange = async (e) => {
        const value = e.target.value;
        setSearchKeyword(value);
        if (value.length === 0) {
            setSearchKeyword("0");
            await PurchaseListRequest(1, perPage, "0");
        }
    };

    const TextSearch = (e) => {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? '' : 'none';
        });
    };

    const DetailsPopUp = (item) => {
        console.log("Details clicked for:", item);
    };

    return (
        <Fragment>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    {/* Header & Search */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <h5>Purchase List</h5>
                                        </div>
                                        <div className="col-2">
                                            <input onKeyUp={TextSearch} placeholder="Text Filter" className="form-control form-control-sm"/>
                                        </div>
                                        <div className="col-2">
                                            <select onChange={perPageOnChange} className="form-select form-select-sm">
                                                <option value="20">20 Per Page</option>
                                                <option value="30">30 Per Page</option>
                                                <option value="50">50 Per Page</option>
                                                <option value="100">100 Per Page</option>
                                                <option value="200">200 Per Page</option>
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <div className="input-group">
                                                <input onChange={searchKeywordOnChange} type="text" className="form-control form-control-sm" placeholder="Search.."/>
                                                <button onClick={searchData} className="btn btn-success btn-sm">Search</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="row">
                                        <div className="col-12 table-responsive">
                                            <table className="table table-striped">
                                                <thead className="sticky-top bg-white">
                                                    <tr>
                                                        <th>Supplier</th>
                                                        <th>Grand Total</th>
                                                        <th>Shipping Cost</th>
                                                        <th>Vat/Tax</th>
                                                        <th>Other Cost</th>
                                                        <th>Discount</th>
                                                        <th>Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {DataList.map((item, index) => (
                                                        <tr key={item._id || index}>
                                                            <td>{item.suppliers?.[0]?.Name || "N/A"}</td>

                                                            <td>
    <CurrencyFormat 
        value={item.GrandTotal ?? 0} 
        displayType={'text'} 
        thousandSeparator 
        prefix={'৳ '} 
    />
</td>

<td>
    <CurrencyFormat 
        value={item.ShippingCost ?? 0} 
        displayType={'text'} 
        thousandSeparator 
        prefix={'৳ '} 
    />
</td>

<td>
    <CurrencyFormat 
        value={item.VatTax ?? 0} 
        displayType={'text'} 
        thousandSeparator 
        prefix={'৳ '} 
        renderText={value => <span>{value} %</span>} 
    />
</td>

<td>
    <CurrencyFormat 
        value={item.OtherCost ?? 0} 
        displayType={'text'} 
        thousandSeparator 
        prefix={'৳ '} 
    />
</td>

<td>
    <CurrencyFormat 
        value={item.Discount ?? 0} 
        displayType={'text'} 
        thousandSeparator 
        prefix={'৳ '} 
        renderText={value => <span>{value} %</span>} 
    />
</td>

                                                            <td>{moment(item.CreatedDate).format('MMMM Do YYYY')}</td>

                                                            <td>
                                                                <button onClick={() => DetailsPopUp(item)} className="btn btn-outline-success btn-sm">
                                                                    <AiOutlineEye size={15} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <ReactPaginate
                                                previousLabel="<"
                                                nextLabel=">"
                                                pageCount={Math.ceil(Total / perPage)}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName="pagination"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakLabel="..."
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                activeClassName="active"
                                            />
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

export default PurchaseList;
