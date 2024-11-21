import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { decodeToken, getToken } from "../utils/tokenStorage";

function Blog() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const handleViewMorePosts = async () => {
    const grabbedPosts = await fetchPosts(page + 1);
    if (grabbedPosts) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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

  const fetchPosts = async (page) => {
    const currUser = decodeToken();

    try {
      const response = await fetch(
        `${baseUrl}/posts/author/${currUser.id}?page=${page}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.length !== 0) {
          const newPosts = [...posts, ...data];
          setPosts(newPosts);
          return true;
        }
        return false;
      } else {
        console.log("Retrieving posts failed.");
        return false;
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, []);

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
      <button onClick={handleViewMorePosts}>View more</button>
    </div>
  );
}

export default Blog;
