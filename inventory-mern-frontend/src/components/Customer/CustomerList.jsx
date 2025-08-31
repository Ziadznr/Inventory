import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomerListRequest, DeleteCustomerRequest } from "../../APIRequest/CustomerAPIRequest";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { DeleteAlert } from "../../helper/DeleteAlert";
import { ErrorToast, SuccessToast } from "../../helper/FormHelper";
import axios from "axios";
import { BaseURL } from "../../helper/config";
import { getToken } from "../../helper/SessionHelper";
import "../../assets/css/EmailModal.css"; // modal CSS

const CustomerList = () => {
  const [searchKeyword, setSearchKeyword] = useState("0");
  const [category, setCategory] = useState("All");
  const [perPage, setPerPage] = useState(20);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const DataList = useSelector((state) => state.customer.List) || [];
  const Total = Number(useSelector((state) => state.customer.ListTotal)) || 0;

  const AxiosHeader = { headers: { token: getToken() } };

  // Fetch data
  const fetchData = async (page = 1) => {
    setLoading(true);
    setPageNo(page);
    await CustomerListRequest(page, perPage, searchKeyword, category);
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchData(1); 
      setLoading(false);
    };
    fetch();
  }, [perPage, category]);

  const handlePageClick = async (event) => {
    await fetchData(event.selected + 1);
  };

  const searchData = async () => {
    await fetchData(1);
  };

  const DeleteItem = async (id) => {
    const Result = await DeleteAlert();
    if (Result.isConfirmed) {
      await DeleteCustomerRequest(id);
      await fetchData(pageNo);
    }
  };

  const SendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      return ErrorToast("Subject and message cannot be empty!");
    }

    try {
      setEmailSending(true);
      const formData = new FormData();
      formData.append("customerId", selectedCustomerId);
      formData.append("subject", emailSubject);
      formData.append("message", emailMessage);
      attachments.forEach((file) => formData.append("attachments", file));

      const result = await axios.post(`${BaseURL}/send-email`, formData, {
        headers: { "Content-Type": "multipart/form-data", token: getToken() },
      });

      if (result.status === 200 && result.data?.status === "success") {
        SuccessToast("Email sent successfully!");
        setShowEmailModal(false);
        setEmailSubject("");
        setEmailMessage("");
        setAttachments([]);
      } else {
        ErrorToast(result.data?.message || "Email sending failed");
      }
    } catch (error) {
      console.log("SendEmail error:", error);
      ErrorToast("Something went wrong while sending email");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="container-fluid my-5">
      {/* Filters */}
      <div className="row mb-3 align-items-center">
        <div className="col-3"><h5>Customer List</h5></div>
        <div className="col-2">
          <input
            value={searchKeyword === "0" ? "" : searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value.trim() === "" ? "0" : e.target.value)}
            placeholder="Search by name, phone, or email"
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-2">
          <select
            value={category}
            onChange={async (e) => { setCategory(e.target.value); await fetchData(1); }}
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
            onChange={async (e) => { setPerPage(Number(e.target.value)); await fetchData(1); }}
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
          <button onClick={searchData} className="btn btn-success btn-sm">Search</button>
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
              <th>Faculty</th>
              <th>Department</th>
              <th>Section</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center">Loading...</td></tr>
            ) : DataList.length > 0 ? (
              DataList.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1 + (pageNo - 1) * perPage}</td>
                  <td>{item.CustomerName}</td>
                  <td>{item.Phone}</td>
                  <td>{item.CustomerEmail}</td>
                  <td>{item.Category}</td>
                  <td>{item?.FacultyName || "-"}</td>
                  <td>{item?.DepartmentName || "-"}</td>
                  <td>{item?.SectionName || "-"}</td>
                  <td>
                    <Link to={`/CustomerCreateUpdatePage?id=${item._id}`} className="btn text-info btn-outline-light btn-sm">
                      <AiOutlineEdit size={15} />
                    </Link>
                    <button onClick={() => DeleteItem(item._id)} className="btn btn-outline-light text-danger btn-sm ms-2">
                      <AiOutlineDelete size={15} />
                    </button>
                    <button
                      onClick={() => { setSelectedCustomerId(item._id); setEmailSubject(`Hello ${item.CustomerName}`); setShowEmailModal(true); }}
                      className="btn btn-outline-light text-primary btn-sm ms-2"
                    >
                      <AiOutlineMail size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={9} className="text-center">No Data Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 d-flex justify-content-center">
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={Math.max(Math.ceil(Total / perPage), 1)}
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-content-custom">
            <h5 className="mb-3">Send Email</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              rows={4}
              placeholder="Message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
            <input type="file" multiple className="form-control mb-2" onChange={(e) => setAttachments([...e.target.files])} />
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary btn-sm me-2" onClick={() => { setShowEmailModal(false); setAttachments([]); }}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={SendEmail} disabled={emailSending}>{emailSending ? "Sending..." : "Send"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
