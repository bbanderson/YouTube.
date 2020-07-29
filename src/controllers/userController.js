import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import Subscribe from "../models/Subscribe";
import mongoose from "mongoose";

export const getJoin = (req, res) =>
  res.render("join", {
    siteName: "Join - ",
  });
export const postJoin = async (req, res, next) => {
  const {
    body: {
      name,
      email,
      password,
      password2
    },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match.");
    res.status(400);
    res.render("join", {
      siteName: "Join - ",
    });
  } else {
    // To Do: Register User
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    // To Do: Log user in
  }
};
export const getLogin = (req, res) =>
  res.render("login", {
    siteName: "Login - ",
  });
export const postLogin = passport.authenticate("local", {
  successFlash: "Welcome",
  failureFlash: "Cannot log in, check your account",
  failureRedirect: routes.login,
  successRedirect: routes.home,
});
// SOCIAL LOGIN PART
// Github
export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Cannot log in, try it again.",
});
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(accessToken, refreshToken, profile, cb);
  const {
    _json: {
      id,
      avatar_url,
      login: name,
      email
    },
  } = profile;
  try {
    // Github와 연동했을 때, 만약 회원이 Local Strategy로 가입했던 이메일과 Github에 등록된 이메일이 같다면,
    // 기존 회원정보에 Github 정보도 추가해서 DB에 등록한다.
    const user = await User.findOne({
      email,
    });
    console.log(user);
    if (user) {
      user.githubId = id;
      user.save();
      // Github을 이용한 인증은 passport에서 제공하는 cb()함수를 이용한다.
      // cb() 함수의 첫번째 인자는 에러처리, 두번째 인자는 성공처리다.
      return cb(null, user);
    }
    // 만약 내 웹서비스에 가입한 적이 없거나 이메일 정보가 Github과 다르다면, 해당 Github정보로 가입을 시킨다.

    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

// Facebook
export const fbLogin = passport.authenticate("facebook", {
  successFlash: "Welcome",
  failureFlash: "Cannot log in, try it again.",
});
export const fbCallback = async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  const {
    _json: {
      id,
      name,
      email
    },
  } = profile;
  try {
    const user = await User.findOne({
      email,
    });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    console.error(error);
    cb(error);
  }
};

export const postFbLogin = (req, res) => {
  res.redirect(routes.home);
};

// Kakao Login
export const kakaoLogin = passport.authenticate("kakao", {
  failureFlash: "Failed",
  successFlash: "Success",
});

export const kakaoLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  console.log(accessToken, refreshToken, profile, done);
  const {
    _json: {
      id,
      properties: {
        nickname: name,
        profile_image: avatar_url
      },
      kakao_account: {
        email
      },
    },
  } = profile;
  try {
    // Github와 연동했을 때, 만약 회원이 Local Strategy로 가입했던 이메일과 Github에 등록된 이메일이 같다면,
    // 기존 회원정보에 Github 정보도 추가해서 DB에 등록한다.
    const user = await User.findOne({
      email,
    });
    console.log(user);
    if (user) {
      user.kakaoId = id;
      user.save();
      // Github을 이용한 인증은 passport에서 제공하는 cb()함수를 이용한다.
      // cb() 함수의 첫번째 인자는 에러처리, 두번째 인자는 성공처리다.
      return done(null, user);
    }
    // 만약 내 웹서비스에 가입한 적이 없거나 이메일 정보가 Github과 다르다면, 해당 Github정보로 가입을 시킨다.

    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl: avatar_url,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

export const postkakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged out.");
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) =>
  res.render("users", {
    siteName: "Home",
  });

export const userDetail = async (req, res) => {
  const {
    params: {
      id
    },
  } = req;
  try {
    const user = await User.findById(id)
      .populate("videos")
      .populate("comments").populate("subscribe");
    console.log("User info you are looking at this page : ", user);
    // console.log("REQ.USER : ", req.user)
    for (let i = 0; i < user.videos.length; i++) {
      console.log("This USER's video id : ", user.videos[i]["_id"]);
    }
    const followings = await Subscribe.find({
      requester: req.user.id
    })
    const isFollowing = followings.find(item => String(item.target) === String(user.id))
    console.log("👍 Is Following : ", isFollowing)

    const followers = await Subscribe.find({
      target: user.id
    })
    // console.log("This USER's video id : ", user.videos)
    res.render("userDetail", {
      siteName: `${user.name} - `,
      user,
      followings,
      followers,
      isFollowing
    });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};

export const getMe = (req, res) => {
  res.render("userDetail", {
    siteName: "YouTube Studio - ",
    user: req.user,
  });
};

export const getEditProfile = (req, res) => {
  res.render("editProfile");
};

export const postEditProfile = async (req, res) => {
  const {
    body: {
      name,
      email
    },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.userDetail(req.user.id));
  } catch (error) {
    req.flash("error", "Cannot update profile");
    res.render("editProfile", {
      siteName: "Edit Profile - ",
    });
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", {
    siteName: "Change Password - ",
  });
};

export const postChangePassword = async (req, res) => {
  const {
    body: {
      oldPassword,
      newPassword,
      newPassword1
    },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Passwords do not match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
    } else {
      await req.user.changePassword(oldPassword, newPassword);
      req.flash("success", "Password has been changed");
      res.redirect(routes.me);
    }
  } catch (error) {
    req.flash("error", "Cannot change password");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};

// export const subscribe = async (req, res) => {
//   const {
//     body: {
//       targetId
//     },
//     user,
//   } = req;
//   console.log(targetId);
//   try {
//     const target = await User.findById(targetId);
//     let followersList = target.followers;
//     let followingList = req.user.following;
//     console.log(target);
//     let index = 0;
//     const modifyList = (index, arr) => {
//       const arr1 = arr.slice(0, index);
//       const arr2 = arr.slice(index + 1);
//       // followersList = [...arr1, ...arr2];
//       // target.followers = followersList;
//       followingList = [...arr1, ...arr2];
//       // target.save();
//     };
//     if (followingList.length === 0) {
//       followingList.push(targetId);
//       user.save();
//       res.json(followingList);
//     } else {

//       for (let i = 0; i < followingList.length; i++) {
//         if (followingList[i] === user.id) {
//           index = i;
//           modifyList(index, followingList);
//         } else {
//           // If user is not subscribing yet, Subscribe it
//           // target.followers.push(req.user.id);
//           followingList.push(targetId);
//           req.user.save();
//           // followersList.push(req.user.id)
//         }
//       }
//     }
//     // for (let i = 0; i < followersList.length; i++) {
//     //   // If user is subscribing already, Unsubscribe it
//     // }
//     // target.save();
//     res.json(followingList);
//     // if (!followerObj[user.id]) {
//     //   console.log("You are going to subscribe this user : ", target);
//     //   target.update()
//     //   res.json({
//     //     target,
//     //     status: "start subscribing"
//     //   });
//     // } else {
//     //   console.log("You are going to unsubscribe this user : ", target);
//     //   // followerObj[user.id] = null;
//     //   const key = user.id
//     //   await User.findOneAndUpdate({
//     //     _id: targetId
//     //   }, {
//     //     key: null
//     //   })
//     //   target.save();
//     //   res.json({
//     //     target,
//     //     status: "start unsubscribing"
//     //   });
//     // }
//   } catch (error) {
//     res.status(400);
//     console.error(error);
//   } finally {
//     res.end();
//   }
// };

export const subscribe = async (req, res) => {
  const {
    body: {
      targetId
    },
    user
  } = req;
  // for (let i = 0; i < req.user.following.length; i++) {
  //   req.user.following.pop();
  // }
  // req.user.save();
  // res.end();
  try {
    const currentUser = await User.findById(user.id).populate("subscribe");
    const targetUser = await User.findById(targetId).populate("subscribe");
    const myFollowings = await Subscribe.find({
      requester: user.id
    }).populate("user");
    console.log(myFollowings)
    const item = myFollowings.find(item => String(item.target) === String(targetId))
    // const isFollwing = myFollowings.includes(targetId);
    // currentUser.save();
    if (!item) {
      console.log(`💖 New Subscribe : ${currentUser.id} -> ${targetId}`);
      const newSubscribe = await Subscribe.create({
        requester: user.id,
        target: targetId
      });
      currentUser.subscribe.push(newSubscribe.id);
      targetUser.subscribe.push(newSubscribe.id);
      console.log(`✅ New subscribe document ID : ${newSubscribe.id}`);
      currentUser.save();
      res.json({
        "subscribe": true
      })
    } else {
      console.log("DELETE IT")
      const prevSubscribeDocument = await currentUser.subscribe.find(item => String(item.target) === String(targetId));
      console.log(prevSubscribeDocument);
      await Subscribe.findByIdAndRemove(prevSubscribeDocument._id, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          // console.log(response);
          console.log(`👏 Unsubscribe : ${currentUser.id} -> ${targetId}`)
          console.log("✅ Deleted subscribe document's ID : ", prevSubscribeDocument._id);
        }
      });
      res.json({
        "subscribe": false
      })
    }
    // if (currentUser.subscribe)
    // res.json(currentUser);
  } catch (error) {
    res.status(400);
    console.error(error);
  } finally {
    res.end();
  }
}