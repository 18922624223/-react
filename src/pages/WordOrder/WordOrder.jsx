import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Statistic, Row, Col, Input, Select, Button, 
  Modal, Form, Checkbox, Pagination, Alert, Space, Tag, 
  Spin, Empty, message, Typography, Layout, Radio 
} from 'antd';
import { 
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  FileTextOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined,
  InfoCircleOutlined, ExclamationTriangleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const App = () => {
  // 状态管理
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    trackId: '',
    status: 0
  });
  const [visible, setVisible] = useState(false);
  const [currentApproval, setCurrentApproval] = useState(null);
  const [form] = Form.useForm();
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [detailVisible, setDetailVisible] = useState(false);

  // 获取审批列表数据
  const fetchApprovalList = async () => {
    try {
      setLoading(true);
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模拟数据
      const totalCount = 28;
      const filteredData = [];
      
      for (let i = 1; i <= totalCount; i++) {
        // 随机状态
        let itemStatus = 1; // 待处理
        if (i % 3 === 0) itemStatus = 2; // 已批准
        if (i % 5 === 0) itemStatus = -1; // 已拒绝
        
        // 状态筛选
        if (searchParams.status !== 0 && itemStatus !== searchParams.status) continue;
        
        // 工单编号筛选
        const itemTrackId = `WY20230${i}${Math.floor(Math.random() * 10000000000)}`;
        if (searchParams.trackId && !itemTrackId.includes(searchParams.trackId)) continue;
        
        filteredData.push({
          id: i,
          trackId: itemTrackId,
          type: Math.floor(Math.random() * 4) + 1,
          status: itemStatus,
          applyRemark: i % 4 === 0 ? '' : `这是第${i}条审批的申请备注信息`,
          createAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      // 分页处理
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      
      setApprovals(paginatedData);
      setTotal(filteredData.length);
      
      // 更新统计数据
      const pending = filteredData.filter(item => item.status === 1).length;
      const approved = filteredData.filter(item => item.status === 2).length;
      const rejected = filteredData.filter(item => item.status === -1).length;
      
      setStatistics({
        pending,
        approved,
        rejected,
        total: filteredData.length
      });
      
    } catch (error) {
      console.error('获取审批列表失败:', error);
      message.error('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchApprovalList();
  }, [currentPage, pageSize, searchParams]);

  // 搜索处理
  const handleSearch = (values) => {
    setSearchParams({
      trackId: values.trackId || '',
      status: values.status || 0
    });
    setCurrentPage(1); // 重置到第一页
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      trackId: '',
      status: 0
    });
    setCurrentPage(1);
  };

  // 打开处理模态框
  const handleProcess = (record) => {
    setCurrentApproval(record);
    form.setFieldsValue({
      processStatus: 2,
      processRemark: '',
      returnCoupon: false
    });
    setVisible(true);
  };

  // 查看详情
  const handleViewDetail = (record) => {
    setCurrentApproval(record);
    setDetailVisible(true);
  };

  // 提交审批处理
  const handleSubmitProcess = async () => {
    if (!currentApproval) return;
    
    try {
      const values = await form.validateFields();
      // 模拟API提交
      await new Promise(resolve => setTimeout(resolve, 500));
      
      message.success('审批处理成功');
      setVisible(false);
      fetchApprovalList(); // 重新加载列表
    } catch (error) {
      console.error('提交审批失败:', error);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取审批类型文本
  const getApprovalTypeText = (type) => {
    const types = {
      1: '退款申请',
      2: '取消订单',
      3: '修改信息',
      4: '其他申请'
    };
    return types[type] || `类型 ${type}`;
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="orange">待处理</Tag>;
      case 2:
        return <Tag color="green">已批准</Tag>;
      case -1:
        return <Tag color="red">已拒绝</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '工单编号',
      dataIndex: 'trackId',
      key: 'trackId',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getApprovalTypeText(type)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (time) => formatDate(time)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 1 && (
            <Button 
              color="primary" 
              variant="solid" 
              size="small" 
              onClick={() => handleProcess(record)}
              style={{ padding: '15px 18px' }}
            >
              处理
            </Button>
          )}
          <Button 
            color="primary" 
            variant="outlined" 
            size="small" 
            onClick={() => handleViewDetail(record)}
            style={{ padding: '15px 18px' }}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#F2F3F5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
  
          {/* 筛选和搜索区域 */}
          <Card style={{ marginBottom: '24px' }}>
            <Form 
              layout="inline" 
              onFinish={handleSearch} 
              initialValues={searchParams}
              style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}
            >
              <FormItem name="trackId" label="工单编号" style={{ marginLeft: '16px', marginRight: '16px' }}>
                <Input placeholder="请输入工单编号" style={{ width: 200 }} />
              </FormItem>
              <FormItem name="status" label="审批状态" style={{ marginRight: '16px' }}>
                <Select style={{ width: 150 }} placeholder="全部状态">
                  <Option value={0}>全部状态</Option>
                  <Option value={1}>待处理</Option>
                  <Option value={2}>已批准</Option>
                  <Option value={-1}>已拒绝</Option>
                </Select>
              </FormItem>
              <FormItem style={{ marginRight: '8px' }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </FormItem>
              <FormItem>
                <Button htmlType="button" onClick={handleReset}>
                  重置
                </Button>
              </FormItem>
            </Form>
          </Card>
          
          {/* 审批列表 */}
          <Card>
            <Table
              columns={columns}
              dataSource={approvals}
              rowKey="id"
              loading={loading}
              pagination={false}
              locale={{ emptyText: <Empty description="没有找到匹配的审批记录" /> }}
            />
            
            {/* 分页控件 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </Card>
        </div>
      </Content>
      
      {/* 处理审批模态框 */}
      <Modal
        title="处理审批"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitProcess}>
            提交审批
          </Button>
        ]}
      >
        {currentApproval && (
          <>
            <Text type="secondary" >工单编号: {currentApproval.trackId}</Text>
            <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
              <FormItem 
                name="processStatus" 
                label="审批状态" 
                rules={[{ required: true, message: '请选择审批状态' }]}
              >
                <RadioGroup>
                  <Radio.Button value={2}>批准</Radio.Button>
                  <Radio.Button value={-1}>拒绝</Radio.Button>
                </RadioGroup>
              </FormItem>
              <FormItem 
                name="processRemark" 
                label="审批备注" 
                rules={[{ required: true, message: '请输入审批备注' }]}
              >
                <Input.TextArea rows={3} placeholder="请输入审批备注信息" />
              </FormItem>
              <FormItem name="returnCoupon" valuePropName="checked">
                <Checkbox>退回优惠券</Checkbox>
              </FormItem>
            </Form>
          </>
        )}
      </Modal>
      
      {/* 详情弹窗 */}
      <Modal
        title="审批详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        destroyOnClose
      >
        {currentApproval && (
          <div>
            <Alert
              message="审批详情"
              description={`工单编号: ${currentApproval.trackId}`}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <div style={{ lineHeight: '1.8' }}>
              <p><Text strong>ID:</Text> {currentApproval.id}</p>
              <p><Text strong>类型:</Text> {getApprovalTypeText(currentApproval.type)}</p>
              <p><Text strong>状态:</Text> {getStatusTag(currentApproval.status)}</p>
              <p>
                <Text strong>申请备注:</Text> 
                <br />
                {currentApproval.applyRemark || '无'}
              </p>
              <p><Text strong>创建时间:</Text> {formatDate(currentApproval.createAt)}</p>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default App;