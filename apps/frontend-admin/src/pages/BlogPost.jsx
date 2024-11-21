import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { EditorState, convertFromRaw } from "draft-js";
import RichTextEditor from "../components/RichTextEditor";
import { getToken, decodeToken } from "../utils/tokenStorage";

function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [currUser, setCurrentUser] = useState({});
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const post = location.state?.post;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleUpdatePost = (post) => {
    navigate("/update", { state: { post } });
  };

  const handleDeleteComment = async (comment) => {
    if (currUser.id !== comment.authorId) {
      return;
    }

    try {
      const response = await fetch(baseUrl + "/comments/" + comment.id, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      });

      if (response.ok) {
        console.log("Successfully deleted comment.");
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== comment.id)
        );
      } else {
        console.log("Failed deleting comment.");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const newData = {
      content: comment,
      authorId: currUser.id,
      postId: post.id,
    };

    try {
      const response = await fetch(baseUrl + "/comments", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        setComment("");
      } else {
        console.log("Creating comment failed.");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    setCurrentUser(decodeToken());
  }, []);

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
          console.log("Retrieving comments failed.");
        }
      } catch (error) {
        console.log("An error occurred: " + error.message);
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
            <p>{comment.createdAt}</p>
            {comment.authorId === currUser.id && (
              <button onClick={() => handleDeleteComment(comment)}>
                Delete comment
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BlogPost;
