import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Post";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import AdminSupport from "./pages/AdminSupport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <PrivateRoute>
            <EditProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
            <Route
        path="/support"
        element={
          <PrivateRoute>
            <Support />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/support"
        element={
          <PrivateRoute>
            <AdminSupport />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;