import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../../utils";
import { showToast } from "../../../utils";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchOrders();
        const json = await response.json();
        if (json.status === "success") {
          setOrders(json.orders);
          console.log("this orders: ", json.orders);
        } else {
          showToast("failure", "Failed to load orders", 5);
        }
      } catch (error) {
        console.error(error);
        showToast("failure", "Failed to load orders", 5);
      }
    })();
  }, []);

  return (
    <div className="order-container">
      {orders.map((order) => (
        <div className="order">
          <ul className="order-heading">
            <li className="order-number fs-4">{`Order ID #${order.id}`}</li>
            <li className="order-date fs-4">{`Order date: ${formatDateString(
              order.date_purchased
            )}`}</li>
            <li className="order-date-small fs-4">{`Exam date: ${order.exam_date_time}`}</li>
            <li className="order-total-cost fs-4">{`Total: $${order.cost}`}</li>
            <li className="order-total-cost-small fs-4">
              {`Total: $${order.cost}`}
            </li>
          </ul>
          <ul className="order-details">
            <li className="order-exam-name">{`${order.exam_name}, ${order.university}`}</li>
            <li className="order-exam-length">{`Exam date: ${formatDateTimeString(
              order.exam_date_time
            )} - ${order.exam_length} hour`}</li>
            <li className="order-exam-cost">Proctor cost per hour: $35.00</li>
          </ul>
        </div>
      ))}
    </div>
  );

  function formatDateString(inputDateString) {
    const inputDate = new Date(inputDateString);

    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  function formatDateTimeString(inputDateString) {
    const inputDate = new Date(inputDateString);

    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minutes: "numeric",
    };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }
}
