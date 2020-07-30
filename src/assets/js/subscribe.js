import axios from "axios";
const subscribe = document.getElementById("jsSubscribe");
const followerNumber = document.getElementById("jsFollowerNumber");

const paintSubscribe = (subscribeStatus, oppositeID) => {
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

const leadLogin = () => {
    const loginLink = document.createElement("a");
    loginLink.href = "/login";
    loginLink.click();
}

const handleSubscribeBtn = async () => {
    const targetId = subscribe.querySelector("span")["id"];
    // const loginStatus = document.getElementById("jsCheckLogin");
    // const isLogin = loginStatus["value"];
    axios.post(`/api/${targetId}/subscribe`, {
        targetId,
        // isLogin
    }).then(response => {
        if (response.status === 200) {
            console.log("Subscribe response : ", response);
            const loginStatus = response.data.subscribe
            if (loginStatus === "No Login") {
                console.log("Need to login");
                leadLogin();
            } else {
                paintSubscribe(loginStatus, targetId);
            }
            // else {
            //     console.log("THIS")
            //     axios.get(`/login`).then(response => {

            //     }).catch(error => {
            //         console.error(error)
            //     });

            // }
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