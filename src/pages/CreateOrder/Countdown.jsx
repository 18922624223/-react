// CountDown.jsx
import React, { useState, useEffect, useRef } from 'react';

const CountDown = ({ onReminderClick, onCountdownEnd }) => {
  const [countdown, setCountdown] = useState(300); // 5分钟 = 300秒
  const countdownRef = useRef(null);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // 倒计时结束
            if (onCountdownEnd) {
              onCountdownEnd();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // 清理函数
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [countdown, onCountdownEnd]);

  // 格式化倒计时显示
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 如果倒计时结束，不渲染组件
  if (countdown <= 0) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#ff4d4f',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }} 
      onClick={onReminderClick}
    >
      <span style={{ marginRight: '10px' }}>❗❗❗ 你有订单未支付</span>
      <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
        {formatCountdown(countdown)}
      </span>
    </div>
  );
};

export default CountDown;