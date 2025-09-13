import React, { Fragment, useEffect, useState } from "react";
import { ProductListRequest } from "../../APIRequest/ProductAPIRequest";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

const CustomerProductList = () => {
  let [searchKeyword, setSearchKeyword] = useState("0");
  let [perPage, setPerPage] = useState(20);

  useEffect(() => {
    (async () => {
      await ProductListRequest(1, perPage, searchKeyword);
    })();
  }, []);

  let DataList = useSelector((state) => state.product.List);
  let Total = useSelector((state) => state.product.ListTotal);

  const handlePageClick = async (event) => {
    await ProductListRequest(event.selected + 1, perPage, searchKeyword);
  };

  const searchData = async () => {
    await ProductListRequest(1, perPage, searchKeyword);
  };

  const perPageOnChange = async (e) => {
    setPerPage(parseInt(e.target.value));
    await ProductListRequest(1, e.target.value, searchKeyword);
  };

  const searchKeywordOnChange = async (e) => {
    setSearchKeyword(e.target.value);
    if (e.target.value.length === 0) {
      setSearchKeyword("0");
      await ProductListRequest(1, perPage, "0");
    }
  };

  const TextSearch = (e) => {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.style.display = row.innerText.includes(e.target.value) ? "" : "none";
    });
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
                    <div className="col-4">
                      <h5>Product List</h5>
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
                        className="form-control mx-2 form-select-sm form-control-sm"
                      >
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
                          placeholder="Search.."
                        />
                        <button
                          onClick={searchData}
                          className="btn btn-success btn-sm mb-0"
                          type="button"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 table-responsive table-section">
                      <table className="table">
                        <thead className="sticky-top bg-white">
                          <tr>
                            <td>Name</td>
                            <td>Stock</td>
                            <td>Brand</td>
                            <td>Category</td>
                            <td>Details</td>
                            {/* Hide Actions for customer */}
                          </tr>
                        </thead>
                        <tbody>
                          {DataList.map((item) => (
                            <tr key={item._id}>
                              <td>{item.Name}</td>
                              <td>{item.TotalPurchased - item.TotalSold}</td>
                              <td>{item.brands?.[0]?.Name || ""}</td>
                              <td>{item.categories?.[0]?.Name || ""}</td>
                              <td>{item.Details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row mt-5">
                    <div className="col-12">
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
                          pageCount={Total / perPage}
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

export default CustomerProductList;
