import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import handleLikes from "./handleLikes";
import io from "socket.io-client";
import axios from "axios"; 

const Post = (props) => {
      const [likes, setLikes] = useState(props.likes);
      const [isliked, setIsLiked] = useState(false);
      
      const newStyle = {
         color: "#2ecc71"
      }

      useEffect(() => {
         const socket = io("http://localhost:5000");

         socket.on("like", (data) => {
            getLikes();
         })

         return () => socket.disconnect();
      }, []);

      const handleOnClick = async () => {
         const res = await axios.get("http://localhost:5000/api/getUser", {withCredentials: true});
         const likedOrUnliked = handleLikes(props.id, props.author, res.data.user.username);
         if(likedOrUnliked === "liked"){
            setIsLiked(true);
         } else{  
            setIsLiked(false);
         }
      }

      const getLikes = () => {
         axios.get(`http://localhost:5000/api/getLikes/${props.id}`)
         .then(res => {
            setLikes(res.data.likes);
         })
         .catch(err => console.log(err));
      }
    return (
       <Link to="#"className="post card container text-decoration-none w-100 border-0">
          <div className="row p-2">
             <div className="col-1 h-100 m-2">
                <img src="https://picsum.photos/200" alt="profile" className="rounded-circle mx-auto" style={{width: "35px"}} />
             </div>
             <div className="col-9 py-2">
                 <p className="fw-bold fs-6 d-block">{props.author} • {props.day} {props.month}</p>
                 <p className="fs-6 d-block">{props.text}</p>
                 {props.image && <img src={props.image} alt="image" className="rounded mx-auto d-block shadow" style={{width: "100%"}} />}
             </div>
          </div>
          <div className="container d-flex justify-content-around">
             <div className="like" >
                <svg onClick={handleOnClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16" style={{color: isliked && "#2ecc71"}}>
                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                </svg> {likes}
             </div>
             <div className="comment">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
               <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
               </svg> {props.comments.length}
             </div>
          </div>
          <hr className="py-1"/>
       </Link>
    );
}

export default Post;