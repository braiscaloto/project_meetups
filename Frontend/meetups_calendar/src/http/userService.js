import axios from 'axios';

export function deleteAccount() {
  return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/accounts`);
}

export function updateAccount(formData) {
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/accounts`,
    formData
  );
}
export function uploadAvatar(data) {
  return axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/avatar`, data)
    .then(res => {
      return res;
    });
}

export function updateAvatar(avatar) {
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/api/users/avatar`,
    avatar
  );
}

export function getProfile(id) {
  return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/${id}`);
}
