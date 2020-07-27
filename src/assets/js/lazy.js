import axios from "axios";
const comments = document.querySelector(".comments");
const commentsList = comments.querySelector("ul");
const delCommentForm = document.querySelector("#jsDeleteComment");
import {
    deleteComment,
    handleCommentId,
    initDelete
} from "./deleteComment"

// const init = () => {
//     window.addEventListener("", fetchComments);
// }
const paintComments = async (comments, loggedUser) => {
    for (let i = 0; i < comments.length; i++) {
        const li = document.createElement("li");
        li.className = "comment"

        const creatorName = comments[i]["creator_name"];
        const creatorId = comments[i]["creator_id"];
        const commentId = comments[i]["id"];
        const avatarUrl = comments[i]["avatarUrl"];
        const text = comments[i]["text"];

        li.innerHTML = `<div class="avatar"><a href="/users/${creatorId}">${avatarUrl?`<img src="${avatarUrl}" width="50" style="border-radius: 100%;"/>`:`<div class="no-avatar" style="display:flex; justify-content: center; align-items: center; width: 50px; height: 50px; border-radius: 100%; background-color: white; font-weight: 500; -webkit-box-pack: center; -webkit-box-align: center;"><span>${String(creatorName[0]).toUpperCase()}</span></div>`}</a></div>
        <div class="text"><span class="creator"><a href="/users/${creatorId}">${creatorName}</a></span><span class="content">${text}</span></div><span class="jsDeleteComment">
        ${loggedUser && loggedUser._id === creatorId ? `<button id="${commentId}" class="deleteBtn">Delete</button>` : ""}</span>`;

        await commentsList.appendChild(li);

    }
    // <form class="delete__comment" id="jsDeleteComment">
    //         <input class="commentID" type="hidden" name="commentID" value="${commentId}"/>
    //         ${loggedUser._id === creatorId ? `<button class='deleteBtn' type='button' value='Delete' />` : ""}
    //       </form>
    // if (delCommentForm) {
    //     const deleteBtn = document.querySelectorAll(".deleteBtn");
    // init();
    // const deleteBtn = document.querySelectorAll(".deleteBtn");

    // deleteBtn.forEach(btn => {
    //     btn.addEventListener("click", () => handleCommentId);
    // })

    // if (deleteBtn) {

    const deleteBtn = document.querySelectorAll(".deleteBtn");
    initDelete(deleteBtn);
    // };

}



const fetchData = () => {
    const loadingText = document.createElement("li")
    const loadingImg = new Image();
    loadingImg.className = "comment"
    loadingImg.id = "loadingText"
    loadingImg.src = "/static/loading.gif"
    loadingImg.width = "300"
    loadingImg.style = "justify-self: center;"
    // loadingText.innerHTML = "<span>Loading...</span>"
    commentsList.appendChild(loadingImg);
    window.onload = async () => {
        const videoId = window.location.href.split("/videos/")[1];
        console.log(videoId);
        axios.post(`/api/${videoId}/all-comments`, {
            videoId
        }).then(response => {
            console.log(response);

            if (response.status === 200) {
                console.log("Success : Fetch this videos' all comments")
                const comments = response.data.commentData;
                const loggedUser = response.data.user;
                const loading = document.getElementById("loadingText");
                loading.style = "display: none;";
                paintComments(comments.reverse(), loggedUser);
            }
        }).catch(error => {
            console.error(error.response);
        })
    }
}

if (comments) {
    fetchData();
}