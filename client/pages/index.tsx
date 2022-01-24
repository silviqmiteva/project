/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import type { NextPage } from 'next';
// import { io } from 'socket.io-client';
import ButtonComponent from '../components/button/button';
// import LoginForm from '../modules/login/loginForm';
import styles from '../styles/Home.module.css';

let accessTokenInStore = '';

function login() {
  const user = {
    username: 'qsen', // ivan qsen
    password: '12345678', // 0-7 1-8
  };

  fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // important for cookie with refresh_token
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      accessTokenInStore = data.access_token; // save data.access_token in redux
      // getProfileInfo();
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout() {
  const accessToken = 'Bearer '.concat(accessTokenInStore);
  fetch('http://localhost:3001/auth/logout', {
    method: 'PUT',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId: '61e692115985e38070a9a629' }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      accessTokenInStore = '';
    })
    .catch((err) => {
      console.log(err);
    });
}

function register(name: string, pass: string, mail: string) {
  const user = {
    username: name,
    password: pass,
    email: mail,
  };

  fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function accessProtectedRoute() {
  const accessToken = 'Bearer '.concat(accessTokenInStore);
  fetch('http://localhost:3001/auth/test', {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include', // to send the refresh_token in cookie
    body: JSON.stringify({ test: 'hi from me' }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        accessTokenInStore = data.access_token; // save data.access_token in redux
      }
    })
    .catch((err) => console.log(err));
}

function accessAdminRoleRoute() {
  const accessToken = 'Bearer '.concat(accessTokenInStore);
  fetch('http://localhost:3001/users', {
    headers: {
      Authorization: accessToken,
    },
    method: 'GET',
    credentials: 'include', // to send the refresh_token in cookie
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
}

function createRole() {
  const accessToken = 'Bearer '.concat(accessTokenInStore);
  fetch('http://localhost:3001/users/role', {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include', // to send the refresh_token in cookie
    body: JSON.stringify({ name: 'user' }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        accessTokenInStore = data.access_token; // save data.access_token in redux
      }
    })
    .catch((err) => console.log(err));
}

// function getProfileInfo() {
//   fetch('http://localhost:3001/users/profile', {
//     method: 'GET',
//     credentials: 'include',
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => console.log(err));
// }

const Home: NextPage = () => (
  <div className={styles.container}>
    {/* <LoginForm /> */}
    <ButtonComponent title='login' onClick={login}></ButtonComponent>
    <ButtonComponent
      title='access admin role protected route'
      onClick={accessAdminRoleRoute}
    ></ButtonComponent>
    <ButtonComponent
      title='access protected test route'
      onClick={accessProtectedRoute}
    ></ButtonComponent>
    <ButtonComponent
      title='add new role'
      onClick={createRole}
    ></ButtonComponent>
    <ButtonComponent title='logout' onClick={logout}></ButtonComponent>
    <ButtonComponent
      title='register'
      onClick={() => {
        register('ivan', '01234567', 'ivan@gmail.com');
      }}
    ></ButtonComponent>
  </div>
);

// const socket = io('http://localhost:3001');
// socket.emit('msgToServer', 'hi from client');
// socket.on('connect', () => {
//   console.log('Connected with server : ', socket.connected);
// });

// socket.on('numberToClient', (data) => {
//   console.log(data); // from server
// });

export default Home;
