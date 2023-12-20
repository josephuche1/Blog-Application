import React from "react";
//83
const PostForm = () => {
  return (
<div className="modal fade" id="postForm" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="false">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
            <div>
                <textarea className="borderless form-control w-100 border-0 p-0" id="text" rows="3" placeholder="What's on your mind?" />
            </div>
            <div>

            </div>
        </form>
      </div>
    </div>
  </div>
</div>
  )
}

export default PostForm;