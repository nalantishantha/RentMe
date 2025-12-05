"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Card, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContex";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
    const { login } = useAuth();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
        const loggedInUser = await login(values.email, values.password);
        message.success('Login successful!');

        switch(loggedInUser.role){
            case 'admin':
                router.push('/admin/dashboard')
                break
            case 'seller':
                router.push('/seller/my-properties')
                break
            default:
                router.push('/')
        }

    } catch (error: any) {
        console.error("Login error:", error);

        if (error.response?.status === 401) {
            message.error('Invalid email or password');
        } else if (error.response?.data?.message) {
            message.error(error.response.data.message);
        } else {
            message.error('Login failed. Please try again.');
        }
    } finally {
    setLoading(false);
    }
  };

    return(
            <Card className="shadow-2xl w-full max-w-md bg-slate-800 border-none">
                <div className="text-center mb-8">
                    <Title level={1} style={{ color: 'white', fontSize: '2.5rem', letterSpacing: '2px' }}>RentMe</Title>
                    <Text style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>Login to your account</Text>
                </div>

                <Form layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="email" label={<span className="text-white text-lg">Email</span>} rules={[{required: true, message: "Email is required"},{type:"email", message: "Invalid email format"}]}> 
                        <Input placeholder="Enter your email" prefix={<MailOutlined/>} className="h-12 text-base"/>
                    </Form.Item>

                    <Form.Item name="password" label={<span className="text-white text-lg">Password</span>} rules={[{required: true, message: "Password is required"},{min:6, message: "Minimum 6 characters"}]}> 
                        <Input.Password placeholder="Enter your password" prefix={<LockOutlined/>} className="h-12 text-base"/>
                    </Form.Item>

                    <div className="flex justify-between items-center mb-4">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox className="text-slate-200">Remember me</Checkbox>
                        </Form.Item>
                        <Button type="link" size="small" className="text-blue-400">Forgot password?</Button>
                    </div>

                    <Form.Item>
                        <Button htmlType="submit" block loading={loading} className="bg-white text-slate-800 font-bold h-12 text-lg rounded-md hover:bg-slate-100 border-none">
                            Login
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4">
                        <Text style={{ color: '#cbd5e1', fontSize: '1rem' }}>
                            Don't have an account?{' '}
                            <Button type="link" className="text-blue-400 font-bold" onClick={() => router.push("/signup")}>Sign up as Owner</Button>
                        </Text>
                    </div>
                </Form>
            </Card>
    );
}