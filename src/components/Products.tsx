import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';  // Asegúrate de que la ruta es correcta

interface Product {
  id: number;
  name: string;
  url: string;
  price: string;
  images: string[]; // Cambiado a una lista de URLs de imágenes
}

const Products: React.FC = () => {
  const { brandName, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete || !accessToken) return;

    try {
      await axios.delete(`http://localhost:3001/api/products/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productToDelete.id));
      closeDeleteModal();
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error deleting product:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
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
            <th className="py-2 px-4 border-b">Imagen</th>
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
                {product.images.length > 0 && (
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover" />
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
                <button onClick={() => openDeleteModal(product)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {productToDelete && (
        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation Modal"
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">¿Seguro que quieres borrar este producto?</h2>
              <div className="flex justify-end space-x-4">
                <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-500 text-white rounded">No</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Sí</button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Products;
