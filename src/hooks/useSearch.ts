import { useEffect, useState, useCallback } from 'react';
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
  image_urls: string[];
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:3001/api/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          query,
          page,
          limit: 48,
        },
      });

      setUsers((prev) => (page === 1 ? response.data.users : [...prev, ...response.data.users]));
      setBrands((prev) => (page === 1 ? response.data.brands : [...prev, ...response.data.brands]));
      setProducts((prev) => (page === 1 ? response.data.products : [...prev, ...response.data.products]));

      setHasMore(response.data.products.length > 0);
    } catch (err) {
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  }, [accessToken, query, page]);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query, page, fetchSearchResults]);

  return { users, brands, products, loading, error, hasMore, setPage };
};

export default useSearch;
