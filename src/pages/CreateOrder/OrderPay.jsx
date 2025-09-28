import React from 'react';
import { Modal, Button } from 'antd';
import { PayCircleOutlined } from '@ant-design/icons';
import './OrderPay.css';
const OrderPay = ({ visible, totalMoney, onPay, onCancel }) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PayCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          订单支付确认
        </div>
      }
      open={visible}
      onCancel={onCancel}
      maskClosable={false} // 点击遮罩层不关闭弹窗
      footer={[
        <Button key="cancel" onClick={onCancel} className="form-input">
          取消
        </Button>,
        <Button 
        style={{width: '100%',marginTop: '10px'}}
          key="pay" 
          type="primary" 
          onClick={onPay}
          className="pay-button"
        >
          确认支付
        </Button>
      ]}
      centered
    >
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div style={{ 
          fontSize: '18px', 
          marginBottom: '24px',
          color: '#333'
        }}>
          订单支付金额
        </div>
        <div style={{ 
          fontSize: '28px', 
          color: '#f50', 
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          ¥{totalMoney || 0}元
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#666',
          padding: '0 20px'
        }}>
          请确认支付金额无误，支付完成后订单状态将更新为已支付
        </div>
      </div>
    </Modal>
  );
};

export default OrderPay;