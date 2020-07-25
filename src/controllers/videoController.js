import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import {
  s3
} from "../middlewares";

export const home = async (req, res) => {
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
    });
    users = await User.find({
      name: {
        $regex: searchingBy,
        $options: "i"
      }
    });
  } catch (error) {}
  res.render("search", {
    siteName: `${searchingBy} - `,
    searchingBy,
    videos,
    users
  });
};
// export const videos = (req, res) => res.render("home", {siteName: "Home"})
export const getUpload = (req, res) => {
  if (req.user) {
    res.render("upload", {
      siteName: "YouTube Studio - ",
    });
  } else {
    res.render("login")
  }
}
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
  console.log(newVideo);
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
      .populate("comments");
    const charSet = '|';
    const index = charSet.length;
    const randomQuery = charSet[Math.floor(Math.random() * index)]
    console.log(randomQuery)
    // for (let i = 0; i < randomIndex; i++) {
    //   result += randomChar.charAt(Math.floor(Math.random() * randomIndex));
    // }
    recommendVideos = await Video.find({
      title: {
        $regex: randomQuery,
        $options: "i",
      },
    });
    console.log(recommendVideos);
    let commentAvatars = [];
    for (let i = 0; i < video.comments.length; i++) {
      // console.log(video.comments[i].creator)
      const user = await User.find({
        _id: video.comments[i].creator
      });
      // console.log(user[0].avatarUrl)
      if (user[0].avatarUrl) {
        commentAvatars.push(user[0].avatarUrl);
      } else {
        commentAvatars.push("");
      }
    }
    console.log(commentAvatars)
    // console.log(video.comments["_id"]);
    // const commentCreators = [];
    // for (let i = 0; i < video.comments.length; i++) {
    //   await User.findById(video.comments[i]["_id"])
    // }
    // const user = await User.findById(video.comments.i)
    const date = await String(video.createdAt).split(" ").slice(0, 4).join(" ");
    res.render("videoDetail", {
      siteName: `${video.title} - `,
      video,
      createdAt: date,
      commentAvatars,
      recommendVideos
    });
  } catch (error) {
    console.log(error);
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
      siteName: `Edit ${video.title}`,
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
    const video = await Video.findById(id);
    const regex = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/;
    const filePath = await video.fileUrl.match(regex)[3];
    const delFile = {
      Bucket: "bbantube/video",
      Key: filePath,
    };
    await s3
      .deleteObject(delFile, (err, data) => {
        if (err) {
          console.err(err);
        } else {
          console.log("Your video has been removed.");
        }
      })
      .promise();
    await Video.findOneAndRemove({
      _id: id,
    });
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
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    const wroteUser = await User.findById(user.id);
    console.log(wroteUser);
    // console.log(user.id === req.user.id)
    video.comments.push(newComment.id);
    video.save();
    res.json(wroteUser);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    body: {
      commentId
    },
    params: {
      id
    }
  } = req;
  console.log(commentId);
  try {
    await Comment.findByIdAndRemove({
      _id: commentId
    });
  } catch (error) {
    console.log(error)
  }
  res.redirect(routes.videoDetail(id))
}