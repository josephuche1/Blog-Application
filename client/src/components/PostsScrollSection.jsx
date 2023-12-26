import React, {useState, useEffect} from "react";
import Post from "./Post";
import axios from "axios";
import io from "socket.io-client";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PostScrollSection = () => {
   const [posts, setPosts] = useState([]);

   useEffect(() => {
      const socket = io("http://localhost:5000");

      socket.on("new post", (newPost) => {
         setPosts([newPost, ...posts]);
      });

      getPosts();

      return () => socket.disconnect();
   }, []);

   function getPosts(){
     axios.get("http://localhost:5000/api/posts")
       .then(res => {
          setPosts(res.data.reverse());
       })
       .catch(err => {
          console.log("An error occured while getting posts: " + err);
       });
   }

   function getDate(date){
      return new Date(date).getDate(); 
   }
   function getMonth(date){
      const month = new Date(date).getMonth();
      return months[month];
   }

   function renderPosts(post){
      return (
        <Post 
          key={post._id}
          id={post._id}
          author={post.author} 
          comments={post.comments}
          image = {post.image && `http://localhost:5000/images/${post.image}`}
          likes={post.likes}
          day={getDate(post.timestamp)}
          month={getMonth(post.timestamp)}
          text={post.text}
          
        />
      )
   }
    return (
        <div className="posts-container">
           <div className="posts container overflow-y-auto mx-auto my-auto vh-100 w-100">
              <div className="row w-100  ms-1">
                <div className="mini-navbar-placeholder pt-5"></div>
                {posts.length === 0 ? <h2 className="text-center text-body-secondary vw-100 vh-100 d-flex align-items-center justify-content-center">No posts yet</h2> : null}
                {posts.map(renderPosts)}
              </div>
            </div>
        </div>
    );
}
export default PostScrollSection;