import { updateAccessToken, setUserId, setUsername } from '../slices/authSlice';
import store from '../store';

let token = '';
export default function makeRequest(
  path: string,
  methodType: string,
  obj?: object,
  onResult?: any,
) {
  if (!path) {
    return;
  }

  const url = `http://localhost:3001${path}`;
  const { dispatch } = store;
  let header = {};

  if (path !== '/auth/login' && path !== '/auth/register') {
    header = {
      Authorization: `Bearer ${token}`,
    };
  }

  let options = {};
  if (methodType === 'POST' || methodType === 'PUT') {
    header['Content-Type'] = 'application/json';
    options = {
      method: methodType,
      headers: header,
      credentials: 'include',
      body: JSON.stringify(obj),
    };
  } else {
    options = {
      method: methodType,
      headers: header,
      credentials: 'include',
    };
  }

  fetch(url, options)
    .then((response) => response.json())
    .then((data: any) => {
      if (data.access_token) {
        token = data.access_token;
        dispatch(updateAccessToken(data.access_token));
        if (path === '/auth/login') {
          // userId = data.id;
          dispatch(setUserId(data.id));
          dispatch(setUsername(data.username));
        }
      }
      if (onResult) {
        onResult(data);
      }
    })
    .catch((err) => {
      console.log(err);
      if (onResult) {
        onResult(err);
      }
    });
}
