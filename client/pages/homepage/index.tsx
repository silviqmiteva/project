import React, { Component } from 'react';
import ButtonComponent from '../../components/button/button';
import makeRequest from '../../fetch/fetchData';

interface Props {}
interface State {}

class LoginForm extends Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {};
    this.accessAdminRoleRoute = this.accessAdminRoleRoute.bind(this);
  }

  onResult(result: any) {
    console.log(result);
  }

  accessAdminRoleRoute() {
    makeRequest('/users', 'GET', {}, this.onResult);
  }

  render() {
    return (
      <div>
        <label>hello from homepage</label>
        <ButtonComponent title='get data' onClick={this.accessAdminRoleRoute} />
        <ButtonComponent
          title='access protected route test'
          onClick={() => {
            makeRequest(
              '/auth/test',
              'POST',
              {
                test: 'testNew',
              },
              (result: any) => {
                console.log(result);
              },
            );
          }}
        />
        <ButtonComponent
          title='logout'
          onClick={() => {
            makeRequest(
              '/auth/logout',
              'PUT',
              { userId: '61e692405985e38070a9a62d' },
              (result: any) => {
                console.log(result);
              },
            );
          }}
        />
      </div>
    );
  }
}

export default LoginForm;
