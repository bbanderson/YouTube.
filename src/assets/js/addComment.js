import axios from "axios";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector(".video__comments-list");
const avatarList = document.querySelector(".comments__avatar-list");
const textList = document.querySelector(".comments__text-list");
const commentNumber = document.getElementById("jsCommentNumber");

let img = new Image();
let imgUrl = "";

const addComment = (comment) => {
    // List
    const liForAvatar = document.createElement("li");
    const liForText = document.createElement("li");
    // Span for List
    const spanForAvatar = document.createElement("span");
    const spanForText = document.createElement("span");
    const delBtn = document.createElement("button");
    if (imgUrl) {
        spanForAvatar.innerHTML = `<img src=${imgUrl} width="50" style="border-radius: 100%;" />`;
    } else {
        spanForAvatar.innerHTML = `<div class="noAvatar"></div>`
    }
    spanForText.innerText = comment;
    delBtn.innerHTML = "DELETE";
    // let commentImg = document.createElement("img");
    // commentImg = img;


    // const delBtn = document.createElement("button");
    // delBtn.innerHTML = "Delete";
    // span.innerHTML = comment;
    liForAvatar.appendChild(spanForAvatar);
    liForText.appendChild(spanForText);
    liForText.appendChild(delBtn);
    avatarList.prepend(liForAvatar);
    textList.prepend(liForText);
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
            console.log(response.data.avatarUrl);
            makeImg(response.data.avatarUrl);
            if (response.status === 200) {
                addComment(comment);
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