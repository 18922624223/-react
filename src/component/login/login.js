import React, { useState, useEffect } from "react";
import './login.css';
import { loginValidate, checkToken } from '../../api/AxiosRequest';
import { setToken, getToken, removeToken } from '../../api/Token'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkStoredToken = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const res = await checkToken();
          if (res.code === 200) {
            setTimeout(() => {
              navigate('/home');
            }, 3000);
          } else {
            removeToken(); 
          }
        } catch (err) {
          console.error('Token验证失败：', err);
          removeToken();
        }
      }
    };

    checkStoredToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      const res = await loginValidate({ username, password });
      
      if (res.code === 200 && res.data?.token) {
        // 存储token到localStorage
        setToken(res.data.token);
        console.log('登录成功，token已存储');
        navigate('/home');
      } else {
        setError(res.msg || '登录失败，请重试');
      }
    } catch (err) {
      setError('网络异常，请稍后再试');
      console.error('登录请求失败：', err);
    }
  };

  // 保持原有的return部分不变
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">
          <span>用户登录</span>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-item">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="login-form-item">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            登录
          </button>
        </form>
        <div className="login-footer">
          <p>还没有账号？<a href="#" className="register-link">立即注册</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;