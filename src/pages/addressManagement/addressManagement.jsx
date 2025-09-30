import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Button, Form, Input, Radio, 
  Table, Tag, Space, message, Modal, Select, Checkbox
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, CheckCircleOutlined 
} from '@ant-design/icons';

// 解构Ant Design组件
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

// 地址管理主组件（默认导出，确保可正常导入使用）
const AddressManagement = () => {
  // 1. 状态管理
  const [form] = Form.useForm(); // 表单实例
  const [addressList, setAddressList] = useState([]); // 地址列表数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 批量选择的地址ID
  const [isModalVisible, setIsModalVisible] = useState(false); // 弹窗显示状态
  const [modalType, setModalType] = useState('add'); // 弹窗类型：add-新增，edit-编辑
  const [currentAddress, setCurrentAddress] = useState(null); // 当前编辑的地址
  const [isSmartRecognition, setIsSmartRecognition] = useState(false); // 智能识别开关
  const [recognitionResult, setRecognitionResult] = useState(null); // 识别结果

  // 2. 初始化地址数据（从本地存储加载）
  useEffect(() => {
    // 从本地存储加载地址数据
    const savedAddresses = localStorage.getItem('addressList');
    if (savedAddresses) {
      try {
        setAddressList(JSON.parse(savedAddresses));
      } catch (error) {
        console.error('解析本地存储地址数据失败:', error);
        // 如果解析失败，使用默认数据
        initializeDefaultAddresses();
      }
    } else {
      // 如果没有本地存储数据，初始化默认数据
      initializeDefaultAddresses();
    }
  }, []);

  // 初始化默认地址数据
  const initializeDefaultAddresses = () => {
    const mockAddresses = [
      {
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园路1号腾讯大厦10楼',
        isDefault: true,
        tag: '公司'
      },
      {
        id: '2',
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '福田区',
        detail: '福田路88号福田花园3栋2单元501',
        isDefault: false,
        tag: '家庭'
      },
      {
        id: '3',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '朝阳路66号朝阳广场A座802',
        isDefault: false,
        tag: '其他'
      }
    ];
    setAddressList(mockAddresses);
    // 保存到本地存储
    localStorage.setItem('addressList', JSON.stringify(mockAddresses));
  };

  // 保存地址列表到本地存储
  const saveAddressesToLocalStorage = (addresses) => {
    try {
      localStorage.setItem('addressList', JSON.stringify(addresses));
    } catch (error) {
      console.error('保存地址数据到本地存储失败:', error);
      message.error('保存数据失败');
    }
  };

  // 3. 表格列配置
  const columns = [
    {
      title: '收件人',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      align: 'center'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: '15%',
      align: 'center'
    },
    {
      title: '地址信息',
      dataIndex: 'detail',
      key: 'detail',
      width: '40%',
      render: (text, record) => (
        <div style={{ textAlign: 'left' }}>
          <div>{`${record.province}${record.city}${record.district}${text}`}</div>
          {record.tag && (
            <Tag 
              size="small" 
              style={{ marginTop: 4 }} 
              color={
                record.tag === '公司' ? 'blue' : 
                record.tag === '家庭' ? 'green' : 'gray'
              }
            >
              {record.tag}
            </Tag>
          )}
        </div>
      )
    },
    {
      title: '默认地址',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: '10%',
      align: 'center',
      render: (isDefault) => (
        isDefault ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} /> : '-'
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            style={{ color: '#1890ff' }}
            size="small"
          >
            编辑
          </Button>
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteSingle(record.id)}
            style={{ color: '#ff4d4f' }}
            size="small"
            disabled={record.isDefault}
          >
            删除
          </Button>
          {!record.isDefault && (
            <Button 
              type="link" 
              onClick={() => handleSetDefault(record.id)}
              style={{ color: '#1890ff' }}
              size="small"
            >
              设为默认
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 4. 表格选择配置（单选模式，可改为多选）
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    type: 'radio',
    getCheckboxProps: () => ({ disabled: false })
  };

  // 5. 核心功能方法
  // 打开新增弹窗
  const handleAddAddress = () => {
    setModalType('add');
    setIsSmartRecognition(false);
    setRecognitionResult(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentAddress(record);
    setIsSmartRecognition(false);
    setRecognitionResult(null);
    // 填充表单数据
    form.setFieldsValue({
      name: record.name,
      phone: record.phone,
      province: record.province,
      city: record.city,
      district: record.district,
      detail: record.detail,
      tag: record.tag,
      isDefault: record.isDefault
    });
    setIsModalVisible(true);
  };

// 智能地址识别（优化后的逻辑）
const handleSmartRecognition = () => {
  const fullAddress = form.getFieldValue('fullAddress');
  if (!fullAddress) {
    message.warning('请输入完整地址（含省市区、详细地址、收件人、电话）');
    return;
  }

  // 提取邮政编码（6位数字开头）
  const postalCodeMatch = fullAddress.match(/^(\d{6})/);
  const postalCode = postalCodeMatch ? postalCodeMatch[1] : '';

  // 提取收件人姓名（末尾的中文字符，不包含数字）
  const nameMatch = fullAddress.match(/([\u4e00-\u9fa5]{2,4})$/);
  
  // 提取手机号（11位数字）
  const phoneMatch = fullAddress.match(/(1[3-9]\d{9})/);
  
  // 省份匹配
  const provinceMatch = fullAddress.match(/(广东省|广西省|湖南省|湖北省|河南省|河北省|山东省|山西省|陕西省|甘肃省|青海省|云南省|贵州省|四川省|海南省|福建省|江西省|安徽省|浙江省|江苏省|黑龙江省|吉林省|辽宁省|内蒙古自治区|新疆维吾尔自治区|西藏自治区|宁夏回族自治区|广西壮族自治区|北京市|天津市|上海市|重庆市)/);
  
  // 城市匹配
  const cityMatch = fullAddress.match(/([\u4e00-\u9fa5]{2,4}[市州])/);
  
  // 区县匹配
  const districtMatch = fullAddress.match(/([\u4e00-\u9fa5]{2,5}[区县街道镇乡])/);

  // 构建详细地址（移除邮政编码、姓名、手机号）
  let detail = fullAddress;
  if (postalCodeMatch) detail = detail.replace(postalCodeMatch[0], '');
  if (nameMatch) detail = detail.replace(nameMatch[0], '');
  if (phoneMatch) detail = detail.replace(phoneMatch[0], '');
  detail = detail.trim().replace(/^[\s,，]+/, ''); // 去除开头的空格和逗号

  // 设置默认值
  const result = {
    name: nameMatch?.[0] || '未识别',
    phone: phoneMatch?.[0] || '未识别',
    province: provinceMatch?.[0] || '广东省', // 默认广东省
    city: cityMatch?.[0] || '清远市', // 默认清远市
    district: districtMatch?.[0] || '洲心街道', // 默认洲心街道
    detail: detail || '未识别',
    postalCode: postalCode || ''
  };

  setRecognitionResult(result);
  
  // 填充解析结果到表单
  form.setFieldsValue({
    name: result.name,
    phone: result.phone,
    province: result.province,
    city: result.city,
    district: result.district,
    detail: result.detail
  });
  
  message.success('地址识别完成，可修改后保存');
};

  // 提交表单（新增/编辑）
  const handleFormSubmit = () => {
    form.validateFields()
      .then(values => {
        const addressData = {
          id: modalType === 'add' ? Date.now().toString() : currentAddress.id,
          name: values.name,
          phone: values.phone,
          province: values.province,
          city: values.city,
          district: values.district,
          detail: values.detail,
          tag: values.tag,
          isDefault: values.isDefault || false
        };

        let updatedList = [...addressList];
        if (modalType === 'add') {
          // 新增：若设为默认，取消其他地址默认状态
          if (addressData.isDefault) {
            updatedList = updatedList.map(item => ({ ...item, isDefault: false }));
          }
          updatedList.push(addressData);
          message.success('地址新增成功');
        } else {
          // 编辑：若设为默认，取消其他地址默认状态
          if (addressData.isDefault) {
            updatedList = updatedList.map(item => ({ ...item, isDefault: false }));
          }
          updatedList = updatedList.map(item => 
            item.id === addressData.id ? addressData : item
          );
          message.success('地址编辑成功');
        }

        setAddressList(updatedList);
        saveAddressesToLocalStorage(updatedList); // 保存到本地存储
        setIsModalVisible(false);
        // 实际项目需调用保存接口：axios.post('/api/address/save', addressData)
      })
      .catch(info => {
        console.error('表单验证失败：', info);
        message.error('请检查表单填写是否正确');
      });
  };

  // 单个地址删除
  const handleDeleteSingle = (id) => {
    const address = addressList.find(item => item.id === id);
    if (address && address.isDefault) {
      message.warning('默认地址不能删除');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: '此操作将永久删除该地址，删除后无法恢复，是否继续？',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        const updatedList = addressList.filter(item => item.id !== id);
        setAddressList(updatedList);
        saveAddressesToLocalStorage(updatedList); // 保存到本地存储
        setSelectedRowKeys(selectedRowKeys.filter(key => key !== id)); // 清空选中状态
        message.success('地址删除成功');
        // 实际项目需调用删除接口：axios.delete(`/api/address/delete/${id}`)
      }
    });
  };

  // 批量删除地址
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的地址');
      return;
    }

    // 检查是否包含默认地址
    const hasDefaultAddress = addressList.some(
      item => selectedRowKeys.includes(item.id) && item.isDefault
    );
    
    if (hasDefaultAddress) {
      message.warning('不能删除默认地址');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `您将删除选中的 ${selectedRowKeys.length} 个地址，删除后无法恢复，是否继续？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        const updatedList = addressList.filter(item => !selectedRowKeys.includes(item.id));
        setAddressList(updatedList);
        saveAddressesToLocalStorage(updatedList); // 保存到本地存储
        setSelectedRowKeys([]); // 清空选中状态
        message.success(`成功删除 ${selectedRowKeys.length} 个地址`);
        // 实际项目需调用批量删除接口：axios.post('/api/address/batchDelete', { ids: selectedRowKeys })
      }
    });
  };

  // 设置默认地址
  const handleSetDefault = (id) => {
    const updatedList = addressList.map(item => ({
      ...item,
      isDefault: item.id === id
    }));
    setAddressList(updatedList);
    saveAddressesToLocalStorage(updatedList); // 保存到本地存储
    message.success('默认地址设置成功');
    // 实际项目需调用设置默认接口：axios.post('/api/address/setDefault', { id })
  };

  // 6. 组件渲染
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* 标题与操作区 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h1 style={{
              fontSize: '20px',
              margin: 0,
              color: '#1f2329',
              fontWeight: 500
            }}>
              地址管理
            </h1>
            <Space size="middle">
              {/* 批量删除按钮（选中地址后显示） */}
              {selectedRowKeys.length > 0 && (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                >
                  批量删除
                </Button>
              )}
              {/* 新增地址按钮 */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddAddress}
              >
                新增地址
              </Button>
            </Space>
          </div>

          {/* 地址列表卡片 */}
          <Card
            bordered={false}
            style={{ marginBottom: '24px' }}
          >
            <Table
              rowKey="id"
              dataSource={addressList}
              columns={columns}
              rowSelection={rowSelection}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 个地址`,
                pageSizeOptions: ['5', '10', '15'],
                size: 'middle'
              }}
              locale={{ emptyText: '暂无地址数据，点击"新增地址"添加' }}
              scroll={{ x: 900 }} // 适配小屏幕横向滚动
              size="middle"
            />
          </Card>
        </div>
      </Content>

      {/* 新增/编辑地址弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增地址' : '编辑地址'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFormSubmit}
        okText="保存"
        cancelText="取消"
        destroyOnClose // 关闭弹窗销毁表单，避免数据残留
        width={700}
        maskClosable={false} // 点击遮罩不关闭弹窗
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ isDefault: false, tag: '家庭' }}
          style={{ marginTop: 8 }}
        >
          {/* 输入模式切换（普通/智能） */}
          <Form.Item label="输入模式" style={{ marginBottom: 16 }}>
            <Radio.Group
              value={isSmartRecognition ? 'smart' : 'normal'}
              onChange={(e) => setIsSmartRecognition(e.target.value === 'smart')}
              style={{ marginBottom: 8 }}
            >
              <Radio.Button value="normal">普通输入</Radio.Button>
              <Radio.Button value="smart">智能识别</Radio.Button>
            </Radio.Group>

            {/* 智能识别输入区（仅智能模式显示） */}
            {isSmartRecognition && (
              <Form.Item
                name="fullAddress"
                rules={[{ required: true, message: '请输入完整地址（例：广东省深圳市南山区科技园路1号 张三 13800138000）' }]}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextArea
                    rows={3}
                    placeholder="请输入包含省市区、详细地址、收件人、手机号的完整地址"
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSmartRecognition}
                    style={{ whiteSpace: 'nowrap', height: 'auto' }}
                  >
                    识别
                  </Button>
                </div>

                {/* 识别结果提示（识别后显示） */}
                {recognitionResult && (
                  <div style={{ 
                    marginTop: 8, 
                    padding: 8, 
                    background: '#f0f7ff', 
                    borderRadius: 4,
                    fontSize: 12,
                    color: '#1890ff'
                  }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    识别完成，可修改表单内容后保存
                  </div>
                )}
              </Form.Item>
            )}
          </Form.Item>

            {/* 基础信息：收件人 + 手机号（两种模式通用） */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <Form.Item
                name="name"
                label="收件人"
                rules={[
                  { required: true, message: '请输入收件人姓名' },
                  { max: 20, message: '姓名长度不能超过20个字符' }
                ]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input placeholder="请输入收件人姓名" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
                ]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input placeholder="请输入11位手机号" />
              </Form.Item>
            </div>

            {/* 地区选择：省 + 市 + 区（两种模式通用） */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: '请输入省份' }]}
                style={{ flex: 1, marginBottom: 0 }}
                >
                <Input placeholder="请输入省份" />
                </Form.Item>
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
                style={{ flex: 1, marginBottom: 0 }}
                >
                <Input placeholder="请输入城市" />
                </Form.Item>

              <Form.Item
                name="district"
                label="区县"
                rules={[{ required: true, message: '请输入区县' }]}
                style={{ flex: 1, marginBottom: 0 }}
                >
                <Input placeholder="请输入区县" />
                </Form.Item>
            </div>

            {/* 详细地址（两种模式通用） */}
            <Form.Item
              name="detail"
              label="详细地址"
              rules={[
                { required: true, message: '请输入详细地址' },
                { max: 100, message: '详细地址长度不能超过100个字符' }
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input.TextArea
                rows={2}
                placeholder="请输入街道、门牌号、单元号等详细信息"
              />
            </Form.Item>

            {/* 地址标签 + 默认地址（两种模式通用） */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Form.Item
                name="tag"
                label="地址标签"
                rules={[{ required: true, message: '请选择地址标签' }]}
                style={{ marginBottom: 0 }}
              >
                <Select placeholder="请选择标签">
                  <Option value="家庭">家庭</Option>
                  <Option value="公司">公司</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name="isDefault" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>设为默认地址</Checkbox>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Layout>
    );
  };

export default AddressManagement;