// src/pages/Main.js
import React from 'react';
import { LaptopOutlined, UserOutlined, PieChartOutlined, MenuOutlined, AppstoreAddOutlined, CommentOutlined, CalendarOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { FloatButton } from 'antd';

const { Header, Content, Sider } = Layout;

// 定义导航菜单项
const items1 = ['1'].map(key => ({
  key,
  label: `快递管理系统`,
  icon: React.createElement(MenuOutlined),
}));

const Main = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();

  // 修改后的 items2 - 使用具体的文字
  const items2 = [
    {
      key: '1',
      icon: React.createElement(AppstoreAddOutlined),
      label: '订单快递信息',
      children: [
        { key: '2', label: '订单信息管理' },
        { key: '3', label: '设置订单轨迹' },
      ]
    },
    {
      key: '4',
      icon: React.createElement(LaptopOutlined),
      label: '用户订单管理',
      children: [
        { key: '5', label: '用户订单' },
        { key: '6', label: '创建订单' },
        { key: '7', label: '地址管理' },
      ]
    },
    {
      key: '8',
      icon: React.createElement(DollarOutlined),
      label: '优惠券',
    },
    {
      key: '9',
      icon: React.createElement(PieChartOutlined),
      label: '数据看板',
    },
    {
      key: '10',
      icon: React.createElement(CalendarOutlined),
      label: '工单',
    },
    {
      key: '11',
      icon: React.createElement(CommentOutlined),
      label: '消息中心',
    },
    {
      key: '12',
      icon: React.createElement(UserOutlined),
      label: '用户管理',
      children: [
        { key: '13', label: '个人主页' },
        { key: '14', label: '退出登录' },
      ]
    },
  ];

  const handleMenuClick = ({ key }) => {
    switch(key) {
      case '1': // 订单快递信息
        // navigate to order info page
        break;
      case '2': // 订单信息管理
        navigate('/Order');
        break;
      case '3': // 设置订单轨迹
        navigate('/OrderTrack');
        break;
      case '4': // 用户订单管理
        // navigate to user order management page
        break;
      case '5': // 用户订单
        navigate('/MyOrder');
        break;
      case '6': // 创建订单
        navigate('/CreateOrder');
        break;
      case '7': // 地址管理
        navigate('/AddressManagement');
        break;
      case '8': // 优惠券
        navigate('/Coupon');
        break;
      case '9': // 数据看板
        navigate('/Statistics');
        break;
      case '10': // 工单
        navigate('/WordOrder');
        break;
      case '11': // 消息中心
        navigate('/Message');
        break;
      case '12': // 用户管理
        // navigate to user management page
        break;
      case '13': // 个人主页
        navigate('/User');
        break;
      case '14': // 退出登录
        localStorage.removeItem('token');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const UpperFloatButton = () => (
    <div>
      <FloatButton.BackTop />
    </div>
  );

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          marginLeft: '16px',
          fontFamily: 'Arial, sans-serif', // 固定字体
          userSelect: 'none', // 防止选中
          cursor: 'default',   // 去掉鼠标指针变化
        }}>
          快递管理系统
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderInlineEnd: 0 }}
            items={items2}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: '100vh',
              height: 'auto'
            }}
          >
            <UpperFloatButton/>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;