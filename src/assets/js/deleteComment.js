import axios from "axios";

const delCommentForm = document.querySelector("#jsDeleteComment");
const deleteBtn = document.querySelectorAll(".deleteBtn");
const commentList = document.querySelector(".video__comments-list");
const commentNumber = document.getElementById("jsCommentNumber");


const handleDeleleBtn = (event) => {
    console.log(event.target.parentNode.parentNode.parentNode);
    event.target.parentNode.parentNode.parentNode.style.display = "none";
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

const deleteComment = (commentId) => {
    axios.post(`/api/${commentId}/comment/delete`, {
        commentId
    }).then((response) => {
        if (response.status === 200) {
            console.log("SUCCESS");
            // arrangeList(commentId)
        }
    }).catch((error) => {
        console.log(error.response)
    })

}

const handleSubmit = (event) => {
    event.preventDefault();
    const commentId = event.target.querySelector(".commentID")["value"];
    deleteComment(commentId)
}

const init = () => {
    delCommentForm.addEventListener("submit", handleSubmit);
    // console.log(deleteBtn)
    deleteBtn.forEach(btn => {
        btn.addEventListener("click", handleDeleleBtn);
    })
};

if (delCommentForm) {
    init();
};