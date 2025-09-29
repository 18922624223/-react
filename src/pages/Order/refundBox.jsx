// src/pages/Order/refundBox.jsx
import React from 'react';
import { Modal, Button, message } from 'antd';
import { PayCircleOutlined } from '@ant-design/icons';

const RefundBox = ({ 
  visible, 
  paidAmount, 
  actualAmount, 
  onOk, 
  onCancel 
}) => {
  const refundAmount = (paidAmount - actualAmount).toFixed(2);

  return (
    <Modal
      visible={visible}
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PayCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          退差提醒
        </div>
      }
      onCancel={onCancel}
      centered
      width={500}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel} className="form-input">
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          style={{ width: '100%', marginTop: '10px' }}
          onClick={onOk}
          className="pay-button"
        >
          确定
        </Button>
      ]}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>
          一小时内退差金额将返回原账户，请注意查收。
        </div>
        <div style={{ fontSize: '24px', color: '#f50', fontWeight: 'bold', marginBottom: '16px' }}>
          ¥{refundAmount} 元
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          退款将在1小时内原路返回至原支付账户
        </div>
      </div>
    </Modal>
  );
};

export default RefundBox;