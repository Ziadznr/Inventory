import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomerListRequest, DeleteCustomerRequest } from "../../APIRequest/CustomerAPIRequest";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { DeleteAlert } from "../../helper/DeleteAlert";

const CustomerList = () => {
  const [searchKeyword, setSearchKeyword] = useState("0");
  const [category, setCategory] = useState("All");
  const [perPage, setPerPage] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const DataList = useSelector((state) => state.customer.List) || [];
  const Total = useSelector((state) => state.customer.ListTotal) || 0;

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
    setPageNo(page);
    await CustomerListRequest(page, perPage, searchKeyword, category);
    setLoading(false);
  };

  const handlePageClick = async (event) => {
    await fetchData(event.selected + 1);
  };

  const searchData = async () => {
    await fetchData(1);
  };

  const perPageOnChange = async (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    await fetchData(1);
  };

  const searchKeywordOnChange = (e) => {
    setSearchKeyword(e.target.value.trim() === "" ? "0" : e.target.value);
  };

  const categoryOnChange = async (e) => {
    setCategory(e.target.value);
    await fetchData(1);
  };

  const DeleteItem = async (id) => {
    const Result = await DeleteAlert();
    if (Result.isConfirmed) {
      await DeleteCustomerRequest(id);
      await fetchData(pageNo);
    }
  };

  return (
    <div className="container-fluid my-5">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3 align-items-center">
                <div className="col-3">
                  <h5>Customer List</h5>
                </div>
                <div className="col-2">
                  <input
                    value={searchKeyword === "0" ? "" : searchKeyword}
                    onChange={searchKeywordOnChange}
                    placeholder="Search by name, phone, or email"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-2">
                  <select
                    value={category}
                    onChange={categoryOnChange}
                    className="form-select form-select-sm"
                  >
                    <option value="All">All Categories</option>
                    <option value="Dean">Dean</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Chairman">Chairman</option>
                    <option value="Officer">Officer</option>
                  </select>
                </div>
                <div className="col-2">
                  <select
                    value={perPage}
                    onChange={perPageOnChange}
                    className="form-select form-select-sm"
                  >
                    <option value={20}>20 Per Page</option>
                    <option value={30}>30 Per Page</option>
                    <option value={50}>50 Per Page</option>
                    <option value={100}>100 Per Page</option>
                    <option value={200}>200 Per Page</option>
                  </select>
                </div>
                <div className="col-3">
                  <button onClick={searchData} className="btn btn-success btn-sm">
                    Search
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive table-section">
                <table className="table">
                  <thead className="sticky-top bg-white">
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : DataList && DataList.length > 0 ? (
                      DataList.map((item, i) => (
                        <tr key={item._id}>
                          <td>{i + 1 + (pageNo - 1) * perPage}</td>
                          <td>{item.CustomerName}</td>
                          <td>{item.Phone}</td>
                          <td>{item.UserEmail}</td>
                          <td>{item.Category}</td>
                          <td>
                            <Link
                              to={`/CustomerCreateUpdatePage?id=${item._id}`}
                              className="btn text-info btn-outline-light btn-sm"
                            >
                              <AiOutlineEdit size={15} />
                            </Link>
                            <button
                              onClick={() => DeleteItem(item._id)}
                              className="btn btn-outline-light text-danger btn-sm ms-2"
                            >
                              <AiOutlineDelete size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {Total > perPage && (
                <div className="mt-4">
                  <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    pageCount={Math.ceil(Total / perPage)}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
