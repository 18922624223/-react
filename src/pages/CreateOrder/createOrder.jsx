import React, { useState, useEffect } from 'react';
import { Card, Typography, Divider, Badge, Button, Input, InputNumber, DatePicker, Select } from 'antd';
// ... 其他导入
import { 
  TruckOutlined, InfoCircleOutlined, 
  UserOutlined, BoxPlotOutlined, ClockCircleOutlined, CheckOutlined
} from '@ant-design/icons';
import './createOrder.css';
import moment from 'moment';
import OrderPay from './OrderPay';
import CountDown from './Countdown'; // 导入CountDown组件

const { Title, Text } = Typography;
const { Option } = Select;

const CreateOrder = () => {
  // 初始化空的订单数据（所有字段默认空值，直接可编辑）
  const [orderData, setOrderData] = useState({
    trackId: "",
    orderLog: {
      status: 0,
      msg: "未填写",
      updateAt: moment().format('YYYY-MM-DD HH:mm:ss') // 初始显示当前时间
    },
    channelId: null,
    deliveryBusiness: "",
    deliveryType: "",
    customerType: "",
    itemName: "",
    packageNum: 1, // 包裹数量默认1
    pickUpStartTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 默认当前时间
    pickUpEndTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'), // 默认1小时后（修复单位）
    remark: "",
    senderInfo: {
      name: "",
      phone: "",
      telephone: "",
      uuid: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    addressseeInfo: {
      name: "",
      phone: "",
      telephone: "",
      uuid: "",
      province: "",
      city: "",
      district: "",
      address: ""
    },
    expressInfo: {
      type: 'yd', // 默认快递类型为 yd
      weight: null,
      volume: null,
      ratio: 6000, // 比例默认6000
      length: null,
      width: null,
      height: null,
      officalMoney: null,
      totalMoney: null,
      agentMoney: 0, // 代理价格默认0
      profitMoney: null,
      detail: ""
    }
  });

  // 控制支付弹窗显示状态
  const [payModalVisible, setPayModalVisible] = useState(false);
  
  // 控制倒计时组件显示状态
  const [showCountdown, setShowCountdown] = useState(false);


// 在 CreateOrder.jsx 中添加状态
const [compensationPayVisible, setCompensationPayVisible] = useState(false);
  // 实时更新订单状态和最后编辑时间
  useEffect(() => {
    const updateOrderStatus = () => {
      setOrderData(prev => {
        const hasTrackId = !!prev.trackId;
        const hasBasicInfo = !!prev.itemName && !!prev.deliveryBusiness;
        
        return {
          ...prev,
          orderLog: {
            ...prev.orderLog,
            msg: hasTrackId && hasBasicInfo ? "已填写未支付" : "未填写",
            updateAt: moment().format('YYYY-MM-DD HH:mm:ss') // 实时更新编辑时间
          }
        };
      });
    };

    // 数据变化时延迟更新（避免频繁触发，优化性能）
    const timer = setTimeout(updateOrderStatus, 300);
    return () => clearTimeout(timer);
  }, [
    orderData.trackId, orderData.itemName, orderData.deliveryBusiness,
    orderData.senderInfo.name, orderData.addressseeInfo.name,
    orderData.expressInfo.weight, orderData.expressInfo.totalMoney
  ]);

  // 处理普通文本输入变化（优化性能，避免不必要的渲染）
  const handleTextChange = (field, value, parent = null) => {
    if (parent) {
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value || "" // 空值处理为字符串，避免null/undefined
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: value || ""
      }));
    }
  };

  // 处理数字输入变化（统一使用InputNumber，确保数字类型）
  const handleNumberChange = (field, value, parent = null) => {
    // 允许空值（null），但非空时确保为数字
    const numValue = value === "" ? null : (value === null ? null : Number(value));
    
    if (parent) {
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: numValue
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  // 处理日期选择变化
  const handleDateChange = (field, date) => {
    setOrderData(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD HH:mm:ss') : ""
    }));
  };

  // 处理下拉选择变化
  const handleSelectChange = (field, value, parent = null) => {
    if (parent) {
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 计算利润（自动计算：官方价格 - 代理价格 = 利润）
  useEffect(() => {
    const { officalMoney, agentMoney } = orderData.expressInfo;
    if (officalMoney !== null && agentMoney !== null) {
      const profit = Math.round((officalMoney - agentMoney) * 100000) / 100000; // 保留5位小数
      setOrderData(prev => ({
        ...prev,
        expressInfo: {
          ...prev.expressInfo,
          profitMoney: profit
        }
      }));
    }
  }, [orderData.expressInfo.officalMoney, orderData.expressInfo.agentMoney]);

  // 下拉选项配置（集中管理，便于维护）
  const fieldOptions = {
    deliveryType: [
      { value: 'DOP', label: 'DOP' },
      { value: 'NORMAL', label: '标准配送' }
    ],
    customerType: [
      { value: 'kd', label: '快递客户' },
      { value: 'yz', label: '邮政客户' },
      { value: 'other', label: '其他客户' }
    ],
    expressType: [
      { value: 'yd', label: 'YD快递' },
      { value: 'qbd', label: 'QBD快递' }
    ]
  };

  // 自动计算官方价格（officalMoney）
  useEffect(() => {
    const { type, weight, pickUpStartTime } = orderData.expressInfo;
    if (!type || !weight) return;

    let officialMoney = 0;

    // 1. 快递运费（必选）
    if (type === 'yd') {
      officialMoney += weight * 10; // YD：每公斤10元
    } else if (type === 'qbd') {
      if (weight <= 5) {
        officialMoney += weight * 6;
      } else if (weight <= 10) {
        officialMoney += 5 * 6 + (weight - 5) * 7;
      } else {
        officialMoney += 5 * 6 + 5 * 7 + (weight - 10) * 8;
      }
    }

    // 2. 保价费（固定5元）
    officialMoney += 5;

    // 3. 耗材费（固定3元）
    officialMoney += 3;

    // 4. 春节加派费（仅yd有）
    if (type === 'yd') {
      const pickupDate = moment(pickUpStartTime);
      const isSpringFestival = pickupDate.isBetween('2025-01-28', '2025-02-04'); // 示例：2025年春节
      if (isSpringFestival) {
        officialMoney += 10;
      }
    }

    // 更新官方价格
    setOrderData(prev => ({
      ...prev,
      expressInfo: {
        ...prev.expressInfo,
        officalMoney: parseFloat(officialMoney.toFixed(2))
      }
    }));
  }, [
    orderData.expressInfo.type,
    orderData.expressInfo.weight,
    orderData.expressInfo.pickUpStartTime
  ]);

  // 总价 = 官方价格 + 代理价格
  useEffect(() => {
    const { officalMoney, agentMoney } = orderData.expressInfo;
    if (officalMoney !== null && agentMoney !== null) {
      const total = officalMoney + agentMoney;
      setOrderData(prev => ({
        ...prev,
        expressInfo: {
          ...prev.expressInfo,
          totalMoney: parseFloat(total.toFixed(2))
        }
      }));
    }
  }, [orderData.expressInfo.officalMoney, orderData.expressInfo.agentMoney]);

  // 支付按钮点击事件
  const handlePay = () => {
    const requiredFields = [
      { name: '订单号', value: orderData.trackId },
      { name: '物品名称', value: orderData.itemName },
      { name: '快递业务', value: orderData.deliveryBusiness },
      { name: '发件人姓名', value: orderData.senderInfo.name },
      { name: '收件人姓名', value: orderData.addressseeInfo.name },
      { name: '快递重量', value: orderData.expressInfo.weight },
      { name: '总价', value: orderData.expressInfo.totalMoney }
    ];

    const emptyFields = requiredFields.filter(item => !item.value);
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(item => item.name).join('、');
      alert(`请先填写以下必填字段：${fieldNames}`);
      return;
    }

    setPayModalVisible(true);
  };

  // 处理支付确认
  const handleConfirmPay = () => {
    alert(`订单${orderData.trackId}支付成功，金额：${orderData.expressInfo.totalMoney}元`);
    
    // 创建订单对象用于保存到订单列表
    const newOrder = {
      key: Date.now().toString(), // 使用时间戳作为唯一key
      id: orderData.trackId,
      name: orderData.addressseeInfo.name,
      platform: orderData.expressInfo.type === 'yd' ? 'YD' : 'QBD',
      companyId: '',
      priceStrategyId: '',
      tag: '',
      tagcolor: '',
      pagename: '',
      type: '1', // 快递类型
      banOrder: '0',
      notice: orderData.remark,
      status: '3', 
      couponId: '',
      trackId: orderData.trackId,
      uuid: orderData.addressseeInfo.uuid,
      ydId: '',
      channelId: orderData.channelId,
      expressId: '',
      senderInfoId: 1,
      addressseeInfoId: 1,
      pickUpStartTime: orderData.pickUpStartTime,
      pickUpEndTime: orderData.pickUpEndTime,
      itemName: orderData.itemName,
      packageNum: orderData.packageNum,
      deliveryBusiness: orderData.deliveryBusiness,
      deliveryType: orderData.deliveryType,
      customerType: orderData.customerType,
      senderInfo: {
        id: 1,
        uuid: orderData.senderInfo.uuid,
        name: orderData.senderInfo.name,
        phone: orderData.senderInfo.phone,
        telephone: orderData.senderInfo.telephone,
        province: orderData.senderInfo.province,
        city: orderData.senderInfo.city,
        district: orderData.senderInfo.district,
        address: orderData.senderInfo.address
      },
      addressseeInfo: {
        id: 1,
        uuid: orderData.addressseeInfo.uuid,
        name: orderData.addressseeInfo.name,
        phone: orderData.addressseeInfo.phone,
        telephone: orderData.addressseeInfo.telephone,
        province: orderData.addressseeInfo.province,
        city: orderData.addressseeInfo.city,
        district: orderData.addressseeInfo.district,
        address: orderData.addressseeInfo.address
      },
      express_info: {
        trackId: orderData.trackId,
        type: orderData.expressInfo.type === 'yd' ? 1 : 2,
        weight: orderData.expressInfo.weight,
        volume: orderData.expressInfo.volume,
        length: orderData.expressInfo.length,
        width: orderData.expressInfo.width,
        height: orderData.expressInfo.height,
        ratio: orderData.expressInfo.ratio,
        officalMoney: orderData.expressInfo.officalMoney,
        totalMoney: orderData.expressInfo.totalMoney,
        agentMoney: orderData.expressInfo.agentMoney,
        profitMoney: orderData.expressInfo.profitMoney
      }
    };

    // 从 localStorage 获取现有订单数据
    const existingOrders = JSON.parse(localStorage.getItem('orderData') || '[]');
    
    // 添加新订单到现有订单列表
    const updatedOrders = [...existingOrders, newOrder];
    
    // 保存到 localStorage
    localStorage.setItem('orderData', JSON.stringify(updatedOrders));
    
    setPayModalVisible(false);
    setShowCountdown(false);
  };

  // 关闭支付弹窗
  const handleCancelPay = () => {
    setPayModalVisible(false);
    setShowCountdown(true);
  };

  // 点击倒计时提醒按钮
  const handleReminderClick = () => {
    setPayModalVisible(true);
  };

  // 倒计时结束处理
  const handleCountdownEnd = () => {
    setShowCountdown(false);
  };

  // 重置表单
  const handleReset = () => {
    if (window.confirm('确定要重置所有表单数据吗？')) {
      setOrderData({
        trackId: "",
        orderLog: {
          status: 0,
          msg: "未填写",
          updateAt: moment().format('YYYY-MM-DD HH:mm:ss')
        },
        channelId: null,
        deliveryBusiness: "",
        deliveryType: "",
        customerType: "",
        itemName: "",
        packageNum: 1,
        pickUpStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        pickUpEndTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        remark: "",
        senderInfo: {
          name: "",
          phone: "",
          telephone: "",
          uuid: "",
          province: "",
          city: "",
          district: "",
          address: ""
        },
        addressseeInfo: {
          name: "",
          phone: "",
          telephone: "",
          uuid: "",
          province: "",
          city: "",
          district: "",
          address: ""
        },
        expressInfo: {
          type: 'yd',
          weight: null,
          volume: null,
          ratio: 6000,
          length: null,
          width: null,
          height: null,
          officalMoney: null,
          totalMoney: null,
          agentMoney: 0,
          profitMoney: null,
          detail: ""
        }
      });
      setShowCountdown(false);
    }
  };

  return (
    <div className="order-container">
      {/* 倒计时提醒组件 */}
      {showCountdown && (
        <CountDown 
          onReminderClick={handleReminderClick}
          onCountdownEnd={handleCountdownEnd}
        />
      )}

      <Card className="order-card" bordered={false}>
        {/* 页面标题与订单号 */}
        <div className="order-header">
          <Title level={2} className="order-title">
            <TruckOutlined className="title-icon" />
            物流订单填写
          </Title>
          <div className="order-id-container">
            <Text className="id-label">订单号：</Text>
            <Input
              value={orderData.trackId || ''}
              onChange={(e) => handleTextChange('trackId', e.target.value)}
              placeholder="请输入订单号（必填）"
              className="order-id-input"
              autoFocus
            />
          </div>
        </div>

        {/* 订单状态提示 */}
        <div className="order-status-section">
          <div className="status-info">
            <Title level={3} className="section-title">订单状态</Title>
            <Text className="update-time">
              最后编辑时间: {orderData.orderLog.updateAt}
            </Text>
          </div>
          <Badge 
            status={orderData.trackId && orderData.itemName ? "processing" : "default"} 
            text={
              <span className="status-text">
                <ClockCircleOutlined className="status-icon" />
                {orderData.orderLog.msg}
              </span>
            } 
            className="status-badge"
          />
        </div>

        <Divider />

        {/* 1. 订单基本信息区域 */}
        <div className="form-section">
          <Title level={3} className="section-title">
            <InfoCircleOutlined className="section-icon" />
            基本信息
          </Title>
          <div className="form-grid">
            <div className="form-field">
              <Text className="field-label">渠道ID</Text>
              <InputNumber
                value={orderData.channelId}
                onChange={(val) => handleNumberChange('channelId', val)}
                min={10000}
                max={99999}
                placeholder="请输入渠道ID（数字）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">快递业务</Text>
              <Input
                value={orderData.deliveryBusiness || ''}
                onChange={(e) => handleTextChange('deliveryBusiness', e.target.value)}
                placeholder="请输入快递业务名称（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">配送类型</Text>
              <Select
                value={orderData.deliveryType}
                onChange={(val) => handleSelectChange('deliveryType', val)}
                placeholder="请选择配送类型"
                className="form-input"
                style={{ width: '100%' }}
              >
                {fieldOptions.deliveryType.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form-field">
              <Text className="field-label">客户类型</Text>
              <Select
                value={orderData.customerType}
                onChange={(val) => handleSelectChange('customerType', val)}
                placeholder="请选择客户类型"
                className="形式输入"
                style={{ width: '100%' }}
              >
                {fieldOptions.customerType.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form-field">
              <Text className="field-label">物品名称</Text>
              <Input
                value={orderData.itemName || ''}
                onChange={(e) => handleTextChange('itemName', e.target.value)}
                placeholder="请输入物品名称（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">包裹数量</Text>
              <InputNumber
                value={orderData.packageNum}
                onChange={(val) => handleNumberChange('packageNum', val)}
                min={1}
                max={999}
                step={1}
                placeholder="请输入包裹数量"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">取件开始时间</Text>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={orderData.pickUpStartTime ? moment(orderData.pickUpStartTime) : null}
                onChange={(date) => handleDateChange('pickUpStartTime', date)}
                placeholder="请选择取件开始时间"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">取件结束时间</Text>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={orderData.pickUpEndTime ? moment(orderData.pickUpEndTime) : null}
                onChange={(date) => handleDateChange('pickUpEndTime', date)}
                placeholder="请选择取件结束时间"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field span-2">
              <Text className="field-label">备注信息</Text>
              <Input
                value={orderData.remark || ''}
                onChange={(e) => handleTextChange('remark', e.target.value)}
                placeholder="请输入备注（选填）"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* 2. 发件人信息区域 */}
        <div className="form-section">
          <Title level={3} className="section-title">
            <UserOutlined className="section-icon" />
            发件人信息
          </Title>
          <div className="form-grid">
            <div className="form-field">
              <Text className="field-label">发件人姓名</Text>
              <Input
                value={orderData.senderInfo.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value, 'senderInfo')}
                placeholder="请输入发件人姓名（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">手机号码</Text>
              <Input
                value={orderData.senderInfo.phone || ''}
                onChange={(e) => handleTextChange('phone', e.target.value, 'senderInfo')}
                placeholder="请输入发件人手机号（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">固定电话</Text>
              <Input
                value={orderData.senderInfo.telephone || ''}
                onChange={(e) => handleTextChange('telephone', e.target.value, 'senderInfo')}
                placeholder="请输入固定电话（选填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">UUID</Text>
              <Input
                value={orderData.senderInfo.uuid || ''}
                onChange={(e) => handleTextChange('uuid', e.target.value, 'senderInfo')}
                placeholder="请输入UUID（选填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">省份</Text>
              <Input
                value={orderData.senderInfo.province || ''}
                onChange={(e) => handleTextChange('province', e.target.value, 'senderInfo')}
                placeholder="请输入省份（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">城市</Text>
              <Input
                value={orderData.senderInfo.city || ''}
                onChange={(e) => handleTextChange('city', e.target.value, 'senderInfo')}
                placeholder="请输入城市（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">区/县</Text>
              <Input
                value={orderData.senderInfo.district || ''}
                onChange={(e) => handleTextChange('district', e.target.value, 'senderInfo')}
                placeholder="请输入区/县（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field span-2">
              <Text className="field-label">详细地址</Text>
              <Input
                value={orderData.senderInfo.address || ''}
                onChange={(e) => handleTextChange('address', e.target.value, 'senderInfo')}
                placeholder="请输入详细地址（必填）"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* 3. 收件人信息区域 */}
        <div className="form-section">
          <Title level={3} className="section-title">
            <UserOutlined className="section-icon" />
            收件人信息
          </Title>
          <div className="form-grid">
            <div className="form-field">
              <Text className="field-label">收件人姓名</Text>
              <Input
                value={orderData.addressseeInfo.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value, 'addressseeInfo')}
                placeholder="请输入收件人姓名（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">手机号码</Text>
              <Input
                value={orderData.addressseeInfo.phone || ''}
                onChange={(e) => handleTextChange('phone', e.target.value, 'addressseeInfo')}
                placeholder="请输入收件人手机号（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">固定电话</Text>
              <Input
                value={orderData.addressseeInfo.telephone || ''}
                onChange={(e) => handleTextChange('telephone', e.target.value, 'addressseeInfo')}
                placeholder="请输入固定电话（选填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">UUID</Text>
              <Input
                value={orderData.addressseeInfo.uuid || ''}
                onChange={(e) => handleTextChange('uuid', e.target.value, 'addressseeInfo')}
                placeholder="请输入UUID（选填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">省份</Text>
              <Input
                value={orderData.addressseeInfo.province || ''}
                onChange={(e) => handleTextChange('province', e.target.value, 'addressseeInfo')}
                placeholder="请输入省份（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">城市</Text>
              <Input
                value={orderData.addressseeInfo.city || ''}
                onChange={(e) => handleTextChange('city', e.target.value, 'addressseeInfo')}
                placeholder="请输入城市（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field">
              <Text className="field-label">区/县</Text>
              <Input
                value={orderData.addressseeInfo.district || ''}
                onChange={(e) => handleTextChange('district', e.target.value, 'addressseeInfo')}
                placeholder="请输入区/县（必填）"
                className="form-input"
              />
            </div>
            <div className="form-field span-2">
              <Text className="field-label">详细地址</Text>
              <Input
                value={orderData.addressseeInfo.address || ''}
                onChange={(e) => handleTextChange('address', e.target.value, 'addressseeInfo')}
                placeholder="请输入详细地址（必填）"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* 4. 快递信息区域 */}
        <div className="form-section">
          <Title level={3} className="section-title">
            <BoxPlotOutlined className="section-icon" />
            快递信息
          </Title>
          <div className="form-grid">
            <div className="form-field">
              <Text className="field-label">快递类型</Text>
              <Select
                value={orderData.expressInfo.type}
                onChange={(val) => handleSelectChange('type', val, 'expressInfo')}
                placeholder="请选择快递类型"
                className="form-input"
                style={{ width: '100%' }}
              >
                {fieldOptions.expressType.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="form-field">
              <Text className="field-label">重量(kg)</Text>
              <InputNumber
                value={orderData.expressInfo.weight}
                onChange={(val) => handleNumberChange('weight', val, 'expressInfo')}
                min={0.1}
                step={0.1}
                placeholder="请输入重量（必填）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">体积(m³)</Text>
              <InputNumber
                value={orderData.expressInfo.volume}
                onChange={(val) => handleNumberChange('volume', val, 'expressInfo')}
                min={0.001}
                step={0.001}
                placeholder="请输入体积（选填）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">计费比例</Text>
              <InputNumber
                value={orderData.expressInfo.ratio}
                onChange={(val) => handleNumberChange('ratio', val, 'expressInfo')}
                min={1000}
                max={10000}
                step={100}
                placeholder="请输入计费比例"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">长度(cm)</Text>
              <InputNumber
                value={orderData.expressInfo.length}
                onChange={(val) => handleNumberChange('length', val, 'expressInfo')}
                min={1}
                step={1}
                placeholder="请输入长度（选填）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">宽度(cm)</Text>
              <InputNumber
                value={orderData.expressInfo.width}
                onChange={(val) => handleNumberChange('width', val, 'expressInfo')}
                min={1}
                step={1}
                placeholder="请输入宽度（选填）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">高度(cm)</Text>
              <InputNumber
                value={orderData.expressInfo.height}
                onChange={(val) => handleNumberChange('height', val, 'expressInfo')}
                min={1}
                step={1}
                placeholder="请输入高度（选填）"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">官方价格(元)</Text>
              <InputNumber
                value={orderData.expressInfo.officalMoney}
                disabled={true}
                min={0.01}
                step={0.01}
                placeholder="自动计算"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">总价(元)</Text>
              <InputNumber
                value={orderData.expressInfo.totalMoney}
                disabled={true}
                min={0.01}
                step={0.01}
                placeholder="自动计算"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">代理价格(元)</Text>
              <InputNumber
                value={orderData.expressInfo.agentMoney}
                onChange={(val) => handleNumberChange('agentMoney', val, 'expressInfo')}
                min={0}
                step={0.01}
                placeholder="请输入代理价格"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">利润(元)</Text>
              <InputNumber
                value={orderData.expressInfo.profitMoney}
                disabled={true}
                min={0}
                step={0.00001}
                placeholder="自动计算"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-field">
              <Text className="field-label">快递详情</Text>
              <Input
                value={orderData.expressInfo.detail || ''}
                onChange={(e) => handleTextChange('detail', e.target.value, 'expressInfo')}
                placeholder="请输入快递详情（选填）"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="action-buttons">
          <Button 
            onClick={handleReset}
            style={{height: '40px', width: '120px'}}
          >
            重置表单
          </Button>
          <Button 
            icon={<CheckOutlined />} 
            type="primary" 
            className="pay-button"
            onClick={handlePay}
            disabled={!orderData.trackId || !orderData.itemName || !orderData.expressInfo.totalMoney}
          >
            提交订单并支付
          </Button>
        </div>
      </Card>

      {/* 支付弹窗 */}
      <OrderPay
        visible={payModalVisible}
        totalMoney={orderData.expressInfo.totalMoney}
        onPay={handleConfirmPay}
        onCancel={handleCancelPay}
      />
    </div>
  );
};

export default CreateOrder;