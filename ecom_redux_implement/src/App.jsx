// src/App.jsx
import { useState, useEffect } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const url = `https://dummyjson.com/products?limit=12`;

    const fetchProducts = async () => {
      const response = await axios.get(url);
      setProducts(response.data.products);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

export default App;
