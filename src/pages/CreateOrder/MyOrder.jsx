// src/pages/CreateOrder/MyOrder.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import './MyOrder.css';
import OrderPay from './OrderPay';

const MyOrder = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payRecord, setPayRecord] = useState(null);
  const [orderData, setOrderData] = useState(() => {
    const savedData = localStorage.getItem('orderData');
    return savedData ? JSON.parse(savedData) : [
      {
        key: '1',
        id: 'ORD001',
        name: '张三',
        platform: 'YD',
        companyId: 'CP001',
        priceStrategyId: 'PS100001',
        tag: '重要客户',
        tagcolor: 'blue',
        pagename: '首页推荐',
        type: '1',
        banOrder: '0',
        notice: '易碎品，轻拿轻放',
        status: '1',
        couponId: 'C001',
        trackId: 'TRK000001',
        uuid: 'uuid-001',
        ydId: 'YD001',
        channelId: 1001,
        expressId: 'EXP001',
        senderInfoId: 1,
        addressseeInfoId: 1,
        pickUpStartTime: '2024-01-01',
        pickUpEndTime: '2024-01-02',
        itemName: '食品',
        packageNum: 1,
        deliveryBusiness: '德邦快递',
        deliveryType: 'DOP',
        customerType: 'kd',
        senderInfo: {
          id: 1,
          uuid: 'sender-uuid-001',
          name: '发货人张三',
          phone: '13800138001',
          telephone: '010-12345678',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '北京市朝阳区建国路1号'
        },
        addressseeInfo: {
          id: 1,
          uuid: 'receiver-uuid-001',
          name: '收货人李四',
          phone: '13900139001',
          telephone: '010-87654321',
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          address: '上海市浦东新区陆家嘴金融中心'
        },
        express_info: {
          trackId: 'TRK000001',
          type: 1,
          weight: 1.5,
          volume: 0.5,
          length: 20,
          width: 15,
          height: 10,
          ratio: 6000,
          officalMoney: "15",
          totalMoney: "12.50",
          agentMoney: "1.00",
          profitMoney: "0.30"
        }
      },
      {
        key: '3',
        id: 'ORD003',
        name: '王五',
        platform: 'YD',
        companyId: 'CP003',
        priceStrategyId: 'PS100003',
        tag: '普通客户',
        tagcolor: 'gray',
        pagename: '搜索结果',
        type: '1',
        banOrder: '0',
        notice: '需补差价',
        status: '5', // 待补差
        couponId: 'C003',
        trackId: 'TRK000003',
        uuid: 'uuid-003',
        ydId: 'YD003',
        channelId: 1003,
        expressId: 'EXP003',
        senderInfoId: 3,
        addressseeInfoId: 3,
        pickUpStartTime: '2024-01-10',
        pickUpEndTime: '2024-01-11',
        itemName: '书籍',
        packageNum: 1,
        deliveryBusiness: '中通快递',
        deliveryType: 'DOP',
        customerType: 'kd',
        senderInfo: {
          id: 3,
          uuid: 'sender-uuid-003',
          name: '发货人王五',
          phone: '13800138003',
          telephone: '010-98765432',
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          address: '北京市海淀区上地十街'
        },
        addressseeInfo: {
          id: 3,
          uuid: 'receiver-uuid-003',
          name: '收货人赵六',
          phone: '13900139003',
          telephone: '010-87654321',
          province: '深圳市',
          city: '深圳市',
          district: '南山区',
          address: '深圳市南山区科技园'
        },
        express_info: {
          trackId: 'TRK000003',
          type: 1,
          weight: 1.0,
          volume: 0.3,
          length: 15,
          width: 10,
          height: 8,
          ratio: 6000,
          officalMoney: "10",
          totalMoney: "8.50",
          agentMoney: "1.00",
          profitMoney: "0.20"
        }
      }
    ];
  });

  // 监听 orderData 变化，自动保存到 localStorage
  useEffect(() => {
    localStorage.setItem('orderData', JSON.stringify(orderData));
  }, [orderData]);

  // 获取状态描述
  const getStatusText = (status) => {
    const statusMap = {
      '-5': '订单取消',
      '-4': '揽收取消',
      '-3': '已退款',
      '-2': '待退款',
      '-1': '订单异常',
      '0': '待支付',
      '1': '更换快递',
      '2': '已支付',
      '3': '待揽收',
      '4': '已揽收',
      '5': '待补差',
      '6': '待退差',
      '7': '已补差',
      '8': '已退差',
      '9': '运输中',
      '10': '已送达'
    };
    return statusMap[status] || '未知';
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '-5': 'red',
      '-4': 'red',
      '-3': 'green',
      '-2': 'blue',
      '-1': 'orange',
      '0': 'gray',
      '1': 'yellow',
      '2': 'cyan',
      '3': 'blue',
      '4': 'green',
      '5': 'blue',
      '6': 'blue',
      '7': 'green',
      '8': 'green',
      '9': 'orange',
      '10': 'green'
    };
    return colorMap[status] || 'default';
  };

  // 查看详情处理函数
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 关闭详情弹框
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentRecord(null);
  };

  // 取消订单处理函数
  const handleCancelOrder = (record) => {
    if (record.status === '-5') {
      message.warning('订单已经是取消状态！');
      return;
    }
    if (record.status === '10') {
      message.warning('订单已送达，无法取消！');
      return;
    }
    if (record.status === '-3') {
      message.warning('订单已退款，无法取消！');
      return;
    }

    const updatedData = orderData.map(item => {
      if (item.key === record.key) {
        return {
          ...item,
          status: '-5'
        };
      }
      return item;
    });

    setOrderData(updatedData);
    message.success(`订单 "${record.id}" 已取消`);
  };

  // 查看轨迹处理函数
  const handleViewTrack = (record) => {
    message.info(`查看订单 "${record.id}" 的物流轨迹`);
  };

  // 表格列配置
  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
// 在 MyOrder.jsx 中的 columns 数组中添加新的操作列
{
  title: '操作',
  key: 'action',
  render: (_, record) => (
    <>
      {/* 查看详情 */}
      <Button 
        type="default" 
        icon={<EyeOutlined />} 
        onClick={() => handleViewDetail(record)}
        style={{ marginRight: 30 }}
      >
        查看详情
      </Button>

      {/* 根据状态决定按钮 */}
      {record.status === '5' ? (
        // 待补差：显示“支付”按钮
        <Button
          type="primary"
          onClick={() => {
            setPayModalVisible(true);
            setPayRecord(record); // 保存当前记录用于支付
          }}
          style={{ marginRight: 30 }}
        >
          支付
        </Button>
      ) : (
        // 其他状态：显示“取消订单”
        <Popconfirm
          title="确定要取消这个订单吗？"
          onConfirm={() => handleCancelOrder(record)}
          okText="确定"
          cancelText="取消"
          disabled={record.status === '10' || record.status === '-5' || record.status === '-3'}
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            style={{
              marginRight: 30,
              backgroundColor: (record.status === '10' || record.status === '-5' || record.status === '-3') ? '#d9d9d9' : '#ff4d4f',
              borderColor: (record.status === '10' || record.status === '-5' || record.status === '-3') ? '#bfbfbf' : '#ff4d4f',
              color: (record.status === '10' || record.status === '-5' || record.status === '-3') ? '#999' : '#fff',
              cursor: (record.status === '10' || record.status === '-5' || record.status === '-3') ? 'not-allowed' : 'pointer'
            }}
            disabled={record.status === '10' || record.status === '-5' || record.status === '-3'}
          >
            取消订单
          </Button>
        </Popconfirm>
      )}

      <Button 
        type="default" 
        icon={<HistoryOutlined />} 
        onClick={() => handleViewTrack(record)}
      >
        查看轨迹
      </Button>
    </>
  ),
}
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>我的订单</h2>
      <Table 
        columns={columns} 
        dataSource={orderData} 
        pagination={false}
        rowKey="key"
      />

      {/* 详情弹框 */}
{/* 详情弹框 */}
<Modal
  title="订单详情"
  visible={detailVisible}
  onCancel={handleCloseDetail}
  footer={null}
  width={800}
>
  {currentRecord && (
    <Descriptions bordered column={2}>
      <Descriptions.Item label="订单ID" span={2}>{currentRecord.id}</Descriptions.Item>
      <Descriptions.Item label="客户名称">{currentRecord.name}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Tag color={getStatusColor(currentRecord.status)}>
          {getStatusText(currentRecord.status)}
        </Tag>
      </Descriptions.Item>
      {/* 其他字段... */}
    </Descriptions>
  )}
</Modal>

{/* 支付弹窗：补款支付 */}
<OrderPay
  visible={payModalVisible}
  totalMoney={{
    refundOrPay: payRecord?.refundOrPay,
    totalMoney: payRecord?.express_info?.totalMoney
  }}
  onPay={() => {
    message.success(`补款订单 ${payRecord.id} 支付成功`);

    const updatedData = orderData.map(item => {
      if (item.key === payRecord.key) {
        return {
          ...item,
          status: '7' // 已补差
        };
      }
      return item;
    });
    setOrderData(updatedData);

    // 同步更新原订单状态为“已揽收”
    const allOrders = JSON.parse(localStorage.getItem('orderData') || '[]');
    const updatedAllOrders = allOrders.map(order => {
      if (order.id && payRecord.id && order.id.replace('ORD-', '') === payRecord.id.replace('COMP-', '')) {
        return {
          ...order,
          status: '4'
        };
      }
      return order;
    });
    localStorage.setItem('orderData', JSON.stringify(updatedAllOrders));
    setPayModalVisible(false);
  }}
  onCancel={() => setPayModalVisible(false)}
/>


    </div>
  );
};

export default MyOrder;