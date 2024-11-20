import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { EditorState, convertFromRaw } from "draft-js";
import RichTextEditor from "../components/RichTextEditor";

function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const post = location.state?.post;

  const handleUpdatePost = (post) => {
    navigate("/update", { state: { post } });
  };

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
      <button onClick={() => handleUpdatePost(post)}>Update post</button>
      <h1>{post.title}</h1>
      <h2>{post.authorId}</h2>
      <h3>Published: {post.published ? "True" : "False"}</h3>
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
    </div>
  );
}

export default BlogPost;
