import React, { useState, useEffect } from 'react';
import { 
  Layout, Input, Button, Form, DatePicker, Card, Timeline, 
  Badge, message, Typography
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, SaveOutlined, 
  ClockCircleOutlined, CheckCircleOutlined, 
  TruckOutlined, HistoryOutlined 
} from '@ant-design/icons';

import moment from 'moment';

// 解构组件
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const OrderTrack = () => {
  // 表单实例
  const [form] = Form.useForm();
  
  // 状态管理
  const [trackData, setTrackData] = useState([]);
  const [isDelivered, setIsDelivered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [searchedTrackData, setSearchedTrackData] = useState([]);
  const [searchedOrderId, setSearchedOrderId] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  
  // 初始数据
  const initialTrackData = [];
  
  // 初始化数据
  useEffect(() => {
    // 从localStorage获取数据或使用初始数据
    const savedTracks = localStorage.getItem('orderTracks');
    const savedStatus = localStorage.getItem('orderDelivered');
    
    if (savedTracks) {
      setTrackData(JSON.parse(savedTracks));
    } else {
      setTrackData(initialTrackData);
      localStorage.setItem('orderTracks', JSON.stringify(initialTrackData));
    }
    
    if (savedStatus) {
      setIsDelivered(savedStatus === 'true');
    }
    
    // 表单初始值设置为当前时间
    form.setFieldsValue({
      time: moment()
    });
  }, [form]);
  
  // 提交新轨迹
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        // 格式化时间
        const formattedTime = values.time.format('YYYY-MM-DD HH:mm:ss');
        
        // 创建新轨迹
        const newTrack = {
          time: formattedTime,
          desc: values.desc
        };
        
        let updatedTracks;
        
        if (searchedOrderId) {
          // 如果正在查看特定订单的轨迹，更新该订单的轨迹
          updatedTracks = [newTrack, ...searchedTrackData];
          setSearchedTrackData(updatedTracks);
          
          // 保存到localStorage，使用特定订单ID的key
          const orderTracksKey = `orderTracks_${searchedOrderId}`;
          localStorage.setItem(orderTracksKey, JSON.stringify(updatedTracks));
          
          // 更新订单状态为"运输中"(状态码9)
          updateOrderStatus(searchedOrderId, '9');
        } else {
          // 否则更新默认轨迹数据
          updatedTracks = [newTrack, ...trackData];
          setTrackData(updatedTracks);
          localStorage.setItem('orderTracks', JSON.stringify(updatedTracks));
        }
        
        // 重置表单
        form.resetFields(['desc']);
        form.setFieldsValue({
          time: moment()
        });
        
        // 显示成功消息
        message.success('轨迹添加成功');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  // 确认订单送达
  const confirmDelivery = () => {
    if (isDelivered) {
      message.info('订单已处于送达状态');
      return;
    }
    
    // 创建送达轨迹
    const deliveredTrack = {
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      desc: '【系统通知】 订单已送达，交易完成'
    };
    
    let updatedTracks;
    
    if (searchedOrderId) {
      // 如果正在查看特定订单的轨迹，更新该订单的轨迹
      updatedTracks = [deliveredTrack, ...searchedTrackData];
      setSearchedTrackData(updatedTracks);
      setIsDelivered(true);
      
      // 保存到localStorage，使用特定订单ID的key
      const orderTracksKey = `orderTracks_${searchedOrderId}`;
      localStorage.setItem(orderTracksKey, JSON.stringify(updatedTracks));
      localStorage.setItem(`orderDelivered_${searchedOrderId}`, 'true');
      
      // 更新订单状态为"已送达"(状态码10)
      updateOrderStatus(searchedOrderId, '10');
    } else {
      // 否则更新默认轨迹数据
      updatedTracks = [deliveredTrack, ...trackData];
      setTrackData(updatedTracks);
      setIsDelivered(true);
      
      // 保存到localStorage
      localStorage.setItem('orderTracks', JSON.stringify(updatedTracks));
      localStorage.setItem('orderDelivered', 'true');
    }
    
    // 显示成功消息
    message.success('订单已标记为送达状态');
  };
  
  // 更新订单状态的通用函数
  const updateOrderStatus = (orderId, status) => {
    // 更新Order页面的订单数据
    const orderData = JSON.parse(localStorage.getItem('orderData') || '[]');
    const updatedOrderData = orderData.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: status
        };
      }
      return order;
    });
    localStorage.setItem('orderData', JSON.stringify(updatedOrderData));
    
    // 如果是MyOrder页面，也更新对应的数据
    // 注意：MyOrder和Order使用相同的数据源，所以这一步已经完成
    // 如果MyOrder有独立的数据源，也需要在这里更新
  };
  
  // 搜索订单
  const searchOrder = () => {
    setSearchPerformed(true);
    setOrderFound(false);
    
    if (!orderId.trim()) {
      setSearchedOrderId('');
      setSearchedTrackData([]);
      return;
    }

    // 从localStorage获取所有订单数据
    const savedOrders = localStorage.getItem('orderData');
    let orders = [];
    
    if (savedOrders) {
      try {
        orders = JSON.parse(savedOrders);
      } catch (e) {
        console.error('解析订单数据出错:', e);
      }
    }

    // 检查订单是否存在
    const foundOrder = orders.find(order => order.id === orderId.trim());
    
    if (foundOrder) {
      setOrderFound(true);
      // 如果找到订单，加载该订单的轨迹信息
      const orderTracksKey = `orderTracks_${orderId.trim()}`;
      const savedTracks = localStorage.getItem(orderTracksKey);
      const savedStatus = localStorage.getItem(`orderDelivered_${orderId.trim()}`);
      
      if (savedTracks) {
        setSearchedTrackData(JSON.parse(savedTracks));
        setSearchedOrderId(orderId.trim());
        setIsDelivered(savedStatus === 'true');
        message.success(`找到订单 ID: ${orderId.trim()} 的轨迹信息`);
      } else {
        // 如果没有轨迹信息，使用初始数据
        setSearchedTrackData(initialTrackData);
        setSearchedOrderId(orderId.trim());
        setIsDelivered(false);
      }
    } else {
      setSearchedOrderId(orderId.trim());
      setSearchedTrackData([]);
      message.error(`无相关包裹`);
    }
  };
  
  // 按时间排序轨迹（最新的在前）
  const displayTracks = searchedOrderId ? searchedTrackData : trackData;
  const sortedTracks = [...displayTracks].sort((a, b) => {
    return new Date(b.time) - new Date(a.time);
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TruckOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>订单轨迹管理系统</Title>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="请输入订单ID搜索"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300, marginRight: 10 }}
              onPressEnter={searchOrder}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={searchOrder}>
              搜索
            </Button>
          </div>
        </div>
      </Header>
      
      {/* 主内容区 */}
      <Content style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* 左侧：新增轨迹表单 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PlusOutlined style={{ marginRight: '5px' }} />
                新增订单轨迹
              </div>
            }
            style={{ flex: 1, minWidth: '300px', maxWidth: '350px' }}
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Item
              style={{ margin: '10px' }}
                name="time"
                label="时间"
                rules={[{ required: true, message: '请选择时间' }]}
              >
                <DatePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm:ss" 
                  style={{ width: '100%' }}
                />
              </Item>
              
              <Item
              style={{ margin: '10px' }}
                name="desc"
                label="描述"
                rules={[{ required: true, message: '请输入轨迹描述' }]}
              >
                <Input.TextArea 
                  rows={4} 
                  style={{ height: '300px' }}
                  placeholder="例如：【山东省东营市公司】 已收入"
                />
              </Item>
              
              <Item>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSubmit}
                  style={{ width: '90%' ,padding: '20px 0'}}
                >
                  保存轨迹
                </Button>
              </Item>
            </Form>
          </Card>
          
          {/* 右侧：轨迹列表 */}
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryOutlined style={{ marginRight: '5px' }} />
                  {searchedOrderId ? `订单 ${searchedOrderId} 轨迹记录` : '订单轨迹记录'}
                </div>
                
                <Badge 
                  status={isDelivered ? "success" : "processing"} 
                  text={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {isDelivered ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                      <span style={{ marginLeft: '5px' }}>
                        {isDelivered ? '已送达' : '运输中'}
                      </span>
                    </span>
                  } 
                />
              </div>
            }
            style={{ flex: 2, minWidth: '300px' }}
          >
            <div style={{ 
              marginTop: '20px', 
              position: 'relative',
              paddingLeft: '20px',
              borderLeft: '2px solid #e8e8e8'
            }}>
              {!searchPerformed ? (
                // 未进行搜索时显示提示
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  请输入完整订单ID
                </div>
              ) : searchedOrderId && !orderFound ? (
                // 搜索了但没有匹配的订单
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  无相关包裹
                </div>
              ) : searchedOrderId && orderFound && sortedTracks.length === 0 ? (
                // 找到订单但没有轨迹信息
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  此包裹暂时未更新轨迹
                </div>
              ) : sortedTracks.length > 0 ? (
                // 显示轨迹数据
                sortedTracks.map((track, index) => (
                  <div key={index} style={{ 
                    marginBottom: '20px',
                    position: 'relative',
                    paddingLeft: '20px'
                  }}>
                    {/* 时间点 */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-30px',
                        top: '0',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? '#1890ff' : '#d9d9d9',
                        border: index === 0 ? '2px solid #1890ff' : '2px solid #d9d9d9',
                        boxShadow: index === 0 ? '0 0 0 2px rgba(24, 144, 255, 0.3)' : 'none'
                      }}
                    />
                    
                    {/* 轨迹信息 */}
                    <div style={{ 
                      width: '95%',
                      padding: '10px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <Text type="secondary">{track.time}</Text>
                      <div style={{ marginTop: '5px' }}>{track.desc}</div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </Card>
        </div>
      </Content>
      
      {/* 底部按钮区 */}
      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #e8e8e8' }}>
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          onClick={confirmDelivery}
          disabled={isDelivered}
          size="large"
          style={{ padding: '8px 30px' }}
        >
          确认订单已送达
        </Button>
      </Footer>
    </Layout>
  );
};

export default OrderTrack;