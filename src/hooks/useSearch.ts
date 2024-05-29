import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface UserType {
  id: number;
  username: string;
  profile_pic: string;
}

interface BrandType {
  id: number;
  name: string;
  logo: string;
}

interface ProductType {
  id: number;
  name: string;
  image_urls: string;
  price: number;
  url: string;
}


const useSearch = (query: string) => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:3001/api/search', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            query,
          },
        });

        setUsers(response.data.users);
        setBrands(response.data.brands);
        setProducts(response.data.products);
      } catch (err) {
        setError('Error fetching search results');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, accessToken]);

  return { users, brands, products, loading, error };
};

export default useSearch;