import axios from 'axios';
import { useRouter } from 'vue-router';


async function refreshToken(refreshToken) {
  const response = await axios.post('http://localhost:3000/api/auth/refresh-token', { refreshToken });
  return response.data.data.user;
}

const setupInterceptors = () => {
  const router = useRouter();

  axios.interceptors.request.use(config => {

    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      config.headers['Authorization'] = `Bearer ${userData.accessToken}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => {

    return response;
  }, async error => {

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        try {
          const refreshedTokens = await refreshToken(userData.refreshToken);
          localStorage.setItem('userData', JSON.stringify({
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken
          }));
          originalRequest.headers['Authorization'] = `Bearer ${refreshedTokens.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('userData');
          router.push('/');
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  });
};

export default setupInterceptors;
