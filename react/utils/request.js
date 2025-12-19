
// 使用 '127.0.0.1' 代替 'localhost' 以提高在不同开发环境（如浏览器、模拟器）下的兼容性。
export const BASE_IP = '127.0.0.1'; 
export const BASE_URL = `http://${BASE_IP}:5000`; 
const API_URL = `${BASE_URL}/api/v1`;

export const formatUrl = (url) => {
  if (!url) return '';
  let urlStr = typeof url === 'string' ? url : (url.url || url.fileUrl || '');
  if (!urlStr) return '';
  if (urlStr.startsWith('http')) return urlStr;
  const path = urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
  return `${BASE_URL}${path}`;
};

export const request = (options) => {
  const token = uni.getStorageSync('token');
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url.startsWith('http') ? options.url : API_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        // 兼容处理：有些接口返回带 code 的对象，有些严格按照文档直接返回数据数组/对象
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.navigateTo({ url: '/pages/login/login' });
          reject(res.data);
        } else {
          uni.showToast({ title: res.data.message || 'Error', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: 'Network error', icon: 'none' });
        reject(err);
      }
    });
  });
};
