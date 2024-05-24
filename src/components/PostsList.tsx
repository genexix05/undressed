import React, { useCallback, useRef } from 'react';
import useFetchPosts from '../hooks/useFetchPosts';
import Post from './Post';
import { PostType } from '../context/AuthContext';

const PostsList: React.FC = () => {
  const { posts, loading, error, hasMore, setPage } = useFetchPosts();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, setPage]);

  return (
    <div className="container mx-auto mt-6">
      {posts.map((post: PostType, index: number) => {
        if (posts.length === index + 1) {
          return <div ref={lastPostElementRef} key={post.id}><Post {...post} /></div>;
        } else {
          return <Post key={post.id} {...post} />;
        }
      })}
      {loading && <p>Cargando más publicaciones...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PostsList;
