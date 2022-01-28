import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import makeRequest from '../../fetch/fetchData';
// import { connect } from 'react-redux';

interface Props {}
interface State {
  username: string;
  password: string;
  email: string;
  repeatedPassword: string;
  message: string;
}

class RegisterForm extends Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      username: '',
      password: '',
      repeatedPassword: '',
      email: '',
      message: '',
    };

    this.valueChanged = this.valueChanged.bind(this);
    this.register = this.register.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  onResult = (result: any) => {
    if (result && result.username) {
      Router.push('/');
    }
  };

  register = () => {
    if (
      !this.state.username ||
      !this.state.password ||
      !this.state.email ||
      !this.state.repeatedPassword
    ) {
      return;
    }

    if (this.state.password !== this.state.repeatedPassword) {
      this.setState({
        message: 'Password and Repeated Password do not matches.',
      });
      return;
    }

    const user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };

    makeRequest('/auth/register', 'POST', user, this.onResult);
  };

  valueChanged(obj: any) {
    this.setState(obj);
  }

  render() {
    return (
      <div className='container'>
        <div className='main'>
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
            onSubmitCapture={this.register}
            onValuesChange={this.valueChanged}
          >
            <Form.Item>
              <h1>Register</h1>
            </Form.Item>
            <Form.Item
              label='Username'
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
                {
                  min: 8,
                  message: 'Password length must be between 8-20 characters.',
                },
                {
                  max: 20,
                  message: 'Password length must be between 8-20 characters.',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label='Repeat Pass'
              name='repeatedPassword'
              rules={[
                { required: true, message: 'Please repeat your password!' },
                {
                  min: 8,
                  message: 'Password length must be between 8-20 characters.',
                },
                {
                  max: 20,
                  message: 'Password length must be between 8-20 characters.',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please input your email.' },
                {
                  type: 'email',
                  message: 'Invalid email. Try again.',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item className='errorMessage'>
              <label>{this.state.message}</label>
            </Form.Item>
            <Form.Item>
              <Link href='/'>Have an account?</Link>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 10,
                span: 8,
              }}
            >
              <Button type='primary' htmlType='submit'>
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = (dispatch) => ({});

// export default connect(mapStateToProps, mapDispatchToProps)(FileName);

export default RegisterForm;

// let accessTokenInStore = '';

// function register(name: string, pass: string, mail: string) {
//   const user = {
//     username: name,
//     password: pass,
//     email: mail,
//   };

//   fetch('http://localhost:3001/auth/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(user),
//   })
//     .then((res) => res.text())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
