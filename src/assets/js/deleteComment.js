import axios from "axios";

const delCommentForm = document.querySelector("#jsDeleteComment");
const commentList = document.querySelector(".video__comments-list");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const handleDeleleBtn = (event) => {
    // console.log(event.target.parentNode.parentNode.parentNode);
    event.target.parentNode.parentNode.parentNode.style.display = "none";
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

export const deleteComment = async (commentId) => {
    const videoId = window.location.href.split("/videos/")[1];
    axios.post(`/api/${commentId}/comment/delete`, {
        commentId,
        videoId
    }).then((response) => {
        if (response.status === 200) {
            console.log("Your comment has been deleted.");
            // arrangeList(commentId)
        }
    }).catch((error) => {
        console.log(error.response)
    })
}

export const handleCommentId = (event) => {
    // event.preventDefault();
    // const commentId = event.target.querySelector(".commentID")["value"];
    console.log(event.target);
    // deleteComment(commentId)
}

export const init = () => {
    // delCommentForm.addEventListener("submit", (event) => event.preventDefault());
    // console.log(deleteBtn)
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", handleCommentId)
    })

};

if (deleteBtn) {
    init();
};