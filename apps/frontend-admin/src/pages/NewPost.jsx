import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { EditorState, convertToRaw } from "draft-js";
import { getToken, decodeToken } from "../utils/tokenStorage";
import RichTextEditor from "../components/RichTextEditor";

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleSubmit = async (event) => {
    event.preventDefault();

    const contentRaw = convertToRaw(editorState.getCurrentContent());
    const contentState = editorState.getCurrentContent();
    const currUser = decodeToken();

    const newPostData = {
      title,
      published,
      content: contentRaw,
      authorId: currUser.id,
    };

    try {
      const response = await fetch(baseUrl + "/posts/", {
        method: "POST",
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
        alert("Create post failed.");
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
        <button type="submit">Create post</button>
      </form>
    </div>
  );
}

export default NewPost;
