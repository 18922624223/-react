// src/component/Button.jsx
import React from 'react';
import { Button } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  UndoOutlined 
} from '@ant-design/icons';

// 查看详情按钮
export const ViewButton = ({ onClick, children = "查看详情", ...props }) => (
  <Button
    type="default"
    icon={<EyeOutlined />}
    style={{ backgroundColor: '#f0f0f0', borderColor: '#d9d9d9' }}
    onClick={onClick}
    {...props}
  >
    {children}
  </Button>
);

// 编辑按钮
export const EditButton = ({ onClick, children = "修改", ...props }) => (
  <Button
    type="primary"
    icon={<EditOutlined />}
    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
    onClick={onClick}
    {...props}
  >
    {children}
  </Button>
);

// 删除按钮
export const DeleteButton = ({ onConfirm, children = "删除", ...props }) => (
  <Button
    type="primary"
    danger
    icon={<DeleteOutlined />}
    {...props}
  >
    {children}
  </Button>
);

// 添加按钮
export const AddButton = ({ onClick, children = "添加", icon = <PlusOutlined />, ...props }) => (
  <Button
    type="primary"
    icon={icon}
    className="add-button"
    onClick={onClick}
    {...props}
  >
    {children}
  </Button>
);

// 重置按钮
export const ResetButton = ({ onClick, children = "重置", icon = <UndoOutlined />, ...props }) => (
  <Button
    type="default"
    className="reset-button"
    onClick={onClick}
    icon={icon}
    {...props}
  >
    {children}
  </Button>
);