import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../component/login/login";
import PrivateRoute from "../component/PrivateRoute"; 
import User from "../pages/user/User";
import Coupon from "../pages/Coupon/Coupon";
import Order from "../pages/Order/Order";
import Package from "../pages/Package/Package";
import CreateOrder from "../pages/CreateOrder/createOrder";
import MyOrder from "../pages/CreateOrder/MyOrder";
import OrderTrack from "../pages/Order/OrderTrack"; 
import Message from "../pages/Message/Message";
import AddressManagement from "../pages/addressManagement/addressManagement";
import Statistics from "../pages/statistics/Statistics";
import WordOrder from "../pages/WordOrder/WordOrder";
const routers = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Main />,
        children: [
          { path: 'User', element: <User /> } ,
          { path: 'Coupon', element: <Coupon /> } ,
          { path: 'Order', element: <Order /> } ,
          { path: 'Package', element: <Package /> } ,
          { path: 'CreateOrder', element: <CreateOrder /> } ,
          { path: 'MyOrder', element: <MyOrder /> } ,
          { path: 'OrderTrack', element: <OrderTrack /> } ,
          { path: 'addressManagement', element: <AddressManagement /> } ,
          { path: 'Message', element: <Message /> },
          { path: 'Statistics', element: <Statistics /> },
          { path: 'WordOrder', element: <WordOrder /> },
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <Login /> 
  }
];


export default createBrowserRouter(routers);