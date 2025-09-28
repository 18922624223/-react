import React, { useState,useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message, Popconfirm, Form, Input, Select, DatePicker,Pagination } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined, AudioOutlined } from '@ant-design/icons';
import './Coupon.css';
import moment from 'moment';
import { Space } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const { Search } = Input;

const Coupon = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
 const [couponData, setCouponData] = useState(()=>{
  const savedData = localStorage.getItem('couponData');
  return savedData ? JSON.parse(savedData) : [
  {
    key: '1',
    couponId: 'C001',
    couponStrategyId: 'CS100001',
    name: '新人注册礼券',
    type: '0',
    getMethod: '首屏领取',
    beginTime: '2024-01-01',
    endTime: '2024-12-31',
    term: 10000,
    status: '0',
    productId: 'ALL',
    companyId: 'CP001',
    reduceMoney: '20',
    reduceDiscount: '',
    condition: '0',
    conditionType: '0',
    remark: '新用户注册专享，无门槛直减20元'
  },
  {
    key: '2',
    couponId: 'C002',
    couponStrategyId: 'CS100002',
    name: '满199减50券',
    type: '1',
    getMethod: '下单时领取',
    beginTime: '2024-03-01',
    endTime: '2024-03-31',
    term: 5000,
    status: '0',
    productId: 'P001,P002,P003',
    companyId: 'CP001',
    reduceMoney: '50',
    reduceDiscount: '',
    condition: '199',
    conditionType: '1',
    remark: '全场满199元减50元，部分商品除外'
  },
  {
    key: '3',
    couponId: 'C003',
    couponStrategyId: 'CS100003',
    name: '重量满减券',
    type: '2',
    getMethod: '首屏领取',
    beginTime: '2024-02-15',
    endTime: '2024-04-15',
    term: 3000,
    status: '1',
    productId: 'P004,P005',
    companyId: 'CP002',
    reduceMoney: '30',
    reduceDiscount: '',
    condition: '5',
    conditionType: '2',
    remark: '生鲜类商品满5kg减30元'
  },
  {
    key: '4',
    couponId: 'C004',
    couponStrategyId: 'CS100004',
    name: '金额折扣券',
    type: '3',
    getMethod: '下单时领取',
    beginTime: '2024-01-10',
    endTime: '2024-06-10',
    term: 2000,
    status: '0',
    productId: 'P006-P010',
    companyId: 'CP003',
    reduceMoney: '',
    reduceDiscount: '0.85',
    condition: '500',
    conditionType: '1',
    remark: '满500元享85折优惠'
  },
  {
    key: '5',
    couponId: 'C005',
    couponStrategyId: 'CS100005',
    name: '复购返现券',
    type: '4',
    getMethod: '首屏领取',
    beginTime: '2024-03-05',
    endTime: '2024-09-05',
    term: 1500,
    status: '0',
    productId: 'P011',
    companyId: 'CP004',
    reduceMoney: '15',
    reduceDiscount: '',
    condition: '2',
    conditionType: '2',
    remark: '第二次购买该商品返现15元'
  },
  {
    key: '6',
    couponId: 'C006',
    couponStrategyId: 'CS100006',
    name: '返利券',
    type: '5',
    getMethod: '下单时领取',
    beginTime: '2024-02-01',
    endTime: '2024-08-01',
    term: 1000,
    status: '2',
    productId: 'P012-P015',
    companyId: 'CP005',
    reduceMoney: '',
    reduceDiscount: '',
    condition: '1000',
    conditionType: '1',
    remark: '消费满1000元返利5%，已过期'
  },
  {
    key: '7',
    couponId: 'C007',
    couponStrategyId: 'CS100007',
    name: '节日直减券',
    type: '0',
    getMethod: '首屏领取',
    beginTime: '2024-05-01',
    endTime: '2024-05-07',
    term: 8000,
    status: '0',
    productId: 'ALL',
    companyId: 'CP001',
    reduceMoney: '30',
    reduceDiscount: '',
    condition: '0',
    conditionType: '0',
    remark: '五一劳动节专享，无门槛减30元'
  },
  {
    key: '8',
    couponId: 'C008',
    couponStrategyId: 'CS100008',
    name: '满399减100券',
    type: '1',
    getMethod: '下单时领取',
    beginTime: '2024-04-01',
    endTime: '2024-04-30',
    term: 4000,
    status: '0',
    productId: 'P016-P020',
    companyId: 'CP006',
    reduceMoney: '100',
    reduceDiscount: '',
    condition: '399',
    conditionType: '1',
    remark: '数码产品满399减100'
  },
  {
    key: '9',
    couponId: 'C009',
    couponStrategyId: 'CS100009',
    name: '重量特惠券',
    type: '2',
    getMethod: '首屏领取',
    beginTime: '2024-03-10',
    endTime: '2024-05-10',
    term: 2500,
    status: '1',
    productId: 'P021-P023',
    companyId: 'CP007',
    reduceMoney: '50',
    reduceDiscount: '',
    condition: '10',
    conditionType: '2',
    remark: '家居用品满10kg减50元'
  },
  {
    key: '10',
    couponId: 'C010',
    couponStrategyId: 'CS100010',
    name: '大额折扣券',
    type: '3',
    getMethod: '下单时领取',
    beginTime: '2024-01-01',
    endTime: '2024-12-31',
    term: 500,
    status: '0',
    productId: 'P024-P026',
    companyId: 'CP008',
    reduceMoney: '',
    reduceDiscount: '0.7',
    condition: '2000',
    conditionType: '1',
    remark: '满2000元享7折优惠，奢侈品专用'
  },
  {
    key: '11',
    couponId: 'C011',
    couponStrategyId: 'CS100011',
    name: '季度复购券',
    type: '4',
    getMethod: '首屏领取',
    beginTime: '2024-04-01',
    endTime: '2024-06-30',
    term: 1200,
    status: '0',
    productId: 'P027',
    companyId: 'CP009',
    reduceMoney: '25',
    reduceDiscount: '',
    condition: '3',
    conditionType: '2',
    remark: '季度内第三次购买该商品返25元'
  },
  {
    key: '12',
    couponId: 'C012',
    couponStrategyId: 'CS100012',
    name: '年度返利券',
    type: '5',
    getMethod: '下单时领取',
    beginTime: '2024-01-01',
    endTime: '2024-12-31',
    term: 800,
    status: '0',
    productId: 'ALL',
    companyId: 'CP010',
    reduceMoney: '',
    reduceDiscount: '',
    condition: '10000',
    conditionType: '1',
    remark: '年度消费满10000元返利8%'
  },
  {
    key: '13',
    couponId: 'C013',
    couponStrategyId: 'CS100013',
    name: '限时直减券',
    type: '0',
    getMethod: '首屏领取',
    beginTime: '2024-06-18',
    endTime: '2024-06-18',
    term: 10000,
    status: '2',
    productId: 'ALL',
    companyId: 'CP001',
    reduceMoney: '61.8',
    reduceDiscount: '',
    condition: '0',
    conditionType: '0',
    remark: '618活动专用，已过期'
  },
  {
    key: '14',
    couponId: 'C014',
    couponStrategyId: 'CS100014',
    name: '满999减300券',
    type: '1',
    getMethod: '下单时领取',
    beginTime: '2024-09-01',
    endTime: '2024-10-07',
    term: 6000,
    status: '0',
    productId: 'P028-P035',
    companyId: 'CP011',
    reduceMoney: '300',
    reduceDiscount: '',
    condition: '999',
    conditionType: '1',
    remark: '国庆中秋双节特惠'
  },
  {
    key: '15',
    couponId: 'C015',
    couponStrategyId: 'CS100015',
    name: '会员专享折扣券',
    type: '3',
    getMethod: '首屏领取',
    beginTime: '2024-01-01',
    endTime: '2024-12-31',
    term: 3000,
    status: '0',
    productId: 'ALL',
    companyId: 'CP012',
    reduceMoney: '',
    reduceDiscount: '0.9',
    condition: '0',
    conditionType: '0',
    remark: 'VIP会员专享9折优惠，无消费门槛'
  }

]
});
const [currentRecord, setCurrentRecord] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

// 监听 couponData 变化，自动保存到 localStorage
useEffect(() => {
  localStorage.setItem('couponData', JSON.stringify(couponData));
}, [couponData]);
  // 处理搜索
  const onSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // 自定义搜索输入框
  const SearchInput = () => (
    <Space direction="vertical">
      <Search
        placeholder="优惠卷名称" 
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
    </Space>
  );
const onShowSizeChange = (current, pageSize) => {
  console.log(current, pageSize);
};
const Pages = () => (
  <>
    <Pagination
      showSizeChanger
      onShowSizeChange={onShowSizeChange}
      defaultCurrent={3}
      total={500}
    />
    
  </>
);
  // 表格列配置
const columns = [
  {
    title: '优惠券名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: '策略ID',
    dataIndex: 'couponStrategyId',
    key: 'couponStrategyId',
    render: (text) => <span>{text}</span>,
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
        title="确定要删除这个优惠券吗？"
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
 // 根据搜索文本过滤数据
const filteredData = searchText
  ? couponData.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.couponId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.couponStrategyId.toLowerCase().includes(searchText.toLowerCase())
    )
  : couponData;  // 查看详情处理函数
  
  // 计算当前页显示的数据
const currentPageData = filteredData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const handleEdit = (record) => {
  setCurrentRecord(record);
  // 设置表单默认值
  editForm.setFieldsValue({
    name: record.name,
    type: record.type,
    getMethod: record.getMethod,
    beginTime: record.beginTime ? moment(record.beginTime) : null,
    endTime: record.endTime ? moment(record.endTime) : null, 
    term: record.term,
    status: record.status,
    productId: record.productId,
    companyId: record.companyId,
    reduceMoney: record.reduceMoney,
    reduceDiscount: record.reduceDiscount,
    condition: record.condition,
    conditionType: record.conditionType,
    remark: record.remark
  });
  
  setEditVisible(true);
};

  // 保存修改
  const handleSaveEdit = () => {
    editForm.validateFields().then(values => {
     const { beginTime, endTime, ...otherValues } = values;
    
    const updatedValues = {
      ...otherValues,
      beginTime: beginTime ? beginTime.format('YYYY-MM-DD') : '',
      endTime: endTime ? endTime.format('YYYY-MM-DD') : ''
    };


      // 更新数据
      const updatedData = couponData.map(item => {
        if (item.key === currentRecord.key) {
          return {
            ...item,
            ...updatedValues
          };
        }
        return item;
      });
      
      setCouponData(updatedData);
      setEditVisible(false);
      message.success('优惠券信息已更新');
    }).catch(error => {
      console.log('验证失败:', error);
    });
  };

  // 删除处理函数
  const handleDelete = (record) => {
    console.log('删除优惠券:', record);
    // 从数据中移除该记录
    const newData = couponData.filter(item => item.key !== record.key);
    setCouponData(newData);
    message.success(`优惠券 "${record.name}" 已删除`);
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
    // 生成新的key和策略ID
    const newKey = `${couponData.length + 1}`;
    const newId = `CS${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    // 创建新记录
    const newRecord = {
      key: newKey,
      couponId: `C${String(newKey).padStart(3, '0')}`,
      couponStrategyId: newId,
      ...values,
      beginTime: values.beginTime ? values.beginTime.format('YYYY-MM-DD') : '',
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : ''
    };
    
    // 添加到数据中
    setCouponData([...couponData, newRecord]);
    setAddVisible(false);
    addForm.resetFields();
    message.success('优惠券添加成功');
  }).catch(error => {
    console.log('验证失败:', error);
  });
};
  // 关闭添加弹框
  const handleCloseAdd = () => {
    setAddVisible(false);
    addForm.resetFields();
  };

  // 根据条件类型获取描述
  const getConditionTypeText = (type) => {
    switch(type) {
      case '0': return '无条件';
      case '1': return '满金额';
      case '2': return '满数量';
      default: return '未知';
    }
  };

  // 格式化优惠信息
  const formatDiscount = (record) => {
    if (record.reduceDiscount) {
      return `${parseFloat(record.reduceDiscount) * 10}折`;
    }
    if (record.reduceMoney) {
      return `减${record.reduceMoney}元`;
    }
    return '未知';
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
      <h2>优惠券信息表</h2>
      <SearchInput/>
      <Button 
        type="default" 
        className='reset-button' 
        onClick={() => {
          setSearchText('');
          setCurrentPage(1);
        }}
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
        dataSource={currentPageData} 
        pagination={false}
        style={{ marginTop: '20px' }}
        rowKey="key"
        rowClassName={getRowClassName}
      />
      <Pagination
  current={currentPage}
  pageSize={pageSize}
  total={filteredData.length}
  showSizeChanger
  showQuickJumper
  showTotal={(total) => `共 ${total} 条记录`}
  onChange={(page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  }}
  onShowSizeChange={(current, size) => setPageSize(size)}
  pageSizeOptions={['5', '10', '20', '50']}
/>

{/* 详情弹框 */}
<Modal
  title="优惠券详情"
  visible={detailVisible}
  onCancel={handleCloseDetail}
  footer={null}
  width={600}
>
  {currentRecord && (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="优惠券ID">{currentRecord.couponId}</Descriptions.Item>
      <Descriptions.Item label="策略ID">{currentRecord.couponStrategyId}</Descriptions.Item>
      <Descriptions.Item label="优惠券名称">{currentRecord.name}</Descriptions.Item>
      <Descriptions.Item label="类型">
        <Tag color={currentRecord.type === '0' ? 'blue' : 
                  currentRecord.type === '1' ? 'green' : 
                  currentRecord.type === '2' ? 'orange' :
                  currentRecord.type === '3' ? 'purple' :
                  currentRecord.type === '4' ? 'cyan' : 'red'}>
          {['直减', '满减', '重量', '金额', '复购', '返利'][currentRecord.type]}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="领取方式">{currentRecord.getMethod === '首屏领取' ? '首屏领取' : '下单时领取'}</Descriptions.Item>
      <Descriptions.Item label="开始时间">{currentRecord.beginTime}</Descriptions.Item>
      <Descriptions.Item label="结束时间">{currentRecord.endTime}</Descriptions.Item>
      <Descriptions.Item label="发放数量">{currentRecord.term}</Descriptions.Item>
      <Descriptions.Item label="状态">
        <Tag color={currentRecord.status === '0' ? 'green' : 
                  currentRecord.status === '1' ? 'orange' : 'red'}>
          {['可领取', '不可领取', '不可使用'][currentRecord.status]}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="关联产品">{currentRecord.productId}</Descriptions.Item>
      <Descriptions.Item label="公司ID">{currentRecord.companyId}</Descriptions.Item>
      <Descriptions.Item label="减免金额">{currentRecord.reduceMoney || '无'}</Descriptions.Item>
      <Descriptions.Item label="金额折扣">{currentRecord.reduceDiscount ? `${currentRecord.reduceDiscount}折` : '无'}</Descriptions.Item>
      <Descriptions.Item label="条件">{currentRecord.condition}</Descriptions.Item>
      <Descriptions.Item label="条件类型">{getConditionTypeText(currentRecord.conditionType)}</Descriptions.Item>
      <Descriptions.Item label="备注">{currentRecord.remark}</Descriptions.Item>
    </Descriptions>
  )}
</Modal>

{/* 修改弹框 */}
<Modal
  title="修改优惠券"
  visible={editVisible}
  onCancel={handleCloseEdit}
  onOk={handleSaveEdit}
  width={600}
>
  <Form form={editForm} layout="vertical">
    <Form.Item name="couponId" label="优惠券ID" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="couponStrategyId" label="策略ID" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="name" label="优惠券名称" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="type" label="类型" rules={[{ required: true }]}>
      <Select>
        <Option value="0">直减</Option>
        <Option value="1">满减</Option>
        <Option value="2">重量</Option>
        <Option value="3">金额</Option>
        <Option value="4">复购</Option>
        <Option value="5">返利</Option>
      </Select>
    </Form.Item>
    <Form.Item name="getMethod" label="领取方式" rules={[{ required: true }]}>
      <Select>
        <Option value="首屏领取">首屏领取</Option>
        <Option value="下单时领取">下单时领取</Option>
      </Select>
    </Form.Item>
    <Form.Item name="beginTime" label="开始时间" rules={[{ required: true }]}>
      <DatePicker format="YYYY-MM-DD" />
    </Form.Item>
    <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
      <DatePicker format="YYYY-MM-DD" />
    </Form.Item>
    <Form.Item name="term" label="发放数量" rules={[{ required: true}]}>
      <Input type="number" />
    </Form.Item>
    <Form.Item name="status" label="状态" rules={[{ required: true }]}>
      <Select>
        <Option value="0">可领取</Option>
        <Option value="1">不可领取</Option>
        <Option value="2">不可使用</Option>
      </Select>
    </Form.Item>
    <Form.Item name="productId" label="关联产品" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="companyId" label="公司ID" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="reduceMoney" label="减免金额">
      <Input type="number" />
    </Form.Item>
    <Form.Item name="reduceDiscount" label="金额折扣">
      <Input type="number" step="0.01" />
    </Form.Item>
    <Form.Item name="condition" label="条件" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="conditionType" label="条件类型" rules={[{ required: true }]}>
      <Select>
        <Option value="0">无条件</Option>
        <Option value="1">满金额</Option>
        <Option value="2">满数量</Option>
      </Select>
    </Form.Item>
    <Form.Item name="remark" label="备注">
      <Input.TextArea rows={4} />
    </Form.Item>
  </Form>
</Modal>
{/* 添加优惠券弹窗 */}
<Modal
  title="添加优惠券"
  visible={addVisible}
  onCancel={handleCloseAdd}
  onOk={handleSaveAdd}
  width={600}
>
  <Form form={addForm} layout="vertical">
    <Form.Item name="name" label="优惠券名称" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="type" label="类型" rules={[{ required: true }]}>
      <Select>
        <Option value="0">直减</Option>
        <Option value="1">满减</Option>
        <Option value="2">重量</Option>
        <Option value="3">金额</Option>
        <Option value="4">复购</Option>
        <Option value="5">返利</Option>
      </Select>
    </Form.Item>
    <Form.Item name="getMethod" label="领取方式" rules={[{ required: true }]}>
      <Select>
        <Option value="首屏领取">首屏领取</Option>
        <Option value="下单时领取">下单时领取</Option>
      </Select>
    </Form.Item>
    <Form.Item name="beginTime" label="开始时间" rules={[{ required: true }]}>
      <DatePicker format="YYYY-MM-DD" />
    </Form.Item>
    <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
      <DatePicker format="YYYY-MM-DD" />
    </Form.Item>
    <Form.Item name="term" label="发放数量" rules={[{ required: true}]}>
      <Input type="number" />
  </Form.Item>
    <Form.Item name="status" label="状态" rules={[{ required: true }]}>
      <Select>
        <Option value="0">可领取</Option>
        <Option value="1">不可领取</Option>
        <Option value="2">不可使用</Option>
      </Select>
    </Form.Item>
    <Form.Item name="productId" label="关联产品" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="companyId" label="公司ID" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="reduceMoney" label="减免金额">
      <Input type="number" />
    </Form.Item>
    <Form.Item name="reduceDiscount" label="金额折扣">
      <Input type="number" step="0.01" />
    </Form.Item>
    <Form.Item name="condition" label="条件" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="conditionType" label="条件类型" rules={[{ required: true }]}>
      <Select>
        <Option value="0">无条件</Option>
        <Option value="1">满金额</Option>
        <Option value="2">满数量</Option>
      </Select>
    </Form.Item>
    <Form.Item name="remark" label="备注">
      <Input.TextArea rows={4} />
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default Coupon;