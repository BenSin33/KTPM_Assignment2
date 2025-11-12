export const loginUser = async (username, password) => {
  
  const API_ENDPOINT = '/api/auth/login';

  // Dùng 'fetch' để gửi yêu cầu POST đến server
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  // Nếu server trả về lỗi (ví dụ: 401 Unauthorized, 500 Server Error)
  if (!response.ok) {
    const errorData = await response.json(); // Lấy thông báo lỗi từ server
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }

  const data = await response.json();
  return data;
};
