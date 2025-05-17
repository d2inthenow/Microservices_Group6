// import axios from "axios";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (data) => {
      window.location.href = data.url; // redirect đến trang thanh toán Stripe
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    //stripe checkout component
    // <div>
    //   Time left to pay: {timeLeft} seconds
    //   <StripeCheckout
    //     token={({ id }) => doRequest({ token: id })}
    //     stripeKey="pk_test_51RPHfA4RYmlZFhQlq6Rt7bGHJ3U4ksBuyy8gJbmSps2FZODCfgU5SD8AJRHsOCYiX5jPmd9Y2QfiznKCeaJ4m8iL00KssfvYzY"
    //     amount={order.ticket.price * 100}
    //     email={currentUser.email}
    //   />
    //   {errors}
    // </div>

    //stripe checkout session
    <div>
      <h4>Time left to pay: {timeLeft} seconds</h4>
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Pay with Stripe
      </button>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
