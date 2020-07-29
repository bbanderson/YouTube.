import mongoose from "mongoose";
import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import {
  s3
} from "../middlewares";

export const home = async (req, res) => {
  console.log("Current logged user : ", req.user);
  const videos = await Video.find({}).sort({
    _id: -1,
  });
  res.render("home", {
    siteName: "",
    videos,
  });
};
export const search = async (req, res) => {
  const {
    query: {
      term: searchingBy
    },
  } = req;
  let videos = [];
  let users = [];
  try {
    videos = await Video.find({
      title: {
        $regex: searchingBy,
        $options: "i",
      },
    }).populate("creator");
    users = await User.find({
      name: {
        $regex: searchingBy,
        $options: "i",
      },
    }).populate("videos");
    console.log("Search results on Users : ", users);
  } catch (error) {}
  res.render("search", {
    siteName: `${searchingBy} - `,
    searchingBy,
    videos,
    users,
  });
};
// export const videos = (req, res) => res.render("home", {siteName: "Home"})
export const getUpload = (req, res) => {
  if (req.user) {
    res.render("upload", {
      siteName: "YouTube Studio - ",
    });
  } else {
    res.render("login");
  }
};
export const postUpload = async (req, res) => {
  const {
    body: {
      title,
      description
    },
    file: {
      location
    },
  } = req;
  // To Do : Upload and save video
  // console.log(path);
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  console.log("Uploaded a video : ", newVideo);
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};
export const videoDetail = async (req, res) => {
  const {
    params: {
      id
    },
  } = req;
  let recommendVideos = [];
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("videos")
      .populate("comments").populate("subscribe");
    console.log("This video : ", video);
    // const videoCreatorFollowers = video.creator.subscribe.
    // const charSet = '|';
    // const index = charSet.length;
    // const randomQuery = charSet[Math.floor(Math.random() * index)]
    // console.log(randomQuery)
    // for (let i = 0; i < randomIndex; i++) {
    //   result += randomChar.charAt(Math.floor(Math.random() * randomIndex));
    // }
    recommendVideos = await Video.find({
        title: {
          // $regex: " ",
          // $options: "i",
          $not: {
            $regex: `${video.title}`
          },
        }
      })
      .populate("creator")
      .populate("comments");
    console.log("Recommend video list : ", recommendVideos);

    const date = await String(video.createdAt).split(" ").slice(0, 4).join(" ");
    res.render("videoDetail", {
      siteName: `${video.title} - `,
      video,
      createdAt: date,
      recommendVideos,
      commentData: [],
    });
  } catch (error) {
    console.log("Error on video detail page : ", error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: {
      id
    },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", {
      siteName: `Edit ${video.title} - `,
      video,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: {
      id
    },
    body: {
      title,
      description
    },
  } = req;
  try {
    await Video.findOneAndUpdate({
      _id: id,
    }, {
      title,
      description,
    });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const deleteVideo = async (req, res) => {
  const {
    params: {
      id
    },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("comments")
      .populate("creator");
    const regex = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/;
    const filePath = await video.fileUrl.match(regex)[3];
    const delFile = {
      Bucket: "bbantube/video",
      Key: filePath,
    };

    await s3
      .deleteObject(delFile, (err, data) => {
        if (err) {
          console.err("Error on deleting video in AWS S3 : ", err);
        } else {
          console.log("Your video has been removed.");
        }
      })
      .promise();
    await Video.findOneAndRemove({
      _id: id,
    });
    const beforeDeleteVideos = req.user.videos;
    let afterDeleteVideos = [];
    afterDeleteVideos = beforeDeleteVideos.filter((item) => {
      return item !== id;
    });
    req.user.videos = afterDeleteVideos;
  } catch (error) {
    res.status(400);
  }
  res.redirect(routes.home);
  // res.render("deleteVideo", {siteName: "Delete Video"})
};

// Video를 데이터베이스에서 찾아오기
export const postRegisterView = async (req, res) => {
  try {
    const {
      params: {
        id
      },
    } = req;
    const video = await Video.findById(id);
    video.views++;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: {
      id
    },
    body: {
      comment
    },
    user,
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("comments")
      .populate("creator");
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    const wroteUser = await User.findById(user.id)
      .populate("comments")
      .populate("videos");
    console.log("Comment wrote user(current logged in) : ", wroteUser);
    // console.log(user.id === req.user.id)
    video.comments.push(newComment.id);
    video.save();
    res.json({
      wroteUser,
      avatarUrl: req.user.avatarUrl,
      loggedUser: user,
      newCommentId: newComment.id,
    });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    body: {
      deleteCommentId,
      videoId
    },
    params: {
      id
    },
  } = req;
  try {
    await Comment.findByIdAndRemove(deleteCommentId, (error, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log(response);
        console.log("Deleted comment Id : ", deleteCommentId);
      }
    });
    // const video = await Video.findById(id).populate("comments").populate("creator");
    // console.log("Wanna delete vid : ", video);
    // video.comments = video.comments.filter(id => {
    //   return id !== commentId;
    // })
  } catch (error) {
    console.log("Error while deleting : ", error);
  } finally {
    res.end();
    // res.redirect(routes.videoDetail(videoId))
  }
};

export const postLoadComments = async (req, res) => {
  const {
    body: {
      videoId
    },
    user,
  } = req;
  let commentData = [];
  try {
    const video = await Video.findById(videoId)
      .populate("creator")
      .populate("videos")
      .populate("comments");
    for (let i = 0; i < (await video.comments.length); i++) {
      const commentDataObj = {};
      // console.log(video.comments[i].creator)
      const user = await User.find({
          _id: video.comments[i].creator,
        })
        .populate("comments")
        .populate("videos");
      // console.log(user[0].avatarUrl)
      if (user[0].avatarUrl) {
        commentDataObj["avatarUrl"] = user[0].avatarUrl;
      } else {
        commentDataObj["avatarUrl"] = "";
      }
      commentDataObj["id"] = video.comments[i].id;
      commentDataObj["text"] = video.comments[i].text;
      commentDataObj["creator_name"] = user[0].name;
      commentDataObj["creator_id"] = user[0].id;
      commentData.push(commentDataObj);
      // commentDataObj["id"] = video.comments
    }
    res.json({
      commentData,
      user,
    });
    // console.log("Comment data in this video : ", commentData)
  } catch (error) {
    console.error(error);
    res.status(400);
  } finally {
    res.end();
  }
  // console.log(video.comments["_id"]);
  // const commentCreators = [];
  // for (let i = 0; i < video.comments.length; i++) {
  //   await User.findById(video.comments[i]["_id"])
  // }
  // const user = await User.findById(video.comments.i)
};