import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import makeRequest from '../../fetch/fetchData';

interface Props {}
interface State {
  username: string;
  password: string;
  message: string;
}

class LoginForm extends Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    };

    this.valueChanged = this.valueChanged.bind(this);
    this.login = this.login.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  onResult(result: any) {
    if (result && result.username) {
      Router.push('/homepage');
    } else if (result.statusCode === 401) {
      this.setState({ message: 'User does not exists.' });
    }
  }

  login = () => {
    if (!this.state.username || !this.state.password) {
      return;
    }
    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    makeRequest('/auth/login', 'POST', user, this.onResult);
  };

  valueChanged(obj: any) {
    this.setState(obj);
  }

  render() {
    return (
      <Form
        name='basic'
        className='formStyle'
        labelCol={{ span: 8 }}
        wrapperCol={{
          span: 13,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete='off'
        onSubmitCapture={this.login}
        onValuesChange={this.valueChanged}
      >
        <Form.Item>
          <h1>Login</h1>
        </Form.Item>
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
        <Form.Item className='errorMessage'>
          <label>{this.state.message}</label>
        </Form.Item>
        <Form.Item
          name='remember'
          valuePropName='checked'
          wrapperCol={{ offset: 8, span: 8 }}
        >
          {/* <Checkbox>Remember me</Checkbox> */}
          <Link href='/register'>Don't have an account?</Link>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 8,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
