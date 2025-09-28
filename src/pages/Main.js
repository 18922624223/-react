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

  const handleMenuClick = ({ key }) => {
    switch(key) {
      case '3': // 个人主页
        navigate('/User');
        break;
      case '6': // 订单信息管理
        navigate('/Order');
        break;
      case '23': // 订单轨迹管理
        navigate('/Order');
        break;
      case '21': // 用户订单管理
        navigate('/MyOrder');
        break;
      case '22': // 创建订单
        navigate('/CreateOrder');
        break;
      case '9': // 优惠券
        navigate('/Coupon');
        break;

      case '11': // 订单总览
        navigate('/home');
        break;
      default:
        break;
    }
  };

  // 修改后的 items2 - 使用具体的文字
  const items2 = [
    {
      key: '2',
      icon: React.createElement(UserOutlined),
      label: '用户管理',
      children: [
        { key: '3', label: '个人主页' },
        { key: '4', label: '退出登录' },
      ]
    },
    {
      key: '5',
      icon: React.createElement(AppstoreAddOutlined),
      label: '订单快递信息',
      children: [
        { key: '6', label: '订单信息管理' },
        { key: '23', label: '设置订单轨迹' },
      ]
    },
    {
      key: '8',
      icon: React.createElement(LaptopOutlined),
      label: '用户订单管理',
      children: [
        { key: '21', label: '用户订单' },
        { key: '22', label: '创建订单' },
        { key: '7', label: '地址管理' },
      ]

    },
    {
      key: '9',
      icon: React.createElement(DollarOutlined),
      label: '优惠券',
    },
    {
      key: '10',
      icon: React.createElement(PieChartOutlined),
      label: '数据看板',
      children: [
        { key: '11', label: '订单总览' },
        { key: '12', label: '最近收货统计' },
        { key: '13', label: '三方余额统计' },
        { key: '14', label: '订单数据统计' },
      ]
    },
    {
      key: '15',
      icon: React.createElement(CalendarOutlined),
      label: '工单',
    },
    {
      key: '16',
      icon: React.createElement(CommentOutlined),
      label: '消息中心',
      children: [
        { key: '17', label: '消息状态更新' },
        { key: '18', label: '最近收货统计' },
        { key: '19', label: '三方余额统计询' },
        { key: '20', label: '消息列表获取' },
      ]
    },
    {
      key: '1',
      icon: React.createElement(SettingOutlined),
      label: '系统配置',
    }
  ];

  const UpperFloatButton = () => (
    <div>
      <FloatButton.BackTop />
    </div>
  );

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
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
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
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