// components/RecentTable.js
import React from "react";

const farmerColumns = [
  { header: "ID", accessor: "farmerid" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "Village", accessor: "village" },
  { header: "Date", accessor: "date" },
];

const milkColumns = [
  { header: "Record ID", accessor: "recordid" },
  { header: "Date", accessor: "date" },
  { header: "Farmer Name", accessor: "farmerName" },
  { header: "Quantity", accessor: "quantity" },
];

const paymentColumns = [
  { header: "Payment ID", accessor: "paymentId" },
  { header: "Date", accessor: "date" },
  { header: "Payer Name", accessor: "payerName" },
  { header: "Amount", accessor: "amount" },
];


export default function RecentTable({ columns, data }) {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>No recent data.</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => (
                <td key={col.header}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
