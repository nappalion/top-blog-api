import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

function BlogPost() {
  const location = useLocation();

  const post = location.state?.post;

  return (
    <div>
      <NavBar />
      <h1>{post.title}</h1>
      <h2>{post.authorId}</h2>
      <h3>{post.createdAt}</h3>
      <p>{post.content}</p>
    </div>
  );
}

export default BlogPost;
