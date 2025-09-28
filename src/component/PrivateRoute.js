// src/component/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api/Token';
import { checkToken } from '../api/AxiosRequest';
import { useState, useEffect } from 'react';
import { Alert, Flex, Spin } from 'antd';

// 改进的加载画面
const App = () => (
  <Flex 
    justify="center" 
    align="center" 
    style={{ 
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 1000
    }}
  >
    <Flex vertical align="center" gap="large">
      <Spin 
        size="large"
        tip="加载中..."
        style={{ 
          fontSize: '18px',
          color: '#1677ff'
        }}
        indicator={
          <div style={{ 
            width: 48, 
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              viewBox="0 0 1024 1024" 
              focusable="false" 
              data-icon="loading" 
              width="48" 
              height="48" 
              fill="#1677ff"
              style={{
                animation: 'loadingCircle 1s infinite linear'
              }}
            >
              <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
            </svg>
          </div>
        }
      />
      <style>
        {`
          @keyframes loadingCircle {
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Flex>
  </Flex>
);

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState(''); 

  useEffect(() => {
    const token = getToken(); 
    if (token) {
      checkToken().then(res => {
        setIsValid(res.code === 200); 
      }).catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setIsValid(false);
        } else {
          setError('验证失败，请重试');
          setIsValid(false);
        }
      });
    } else {
      setIsValid(false);
    }
  }, []); 
  
  if (isValid === null) 
    return <App />; 
  
  // 验证通过则显示子路由(main)，否则跳转到登录页
  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;