import Subscribe from "../models/Subscribe";

export const returnFollowData = (loggedUserInfo) => {
    let followings = [];
    let isFollowing = false;
    if (loggedUserInfo) {
        followings = await Subscribe.find({
            requester: loggedUserInfo.id
        })
        isFollowing = followings.find(item => String(item.target) === String(video.creator.id))
        console.log("👍 Is Following : ", isFollowing)
        console.log("My Followings : ", followings);
    }
    return {
        isFollwing,
        followings
    }
}