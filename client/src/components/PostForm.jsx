import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const PostForm = () => {
  const [previewImage, setPreviewImage] = useState(null); // [image, setImage] = useState(null);
  const [text, setText] = useState(""); // [text, setText] = useState("");
  const [image, setImage] = useState(null); // [image, setImage] = useState(null);
  const [display, setDisplay] = useState(""); // [display, setDisplay] = useState("")
  const [rows, setRows] = useState(1); // [rows, setRows] = useState(3)
  const navigate = useNavigate();

  useEffect(() => {
    setDisplay("");
  },[display]); // [display, setDisplay] = useState("none")

  // Function to allow user to preview image before uploading
  const handleImageOnChange = (e) => {
     const selectedImage = e.target.files[0];
     if(selectedImage){
      setImage(selectedImage);
       const reader = new FileReader();
       reader.onload = event =>{
         setPreviewImage(event.target.result);
       };
       reader.readAsDataURL(selectedImage);
     }else{
        setPreviewImage(null);
        setImage(null);
     }
  };

  // function to handle text input
  const handleTextOnChange = (e) => {
    setText(e.target.value);
  };
  
  // function to handle text input
  const handleSubmit = async (e) => {
     try{
       e.preventDefault();
       if(text !== "" || image !== null){
        const formData = new FormData();
        formData.append("text", text);
        formData.append("image", image);
        
        await axios.get("http://localhost:5000/api/getUser", {withCredentials: true})
          .then(res => {
            console.log(res.data.user);
            formData.append("author", res.data.user._id)
          }) .catch(err => {
             console.log(err);
          });
        await axios.post("http://localhost:5000/api/posts", formData, {
         header: {
           "Content-Type": "multipart/form-data"
         },withCredentials: true})
           .then(res => {
             if(res.data.message === "success"){
               console.log(res.data);
               console.log("Post created successfully");
             } else{
               console.log(res.data.message);
             }
           }). catch(err => {
             console.log(err);
           });
       }
     }catch(err){
       console.log(err);
     }
     reset();
  };
  
  // function to reset form
  const reset = () => {
    setText("");
    setImage(null);
    setPreviewImage(null);
    setDisplay("none");
  }

  // function to handle text input on click
  const handleTextOnClick = () => {
    setRows(3);
  }


  return (
<div className="modal fade" id="postForm" tabindex="-1" aria-labelledby="postFormLabel" aria-hidden="true" data-bs-backdrop="false" style={{display:display}}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="postFormLabel">Create Post</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
            <div>
                <textarea onClick={handleTextOnClick} onChange={handleTextOnChange} className="borderless bg-body w-100" id="text" rows={rows} placeholder="What's on your mind?" value={text}/>
            </div>
            {previewImage && <img src={previewImage} alt="image preview" className="w-100"/>}
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div>
                <label for="image" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                     <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                     <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </label>
                <input type="file" className="d-none" id="image" name="image" accept="image/x-png,image/gif,image/jpeg" onChange={handleImageOnChange}/>
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Post</button>
              </div>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}

export default PostForm;