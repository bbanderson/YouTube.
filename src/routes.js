//Global
const HOME = "/"
const JOIN = "/join"
const LOGIN = "/login"
const LOGOUT = "/logout"
const SEARCH = "/search"

//Users
const USERS = "/users"
const USER_DETAIL = "/:id"
const EDIT_PROFILE = "/edit-profile"
const CHANGE_PASSWORD = "/change-password"
const ME = "/me";

// Github
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Facebook
const FACEBOOK = "/auth/facebook";
const FACEBOOK_CALLBACK = "/auth/facebook/callback";

// Kakao
const KAKAO = "/auth/kakao";
const KAKAO_CALLBACK = "/auth/kakao/callback";

//Videos
const VIDEOS = "/videos"
const VIDEO_DETAIL = "/:id"
const EDIT_VIDEO = "/:id/edit"
const DELETE_VIDEO = "/:id/delete"
const UPLOAD = "/upload"

// API
const API = "/api";
const REGISTER_VIEW = "/:id/view";
const LOAD_COMMENTS = "/:id/all-comments";
const ADD_COMMENTS = "/:id/comment";
const DELETE_COMMENTS = "/:id/comment/delete";
const SUBSCRIBE = "/:id/subscribe";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  me: ME,
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  fb: FACEBOOK,
  fbCallback: FACEBOOK_CALLBACK,
  kakao: KAKAO,
  kakaoCallback: KAKAO_CALLBACK,
  userDetail: id => {
    if (id) {
      return `/users/${id}`
    } else {
      return USER_DETAIL
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: id => {
    if (id) {
      return `/videos/${id}`
    } else {
      return VIDEO_DETAIL
    }
  },
  editVideo: id => {
    if (id) {
      return `/videos/${id}/edit`
    } else {
      return EDIT_VIDEO
    }
  },
  deleteVideo: id => {
    if (id) {
      return `/videos/${id}/delete`
    } else {
      return DELETE_VIDEO
    }
  },
  api: API,
  loadComments: LOAD_COMMENTS,
  registerView: REGISTER_VIEW,
  addComments: ADD_COMMENTS,
  deleteComments: DELETE_COMMENTS,
  subscribe: SUBSCRIBE
}

export default routes;