import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// 获取挂载点
root.render(
  <React.StrictMode>
    <App />
    {/* App.js组件渲染 */}
  </React.StrictMode>
);
reportWebVitals();
