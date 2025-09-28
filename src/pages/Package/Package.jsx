// Package.js
import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message, Popconfirm, Form, Input, Select, DatePicker, Pagination } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import './Package.css';
import moment from 'moment';
import { Space } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const { Search } = Input;

const Package = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [packageData, setPackageData] = useState([
    {
      key: '1',
      name: '顺丰快递',
      company: '顺丰速运',
      size: '大件',
      platform: 'YD',
      companyId: '1',
      banOrder: '0',
      priceStrategyId: 'PSa1b2c3d4e5f6',
      type: '1',
      startTime: '2023-12-01',
      endTime: '2024-02-01'
    },
    {
      key: '2',
      name: '中通快递',
      company: '中通快递',
      size: '小件',
      platform: 'QBD',
      companyId: '2',
      banOrder: '1',
      priceStrategyId: 'PSa1b2c3d4e5f7',
      type: '1',
      startTime: '2023-11-01',
      endTime: '2023-12-31'
    },
    {
      key: '3',
      name: '德邦物流',
      company: '德邦物流',
      size: '超大件',
      platform: 'YD',
      companyId: '3',
      banOrder: '0',
      priceStrategyId: 'PSa1b2c3d4e5f8',
      type: '2',
      startTime: '2023-10-01',
      endTime: '2024-10-01'
    },
  ]);
  
  // 添加分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 3
  });

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  // 处理搜索
  const onSearch = (value) => {
    setSearchText(value);
    // 重置到第一页
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // 自定义搜索输入框
  const SearchInput = () => (
    <Space direction="vertical">
      <Search
        placeholder="包裹名称" 
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
    </Space>
  );

  // 计算当前页数据
  const getCurrentPageData = () => {
    // 先过滤数据
    const filteredData = searchText
      ? packageData.filter(item => item.name.includes(searchText))
      : packageData;
      
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  };

  // 获取过滤后的总数据量
  const getFilteredTotal = () => {
    return searchText
      ? packageData.filter(item => item.name.includes(searchText)).length
      : packageData.length;
  };

  // 表格列配置
  const columns = [
    {
      title: '包裹名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '快递公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '包裹大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform) => (
        <Tag color={platform === 'YD' ? 'blue' : 'green'}>
          {platform === 'YD' ? 'YD' : 'QBD'}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === '1' ? 'cyan' : 'orange'}>
          {type === '1' ? '快递' : '物流'}
        </Tag>
      ),
    },
    {
      title: '查看详情',
      key: 'view',
      render: (_, record) => (
        <Button 
          type="default" 
          icon={<EyeOutlined />} 
          style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
    {
      title: '修改',
      key: 'edit',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => handleEdit(record)}
        >
          修改
        </Button>
      ),
    },
    {
      title: '删除',
      key: 'delete',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这个包裹吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // 查看详情处理函数
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 修改处理函数
  const handleEdit = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      company: record.company,
      size: record.size,
      platform: record.platform,
      companyId: record.companyId,
      banOrder: record.banOrder,
      priceStrategyId: record.priceStrategyId,
      type: record.type,
      timeRange: [
        record.startTime ? moment(record.startTime) : null,
        record.endTime ? moment(record.endTime) : null
      ]
    });
    setEditVisible(true);
  };

  
  // 保存修改
  const handleSaveEdit = () => {
    editForm.validateFields().then(values => {
      const { timeRange, ...otherValues } = values;
      const updatedValues = {
        ...otherValues,
        startTime: timeRange && timeRange[0] ? timeRange[0].toISOString().split('T')[0] : '',
        endTime: timeRange && timeRange[1] ? timeRange[1].toISOString().split('T')[0] : ''
      };

      const updatedData = packageData.map(item => {
        if (item.key === currentRecord.key) {
          return {
            ...item,
            ...updatedValues
          };
        }
        return item;
      });

      setPackageData(updatedData);
      setEditVisible(false);
      message.success('包裹信息已更新');
      
      // 更新分页总数
      setPagination(prev => ({
        ...prev,
        total: updatedData.length
      }));
    }).catch(error => {
      console.log('验证失败:', error);
    });
  };

  // 删除处理函数
  const handleDelete = (record) => {
    const newData = packageData.filter(item => item.key !== record.key);
    setPackageData(newData);
    message.success(`包裹 "${record.name}" 已删除`);
    
    // 更新分页信息
    const filteredTotal = getFilteredTotal();
    const newTotal = filteredTotal - 1;
    const newCurrent = pagination.current > Math.ceil(newTotal / pagination.pageSize) 
      ? Math.max(1, Math.ceil(newTotal / pagination.pageSize)) 
      : pagination.current;
    
    setPagination(prev => ({
      ...prev,
      total: newTotal,
      current: newCurrent
    }));
  };

  // 关闭详情弹框
  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentRecord(null);
  };

  // 关闭编辑弹框
  const handleCloseEdit = () => {
    setEditVisible(false);
    setCurrentRecord(null);
    editForm.resetFields();
  };

  // 打开添加弹框
  const handleAdd = () => {
    setAddVisible(true);
  };

  // 保存添加
  const handleSaveAdd = () => {
    addForm.validateFields().then(values => {
      const { timeRange, ...otherValues } = values;
      const newValues = {
        ...otherValues,
        startTime: timeRange && timeRange[0] ? timeRange[0].toISOString().split('T')[0] : '',
        endTime: timeRange && timeRange[1] ? timeRange[1].toISOString().split('T')[0] : ''
      };

      const newKey = `${packageData.length + 1}`;
      const newId = `PS${Math.random().toString(36).substr(2, 16)}`;

      const newRecord = {
        key: newKey,
        priceStrategyId: newId,
        ...newValues
      };

      const newData = [...packageData, newRecord];
      setPackageData(newData);
      setAddVisible(false);
      addForm.resetFields();
      message.success('包裹添加成功');
      
      // 更新分页信息
      const filteredTotal = getFilteredTotal();
      const newTotal = filteredTotal + 1;
      setPagination(prev => ({
        ...prev,
        total: newTotal,
        current: Math.ceil(newTotal / prev.pageSize)
      }));
    }).catch(error => {
      console.log('验证失败:', error);
    });
  };

  // 关闭添加弹框
  const handleCloseAdd = () => {
    setAddVisible(false);
    addForm.resetFields();
  };

  // 格式化类型文本
  const getTypeText = (type) => {
    return type === '1' ? '快递' : '物流';
  };
  
  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // 重置搜索
  const handleReset = () => {
    setSearchText('');
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // 自定义表格行样式
  const getRowClassName = (record) => {
    if (searchText && record.name.includes(searchText)) {
      return 'highlight-row';
    }
    return '';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>包裹信息表</h2>
      <SearchInput/>
      <Button 
        type="default" 
        className='reset-button' 
        onClick={handleReset}
        icon={<UndoOutlined />} 
      >
        重置
      </Button>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        className='add-button'
        onClick={handleAdd}
      >
        添加
      </Button>
      <Table 
        columns={columns} 
        dataSource={getCurrentPageData()} 
        pagination={false}
        rowKey="key"
        rowClassName={getRowClassName}
      />
      
      {/* 分页组件 */}
      <Pagination
        style={{ marginTop: '20px', textAlign: 'center' }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={getFilteredTotal()}
        onChange={handlePageChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条记录`}
      />

      {/* 详情弹框 */}
      <Modal
        title="包裹详情"
        visible={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="策略ID">{currentRecord.priceStrategyId}</Descriptions.Item>
            <Descriptions.Item label="包裹名">{currentRecord.name}</Descriptions.Item>
            <Descriptions.Item label="快递公司">{currentRecord.company}</Descriptions.Item>
            <Descriptions.Item label="包裹大小">{currentRecord.size}</Descriptions.Item>
            <Descriptions.Item label="平台">
              <Tag color={currentRecord.platform === 'YD' ? 'blue' : 'green'}>
                {currentRecord.platform === 'YD' ? 'YD' : 'QBD'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={currentRecord.type === '1' ? 'cyan' : 'orange'}>
                {getTypeText(currentRecord.type)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="公司ID">{currentRecord.companyId}</Descriptions.Item>
            <Descriptions.Item label="是否禁用订单">{currentRecord.banOrder === '1' ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{currentRecord.startTime || '无'}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{currentRecord.endTime || '无'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 编辑弹框 */}
      <Modal
        title="编辑包裹"
        visible={editVisible}
        onOk={handleSaveEdit}
        onCancel={handleCloseEdit}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        {currentRecord && (
          <Form
            form={editForm}
            layout="vertical"
          >
            <Form.Item
              label="包裹名"
              name="name"
              rules={[{ required: true, message: '请输入包裹名' }]}
            >
              <Input placeholder="请输入包裹名" />
            </Form.Item>
            
            <Form.Item
              label="快递公司"
              name="company"
              rules={[{ required: true, message: '请输入快递公司' }]}
            >
              <Input placeholder="请输入快递公司" />
            </Form.Item>
            
            <Form.Item
              label="包裹大小"
              name="size"
              rules={[{ required: true, message: '请输入包裹大小' }]}
            >
              <Select placeholder="请选择包裹大小">
                <Option value="小件">小件</Option>
                <Option value="中件">中件</Option>
                <Option value="大件">大件</Option>
                <Option value="超大件">超大件</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="平台"
              name="platform"
              rules={[{ required: true, message: '请选择平台' }]}
            >
              <Select placeholder="请选择平台">
                <Option value="YD">YD</Option>
                <Option value="QBD">QBD</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="公司ID"
              name="companyId"
              rules={[{ required: true, message: '请输入公司ID' }]}
            >
              <Input placeholder="请输入公司ID" type="number" />
            </Form.Item>
            
            <Form.Item
              label="是否禁用订单"
              name="banOrder"
              rules={[{ required: true, message: '请选择是否禁用订单' }]}
            >
              <Select placeholder="请选择">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="价格策略ID"
              name="priceStrategyId"
              rules={[{ required: true, message: '请输入价格策略ID' }]}
            >
              <Input placeholder="请输入价格策略ID" />
            </Form.Item>
            
            <Form.Item
              label="类型"
              name="type"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="请选择类型">
                <Option value="1">快递</Option>
                <Option value="2">物流</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              label="有效时间范围"
              name="timeRange"
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 添加弹框 */}
      <Modal
        title="添加包裹"
        visible={addVisible}
        onOk={handleSaveAdd}
        onCancel={handleCloseAdd}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
        >
          <Form.Item
            label="包裹名"
            name="name"
            rules={[{ required: true, message: '请输入包裹名' }]}
          >
            <Input placeholder="请输入包裹名" />
          </Form.Item>
          
          <Form.Item
            label="快递公司"
            name="company"
            rules={[{ required: true, message: '请输入快递公司' }]}
          >
            <Input placeholder="请输入快递公司" />
          </Form.Item>
          
          <Form.Item
            label="包裹大小"
            name="size"
            rules={[{ required: true, message: '请输入包裹大小' }]}
          >
            <Select placeholder="请选择包裹大小">
              <Option value="小件">小件</Option>
              <Option value="中件">中件</Option>
              <Option value="大件">大件</Option>
              <Option value="超大件">超大件</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="平台"
            name="platform"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              <Option value="YD">YD</Option>
              <Option value="QBD">QBD</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="公司ID"
            name="companyId"
            rules={[{ required: true, message: '请输入公司ID' }]}
          >
            <Input placeholder="请输入公司ID" type="number" />
          </Form.Item>
          
          <Form.Item
            label="是否禁用订单"
            name="banOrder"
            rules={[{ required: true, message: '请选择是否禁用订单' }]}
          >
            <Select placeholder="请选择">
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="价格策略ID"
            name="priceStrategyId"
            rules={[{ required: true, message: '请输入价格策略ID' }]}
          >
            <Input placeholder="请输入价格策略ID" />
          </Form.Item>
          
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="1">快递</Option>
              <Option value="2">物流</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="有效时间范围"
            name="timeRange"
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Package;