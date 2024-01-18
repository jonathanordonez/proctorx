import React, { useEffect, useContext } from "react";
import { fetchOrders } from "../../../utils";
import { showToast } from "../../../utils";
import { formatDateTimeString } from "../../../utils";
import { SessionsContext } from "../Homepage";

export default function Orders() {
  const { sessionsContext } = useContext(SessionsContext);
  const { setSessionsContext } = useContext(SessionsContext);

  useEffect(() => {
    (async () => {
      try {
        if (sessionsContext.orders.fetch === "yes") {
          const response = await fetchOrders();
          const json = await response.json();
          if (json.status === "success") {
            const newSessionsContext = {
              ...sessionsContext,
              orders: {
                data: json.orders,
                fetch: "no",
              },
            };
            setSessionsContext(newSessionsContext);
          } else {
            showToast("failure", "Failed to load orders", 5);
          }
        }
      } catch (error) {
        console.error(error);
        showToast("failure", "Failed to load orders", 5);
      }
    })();
  }, []);

  return (
    <div className="order-container">
      {sessionsContext.orders.data.map((order) => (
        <div className="order">
          <ul className="order-heading">
            <li className="order-number fs-5">{`Order ID #${order.id}`}</li>
            <li className="order-date fs-5">{`Order date: ${formatDateString(
              order.date_purchased
            )}`}</li>
            <li className="order-date-small fs-5">{`Exam date: ${order.exam_date_time}`}</li>
            <li className="order-total-cost fs-5">{`Total: $${order.cost}`}</li>
            <li className="order-total-cost-small fs-5">
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
}
