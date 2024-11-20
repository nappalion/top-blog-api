import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import { EditorState, convertFromRaw } from "draft-js";
import RichTextEditor from "../components/RichTextEditor";
import { getToken } from "../utils/tokenStorage";

function BlogPost() {
  const location = useLocation();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const post = location.state?.post;

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmitComment = () => {
    // TODO: handle submitting comment
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(baseUrl + "/comments/post/" + post.id, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          alert("Retrieving comments failed.");
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    fetchComments();
  });

  useEffect(() => {
    if (post.content) {
      try {
        const contentState = convertFromRaw(post.content);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Failed to load editor content:", error);
      }
    }
  }, [post.content]);

  const hasContent = editorState.getCurrentContent().hasText();

  return (
    <div>
      <NavBar />
      <h1>{post.title}</h1>
      <h2>{post.authorId}</h2>
      <h3>{post.createdAt}</h3>
      {hasContent ? (
        <RichTextEditor
          editorState={editorState}
          readOnly={true}
          onChange={() => {}}
        />
      ) : (
        <p>No content</p>
      )}
      <h2>Comments:</h2>

      <form onSubmit={handleSubmitComment}>
        <label>
          Comment:
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button type="submit">Create comment</button>
      </form>

      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <p>{comment.content}</p>
            <p>Author: {comment.authorId}</p>
          </div>
        );
      })}
    </div>
  );
}

export default BlogPost;
