// src/app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Checkbox, Typography, Alert, Card, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { authApi } from "@/lib/api";

const { Title, Text } = Typography;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    
    setLoading(true);
    
    try {
      const signupData = {
      firstName : values.firstName,   
      lastName : values.lastName,
      email : values.email,
      phone : values.phone || undefined,
      password : values.password
      }

      console.log('Sending : ', signupData )

      // Call API
      const response = await authApi.signup(signupData);

      message.success("Account created successfull! Please Login.")
      form.resetFields()
      router.push("/login")

      } catch (error: any) {
      console.error("Signup error:", error);
      
      // Show error message
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
      
  };

  return (
      <Card className="shadow-2xl w-full max-w-lg bg-slate-800 border-none">
        <div className="text-center mb-8">
          <Title level={1} style={{ color: 'white', fontSize: '2.5rem', letterSpacing: '2px' }}>RentMe</Title>
          <Text style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>Create Seller Account</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label={<span className="text-white text-lg">Account Type</span>}>
            <Input 
              value="Seller" 
              disabled 
              prefix={<UserOutlined />} 
              className="h-12 text-base text-white bg-slate-700 placeholder-gray-400" 
              style={{ color: 'white', backgroundColor: '#334155', border: 'none' }}
            />
          </Form.Item>

          {/* name */}
          <Form.Item name="firstName" label={<span className="text-white text-lg">First Name</span>} rules={[{ required: true, message: "First name is required" }]} >
            <Input placeholder="Nalan" prefix={<UserOutlined />} className="h-12 text-base"/>
          </Form.Item>

          <Form.Item name="lastName" label={<span className="text-white text-lg">Last Name</span>} rules={[{ required: true, message: "Last name is required" }]} >
            <Input placeholder="Liyanage" prefix={<UserOutlined />} className="h-12 text-base"/>
          </Form.Item>

          {/* email */}
          <Form.Item name="email" label={<span className="text-white text-lg">Email</span>} rules={[{ required: true, message: "email is required" }]} >
            <Input placeholder="nalan@gmail.com" prefix={<MailOutlined />} className="h-12 text-base"/>
          </Form.Item>

          {/* phone number */}
          <Form.Item name="phone" label={<span className="text-white text-lg">Phone Number</span>}>
            <Input placeholder="0123456789" prefix={<PhoneOutlined />} className="h-12 text-base"/>
          </Form.Item>

          {/* password */}
          <Form.Item name="password" label={<span className="text-white text-lg">Password</span>} rules={[{ required: true, message: "Password is required" }, { min: 6, message: "Minimum 6 characters" }]} >
            <Input.Password placeholder="Create Password" prefix={<LockOutlined />} className="h-12 text-base"/>
          </Form.Item>

          <Form.Item name="confirmPassword" label={<span className="text-white text-lg">Confirm Password</span>} dependencies={['password']}
            rules={[
              { required: true, message: "Confirm Password is required" },
              ({ getFieldValue }) => ({
                validator(_, value){
                  if(!value || getFieldValue('password') === value){
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Passwords do not match"))
                }
              })
            ]}>
            <Input.Password placeholder="Confirm Password" prefix={<LockOutlined />} className="h-12 text-base"/>
          </Form.Item>

          {/* checkbox */}
          <Form.Item name="agreeToTerms" valuePropName="checked"
            rules={[{validator: (_, value) => value? Promise.resolve():Promise.reject(new Error('Must accept terms and conditions'))}]}>
            <Checkbox className="text-slate-200">
              I agree to terms and conditions
            </Checkbox>
          </Form.Item>

          {/* submit button */}
          <Form.Item>
            <Button htmlType="submit" block loading={loading} className="bg-white text-slate-800 font-bold h-12 text-lg rounded-md hover:bg-slate-100 border-none">
              Create Account
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text style={{ color: '#cbd5e1', fontSize: '1rem' }}>
              Already have an account?
              <Button type="link" className="text-blue-400 font-bold" onClick={() => router.push("/login")}>Login</Button>
            </Text>
          </div>
        </Form>
      </Card>
  );
}