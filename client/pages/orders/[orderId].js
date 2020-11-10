import { useEffect, useState } from 'react';
import StripeCheckOut from 'react-stripe-checkout';
import UseRequest from '../../hooks/UseRequest';
import Router from 'next/router'
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors} = UseRequest({
    url: '/api/payments',
    method: 'post',
    body: {
        orderId: order.id
    },
    onSuccess: (payment) => Router.push('/orders')
    })
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
      
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if(timeLeft<0) {
      return <div>Order Expired</div>
  }
  return (<div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckOut 
      token={({id})=> doRequest({token: id})} 
      stripeKey="pk_test_51HkghvLN3ppIcdJdTuClpaQzF0W0bNcl9C8eCstwr3b57CWlLaWIzPWdzvSuQpGu0M8FzMusZj2ja7ndP8PavvP200ilgRauju"
      amount={order.ticket.price * 1000}
      email={currentUser.email}  />
      {errors}
      </div>);
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;