import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { decodeToken, getToken } from "../utils/tokenStorage";

function Blog() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);

  const handleViewPost = (post) => {
    navigate("/post", { state: { post } });
  };

  const handleUpdatePost = (post) => {
    navigate("/update", { state: { post } });
  };

  const handleDeletePost = async (post) => {
    try {
      const response = await fetch(baseUrl + "/posts/" + post.id, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      });

      if (response.ok) {
        console.log("Successfully deleted post.");
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      } else {
        console.log("Failed deleting post.");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const currUser = decodeToken();

      try {
        const response = await fetch(baseUrl + "/posts/author/" + currUser.id, {
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
          console.log("Retrieving posts failed.");
        }
      } catch (error) {
        console.log("An error occurred: " + error.message);
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
      <button onClick={() => navigate("/new")}>Create new post</button>
      <div>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <p>{post.title}</p>
              <p>Published: {post.published ? "True" : "False"}</p>
              <p>Author: {post.authorId}</p>
              <button onClick={() => handleViewPost(post)}>View post</button>
              <button onClick={() => handleDeletePost(post)}>
                Delete post
              </button>
              <button onClick={() => handleUpdatePost(post)}>
                Update post
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blog;
