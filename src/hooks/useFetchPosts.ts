import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth, PostType } from '../context/AuthContext';

const useFetchPosts = (initialPage = 1, limit = 10) => {
  const { accessToken, posts, setPosts } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/posts', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, limit },
      });
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts((prevPosts: PostType[]) => [...prevPosts, ...response.data.posts]);
      }
      setHasMore(response.data.posts.length > 0);
    } catch (err) {
      setError('Error al obtener las publicaciones');
    }
    setLoading(false);
  }, [accessToken, limit, setPosts]);

  useEffect(() => {
    if (accessToken) {
      fetchPosts(page);
    }
  }, [page, accessToken, fetchPosts]);

  useEffect(() => {
    return () => {
      setPosts([]);
    };
  }, [setPosts]);

  return { posts, loading, error, hasMore, setPage };
};

export default useFetchPosts;
