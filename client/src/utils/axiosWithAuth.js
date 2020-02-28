import axios from 'axios';

function axiosWithAuth()  {
  return axios.create({
    headers: {
      authorization: localStorage.getItem('token'),
    },
  });
}

export default axiosWithAuth;
