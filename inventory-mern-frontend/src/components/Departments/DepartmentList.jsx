// src/components/DepartmentList.jsx
import React, { useEffect, useState, Fragment } from 'react';
import { DepartmentListRequest, DeleteDepartmentRequest } from "../../APIRequest/DepartmentAPIRequest";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import moment from 'moment';
import { DeleteAlert } from "../../helper/DeleteAlert";
import DepartmentForm from "./DepartmentForm"; // ✅ Your create form

const DepartmentList = () => {
    let [searchKeyword, setSearchKeyword] = useState("0");
    let [perPage, setPerPage] = useState(20);

    // ✅ Load departments
    const loadDepartments = async (page = 1, size = perPage, keyword = searchKeyword) => {
        await DepartmentListRequest(page, size, keyword);
    };

    useEffect(() => {
        (async () => {
            await loadDepartments();
        })();
    }, []);

    let DataList = useSelector((state) => (state.department.List));
    let Total = useSelector((state) => (state.department.ListTotal));

    const handlePageClick = async (event) => {
        await loadDepartments(event.selected + 1);
    };

    const searchData = async () => {
        await loadDepartments(1);
    };

    const perPageOnChange = async (e) => {
        setPerPage(parseInt(e.target.value));
        await loadDepartments(1, e.target.value);
    };

    const searchKeywordOnChange = async (e) => {
        setSearchKeyword(e.target.value);
        if ((e.target.value).length === 0) {
            setSearchKeyword("0");
            await loadDepartments(1, perPage, "0");
        }
    };

    const TextSearch = (e) => {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = (row.innerText.includes(e.target.value)) ? '' : 'none';
        });
    };

    const DeleteItem = async (id) => {
        let Result = await DeleteAlert();
        if (Result.isConfirmed) {
            let DeleteResult = await DeleteDepartmentRequest(id);
            if (DeleteResult) {
                await loadDepartments();
            }
        }
    };

    return (
        <Fragment>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">

                                    {/* ✅ Create Department Form */}
                                    <DepartmentForm onSuccess={loadDepartments} />

                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <h5>Department List</h5>
                                        </div>
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
                                                <input onChange={searchKeywordOnChange} type="text" className="form-control form-control-sm" placeholder="Search.." />
                                                <button onClick={searchData} className="btn btn-success btn-sm mb-0" type="button">Search</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="table-responsive table-section">
                                                <table className="table ">
                                                    <thead className="sticky-top bg-white">
                                                        <tr>
                                                            <td>#No</td>
                                                            <td>Department Name</td>
                                                            <td>Created</td>
                                                            <td>Action</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {DataList.map((item, i) =>
                                                            <tr key={item._id}>
                                                                <td>{i + 1}</td>
                                                                <td>{item.Name}</td>
                                                                <td>{moment(item.CreatedDate).format('MMMM Do YYYY')}</td>
                                                                <td>
                                                                    <Link to={`/DepartmentCreatePage?id=${item._id}`} className="btn text-info btn-outline-light p-2 mb-0 btn-sm">
                                                                        <AiOutlineEdit size={15} />
                                                                    </Link>
                                                                    <button onClick={DeleteItem.bind(this, item._id)} className="btn btn-outline-light text-danger p-2 mb-0 btn-sm ms-2">
                                                                        <AiOutlineDelete size={15} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Pagination */}
                                        <div className="col-12 mt-5">
                                            <nav>
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

export default DepartmentList;
