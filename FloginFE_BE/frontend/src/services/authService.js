export const loginUser = async (username, password) => {
  const res = await fetch(`http://localhost:8081/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password }) // gửi dữ liệu vào body
  });

  const data = await res.json();
  console.log("data ne");
  console.log(data);

  if (!res.ok) {
    throw new Error(data.message); // ném lỗi nếu status không OK
  }
  return data;
};
