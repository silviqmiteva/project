import React from 'react';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import styles from './loginForm.module.css';

const LoginForm = () => (
  <Row justify='space-around' align='middle'>
    <Col span={24}>
      <div className={styles.formStyle}>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{
            span: 13,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='remember'
            valuePropName='checked'
            wrapperCol={{ offset: 8, span: 8 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 10,
              span: 8,
            }}
          >
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Col>
  </Row>
);

export default LoginForm;
