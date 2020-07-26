import axios from "axios";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector(".video__comments-list");
const avatarList = document.querySelector(".comments__avatar-list");
const textList = document.querySelector(".comments__text-list");
const newList = document.querySelector(".comments__list");
const commentNumber = document.getElementById("jsCommentNumber");

let img = new Image();
let imgUrl = "";

const addComment = (comment, commentCreatorData) => {

    const newLI = document.createElement("li");
    newLI.className = "comment";
    newLI.style = `color: #444444;
    -webkit-box-direction: normal;
    list-style: none;
    box-sizing: border-box;
    margin: 0;
    padding: 15px 5px 10px 0;
    border-radius: 10px;
    border: 0;
    background-color: rgb(243, 241, 176);
    font-size: 100%;
    font: inherit;
    margin-bottom: 24px;
    vertical-align: baseline;`
    // newLI.innerHTML = comment;
    newLI.innerHTML = `<div class="avatar" style="color: #444444;
    -webkit-box-direction: normal;
    list-style: none;
    box-sizing: border-box;
    margin-right: 12px;
    padding: 0;
    border: 1px solid rgba($color: #000000, $alpha: 0.1);
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;"><a href="/users/${commentCreatorData._id}" style="-webkit-box-direction: normal;
    list-style: none;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    all: unset;
    cursor: pointer;
    text-decoration: none;
    color: inherit;">${imgUrl?`<img src="${imgUrl}" width="50" style="border-radius: 100%;"/>`:`<div class="no-avatar" style="display:flex; justify-content: center; align-items: center; width: 50px; height: 50px; border-radius: 100%; background-color: white; font-weight: 500; -webkit-box-pack: center; -webkit-box-align: center;"><span>${String(commentCreatorData.name[0]).toUpperCase()}</span></div>`}</a></div><div class="text" style="    color: #444444;
    list-style: none;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    padding-top: 2px;"><span class="creator" style="color: #444444;
    list-style: none;
    -webkit-box-direction: normal;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    font-weight: 600;
    margin-bottom: 8px;
    vertical-align: baseline;"><a href="/users/${commentCreatorData._id}" style="list-style: none;
    -webkit-box-direction: normal;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    all: unset;
    cursor: pointer;
    text-decoration: none;
    color: inherit;">${commentCreatorData.name}</a></span><span class="content" style="color: #444444;
    list-style: none;
    -webkit-box-direction: normal;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    font-size: 15px;
    vertical-align: baseline;">${comment}</span></div>`;
    newList.prepend(newLI);

    // Image Style Backup
    // <img src="${imgUrl?imgUrl:''}" width="50" style="-webkit-box-direction: normal;
    // list-style: none;
    // cursor: pointer;
    // color: inherit;
    // width: 50px;
    // box-sizing: border-box;
    // margin: 0;
    // padding: 0;
    // border: 0;
    // font-size: 100%;
    // font: inherit;
    // vertical-align: baseline;
    // border-radius: 100%;"></img>
    //
    setTimeout(() => newLI.style.backgroundColor = "inherit", 2000);
    // // List
    // const liForAvatar = document.createElement("li");
    // const liForText = document.createElement("li");
    // // Span for List
    // const spanForAvatar = document.createElement("span");
    // const spanForText = document.createElement("span");
    // // const delBtn = document.createElement("button");
    // if (imgUrl) {
    //     spanForAvatar.innerHTML = `<img src=${imgUrl} width="50" style="border-radius: 100%;" />`;
    // } else {
    //     const userInitialOnHeader = document.querySelector(".profile-image").innerHTML
    //     spanForAvatar.innerHTML = `<div class="noAvatar">${userInitialOnHeader}</div>`
    // }
    // spanForText.innerText = comment;
    // delBtn.innerHTML = "DELETE";
    // let commentImg = document.createElement("img");
    // commentImg = img;
    // console.log(document.querySelector(".profile-image"))
    // spanForAvatar.innerHTML = document.querySelector(".profile-image")

    // const delBtn = document.createElement("button");
    // delBtn.innerHTML = "Delete";
    // span.innerHTML = comment;
    // liForAvatar.appendChild(spanForAvatar);
    // liForText.appendChild(spanForText);
    // // liForText.appendChild(delBtn);
    // avatarList.prepend(liForAvatar);
    // textList.prepend(liForText);
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const makeImg = (url) => {
    img.src = url;
    img.width = "150";
    imgUrl = url;
}

const sendComment = async (comment) => {
    const videoId = window.location.href.split("/videos/")[1];
    axios
        .post(`/api/${videoId}/comment`, {
            comment,
        })
        .then((response) => {
            makeImg(response.data.avatarUrl);
            const commentCreatorData = response.data.wroteUser;
            // console.log(commentData)
            addComment(comment, commentCreatorData);
            if (response.status === 200) {
                console.log("Success : Uploaded a new comment");
            }
        })
        .catch((error) => {
            console.log(error.response);
        });
    //   const response = axios.post(`/api/${videoId}/comment`, comment, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    // console.log(response)
};

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
    init();
}