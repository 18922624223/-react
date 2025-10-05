import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Badge,
  Modal,
  Form,
  message,
  Tag,
} from 'antd';
import { ReadOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // ✅ CSS 文件导入放在最前面
const { Search } = Input;

// 模拟数据
const mockMessages = [
  {
    id: 1,
    title: "系统更新通知",
    source: "系统管理员",
    type: 1,
    typeName: "系统通知",
    level: 2,
    levelName: "重要",
    content: "系统将于2025年9月30日22:00-23:00进行例行维护，期间系统可能会出现短暂不可用，请提前做好准备。维护内容包括：1. 修复已知bug；2. 优化系统性能；3. 新增数据导出功能。",
    createTime: "2025-09-22 08:30:45",
    status: 0,
    statusName: "未读"
  },
  {
    id: 2,
    title: "用户反馈处理提醒",
    source: "客服部门",
    type: 2,
    typeName: "用户反馈",
    level: 1,
    levelName: "普通",
    content: "用户ID: U12345提交了一条反馈，内容如下：\"系统在导出Excel时偶尔会出现格式错乱的问题，请尽快修复。\"请相关负责人处理。",
    createTime: "2025-09-21 14:22:18",
    status: 2,
    statusName: "处理中"
  },
  {
    id: 3,
    title: "数据库连接异常警报",
    source: "监控系统",
    type: 4,
    typeName: "异常警报",
    level: 3,
    levelName: "紧急",
    content: "检测到主数据库连接异常，当前已自动切换至备用数据库。请立即检查主数据库状态。异常时间：2025-09-20 03:15:07，持续时间：约2分钟。",
    createTime: "2025-09-20 03:17:32",
    status: 3,
    statusName: "已处理"
  },
  {
    id: 4,
    title: "月度报表生成任务提醒",
    source: "任务调度",
    type: 3,
    typeName: "任务提醒",
    level: 1,
    levelName: "普通",
    content: "本月度报表生成任务将于2025-09-30 23:59自动执行，请确保相关数据已准备就绪。如需要调整生成时间，请在系统设置中修改。",
    createTime: "2025-09-19 10:00:00",
    status: 1,
    statusName: "已读"
  },
  {
    id: 5,
    title: "新用户注册通知",
    source: "用户系统",
    type: 1,
    typeName: "系统通知",
    level: 1,
    levelName: "普通",
    content: "新用户已注册，用户信息如下：用户名：zhangshan，邮箱：zhangshan@example.com，注册时间：2025-09-18 16:45:33。",
    createTime: "2025-09-18 16:46:05",
    status: 1,
    statusName: "已读"
  },
  {
    id: 6,
    title: "API调用频率超限警报",
    source: "监控系统",
    type: 4,
    typeName: "异常警报",
    level: 2,
    levelName: "重要",
    content: "检测到IP地址：192.168.1.100的API调用频率超过限制，当前已临时限制该IP的访问权限。超限时间：2025-09-17 09:23:15，超限次数：125次/分钟。",
    createTime: "2025-09-17 09:24:01",
    status: 3,
    statusName: "已处理"
  },
  {
    id: 7,
    title: "系统安全更新",
    source: "系统管理员",
    type: 1,
    typeName: "系统通知",
    level: 2,
    levelName: "重要",
    content: "系统将于2025-09-16 18:00进行安全更新，预计耗时30分钟。更新内容包括：1. 修复安全漏洞；2. 增强数据加密；3. 更新SSL证书。期间系统将无法访问，请提前做好安排。",
    createTime: "2025-09-15 11:30:00",
    status: 1,
    statusName: "已读"
  },
  {
    id: 8,
    title: "数据备份完成通知",
    source: "系统管理员",
    type: 1,
    typeName: "系统通知",
    level: 1,
    levelName: "普通",
    content: "系统数据备份已完成，备份时间：2025-09-15 02:00:00，备份文件大小：15.8GB，备份位置：云端存储。备份文件将保留30天。",
    createTime: "2025-09-15 02:35:12",
    status: 1,
    statusName: "已读"
  },
  {
    id: 9,
    title: "用户权限变更提醒",
    source: "权限管理",
    type: 1,
    typeName: "系统通知",
    level: 1,
    levelName: "普通",
    content: "用户ID: U67890的权限已变更，变更内容：1. 新增\"数据统计\"权限；2. 移除\"用户管理\"权限。变更时间：2025-09-14 15:20:33，操作人：admin。",
    createTime: "2025-09-14 15:21:05",
    status: 0,
    statusName: "未读"
  },
  {
    id: 10,
    title: "服务器磁盘空间不足警报",
    source: "监控系统",
    type: 4,
    typeName: "异常警报",
    level: 3,
    levelName: "紧急",
    content: "检测到服务器磁盘空间不足，当前使用率：92%。请立即清理不必要的文件或扩展磁盘空间。服务器名称：web-server-01，磁盘路径：/var/log。",
    createTime: "2025-09-13 08:45:17",
    status: 2,
    statusName: "处理中"
  },
  {
    id: 11,
    title: "新版本功能预告",
    source: "产品部门",
    type: 1,
    typeName: "系统通知",
    level: 1,
    levelName: "普通",
    content: "系统将于2025年10月15日发布v2.1版本，新增功能包括：1. 数据可视化仪表盘；2. 多语言支持；3. 移动端适配优化。详情请查看产品更新日志。",
    createTime: "2025-09-12 14:00:00",
    status: 0,
    statusName: "未读"
  },
  {
    id: 12,
    title: "用户登录异常提醒",
    source: "安全系统",
    type: 4,
    typeName: "异常警报",
    level: 2,
    levelName: "重要",
    content: "检测到用户admin的异常登录行为，登录时间：2025-09-11 23:15:47，登录IP：203.0.113.5，登录地点：未知。如非本人操作，请立即修改密码。",
    createTime: "2025-09-11 23:16:22",
    status: 3,
    statusName: "已处理"
  }
];

// 消息中心组件
const MessageCenter = () => {
  // 状态管理
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 初始化数据
  useEffect(() => {
    fetchMessages();
  }, []);

  // 确保filterMessages函数稳定
  const filterMessages = React.useCallback(() => {
    let result = [...messages];
    
    if (status) {
      result = result.filter(message => message.status.toString() === status);
    }
    
    if (type) {
      result = result.filter(message => message.type.toString() === type);
    }
    
    if (level) {
      result = result.filter(message => message.level.toString() === level);
    }
    
    if (searchText) {
      const text = searchText.toLowerCase();
      result = result.filter(message => 
        message.title.toLowerCase().includes(text) || 
        message.content.toLowerCase().includes(text) ||
        message.source.toLowerCase().includes(text)
      );
    }
    
    setFilteredMessages(result);
    setTotalCount(result.length);
    setCurrentPage(1);
  }, [messages, status, type, level, searchText]);

  // 筛选数据
  useEffect(() => {
    filterMessages();
  }, [filterMessages]);

  // 获取消息列表
  const fetchMessages = () => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      setMessages(mockMessages);
      setFilteredMessages(mockMessages);
      setTotalCount(mockMessages.length);
      setLoading(false);
    }, 500);
  };



  // 分页处理
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 选择行处理
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 查看消息详情
  const viewMessage = (record) => {
    setCurrentMessage(record);
    setVisible(true);
    
    // 如果消息未读，标记为已读
    if (record.status === 0) {
      updateMessageStatus(record.id, 1);
    }
  };

  // 更新消息状态
  const updateMessageStatus = (id, status, processDesc = '') => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const statusNames = ['未读', '已读', '处理中', '已处理'];
      const updatedMessages = messages.map(message => {
        if (message.id === id) {
          return {
            ...message,
            status,
            statusName: statusNames[status],
            processDesc: processDesc || message.processDesc
          };
        }
        return message;
      });
      
      setMessages(updatedMessages);
      
      // 如果当前有筛选条件，需要重新筛选
      if (status || type || level || searchText) {
        filterMessages();
      } else {
        setFilteredMessages(updatedMessages);
      }
      
      setLoading(false);
      message.success(`消息已${statusNames[status]}`);
    }, 500);
  };

  // 删除消息
  const deleteMessage = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const updatedMessages = messages.filter(message => message.id !== id);
          setMessages(updatedMessages);
          
          // 如果当前有筛选条件，需要重新筛选
          if (status || type || level || searchText) {
            filterMessages();
          } else {
            setFilteredMessages(updatedMessages);
            setTotalCount(updatedMessages.length);
          }
          
          // 从选中列表中移除
          setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
          
          setLoading(false);
          message.success('消息已删除');
        }, 500);
      }
    });
  };

  // 删除选中的消息
  const deleteSelectedMessages = () => {
    if (selectedRowKeys.length === 0) return;
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的${selectedRowKeys.length}条消息吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        
        // 模拟API请求
        setTimeout(() => {
          const updatedMessages = messages.filter(message => !selectedRowKeys.includes(message.id));
          setMessages(updatedMessages);
          
          // 如果当前有筛选条件，需要重新筛选
          if (status || type || level || searchText) {
            filterMessages();
          } else {
            setFilteredMessages(updatedMessages);
            setTotalCount(updatedMessages.length);
          }
          
          // 清空选中列表
          setSelectedRowKeys([]);
          
          setLoading(false);
          message.success(`已删除选中的${selectedRowKeys.length}条消息`);
        }, 500);
      }
    });
  };

  // 标记所有消息为已读
  const markAllRead = () => {
    setLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const updatedMessages = messages.map(message => {
        if (message.status === 0) {
          return {
            ...message,
            status: 1,
            statusName: '已读'
          };
        }
        return message;
      });
      
      setMessages(updatedMessages);
      
      // 如果当前有筛选条件，需要重新筛选
      if (status || type || level || searchText) {
        filterMessages();
      } else {
        setFilteredMessages(updatedMessages);
      }
      
      setLoading(false);
      message.success('所有消息已标记为已读');
    }, 500);
  };

  // 处理模态框表单提交
  const handleModalSubmit = () => {
    form.validateFields()
      .then(values => {
        const { status, processDesc } = values;
        updateMessageStatus(currentMessage.id, parseInt(status), processDesc);
        setVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 格式化状态标签
  const renderStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="red">未读</Tag>;
      case 1:
        return <Tag color="blue">已读</Tag>;
      case 2:
        return <Tag color="orange">处理中</Tag>;
      case 3:
        return <Tag color="green">已处理</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 格式化级别标签
  const renderLevelTag = (level) => {
    switch (level) {
      case 1:
        return <Tag color="green">普通</Tag>;
      case 2:
        return <Tag color="orange">重要</Tag>;
      case 3:
        return <Tag color="red">紧急</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: record.status === 0 ? 'bold' : 'normal' }}>{text}</span>
          {record.status === 0 && <Badge status="error" size="small" style={{ marginLeft: 8 }} />}
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName',
      render: (text) => <Tag>{text}</Tag>
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => renderLevelTag(level)
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => viewMessage(record)}>查看</Button>
          <Button type="text" icon={<ReadOutlined />} onClick={() => updateMessageStatus(record.id, 1)}>标记已读</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMessage(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  // 分页数据
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: totalCount,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`,
    onChange: handleTableChange
  };

  // 选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status === 3, // 已处理的消息不可选择
    })
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: 24,
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto'
      }}>
        <h1 style={{ marginBottom: 24 }}>消息中心</h1>
        
        {/* 操作栏 */}
        <div style={{ 
          marginBottom: 16, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <Button 
              type="primary" 
              onClick={markAllRead} 
              style={{ marginRight: 8 }}
              icon={<ReadOutlined />}
            >
              全部已读
            </Button>
            <Button 
              danger 
              onClick={deleteSelectedMessages} 
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
            >
              删除选中
            </Button>
          </div>
          <div>
            <Search
              placeholder="搜索消息..."
              allowClear
              enterButton="搜索"
              size="middle"
              style={{ width: 300 }}
              onSearch={(value) => setSearchText(value)}
            />
          </div>
        </div>
        
        {/* 筛选栏 */}
        <div style={{ 
          marginBottom: 16, 
          padding: 16, 
          backgroundColor: '#f9fafb', 
          borderRadius: 8 
        }}>
          <Space size="middle">
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              value={status}
              onChange={(value) => setStatus(value)}
              allowClear
            >
              <Select.Option value="0">未读</Select.Option>
              <Select.Option value="1">已读</Select.Option>
              <Select.Option value="2">处理中</Select.Option>
              <Select.Option value="3">已处理</Select.Option>
            </Select>
            
            <Select
              placeholder="选择类型"
              style={{ width: 120 }}
              value={type}
              onChange={(value) => setType(value)}
              allowClear
            >
              <Select.Option value="1">系统通知</Select.Option>
              <Select.Option value="2">用户反馈</Select.Option>
              <Select.Option value="3">任务提醒</Select.Option>
              <Select.Option value="4">异常警报</Select.Option>
            </Select>
            
            <Select
              placeholder="选择级别"
              style={{ width: 120 }}
              value={level}
              onChange={(value) => setLevel(value)}
              allowClear
            >
              <Select.Option value="1">普通</Select.Option>
              <Select.Option value="2">重要</Select.Option>
              <Select.Option value="3">紧急</Select.Option>
            </Select>
            
            <Button 
              onClick={() => {
                setStatus('');
                setType('');
                setLevel('');
                setSearchText('');
              }}
              icon={<ReloadOutlined />}
            >
              重置筛选
            </Button>
          </Space>
        </div>
        
        {/* 消息表格 */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: 8, 
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)'
        }}>
          <Table
            rowKey="id"
            dataSource={filteredMessages}
            columns={columns}
            rowSelection={rowSelection}
            pagination={pagination}
            loading={loading}
            bordered
          />
        </div>
        
        {/* 消息详情模态框 */}
        <Modal
          title={currentMessage?.title || '消息详情'}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={[
            <Button key="back" onClick={() => setVisible(false)}>关闭</Button>,
            <Button key="submit" type="primary" onClick={handleModalSubmit}>
              保存
            </Button>
          ]}
          width={700}
        >
          {currentMessage && (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: currentMessage.status.toString(),
                processDesc: currentMessage.processDesc || ''
              }}
            >
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="0">未读</Select.Option>
                  <Select.Option value="1">已读</Select.Option>
                  <Select.Option value="2">处理中</Select.Option>
                  <Select.Option value="3">已处理</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="processDesc" label="处理说明">
                <Input.TextArea rows={4} placeholder="请输入处理说明..." />
              </Form.Item>
              
              <div style={{ marginTop: 20 }}>
                <p><strong>来源：</strong>{currentMessage.source}</p>
                <p><strong>类型：</strong>{currentMessage.typeName}</p>
                <p><strong>级别：</strong>{currentMessage.levelName}</p>
                <p><strong>发送时间：</strong>{currentMessage.createTime}</p>
                <p style={{ marginTop: 16 }}><strong>消息内容：</strong></p>
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: 16, 
                  borderRadius: 4, 
                  whiteSpace: 'pre-line',
                  marginTop: 8
                }}>
                  {currentMessage.content}
                </div>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MessageCenter;
