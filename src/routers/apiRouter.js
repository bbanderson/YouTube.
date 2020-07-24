import express from "express"
import routes from "../routes"
import {
    postRegisterView,
    postAddComment,
    postDeleteComment
} from "../controllers/videoController";

const apiRouter = express.Router()

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComments, postAddComment);
apiRouter.post(routes.deleteComments, postDeleteComment);

export default apiRouter;