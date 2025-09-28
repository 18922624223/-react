import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Form, Input, 
  Row, Col, Typography, Space, message, Divider, Badge, Upload
} from 'antd';
import { 
  EditOutlined, SaveOutlined, UndoOutlined, 
  UserOutlined, MailOutlined, PhoneOutlined,
  HomeOutlined, CalendarOutlined,
  BookOutlined,  CheckCircleOutlined,
  LoadingOutlined, PlusOutlined
} from '@ant-design/icons';
import './User.css';

const { Title, Paragraph, Text } = Typography;

// 头像上传相关函数
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const User = () => {
  // 初始个人信息
const [userInfo, setUserInfo] = useState(() => {
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    try {
      return JSON.parse(savedUserInfo);
    } catch (e) {
      console.error('解析本地存储数据失败:', e);
    }
  }
  
  // 默认用户信息
  return {
    name: "张三",
    title: "前端开发工程师",
    email: "zhangsan@example.com",
    phone: "88888888888",
    location: "广东省肇庆市",
    birthday: "2000-01-01",
    occupation: "前端开发工程师",
    education: "北京大学 计算机",
    website: "https://zhangsan.dev",
    bio: "喜欢研究前端技术，喜欢研究前端技术，喜欢研究前端技术，喜欢研究前端技术，喜欢研究前端技术，喜欢研究前端技术"
  };
});
  
  // 状态管理
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(() => {
  const savedImageUrl = localStorage.getItem('userAvatar');
  return savedImageUrl || "https://picsum.photos/id/64/200";
});

  // 当编辑模式变化时同步表单数据
  useEffect(() => {
    form.setFieldsValue(userInfo);
  }, [editMode, userInfo, form]);
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return false;
  }

  // 生成 base64 并更新 imageUrl 和 localStorage
  getBase64(file, (url) => {
    setImageUrl(url);
    localStorage.setItem('userAvatar', url); // 关键：保存到本地
    setLoading(false);
  });

  return false; // 阻止上传
};
  // 头像上传处理
const handleAvatarChange = (info) => {
  if (info.file.status === 'uploading') {
    setLoading(true);
    return;
  }
  if (info.file.status === 'done') {
    getBase64(info.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
      // 保存到 localStorage
      localStorage.setItem('userAvatar', url);
    });
  }
};

  // 切换编辑模式
  const handleEdit = () => {
    setEditMode(true);
    setSaveSuccess(false);
  };

  // 保存修改
const handleSave = async () => {
  try {
    const values = await form.validateFields();
    setUserInfo(values);
    setEditMode(false);
    setSaveSuccess(true);
    message.success('个人信息已更新');
    
    // 保存到本地存储
    localStorage.setItem('userInfo', JSON.stringify(values));
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  } catch (errorInfo) {
    console.log('保存失败:', errorInfo);
  }
};

  // 取消编辑
  const handleCancel = () => {
    form.setFieldsValue(userInfo);
    setEditMode(false);
    setSaveSuccess(false);
  };

  // 信息项组件
  const InfoItem = ({ label, value, icon }) => (
    <div className="info-item">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <Text className="info-label">{label}</Text>
        <Text className="info-value">{value || '未设置'}</Text>
      </div>
    </div>
  );

  // 上传按钮
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="user-container">
      <Card className="user-card" bordered={false}>
        {/* 头部区域 */}
        <div className="user-header">
          <div className="header-cover"></div>
          
          <div className="user-avatar">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleAvatarChange} // 可选：保留用于调试
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%',height:'100%', borderRadius: '50%' }} />
            ) : (
              <PlusOutlined />
            )}
          </Upload>
          </div>
          
          <div className="user-header-content">
            <Row justify="space-between" align="middle" className="header-title-row">
              <Col>
                <Title level={2} className="user-name">{userInfo.name}</Title>
                <Badge className="user-title" status="processing" text={userInfo.title} />
              </Col>
              
              <Col className="action-buttons">
                {saveSuccess ? (
                  <Badge status="success" icon={<CheckCircleOutlined />} text="已保存" />
                ) : editMode ? (
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />} 
                      onClick={handleSave}
                    >
                      保存
                    </Button>
                    <Button 
                      icon={<UndoOutlined />} 
                      onClick={handleCancel}
                    >
                      取消
                    </Button>
                  </Space>
                ) : (
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                  >
                    编辑信息
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </div>
        
        <Divider />
        
        {/* 内容区域 */}
        <div className="user-content">
          {editMode ? (
            // 编辑模式 - 表单
            <Form
              form={form}
              layout="vertical"
              className="edit-form"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入姓名" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="职称"
                    rules={[{ required: true, message: '请输入职称' }]}
                  >
                    <Input placeholder="请输入职称" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="电话"
                    rules={[{ required: true, message: '请输入电话' }]}
                  >
                    <Input placeholder="请输入电话" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="location"
                    label="地址"
                  >
                    <Input placeholder="请输入地址" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="birthday"
                    label="生日"
                  >
                    <Input placeholder="请输入生日" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="occupation"
                    label="职业"
                  >
                    <Input placeholder="请输入职业" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="education"
                    label="教育背景"
                  >
                    <Input placeholder="请输入教育背景" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="website"
                    label="个人网站"
                  >
                    <Input placeholder="请输入个人网站" />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <Form.Item
                    name="bio"
                    label="个人简介"
                  >
                    <Input.TextArea rows={4} placeholder="请输入个人简介" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            // 展示模式 - 信息列表
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <InfoItem 
                  label="姓名" 
                  value={userInfo.name} 
                  icon={<UserOutlined />} 
                />
                <InfoItem 
                  label="邮箱" 
                  value={userInfo.email} 
                  icon={<MailOutlined />} 
                />
                <InfoItem 
                  label="电话" 
                  value={userInfo.phone} 
                  icon={<PhoneOutlined />} 
                />
                <InfoItem 
                  label="地址" 
                  value={userInfo.location} 
                  icon={<HomeOutlined />} 
                />
              </Col>
              
              <Col xs={24} md={12}>
                <InfoItem 
                  label="生日" 
                  value={userInfo.birthday} 
                  icon={<CalendarOutlined />} 
                />
                <InfoItem 
                  label="职业" 
                  value={userInfo.occupation} 
                
                />
                <InfoItem 
                  label="教育背景" 
                  value={userInfo.education} 
                  icon={<BookOutlined />} 
                />
                <InfoItem 
                  label="个人网站" 
                  value={userInfo.website} 
                />
              </Col>
              
              <Col xs={24}>
                <div className="bio-section">
                  <Title level={4}>个人简介</Title>
                  <Paragraph className="bio-content">
                    {userInfo.bio}
                  </Paragraph>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Card>
    </div>
  );
};

export default User;