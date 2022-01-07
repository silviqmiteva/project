/* eslint-disable linebreak-style */
import React from 'react';
// eslint-disable-next-line object-curly-newline
import { Form, Input, Button, Checkbox } from 'antd';
// import {styles} from './loginForm.module.scss';
const LoginForm = () => (
        <div className='form-style'>
            <Form name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                autoComplete="off">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Form.Item wrapperCol={{
                  offset: 8,
                  span: 16,
                }} >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
);

export default LoginForm;