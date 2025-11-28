import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ProductPage from "./component/product_dashboard/Product.jsx";
import Login from "./component/login_dashboard/Login.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
