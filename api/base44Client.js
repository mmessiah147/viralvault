import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_ID = '69cef095cf537aae99ad1e98';
const BASE_URL = 'https://base44.app/api/apps/' + APP_ID;

const getToken = () => AsyncStorage.getItem('base44_token');
const setToken = (token) => AsyncStorage.setItem('base44_token', token);
const clearToken = () => AsyncStorage.removeItem('base44_token');

async function request(method, path, body) {
  const token = await getToken();
  const res = await fetch(BASE_URL + path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Id': APP_ID,
      ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error('API error: ' + res.status);
  return res.json();
}

function entityClient(name) {
  const path = '/entities/' + name;
  return {
    list: (sort, limit) => request('GET', path + '?sort=' + (sort || '-created_date') + '&limit=' + (limit || 50)),
    filter: (query, sort, limit) => request('POST', path + '/filter', { query: query, sort: sort || '-created_date', limit: limit || 50 }),
    get: (id) => request('GET', path + '/' + id),
    create: (data) => request('POST', path, data),
    update: (id, data) => request('PUT', path + '/' + id, data),
    delete: (id) => request('DELETE', path + '/' + id),
  };
}

const auth = {
  me: () => request('GET', '/auth/me'),
  login: async (email, password) => {
    const res = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!res.ok) throw new Error('Login failed: ' + res.status);
    const data = await res.json();
    if (data.access_token) {
      await setToken(data.access_token);
    }
    return data;
  },
  register: async (email, password) => {
    const res = await fetch(BASE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!res.ok) throw new Error('Register failed: ' + res.status);
    const data = await res.json();
    if (data.access_token) {
      await setToken(data.access_token);
    }
    return data;
  },
  logout: clearToken,
  setToken: setToken,
  getToken: getToken,
};

export const base44 = {
  auth,
  entities: {
    ContentLibraryItem: entityClient('ContentLibraryItem'),
    ContentCluster: entityClient('ContentCluster'),
    Post: entityClient('Post'),
    Notification: entityClient('Notification'),
  },
  functions: {
    invoke: (name, payload) => request('POST', '/functions/' + name, payload),
  },
};
