import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarCircleOutlined, 
  RiseOutlined, 
  FallOutlined,
  UserOutlined,
  BoxPlotOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Statistics = () => {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  let lineChart = null;
  let pieChart = null;
  let barChart = null;

  // 模拟订单数据
  const orderData = {
    totalOrders: 1286,
    totalRevenue: 542000,
    todayOrders: 42,
    todayRevenue: 18600,
    growthRate: 12.6,
    customerCount: 865,
    avgOrderValue: 421.5
  };

  // 订单状态分布数据
  const orderStatusData = [
    { name: '待处理', value: 24, color: '#faad14' },
    { name: '配送中', value: 68, color: '#1890ff' },
    { name: '已完成', value: 1182, color: '#52c41a' },
    { name: '已取消', value: 12, color: '#ff4d4f' }
  ];

  // 商品销售排行数据
  const productSalesData = [
    { name: 'iPhone 14 Pro', sales: 128, revenue: 128000 },
    { name: 'MacBook Air M2', sales: 42, revenue: 420000 },
    { name: 'AirPods Pro', sales: 216, revenue: 32400 },
    { name: 'iPad mini', sales: 78, revenue: 39000 },
    { name: 'Apple Watch', sales: 96, revenue: 28800 }
  ];

  useEffect(() => {
    // 初始化折线图
    if (lineChartRef.current) {
      lineChart = echarts.init(lineChartRef.current);
      
      const lineOption = {
        title: {
          text: '近期订单趋势',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单量', '销售额'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月15日', '1月16日', '1月17日', '1月18日', '1月19日', '1月20日', '1月21日']
        },
        yAxis: [
          {
            type: 'value',
            name: '订单量',
            position: 'left'
          },
          {
            type: 'value',
            name: '销售额(元)',
            position: 'right'
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            smooth: true
          },
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 1,
            stack: '金额',
            data: [22000, 18200, 19100, 23400, 29000, 33000, 31000],
            smooth: true
          }
        ]
      };

      lineChart.setOption(lineOption);
    }

    // 初始化饼图
    if (pieChartRef.current) {
      pieChart = echarts.init(pieChartRef.current);
      
      const pieOption = {
        title: {
          text: '订单状态分布',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle'
        },
        series: [
          {
            name: '订单状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold',
                left:'30%'
              }
            },
            labelLine: {
              show: false
            },
            data: orderStatusData
          }
        ]
      };

      pieChart.setOption(pieOption);
    }

    // 初始化柱状图
    if (barChartRef.current) {
      barChart = echarts.init(barChartRef.current);
      
      const barOption = {
        title: {
          text: '热销商品排行',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: productSalesData.map(item => item.name)
        },
        series: [
          {
            name: '销量',
            type: 'bar',
            data: productSalesData.map(item => item.sales),
            itemStyle: {
              color: '#1890ff'
            }
          }
        ]
      };

      barChart.setOption(barOption);
    }

    // 响应窗口大小变化
    const handleResize = () => {
      lineChart && lineChart.resize();
      pieChart && pieChart.resize();
      barChart && barChart.resize();
    };

    window.addEventListener('resize', handleResize);

    // 组件卸载时清理
    return () => {
      window.removeEventListener('resize', handleResize);
      lineChart && lineChart.dispose();
      pieChart && pieChart.dispose();
      barChart && barChart.dispose();
    };
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f2f5' }}>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={orderData.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={orderData.totalRevenue}
              prefix={<DollarCircleOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={orderData.todayOrders}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={orderData.growthRate}
              prefix={orderData.growthRate > 0 ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
              valueStyle={{ color: orderData.growthRate > 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card>
            <div ref={lineChartRef} style={{ width: '100%', height: '400px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <div ref={pieChartRef} style={{ width: '100%', height: '400px' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          <Card>
            <div ref={barChartRef} style={{ width: '100%', height: '400px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>核心指标</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="客户数量"
                    value={orderData.customerCount}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="平均客单价"
                    value={orderData.avgOrderValue}
                    prefix={<BoxPlotOutlined />}
                    suffix="元"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="今日收入"
                    value={orderData.todayRevenue}
                    prefix={<DollarCircleOutlined />}
                    suffix="元"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="转化率"
                    value={32.5}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;