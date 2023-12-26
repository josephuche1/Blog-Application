import io from "socket.io-client";
import axios from "axios";
import addNotification  from 'react-push-notification';

const socket = io("http://localhost:5000");

socket.on("notification", (data) => {
    addNotification({
        title: 'Your post was liked!',
        message: data,
        theme: 'darkblue',
        native: true, // when using native, your OS will handle theming.
        duration: 10000
    });
});

const handleLikes = (postId, author, username) => {
    axios.post(`http://localhost:5000/like/${postId}`, {
        author: author,
        username: username
    }, {withCredentials: true})
    .then(res => {
        if(res.data.message === "liked"){
            socket.emit("user connected", res.data.userId);
            socket.emit("notify", `${username} liked your post!`, res.data.userId, () => {
                return res.data.message;
            });
        } else{
            return res.data.message;
        }
    })
    .catch(err => console.log(err));

}

export default handleLikes;