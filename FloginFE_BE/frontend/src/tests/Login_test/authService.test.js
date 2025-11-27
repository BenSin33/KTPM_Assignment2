import { loginUser } from '../../services/authService';

describe('authService.loginUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('Test case 1: Thàng công và trả về dữ liệu', async () => {
    const mockResponse = { success: true, message: 'ok', token: '123' };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

    const result = await loginUser('admin', '123456');
    expect(result).toEqual(mockResponse);
  });

   test('Test case 2: Thất bại do trống username', async () => {
    const mockError = { message: 'Username is required' };
    fetch.mockResolvedValueOnce({ ok: false, json: async () => mockError });  
    await expect(loginUser('', '123456')).rejects.toThrow('Username is required');
  });
  test("Test case 3: Thất bại do mật khẩu quá ngắn", async () => {
    const mockError = {message: 'Password must be at least 6 characters'};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('123456','12')).rejects.toThrow('Password must be at least 6 characters');
  });
  test("Test case 4: Thất bại do username sai định dạng (chứa ký tự đặc biệt) ", async () => {
    const mockError = {message: "Username can only contain letters, numbers, ., -, _"};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('abc@123','123456')).rejects.toThrow('Username can only contain letters, numbers, ., -, _');
  });
  test('Test case 5: Thất bại do username hợp lệ nhưng không tồn tại trong hệ thống ', async () => {
    const mockError = {message: 'Invalid username or password'};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('ghostuser','123456')).rejects.toThrow('Invalid username or password');
  });
  test('Test case 6: Thất bại do username ít hơn 3 kí tự ', async () => {
    const mockError = {message: 'Username must be longer than 3 characters'};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('gho','123456')).rejects.toThrow('Username must be longer than 3 characters');
  });
  test('Test case 7: Thất bại do password trống ', async () => {
    const mockError = {message: 'Password is required'};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('test123','')).rejects.toThrow('Password is required');
  });
   test('Test case 8: Thất bại do password trống ', async () => {
    const mockError = {message: 'Incorrect password'};
    fetch.mockResolvedValueOnce({ok: false, json: async () => mockError});
    await expect(loginUser('test123','123466')).rejects.toThrow('Incorrect password');
  });
});
