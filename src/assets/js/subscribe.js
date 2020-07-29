import axios from "axios";
const subscribe = document.getElementById("jsSubscribe");

const handleSubscribeBtn = async () => {
    const targetId = subscribe.querySelector("span")["id"];
    axios.post(`/api/${targetId}/subscribe`, {
        targetId
    }).then(response => {
        if (response.status === 200) {
            console.log("Subscribe response : ", response);
        }
    }).catch(error => {
        console.error("Error on subscribe : ", error);
    })
}

const init = () => {
    subscribe.addEventListener("click", handleSubscribeBtn);
}

if (subscribe) {
    init();
}