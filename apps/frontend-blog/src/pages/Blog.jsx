import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getToken } from "../utils/tokenStorage";

function Blog() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);

  const handleViewPost = (post) => {
    navigate("/post", { state: { post } });
  };
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(baseUrl + "/posts", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          alert("Retrieving posts failed.");
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    const checkValidToken = () => {
      const token = getToken();

      if (!token) {
        navigate("/");
      } else {
        fetchPosts();
      }
    };

    checkValidToken();
  }, [baseUrl, navigate]);

  return (
    <div>
      <NavBar />
      <h1>Blog</h1>
      <div>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <p>{post.title}</p>
              <p>Published: {post.published ? "True" : "False"}</p>
              <p>Author: {post.authorId}</p>
              <button onClick={() => handleViewPost(post)}>View post</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blog;
