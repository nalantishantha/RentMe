"use client";

import { useState } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Checkbox, Button, Row, Col, Upload, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { propertyApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContex";

const { Option } = Select;

export default function AddPropertyPage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const {token} = useAuth();

  const onFinish = async (values: any) => {
    try {
      await propertyApi.create(values, token!);
      message.success("Property added successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to add property")
    }
    
    // console.log({ ...values, images: fileList });
  };

  // const handleChange = ({ fileList: newFileList }: any) => {
  //   setFileList(newFileList);
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-16">
        <h1 className="text-center text-5xl font-extrabold text-gray-800 mb-10">Add New Property</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-12 rounded-2xl shadow-lg max-w-3xl mx-auto text-lg"
          style={{ fontSize: '1.25rem' }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the property title" }]}
          >
            <Input maxLength={250} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            initialValue="house"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="house">House</Option>
              <Option value="annex">Annex</Option>
              <Option value="room">Room</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="City" name="city">
            <Input maxLength={150} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Price Per Month"
                name="price_per_month"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber min={0} precision={2} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Currency" name="currency" initialValue="LKR">
                <Select>
                  <Option value="LKR">LKR</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Bedrooms" name="bedrooms">
                <InputNumber min={0} max={99} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bathrooms" name="bathrooms">
                <InputNumber min={0} max={99} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Area (sqm)" name="area_sqm">
                <InputNumber min={0} precision={2} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>


          <Form.Item name="furnished" valuePropName="checked" initialValue={false}>
            <Checkbox>Furnished</Checkbox>
          </Form.Item>

          <Form.Item label="Available From" name="available_from">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* <Form.Item label="Property Images" >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div className="text-gray-500 text-sm mt-1">You can upload up to 8 images.</div>
          </Form.Item> */}

          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full"
              style={{ backgroundColor: '#1e293b', color: 'white', border: 'none' }}
              size="large"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
