// src/pages/Order/Order.jsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Descriptions, message, Popconfirm, Form, Input, Select, Pagination, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import { CheckOutlined } from '@ant-design/icons';
import './Order.css';
import { Space } from 'antd';
import moment from 'moment';
import OrderPay from '../CreateOrder/OrderPay'; // 添加这行
// 在文件顶部的 import 语句中添加（如果还没有）
import { Typography, InputNumber } from 'antd';
const { Text } = Typography; // 如果还没有这行
const { Option } = Select;
const { Search } = Input;

const Order = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  // 添加揽收相关状态
const [pickupVisible, setPickupVisible] = useState(false);
const [pickupRecord, setPickupRecord] = useState(null);
const [pickupForm] = Form.useForm();
const [feeDifferenceText, setFeeDifferenceText] = useState('金额无差异');
// 添加状态
// 添加补款相关状态
const [showCompensationReminder, setShowCompensationReminder] = useState(false);
const [compensationOrder, setCompensationOrder] = useState(null);
const [payModalVisible, setPayModalVisible] = useState(false); // 添加这行


// 监听 actualAmount 变化
useEffect(() => {
  const actualAmount = pickupForm.getFieldValue('actualAmount') || 0;
  const paidAmount = parseFloat(pickupRecord?.express_info?.totalMoney || 0);

  if (paidAmount > actualAmount) {
    setFeeDifferenceText(`将返还账户 ${(paidAmount - actualAmount).toFixed(2)} 元`);
  } else if (paidAmount < actualAmount) {
    setFeeDifferenceText(`还需支付 ${(actualAmount - paidAmount).toFixed(2)} 元`);
  } else {
    setFeeDifferenceText('金额无差异');
  }
}, [pickupRecord, pickupForm.getFieldValue('actualAmount')]);
// 添加揽收处理函数
const handlePickup = (record) => {
  setPickupRecord(record);
  setPickupVisible(true);
  // 设置表单默认值
  pickupForm.setFieldsValue({
    courierName: '',
    courierPhone: '',
    actualAmount: record.express_info?.totalMoney || 0,
  });
};

// 保存揽收信息
// 在 Order.jsx 中的 handleSavePickup 函数中添加补款逻辑
// 保存揽收信息
const handleSavePickup = () => {
  pickupForm.validateFields().then(values => {
    const { actualAmount } = values;
    const paidAmount = parseFloat(pickupRecord.express_info.totalMoney);
    const actualAmountNum = parseFloat(actualAmount);

    let refundOrPay = 0;
    let messageText = '';

    if (paidAmount > actualAmountNum) {
      refundOrPay = paidAmount - actualAmountNum;
      messageText = `将返还账户 ${refundOrPay.toFixed(2)} 元`;
    } else if (paidAmount < actualAmountNum) {
      refundOrPay = actualAmountNum - paidAmount;
      messageText = `还需支付 ${refundOrPay.toFixed(2)} 元`;
    }

    // ✅ 更新原订单：设置为“待补差”
    const updatedData = orderData.map(item => {
      if (item.key === pickupRecord.key) {
        return {
          ...item,
          status: '5', // 待补差
          express_info: {
            ...item.express_info,
           officalMoney: refundOrPay.toString(),
  totalMoney: refundOrPay.toString(), // 更新为实际金额
          }
        };
      }
      return item;
    });

    setOrderData(updatedData);
    setPickupVisible(false);
    message.success('订单已成功揽收，等待补款');

    // ✅ 创建补款订单（仅当需要补款时）
    if (actualAmountNum > paidAmount) {
      const newOrder = {
        key: `COMP-${Date.now()}`,
        id: `COMP-${Date.now()}`,
        name: '补款',
        platform: pickupRecord.platform,
        companyId: '',
        priceStrategyId: '',
        tag: '',
        tagcolor: '',
        pagename: '',
        type: '1',
        banOrder: '0',
        notice: '补款订单',
        status: '5', // 待补差
        couponId: '',
        trackId: '',
        uuid: '',
        ydId: '',
        channelId: pickupRecord.channelId,
        expressId: '',
        senderInfoId: 1,
        addressseeInfoId: 1,
        pickUpStartTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        pickUpEndTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        itemName: '补款',
        packageNum: 1,
        deliveryBusiness: pickupRecord.deliveryBusiness,
        deliveryType: pickupRecord.deliveryType,
        customerType: pickupRecord.customerType,
        senderInfo: {
          id: 1,
          uuid: '',
          name: '系统',
          phone: '',
          telephone: '',
          province: '',
          city: '',
          district: '',
          address: ''
        },
        addressseeInfo: {
          id: 1,
          uuid: '',
          name: '系统',
          phone: '',
          telephone: '',
          province: '',
          city: '',
          district: '',
          address: ''
        },
        express_info: {
          trackId: '',
          type: pickupRecord.express_info.type,
          weight: pickupRecord.express_info.weight,
          volume: pickupRecord.express_info.volume,
          length: pickupRecord.express_info.length,
          width: pickupRecord.express_info.width,
          height: pickupRecord.express_info.height,
          ratio: pickupRecord.express_info.ratio,
          officalMoney: refundOrPay.toString(),
          totalMoney: refundOrPay.toString(), // ✅ 差额作为总金额
          agentMoney: '0',
          profitMoney: '0'
        }
      };

      const existingOrders = JSON.parse(localStorage.getItem('orderData') || '[]');
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('orderData', JSON.stringify(updatedOrders));

      // 设置补款提醒
      setCompensationOrder(newOrder);
      setShowCompensationReminder(true);
    }
  }).catch(error => {
    console.log('表单验证失败:', error);
  });
};
// 关闭揽收弹窗
const handleClosePickup = () => {
  setPickupVisible(false);
  setPickupRecord(null);
  pickupForm.resetFields();
};

 const [orderData, setOrderData] = useState(() => {
  const savedData = localStorage.getItem('orderData');
  return savedData ? JSON.parse(savedData) : [
    {
      key: '1',
      id: 'ORD001',
      name: '张三',
      platform: 'YD',
      companyId: 'CP001',
      priceStrategyId: 'PS100001',
      tag: '重要客户',
      tagcolor: 'blue',
      pagename: '首页推荐',
      type: '1',
      banOrder: '0',
      notice: '易碎品，轻拿轻放',
      status: '1',
      couponId: 'C001',
      trackId: 'TRK000001',
      uuid: 'uuid-001',
      ydId: 'YD001',
      channelId: 1001,
      expressId: 'EXP001',
      senderInfoId: 1,
      addressseeInfoId: 1,
      pickUpStartTime: '2024-01-01',
      pickUpEndTime: '2024-01-02',
      itemName: '食品',
      packageNum: 1,
      deliveryBusiness: '德邦快递',
      deliveryType: 'DOP',
      customerType: 'kd',
      senderInfo: {
        id: 1,
        uuid: 'sender-uuid-001',
        name: '发货人张三',
        phone: '13800138001',
        telephone: '010-12345678',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '北京市朝阳区建国路1号'
      },
      addressseeInfo: {
        id: 1,
        uuid: 'receiver-uuid-001',
        name: '收货人李四',
        phone: '13900139001',
        telephone: '010-87654321',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        address: '上海市浦东新区陆家嘴金融中心'
      },
      express_info: {
        trackId: 'TRK000001',
        type: 1,
        weight: 1.5,
        volume: 0.5,
        length: 20,
        width: 15,
        height: 10,
        ratio: 6000,
        officalMoney: "15",
        totalMoney: "12.50",
        agentMoney: "1.00",
        profitMoney: "0.30"
      }
    },
    {
      key: '2',
      id: 'ORD002',
      name: '李四',
      platform: 'QBD',
      companyId: 'CP002',
      priceStrategyId: 'PS100002',
      tag: 'VIP客户',
      tagcolor: 'gold',
      pagename: '促销页面',
      type: '2',
      banOrder: '1',
      notice: '大件商品，需要搬运工',
      status: '2',
      couponId: 'C002',
      trackId: 'TRK000002',
      uuid: 'uuid-002',
      ydId: 'YD002',
      channelId: 1002,
      expressId: 'EXP002',
      senderInfoId: 2,
      addressseeInfoId: 2,
      pickUpStartTime: '2024-01-05',
      pickUpEndTime: '2024-01-06',
      itemName: '家电',
      packageNum: 2,
      deliveryBusiness: '顺丰速运',
      deliveryType: 'SOP',
      customerType: 'kd',
      senderInfo: {
        id: 2,
        uuid: 'sender-uuid-002',
        name: '发货人李四',
        phone: '13800138002',
        telephone: '020-12345678',
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '广州市天河区珠江新城2号'
      },
      addressseeInfo: {
        id: 2,
        uuid: 'receiver-uuid-002',
        name: '收货人王五',
        phone: '13900139002',
        telephone: '020-87654321',
        province: '浙江省',
        city: '杭州市',
        district: '西湖区',
        address: '杭州市西湖区西湖文化广场'
      },
      express_info: {
        trackId: 'TRK000002',
        type: 2,
        weight: 5.2,
        volume: 1.2,
        length: 40,
        width: 30,
        height: 25,
        ratio: 6000,
        officalMoney: "85",
        totalMoney: "72.25",
        agentMoney: "5.00",
        profitMoney: "1.50"
      }
    },
    {
      key: '3',
      id: 'ORD003',
      name: '王五',
      platform: 'YD',
      companyId: 'CP003',
      priceStrategyId: 'PS100003',
      tag: '新客户',
      tagcolor: 'green',
      pagename: '分类页面',
      type: '1',
      banOrder: '0',
      notice: '生鲜产品，需要冷链运输',
      status: '3',
      couponId: 'C003',
      trackId: 'TRK000003',
      uuid: 'uuid-003',
      ydId: 'YD003',
      channelId: 1003,
      expressId: 'EXP003',
      senderInfoId: 3,
      addressseeInfoId: 3,
      pickUpStartTime: '2024-01-10',
      pickUpEndTime: '2024-01-11',
      itemName: '生鲜',
      packageNum: 3,
      deliveryBusiness: '圆通速递',
      deliveryType: 'DOP',
      customerType: 'kd',
      senderInfo: {
        id: 3,
        uuid: 'sender-uuid-003',
        name: '发货人王五',
        phone: '13800138003',
        telephone: '021-12345678',
        province: '山东省',
        city: '青岛市',
        district: '市南区',
        address: '青岛市市南区东海西路3号'
      },
      addressseeInfo: {
        id: 3,
        uuid: 'receiver-uuid-003',
        name: '收货人赵六',
        phone: '13900139003',
        telephone: '021-87654321',
        province: '江苏省',
        city: '南京市',
        district: '鼓楼区',
        address: '南京市鼓楼区中山路1号'
      },
      express_info: {
        trackId: 'TRK000003',
        type: 1,
        weight: 2.8,
        volume: 0.8,
        length: 30,
        width: 25,
        height: 20,
        ratio: 6000,
        officalMoney: "25",
        totalMoney: "21.25",
        agentMoney: "1.50",
        profitMoney: "0.50"
      }
    },
    {
      key: '4',
      id: 'ORD004',
      name: '赵六',
      platform: 'QBD',
      companyId: 'CP001',
      priceStrategyId: 'PS100004',
      tag: '回头客',
      tagcolor: 'purple',
      pagename: '购物车推荐',
      type: '2',
      banOrder: '0',
      notice: '需要保险',
      status: '4',
      couponId: 'C004',
      trackId: 'TRK000004',
      uuid: 'uuid-004',
      ydId: 'YD004',
      channelId: 1004,
      expressId: 'EXP004',
      senderInfoId: 4,
      addressseeInfoId: 4,
      pickUpStartTime: '2024-01-15',
      pickUpEndTime: '2024-01-16',
      itemName: '电子产品',
      packageNum: 1,
      deliveryBusiness: '中通快递',
      deliveryType: 'SOP',
      customerType: 'kd',
      senderInfo: {
        id: 4,
        uuid: 'sender-uuid-004',
        name: '发货人赵六',
        phone: '13800138004',
        telephone: '022-12345678',
        province: '四川省',
        city: '成都市',
        district: '锦江区',
        address: '成都市锦江区春熙路4号'
      },
      addressseeInfo: {
        id: 4,
        uuid: 'receiver-uuid-004',
        name: '收货人孙七',
        phone: '13900139004',
        telephone: '022-87654321',
        province: '湖北省',
        city: '武汉市',
        district: '江汉区',
        address: '武汉市江汉区解放大道1号'
      },
      express_info: {
        trackId: 'TRK000004',
        type: 2,
        weight: 0.5,
        volume: 0.2,
        length: 15,
        width: 10,
        height: 5,
        ratio: 6000,
        officalMoney: "12",
        totalMoney: "10.20",
        agentMoney: "0.80",
        profitMoney: "0.25"
      }
    },
    {
      key: '5',
      id: 'ORD005',
      name: '孙七',
      platform: 'YD',
      companyId: 'CP002',
      priceStrategyId: 'PS100005',
      tag: '企业客户',
      tagcolor: 'red',
      pagename: '企业采购',
      type: '1',
      banOrder: '0',
      notice: '贵重物品，需要签收确认',
      status: '1',
      couponId: 'C005',
      trackId: 'TRK000005',
      uuid: 'uuid-005',
      ydId: 'YD005',
      channelId: 1005,
      expressId: 'EXP005',
      senderInfoId: 5,
      addressseeInfoId: 5,
      pickUpStartTime: '2024-01-20',
      pickUpEndTime: '2024-01-21',
      itemName: '办公用品',
      packageNum: 5,
      deliveryBusiness: '申通快递',
      deliveryType: 'DOP',
      customerType: 'qy',
      senderInfo: {
        id: 5,
        uuid: 'sender-uuid-005',
        name: '发货人孙七',
        phone: '13800138005',
        telephone: '023-12345678',
        province: '湖南省',
        city: '长沙市',
        district: '芙蓉区',
        address: '长沙市芙蓉区五一大道5号'
      },
      addressseeInfo: {
        id: 5,
        uuid: 'receiver-uuid-005',
        name: '收货人周八',
        phone: '13900139005',
        telephone: '023-87654321',
        province: '陕西省',
        city: '西安市',
        district: '新城区',
        address: '西安市新城区解放路1号'
      },
      express_info: {
        trackId: 'TRK000005',
        type: 1,
        weight: 8.3,
        volume: 2.1,
        length: 50,
        width: 40,
        height: 35,
        ratio: 6000,
        officalMoney: "65",
        totalMoney: "55.25",
        agentMoney: "4.00",
        profitMoney: "1.20"
      }
    },
    {
      key: '6',
      id: 'ORD006',
      name: '周八',
      platform: 'QBD',
      companyId: 'CP003',
      priceStrategyId: 'PS100006',
      tag: '个人客户',
      tagcolor: 'cyan',
      pagename: '个人订单',
      type: '2',
      banOrder: '0',
      notice: '书籍类，避免潮湿',
      status: '2',
      couponId: 'C006',
      trackId: 'TRK000006',
      uuid: 'uuid-006',
      ydId: 'YD006',
      channelId: 1006,
      expressId: 'EXP006',
      senderInfoId: 6,
      addressseeInfoId: 6,
      pickUpStartTime: '2024-01-25',
      pickUpEndTime: '2024-01-26',
      itemName: '图书',
      packageNum: 4,
      deliveryBusiness: '韵达快递',
      deliveryType: 'SOP',
      customerType: 'gr',
      senderInfo: {
        id: 6,
        uuid: 'sender-uuid-006',
        name: '发货人周八',
        phone: '13800138006',
        telephone: '024-12345678',
        province: '福建省',
        city: '福州市',
        district: '鼓楼区',
        address: '福州市鼓楼区东街口2号'
      },
      addressseeInfo: {
        id: 6,
        uuid: 'receiver-uuid-006',
        name: '收货人吴九',
        phone: '13900139006',
        telephone: '024-87654321',
        province: '辽宁省',
        city: '沈阳市',
        district: '和平区',
        address: '沈阳市和平区南京北街1号'
      },
      express_info: {
        trackId: 'TRK000006',
        type: 2,
        weight: 3.7,
        volume: 1.0,
        length: 35,
        width: 25,
        height: 20,
        ratio: 6000,
        officalMoney: "32",
        totalMoney: "27.20",
        agentMoney: "2.00",
        profitMoney: "0.60"
      }
    },
    {
      key: '7',
      id: 'ORD007',
      name: '吴九',
      platform: 'YD',
      companyId: 'CP001',
      priceStrategyId: 'PS100007',
      tag: '批发客户',
      tagcolor: 'orange',
      pagename: '批发订单',
      type: '1',
      banOrder: '1',
      notice: '批量发货，统一包装',
      status: '3',
      couponId: 'C007',
      trackId: 'TRK000007',
      uuid: 'uuid-007',
      ydId: 'YD007',
      channelId: 1007,
      expressId: 'EXP007',
      senderInfoId: 7,
      addressseeInfoId: 7,
      pickUpStartTime: '2024-02-01',
      pickUpEndTime: '2024-02-02',
      itemName: '服装',
      packageNum: 10,
      deliveryBusiness: '百世快递',
      deliveryType: 'DOP',
      customerType: 'pf',
      senderInfo: {
        id: 7,
        uuid: 'sender-uuid-007',
        name: '发货人吴九',
        phone: '13800138007',
        telephone: '025-12345678',
        province: '河南省',
        city: '郑州市',
        district: '金水区',
        address: '郑州市金水区花园路1号'
      },
      addressseeInfo: {
        id: 7,
        uuid: 'receiver-uuid-007',
        name: '收货人郑十',
        phone: '13900139007',
        telephone: '025-87654321',
        province: '河北省',
        city: '石家庄市',
        district: '长安区',
        address: '石家庄市长安区中山路1号'
      },
      express_info: {
        trackId: 'TRK000007',
        type: 1,
        weight: 15.6,
        volume: 3.5,
        length: 60,
        width: 50,
        height: 40,
        ratio: 6000,
        officalMoney: "120",
        totalMoney: "102.00",
        agentMoney: "8.00",
        profitMoney: "2.40"
      }
    },
    {
      key: '8',
      id: 'ORD008',
      name: '郑十',
      platform: 'QBD',
      companyId: 'CP002',
      priceStrategyId: 'PS100008',
      tag: '电商客户',
      tagcolor: 'magenta',
      pagename: '电商平台',
      type: '2',
      banOrder: '0',
      notice: '多件商品，分开包装',
      status: '4',
      couponId: 'C008',
      trackId: 'TRK000008',
      uuid: 'uuid-008',
      ydId: 'YD008',
      channelId: 1008,
      expressId: 'EXP008',
      senderInfoId: 8,
      addressseeInfoId: 8,
      pickUpStartTime: '2024-02-05',
      pickUpEndTime: '2024-02-06',
      itemName: '化妆品',
      packageNum: 3,
      deliveryBusiness: '天天快递',
      deliveryType: 'SOP',
      customerType: 'ds',
      senderInfo: {
        id: 8,
        uuid: 'sender-uuid-008',
        name: '发货人郑十',
        phone: '13800138008',
        telephone: '027-12345678',
        province: '安徽省',
        city: '合肥市',
        district: '包河区',
        address: '合肥市包河区芜湖路1号'
      },
      addressseeInfo: {
        id: 8,
        uuid: 'receiver-uuid-008',
        name: '收货人王一',
        phone: '13900139008',
        telephone: '027-87654321',
        province: '江西省',
        city: '南昌市',
        district: '东湖区',
        address: '南昌市东湖区八一大道1号'
      },
      express_info: {
        trackId: 'TRK000008',
        type: 2,
        weight: 2.1,
        volume: 0.6,
        length: 25,
        width: 20,
        height: 15,
        ratio: 6000,
        officalMoney: "28",
        totalMoney: "23.80",
        agentMoney: "1.80",
        profitMoney: "0.55"
      }
    },
    {
      key: '9',
      id: 'ORD009',
      name: '王一',
      platform: 'YD',
      companyId: 'CP003',
      priceStrategyId: 'PS100009',
      tag: '协议客户',
      tagcolor: 'volcano',
      pagename: '协议订单',
      type: '1',
      banOrder: '0',
      notice: '定时发货，准时送达',
      status: '1',
      couponId: 'C009',
      trackId: 'TRK000009',
      uuid: 'uuid-009',
      ydId: 'YD009',
      channelId: 1009,
      expressId: 'EXP009',
      senderInfoId: 9,
      addressseeInfoId: 9,
      pickUpStartTime: '2024-02-10',
      pickUpEndTime: '2024-02-11',
      itemName: '医疗器械',
      packageNum: 2,
      deliveryBusiness: 'EMS',
      deliveryType: 'DOP',
      customerType: 'xy',
      senderInfo: {
        id: 9,
        uuid: 'sender-uuid-009',
        name: '发货人王一',
        phone: '13800138009',
        telephone: '028-12345678',
        province: '重庆市',
        city: '重庆市',
        district: '渝中区',
        address: '重庆市渝中区解放碑1号'
      },
      addressseeInfo: {
        id: 9,
        uuid: 'receiver-uuid-009',
        name: '收货人李二',
        phone: '13900139009',
        telephone: '028-87654321',
        province: '天津市',
        city: '天津市',
        district: '和平区',
        address: '天津市和平区南京路1号'
      },
      express_info: {
        trackId: 'TRK000009',
        type: 1,
        weight: 4.5,
        volume: 1.3,
        length: 45,
        width: 35,
        height: 30,
        ratio: 6000,
        officalMoney: "55",
        totalMoney: "46.75",
        agentMoney: "3.50",
        profitMoney: "1.05"
      }
    },
    {
      key: '10',
      id: 'ORD010',
      name: '李二',
      platform: 'QBD',
      companyId: 'CP001',
      priceStrategyId: 'PS100010',
      tag: '长期客户',
      tagcolor: 'geekblue',
      pagename: '长期合作',
      type: '2',
      banOrder: '0',
      notice: '长期合作，优先处理',
      status: '2',
      couponId: 'C010',
      trackId: 'TRK000010',
      uuid: 'uuid-010',
      ydId: 'YD010',
      channelId: 1010,
      expressId: 'EXP010',
      senderInfoId: 10,
      addressseeInfoId: 10,
      pickUpStartTime: '2024-02-15',
      pickUpEndTime: '2024-02-16',
      itemName: '工艺品',
      packageNum: 1,
      deliveryBusiness: '德邦物流',
      deliveryType: 'SOP',
      customerType: 'cq',
      senderInfo: {
        id: 10,
        uuid: 'sender-uuid-010',
        name: '发货人李二',
        phone: '13800138010',
        telephone: '029-12345678',
        province: '山西省',
        city: '太原市',
        district: '小店区',
        address: '太原市小店区亲贤街1号'
      },
      addressseeInfo: {
        id: 10,
        uuid: 'receiver-uuid-010',
        name: '收货人张三',
        phone: '13900139010',
        telephone: '029-87654321',
        province: '内蒙古自治区',
        city: '呼和浩特市',
        district: '新城区',
        address: '呼和浩特市新城区新华大街1号'
      },
      express_info: {
        trackId: 'TRK000010',
        type: 2,
        weight: 6.8,
        volume: 1.8,
        length: 55,
        width: 45,
        height: 40,
        ratio: 6000,
        officalMoney: "95",
        totalMoney: "80.75",
        agentMoney: "6.00",
        profitMoney: "1.80"
      }
    }
  ];
});
// 退款处理函数
const handleRefund = (record) => {
  let newStatus;
  if (record.status === '3') {
    // 待揽收，判断是否可以退款
    // 假设存在“已退款”状态，且允许从3→-3
    newStatus = '-3';
  } else {
    // 其他情况直接取消订单
    newStatus = '-5';
  }

  const updatedData = orderData.map(item => {
    if (item.key === record.key) {
      return {
        ...item,
        status: newStatus
      };
    }
    return item;
  });

  setOrderData(updatedData);
  message.success(`订单 "${record.name}" 已申请退款，状态已更新为【${getStatusText(newStatus)}】`);
};

// 在 Order 组件中找到 useEffect 部分并替换为以下代码
useEffect(() => {
  const savedData = localStorage.getItem('orderData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      setOrderData(parsedData);
    } catch (e) {
      console.error('解析订单数据出错:', e);
    }
  }
}, []);

// 监听 orderData 变化，自动保存到 localStorage
useEffect(() => {
  localStorage.setItem('orderData', JSON.stringify(orderData));
}, [orderData]);
  // 处理搜索
  const onSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // 自定义搜索输入框
  const SearchInput = () => (
    <Space direction="vertical">
      <Search
        placeholder="订单ID"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
    </Space>
  );

  // 表格列配置
  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: (status) => {
    const statusMap = {
      '-5': { text: '订单取消', color: 'red' },
      '-4': { text: '揽收取消', color: 'red' },
      '-3': { text: '已退款', color: 'green' },
      '-2': { text: '待退款', color: 'blue' },
      '-1': { text: '订单异常', color: 'orange' },
      '0': { text: '待支付', color: 'gray' },
      '1': { text: '更换快递', color: 'yellow' },
      '2': { text: '已支付', color: 'cyan' },
      '3': { text: '待揽收', color: 'blue' },
      '4': { text: '已揽收', color: 'green' },
      '5': { text: '待补差', color: 'blue' },
      '6': { text: '待退差', color: 'blue' },
      '7': { text: '已补差', color: 'green' },
      '8': { text: '已退差', color: 'green' },
      '9': { text: '运输中', color: 'orange' },
      '10': { text: '已送达', color: 'green' }
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  }
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
          title="确定要删除这个订单吗？"
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
    {
      title: '退款',
      key: 'refund',
      render: (_, record) => (
        <Popconfirm
          title="确定要申请退款吗？"
          onConfirm={() => handleRefund(record)}
          okText="确定"
          cancelText="取消"
          disabled={record.status === '10'} // 已送达状态禁用退款
        >
          <Button 
            type="primary" 
            style={{ backgroundColor: '#f7a151ff', borderColor: '#f7a151ff' }} 
            danger 
            icon={<DeleteOutlined />}
            disabled={record.status === '10'} // 已送达状态禁用退款
          >
            退款
          </Button>
        </Popconfirm>
      ),
    },
// 在 columns 中，控制“揽收”按钮是否显示
{
  title: '揽收',
  key: 'pickup',
  render: (_, record) => (
    <Button
      type="primary"
      icon={<CheckOutlined />}
      onClick={() => handlePickup(record)}
      disabled={record.status !== '3'}>
      揽收
    </Button>
  )
}
  ];

  // 根据搜索文本过滤数据
  const filteredData = searchText
    ? orderData.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase()) ||
        item.trackId.toLowerCase().includes(searchText.toLowerCase())
      )
    : orderData;

  // 计算当前页显示的数据
  const currentPageData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 查看详情处理函数
  const handleViewDetail = (record) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 修改处理函数
  const handleEdit = (record) => {
    setCurrentRecord(record);
    // 设置表单默认值
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      platform: record.platform,
      companyId: record.companyId,
      priceStrategyId: record.priceStrategyId,
      tag: record.tag,
      tagcolor: record.tagcolor,
      pagename: record.pagename,
      type: record.type,
      banOrder: record.banOrder,
      notice: record.notice,
      status: record.status,
      couponId: record.couponId,
      trackId: record.trackId,
      uuid: record.uuid,
      ydId: record.ydId,
      channelId: record.channelId,
      expressId: record.expressId,
      senderInfoId: record.senderInfoId,
      addressseeInfoId: record.addressseeInfoId,
      pickUpStartTime: record.pickUpStartTime ? moment(record.pickUpStartTime) : null,
      pickUpEndTime: record.pickUpEndTime ? moment(record.pickUpEndTime) : null,
      itemName: record.itemName,
      packageNum: record.packageNum,
      deliveryBusiness: record.deliveryBusiness,
      deliveryType: record.deliveryType,
      customerType: record.customerType,
      // 发货人信息
      'senderInfo.name': record.senderInfo?.name,
      'senderInfo.phone': record.senderInfo?.phone,
      'senderInfo.telephone': record.senderInfo?.telephone,
      'senderInfo.province': record.senderInfo?.province,
      'senderInfo.city': record.senderInfo?.city,
      'senderInfo.district': record.senderInfo?.district,
      'senderInfo.address': record.senderInfo?.address,
      // 收货人信息
      'addressseeInfo.name': record.addressseeInfo?.name,
      'addressseeInfo.phone': record.addressseeInfo?.phone,
      'addressseeInfo.telephone': record.addressseeInfo?.telephone,
      'addressseeInfo.province': record.addressseeInfo?.province,
      'addressseeInfo.city': record.addressseeInfo?.city,
      'addressseeInfo.district': record.addressseeInfo?.district,
      'addressseeInfo.address': record.addressseeInfo?.address,
      // 快递信息
      'express_info.type': record.express_info?.type,
      'express_info.weight': record.express_info?.weight,
      'express_info.volume': record.express_info?.volume,
      'express_info.length': record.express_info?.length,
      'express_info.width': record.express_info?.width,
      'express_info.height': record.express_info?.height,
      'express_info.ratio': record.express_info?.ratio,
      'express_info.officalMoney': record.express_info?.officalMoney,
      'express_info.totalMoney': record.express_info?.totalMoney,
      'express_info.agentMoney': record.express_info?.agentMoney,
      'express_info.profitMoney': record.express_info?.profitMoney
    });
    setEditVisible(true);
  };

  // 保存修改
const handleSaveEdit = () => {
  editForm.validateFields().then(values => {
    const {
      pickUpStartTime,
      pickUpEndTime,
      ...otherValues
    } = values;

    // 手动提取嵌套字段
    const senderInfo = {
      name: values['senderInfo.name'],
      phone: values['senderInfo.phone'],
      telephone: values['senderInfo.telephone'],
      province: values['senderInfo.province'],
      city: values['senderInfo.city'],
      district: values['senderInfo.district'],
      address: values['senderInfo.address']
    };

    const addressseeInfo = {
      name: values['addressseeInfo.name'],
      phone: values['addressseeInfo.phone'],
      telephone: values['addressseeInfo.telephone'],
      province: values['addressseeInfo.province'],
      city: values['addressseeInfo.city'],
      district: values['addressseeInfo.district'],
      address: values['addressseeInfo.address']
    };

    const express_info = {
      type: values['express_info.type'],
      weight: values['express_info.weight'],
      volume: values['express_info.volume'],
      length: values['express_info.length'],
      width: values['express_info.width'],
      height: values['express_info.height'],
      ratio: values['express_info.ratio'],
      officalMoney: values['express_info.officalMoney'],
      totalMoney: values['express_info.totalMoney'],
      agentMoney: values['express_info.agentMoney'],
      profitMoney: values['express_info.profitMoney']
    };

    const updatedValues = {
      ...otherValues,
      pickUpStartTime: pickUpStartTime ? pickUpStartTime.format('YYYY-MM-DD') : '',
      pickUpEndTime: pickUpEndTime ? pickUpEndTime.format('YYYY-MM-DD') : '',
      senderInfo,
      addressseeInfo,
      express_info
    };

    // 更新数据
    const updatedData = orderData.map(item => {
      if (item.key === currentRecord.key) {
        return { ...item, ...updatedValues };
      }
      return item;
    });

    setOrderData(updatedData);
    setEditVisible(false);
    message.success('订单信息已更新');
  }).catch(error => {
    console.log('验证失败:', error);
  });
};
  // 删除处理函数
  const handleDelete = (record) => {
    // 从数据中移除该记录
    const newData = orderData.filter(item => item.key !== record.key);
    setOrderData(newData);
    message.success(`订单 "${record.name}" 已删除`);
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
    const newKey = `${orderData.length + 1}`;
    const newRecord = {
      key: newKey,
      id: `ORD${String(newKey).padStart(3, '0')}`,
      ...values,
      uuid: values.uuid || `uuid-${Date.now()}`,
      senderInfo: {
        name: values['senderInfo.name'],
        phone: values['senderInfo.phone'],
        telephone: values['senderInfo.telephone'],
        province: values['senderInfo.province'],
        city: values['senderInfo.city'],
        district: values['senderInfo.district'],
        address: values['senderInfo.address']
      },
      addressseeInfo: {
        name: values['addressseeInfo.name'],
        phone: values['addressseeInfo.phone'],
        telephone: values['addressseeInfo.telephone'],
        province: values['addressseeInfo.province'],
        city: values['addressseeInfo.city'],
        district: values['addressseeInfo.district'],
        address: values['addressseeInfo.address']
      },
      express_info: {
        type: values['express_info.type'],
        weight: values['express_info.weight'],
        volume: values['express_info.volume'],
        length: values['express_info.length'],
        width: values['express_info.width'],
        height: values['express_info.height'],
        ratio: values['express_info.ratio'],
        officalMoney: values['express_info.officalMoney'],
        totalMoney: values['express_info.totalMoney'],
        agentMoney: values['express_info.agentMoney'],
        profitMoney: values['express_info.profitMoney']
      },
      // ✅ 显式转换日期为字符串
      pickUpStartTime: values.pickUpStartTime ? values.pickUpStartTime.format('YYYY-MM-DD') : '',
      pickUpEndTime: values.pickUpEndTime ? values.pickUpEndTime.format('YYYY-MM-DD') : ''
    };

    setOrderData([...orderData, newRecord]);
    setAddVisible(false);
    addForm.resetFields();
    message.success('订单添加成功');
  }).catch(error => {
    console.log('验证失败:', error);
  });
};

// 关闭添加弹框
const handleCloseAdd = () => {
  setAddVisible(false);
  addForm.resetFields();
};
  // 获取状态描述
const getStatusText = (status) => {
  const statusMap = {
    '-5': '订单取消',
    '-4': '揽收取消',
    '-3': '已退款',
    '-2': '待退款',
    '-1': '订单异常',
    '0': '待支付',
    '1': '更换快递',
    '2': '已支付',
    '3': '待揽收',
    '4': '已揽收',
    '5': '待补差',
    '6': '待退差',
    '7': '已补差',
    '8': '已退差',
    '9': '运输中',
    '10': '已送达'
  };
  return statusMap[status] || '未知';
};
  // 获取类型描述
  const getTypeText = (type) => {
    const typeMap = {
      '1': '快递',
      '2': '物流'
    };
    return typeMap[type] || '未知';
  };

  // 获取平台描述
  const getPlatformText = (platform) => {
    const platformMap = {
      'YD': '圆通',
      'QBD': '全班达'
    };
    return platformMap[platform] || '未知';
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
       {showCompensationReminder}
      <h2>订单信息表</h2>
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
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
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
          pageSizeOptions={['10', '20', '50']}
        />
      </div>
          <OrderPay
      visible={payModalVisible}
      totalMoney={compensationOrder?.express_info?.totalMoney}
      onPay={() => {
        // 更新补款订单状态为已支付
        const updatedOrders = JSON.parse(localStorage.getItem('orderData') || '[]').map(order => {
          if (order.key === compensationOrder.key) {
            return {
              ...order,
              status: '2' // 已支付
            };
          }
          return order;
        });
        
        localStorage.setItem('orderData', JSON.stringify(updatedOrders));
        setOrderData(updatedOrders);
        setPayModalVisible(false);
        setShowCompensationReminder(false);
        message.success('补款支付成功！');
      }}
      onCancel={() => setPayModalVisible(false)}
    />

      {/* 详情弹框 */}
      <Modal
        title="订单详情"
        visible={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {currentRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="订单ID" span={2}>{currentRecord.id}</Descriptions.Item>
            <Descriptions.Item label="客户名称">{currentRecord.name}</Descriptions.Item>
            <Descriptions.Item label="平台">{getPlatformText(currentRecord.platform)}</Descriptions.Item>
            <Descriptions.Item label="公司ID">{currentRecord.companyId}</Descriptions.Item>
            <Descriptions.Item label="价格策略ID">{currentRecord.priceStrategyId}</Descriptions.Item>
            <Descriptions.Item label="标签">{currentRecord.tag}</Descriptions.Item>
            <Descriptions.Item label="标签颜色">{currentRecord.tagcolor}</Descriptions.Item>
            <Descriptions.Item label="页面名称">{currentRecord.pagename}</Descriptions.Item>
            <Descriptions.Item label="类型">{getTypeText(currentRecord.type)}</Descriptions.Item>
            <Descriptions.Item label="禁止下单">{currentRecord.banOrder === '1' ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="备注">{currentRecord.notice}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentRecord.status === '-5' ? 'pink' :
                currentRecord.status === '-4' ? 'red' :
                currentRecord.status === '-3' ? 'orange' :
                currentRecord.status === '-2' ? 'green' :
                currentRecord.status === '-1' ? 'blue' :
                currentRecord.status === '0' ? 'gray' :
                currentRecord.status === '1' ? 'purple' :
                currentRecord.status === '2' ? 'cyan' :
                currentRecord.status === '3' ? 'cyan' :
                currentRecord.status === '4' ? 'gray' :
                currentRecord.status === '5' ? 'red' :
                currentRecord.status === '6' ? 'pink' :
                currentRecord.status === '7' ? 'blue' :
                currentRecord.status === '8' ? 'green' :
                currentRecord.status === '9' ? 'orange' :
                currentRecord.status === '10' ? 'green' : 'default'
              }> {getStatusText(currentRecord.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="优惠券ID">{currentRecord.couponId}</Descriptions.Item>
            <Descriptions.Item label="追踪ID">{currentRecord.trackId}</Descriptions.Item>
            <Descriptions.Item label="UUID">{currentRecord.uuid}</Descriptions.Item>
            <Descriptions.Item label="圆通ID">{currentRecord.ydId}</Descriptions.Item>
            <Descriptions.Item label="渠道ID">{currentRecord.channelId}</Descriptions.Item>
            <Descriptions.Item label="快递ID">{currentRecord.expressId}</Descriptions.Item>
            <Descriptions.Item label="发货人ID">{currentRecord.senderInfoId}</Descriptions.Item>
            <Descriptions.Item label="收货人ID">{currentRecord.addressseeInfoId}</Descriptions.Item>
            <Descriptions.Item label="取件开始时间">{currentRecord?.pickUpStartTime||'-'}</Descriptions.Item>
            <Descriptions.Item label="取件结束时间">{currentRecord?.pickUpEndTime||'-'}</Descriptions.Item>
            <Descriptions.Item label="物品名称">{currentRecord.itemName}</Descriptions.Item>
            <Descriptions.Item label="包裹数量">{currentRecord.packageNum}</Descriptions.Item>
            <Descriptions.Item label="快递公司">{currentRecord.deliveryBusiness}</Descriptions.Item>
            <Descriptions.Item label="配送类型">{currentRecord.deliveryType}</Descriptions.Item>
            <Descriptions.Item label="客户类型">{currentRecord.customerType}</Descriptions.Item>
            
            {/* 发货人信息 */}
            <Descriptions.Item label="发货人姓名" span={2}>{currentRecord.senderInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="发货人手机">{currentRecord.senderInfo?.phone}</Descriptions.Item>
            <Descriptions.Item label="发货人电话">{currentRecord.senderInfo?.telephone}</Descriptions.Item>
            <Descriptions.Item label="发货省">{currentRecord.senderInfo?.province}</Descriptions.Item>
            <Descriptions.Item label="发货市">{currentRecord.senderInfo?.city}</Descriptions.Item>
            <Descriptions.Item label="发货区">{currentRecord.senderInfo?.district}</Descriptions.Item>
            <Descriptions.Item label="发货地址" span={2}>{currentRecord.senderInfo?.address}</Descriptions.Item>
            
            {/* 收货人信息 */}
            <Descriptions.Item label="收货人姓名" span={2}>{currentRecord.addressseeInfo?.name}</Descriptions.Item>
            <Descriptions.Item label="收货人手机">{currentRecord.addressseeInfo?.phone}</Descriptions.Item>
            <Descriptions.Item label="收货人电话">{currentRecord.addressseeInfo?.telephone}</Descriptions.Item>
            <Descriptions.Item label="收货省">{currentRecord.addressseeInfo?.province}</Descriptions.Item>
            <Descriptions.Item label="收货市">{currentRecord.addressseeInfo?.city}</Descriptions.Item>
            <Descriptions.Item label="收货区">{currentRecord.addressseeInfo?.district}</Descriptions.Item>
            <Descriptions.Item label="收货地址" span={2}>{currentRecord.addressseeInfo?.address}</Descriptions.Item>
            
            {/* 快递信息 */}
            <Descriptions.Item label="快递类型">{currentRecord.express_info?.type}</Descriptions.Item>
            <Descriptions.Item label="重量(KG)">{currentRecord.express_info?.weight}</Descriptions.Item>
            <Descriptions.Item label="体积(M³)">{currentRecord.express_info?.volume}</Descriptions.Item>
            <Descriptions.Item label="长(CM)">{currentRecord.express_info?.length}</Descriptions.Item>
            <Descriptions.Item label="宽(CM)">{currentRecord.express_info?.width}</Descriptions.Item>
            <Descriptions.Item label="高(CM)">{currentRecord.express_info?.height}</Descriptions.Item>
            <Descriptions.Item label="比率">{currentRecord.express_info?.ratio}</Descriptions.Item>
            <Descriptions.Item label="官方费用">{currentRecord.express_info?.officalMoney}</Descriptions.Item>
            <Descriptions.Item label="总费用">{currentRecord.express_info?.totalMoney}</Descriptions.Item>
            <Descriptions.Item label="代理费用">{currentRecord.express_info?.agentMoney}</Descriptions.Item>
            <Descriptions.Item label="利润">{currentRecord.express_info?.profitMoney}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 修改弹框 */}
      <Modal
        title="修改订单"
        visible={editVisible}
        onCancel={handleCloseEdit}
        onOk={handleSaveEdit}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={editForm} layout="vertical">
          <h3>基本信息</h3>
          <Form.Item name="id" label="订单ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select>
              <Option value="YD">圆通(YD)</Option>
              <Option value="QBD">全班达(QBD)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="companyId" label="公司ID">
            <Input />
          </Form.Item>
          <Form.Item name="priceStrategyId" label="价格策略ID">
            <Input />
          </Form.Item>
          <Form.Item name="tag" label="标签">
            <Input />
          </Form.Item>
          <Form.Item name="tagcolor" label="标签颜色">
            <Input />
          </Form.Item>
          <Form.Item name="pagename" label="页面名称">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Option value="1">快递</Option>
              <Option value="2">物流</Option>
            </Select>
          </Form.Item>
          <Form.Item name="banOrder" label="禁止下单">
            <Select>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notice" label="备注">
            <Input.TextArea rows={4} />
          </Form.Item>
<Form.Item name="status" label="状态" rules={[{ required: true }]}>
  <Select>
    <Option value="-5">订单取消</Option>
    <Option value="-4">揽收取消</Option>
    <Option value="-3">已退款</Option>
    <Option value="-2">待退款</Option>
    <Option value="-1">订单异常</Option>
    <Option value="0">待支付</Option>
    <Option value="1">更换快递</Option>
    <Option value="2">已支付</Option>
    <Option value="3">待揽收</Option>
    <Option value="4">已揽收</Option>
    <Option value="5">待补差</Option>
    <Option value="6">待退差</Option>
    <Option value="7">已补差</Option>
    <Option value="8">已退差</Option>
    <Option value="9">运输中</Option>
    <Option value="10">已送达</Option>
  </Select>
</Form.Item>
          <Form.Item name="couponId" label="优惠券ID">
            <Input />
          </Form.Item>
          <Form.Item name="trackId" label="追踪ID">
            <Input />
          </Form.Item>
          
          <h3>扩展信息</h3>
          <Form.Item name="uuid" label="UUID">
            <Input />
          </Form.Item>
          <Form.Item name="ydId" label="圆通ID">
            <Input />
          </Form.Item>
          <Form.Item name="channelId" label="渠道ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="expressId" label="快递ID">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfoId" label="发货人ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="addressseeInfoId" label="收货人ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="pickUpStartTime" label="取件开始时间">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="pickUpEndTime" label="取件结束时间">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="itemName" label="物品名称">
            <Input />
          </Form.Item>
          <Form.Item name="packageNum" label="包裹数量">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="deliveryBusiness" label="快递公司">
            <Input />
          </Form.Item>
          <Form.Item name="deliveryType" label="配送类型">
            <Input />
          </Form.Item>
          <Form.Item name="customerType" label="客户类型">
            <Input />
          </Form.Item>
          
          <h3>发货人信息</h3>
          <Form.Item name="senderInfo.name" label="发货人姓名">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.phone" label="发货人手机">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.telephone" label="发货人电话">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.province" label="发货省">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.city" label="发货市">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.district" label="发货区">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.address" label="发货地址">
            <Input />
          </Form.Item>
          
          <h3>收货人信息</h3>
          <Form.Item name="addressseeInfo.name" label="收货人姓名">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.phone" label="收货人手机">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.telephone" label="收货人电话">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.province" label="收货省">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.city" label="收货市">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.district" label="收货区">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.address" label="收货地址">
            <Input />
          </Form.Item>
          
          <h3>快递信息</h3>
          <Form.Item name="express_info.type" label="快递类型">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.weight" label="重量(KG)">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="express_info.volume" label="体积(M³)">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="express_info.length" label="长(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.width" label="宽(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.height" label="高(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.ratio" label="比率">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.officalMoney" label="官方费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.totalMoney" label="总费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.agentMoney" label="代理费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.profitMoney" label="利润">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 添加订单弹窗 */}
      <Modal
        title="添加订单"
        visible={addVisible}
        onCancel={handleCloseAdd}
        onOk={handleSaveAdd}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={addForm} layout="vertical">
          <h3>基本信息</h3>
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select>
              <Option value="YD">圆通(YD)</Option>
              <Option value="QBD">全班达(QBD)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="companyId" label="公司ID">
            <Input />
          </Form.Item>
          <Form.Item name="priceStrategyId" label="价格策略ID">
            <Input />
          </Form.Item>
          <Form.Item name="tag" label="标签">
            <Input />
          </Form.Item>
          <Form.Item name="tagcolor" label="标签颜色">
            <Input />
          </Form.Item>
          <Form.Item name="pagename" label="页面名称">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select>
              <Option value="1">快递</Option>
              <Option value="2">物流</Option>
            </Select>
          </Form.Item>
          <Form.Item name="banOrder" label="禁止下单">
            <Select>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notice" label="备注">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="-4">已取消</Option>
              <Option value="-3">订单异常</Option>
              <Option value="-2">退款成功</Option>
              <Option value="-1">申请退款</Option>
              <Option value="0">已下单未支付</Option>
              <Option value="1">已支付代通知快递</Option>
              <Option value="2">已通知快递</Option>
              <Option value="3">已取件</Option>
              <Option value="4">已送达</Option>
            </Select>
          </Form.Item>
          <Form.Item name="couponId" label="优惠券ID">
            <Input />
          </Form.Item>
          <Form.Item name="trackId" label="追踪ID">
            <Input />
          </Form.Item>
          
          <h3>扩展信息</h3>
          <Form.Item name="itemName" label="物品名称">
            <Input />
          </Form.Item>
          <Form.Item name="packageNum" label="包裹数量">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="deliveryBusiness" label="快递公司">
            <Input />
          </Form.Item>
          <Form.Item name="deliveryType" label="配送类型">
            <Input />
          </Form.Item>
          <Form.Item name="customerType" label="客户类型">
            <Input />
          </Form.Item>
          <Form.Item name="uuid" label="UUID">
            <Input />
          </Form.Item>
          <Form.Item name="ydId" label="圆通ID">
            <Input />
          </Form.Item>
          <Form.Item name="channelId" label="渠道ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="expressId" label="快递ID">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfoId" label="发货人ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="addressseeInfoId" label="收货人ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="pickUpStartTime" label="取件开始时间">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="pickUpEndTime" label="取件结束时间">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="itemName" label="物品名称">
            <Input />
          </Form.Item>
          <Form.Item name="packageNum" label="包裹数量">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="deliveryBusiness" label="快递公司">
            <Input />
          </Form.Item>
          <Form.Item name="deliveryType" label="配送类型">
            <Input />
          </Form.Item>
          <Form.Item name="customerType" label="客户类型">
            <Input />
          </Form.Item>

          <h3>发货人信息</h3>
          <Form.Item name="senderInfo.name" label="发货人姓名">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.phone" label="发货人手机">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.telephone" label="发货人电话">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.province" label="发货省">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.city" label="发货市">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.district" label="发货区">
            <Input />
          </Form.Item>
          <Form.Item name="senderInfo.address" label="发货地址">
            <Input />
          </Form.Item>

          <h3>收货人信息</h3>
          <Form.Item name="addressseeInfo.name" label="收货人姓名">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.phone" label="收货人手机">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.telephone" label="收货人电话">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.province" label="收货省">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.city" label="收货市">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.district" label="收货区">
            <Input />
          </Form.Item>
          <Form.Item name="addressseeInfo.address" label="收货地址">
            <Input />
          </Form.Item>

          <h3>快递信息</h3>
          <Form.Item name="express_info.type" label="快递类型">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.weight" label="重量(KG)">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="express_info.volume" label="体积(M³)">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="express_info.length" label="长(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.width" label="宽(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.height" label="高(CM)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.ratio" label="比率">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="express_info.officalMoney" label="官方费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.totalMoney" label="总费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.agentMoney" label="代理费用">
            <Input />
          </Form.Item>
          <Form.Item name="express_info.profitMoney" label="利润">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

{/* 订单揽收模态框 */}
      <Modal
        title="订单揽收"
        visible={pickupVisible}
        onCancel={handleClosePickup}
        footer={[
          <Button key="cancel" onClick={handleClosePickup}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleSavePickup}>
            OK
          </Button>
        ]}
        width={500}
      >
        <div style={{ padding: '20px' }}>
          <p><strong>订单号：</strong>{pickupRecord?.id}</p>
          <p><strong>客户名称：</strong>{pickupRecord?.name}</p>
          <p><strong>支付金额：</strong>¥{parseFloat(pickupRecord?.express_info.totalMoney || 0).toFixed(2)}</p>

          <Form form={pickupForm} layout="vertical">
            <Form.Item
              name="courierName"
              label="快递员姓名"
              rules={[{ required: true, message: '请输入快递员姓名' }]}
            >
              <Input placeholder="请输入快递员姓名" />
            </Form.Item>

            <Form.Item
              name="courierPhone"
              label="快递员电话"
              rules={[{ required: true, message: '请输入快递员电话' }]}
            >
              <Input placeholder="请输入快递员电话" />
            </Form.Item>

            <Form.Item
              name="actualAmount"
              label="实际金额"
              rules={[{ required: true, message: '请输入实际金额' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                formatter={(value) => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/¥|,/g, '')}
                placeholder="请输入实际金额"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

    </div>
  );
}


export default Order;