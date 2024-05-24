import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PostType } from '../context/AuthContext';

const RecentPosts: React.FC<{ brandId: string }> = ({ brandId }) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts?brandId=${brandId}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchPosts();
  }, [brandId]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Publicaciones Recientes</h3>
      <ul>
        {posts.map(post => (
          <li key={post.id} className="mb-2">
            <h4 className="font-semibold">{post.title}</h4>
            <p className="text-gray-600">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentPosts;
