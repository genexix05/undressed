import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';  // Asegúrate de que la ruta es correcta

interface Product {
  id: number;
  name: string;
  url: string;
  price: string;
}

const Products: React.FC = () => {
  const { brandName, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    // Fetch products from the database
    axios.get('http://localhost:3001/api/products', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(response => {
      const filteredProducts = response.data.filter((product: Product) =>
        product.url.includes(brandName || '')
      );
      setProducts(filteredProducts);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [brandName, accessToken]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = () => {
    if (editingProduct && accessToken) {
      axios.put(`http://localhost:3001/api/products/${editingProduct.id}`, editingProduct, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(() => {
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === editingProduct.id ? { ...product, ...editingProduct } : product
          )
        );
        setEditingProduct(null);
      }).catch(error => {
        console.error('Error updating product:', error);
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos de {brandName}</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Precio</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="border p-1"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <input
                    type="text"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="border p-1"
                  />
                ) : (
                  product.price
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editingProduct?.id === product.id ? (
                  <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Guardar
                  </button>
                ) : (
                  <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;