import React, { useEffect } from "react";
import {
  ExpensesSummary,
  SaleSummary,
  ReturnSummary,
  PurchaseSummary,
} from "../../APIRequest/SummaryAPIRequest";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import CurrencyFormat from "react-currency-format";
import store from "../../redux/store/store";
import { ShowLoader, HideLoader } from "../../redux/state-slice/settings-slice";

// ---------------- Helpers ----------------
const getLast30Days = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }
  return dates;
};

const mapToLast30Days = (data) => {
  const last30Days = getLast30Days();
  return last30Days.map((date) => {
    const found = data.find((d) => d._id === date);
    return { _id: date, TotalAmount: found ? found.TotalAmount : 0 };
  });
};

// ---------------- Dashboard ----------------
const Dashboard = () => {
  useEffect(() => {
    const loadData = async () => {
      store.dispatch(ShowLoader());
      try {
        await Promise.all([
          ExpensesSummary(),
          SaleSummary(),
          ReturnSummary(),
          PurchaseSummary(),
        ]);
      } finally {
        store.dispatch(HideLoader());
      }
    };
    loadData();
  }, []);

  // ---------------- Redux State ----------------
  const ExpenseChart = useSelector((state) => state.dashboard.ExpenseChart);
  const ExpenseTotal = useSelector((state) => state.dashboard.ExpenseTotal);

  const SaleChart = useSelector((state) => state.dashboard.SaleChart);
  const SaleTotal = useSelector((state) => state.dashboard.SaleTotal);

  const ReturnChart = useSelector((state) => state.dashboard.ReturnChart);
  const ReturnTotal = useSelector((state) => state.dashboard.ReturnTotal);

  const PurchaseChart = useSelector((state) => state.dashboard.PurchaseChart);
  const PurchaseTotal = useSelector((state) => state.dashboard.PurchaseTotal);

  // ---------------- Render Functions ----------------
  const renderCard = (title, total) => (
    <div className="col-md-3 p-2" key={title}>
      <div className="card">
        <div className="card-body">
          <span className="h5">
            <CurrencyFormat
              value={total}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </span>
          <p>{title}</p>
        </div>
      </div>
    </div>
  );

  const renderBarChart = (title, data, color) => (
    <div className="col-md-6 p-2" key={title}>
      <div className="card">
        <div className="card-body">
          <span className="h6">{title}</span>
          <ResponsiveContainer className="mt-4" width="100%" height={200}>
            <BarChart
              data={mapToLast30Days(data)}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="TotalAmount" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderLineChart = (title, data, color) => (
    <div className="col-md-6 p-2" key={title + "_line"}>
      <div className="card">
        <div className="card-body">
          <span className="h6">{title} Trend</span>
          <ResponsiveContainer className="mt-4" width="100%" height={200}>
            <LineChart
              data={mapToLast30Days(data)}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="TotalAmount"
                stroke={color}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        {renderCard("Total Expense", ExpenseTotal)}
        {renderCard("Total Sale", SaleTotal)}
        {renderCard("Total Purchase", PurchaseTotal)}
        {renderCard("Total Return", ReturnTotal)}
      </div>

      <div className="row">
        {renderBarChart("Expense Last 30 Days", ExpenseChart, "#CB0C9F")}
        {renderLineChart("Expense", ExpenseChart, "#CB0C9F")}
        {renderBarChart("Sales Last 30 Days", SaleChart, "#8884d8")}
        {renderLineChart("Sales", SaleChart, "#8884d8")}
        {renderBarChart("Purchase Last 30 Days", PurchaseChart, "#00A884")}
        {renderLineChart("Purchase", PurchaseChart, "#00A884")}
        {renderBarChart("Return Last 30 Days", ReturnChart, "#CB0C9F")}
        {renderLineChart("Return", ReturnChart, "#CB0C9F")}
      </div>
    </div>
  );
};

export default Dashboard;
