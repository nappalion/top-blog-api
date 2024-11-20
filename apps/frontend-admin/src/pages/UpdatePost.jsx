import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { getToken, decodeToken } from "../utils/tokenStorage";
import RichTextEditor from "../components/RichTextEditor";

function UpdatePost() {
  const navigate = useNavigate();
  const location = useLocation();

  const post = location.state?.post;

  const [title, setTitle] = useState(post.title);
  const [published, setPublished] = useState(post.published);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

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

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (event) => {
    event.preventDefault();

    const contentRaw = convertToRaw(editorState.getCurrentContent());
    const currUser = decodeToken();

    const newPostData = {
      title,
      published: published,
      content: contentRaw,
      authorId: currUser.id,
    };

    try {
      const response = await fetch(baseUrl + "/posts/" + post.id, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify(newPostData),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        alert("Update post failed.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Published:
          <input
            type="checkbox"
            checked={published}
            onChange={() => setPublished(!published)}
          />
        </label>
        <label>
          Content:
          <RichTextEditor editorState={editorState} onChange={setEditorState} />
        </label>
        <button type="submit">Update post</button>
      </form>
    </div>
  );
}

export default UpdatePost;
