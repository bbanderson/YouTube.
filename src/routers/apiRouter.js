import express from "express"
import routes from "../routes"
import {
    postRegisterView,
    postAddComment,
    postDeleteComment,
    postLoadComments
} from "../controllers/videoController";

const apiRouter = express.Router()

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComments, postAddComment);
apiRouter.post(routes.deleteComments, postDeleteComment);
apiRouter.post(routes.loadComments, postLoadComments);

export default apiRouter;