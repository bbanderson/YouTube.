import axios from "axios";
const subscribe = document.getElementById("jsSubscribe");
const followerNumber = document.getElementById("jsFollowerNumber");

const paintUI = (subscribeStatus, oppositeID) => {
    if (subscribeStatus) {
        // Current : Subscribe the creator => Need to change btn to be grey
        subscribe.classList.remove("subscribe");
        subscribe.classList.add("unsubscribe");
        subscribe.innerHTML = `<span id=${oppositeID}>Subscribing</span>`;
        followerNumber.innerText = parseInt(followerNumber.innerText, 10) + 1;
    } else {
        subscribe.classList.remove("unsubscribe");
        subscribe.classList.add("subscribe");
        subscribe.innerHTML = `<span id=${oppositeID}>Subscribe</span>`;
        followerNumber.innerText = parseInt(followerNumber.innerText, 10) - 1;
    }
}

const handleSubscribeBtn = async () => {
    const targetId = subscribe.querySelector("span")["id"];
    axios.post(`/api/${targetId}/subscribe`, {
        targetId
    }).then(response => {
        if (response.status === 200) {
            console.log("Subscribe response : ", response);
            paintUI(response.data.subscribe, targetId);
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