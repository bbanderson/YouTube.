import passport from "passport";
import User from "./models/User";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import KakaoStrategy from "passport-kakao";
import {
    githubLoginCallback,
    fbCallback,
    kakaoLoginCallback
} from "./controllers/userController";
import routes from "./routes";


// Local Strategy
passport.use(User.createStrategy());

// Github Strategy
// http://localhost:3000/auth/github/callback
passport.use(
    new GithubStrategy({
            clientID: process.env.GithubClientID,
            clientSecret: process.env.GithubClientSecret,
            callbackURL: `http://localhost:3000${routes.githubCallback}`,
        },
        githubLoginCallback
    )
);

// Facebook Strategy
passport.use(
    new FacebookStrategy({
            clientID: process.env.FacebookID,
            clientSecret: process.env.FacebookSecret,
            callbackURL: `https://nasty-earwig-33.serverless.social${routes.fbCallback}`,
            profileFields: ["id", "displayName", "photos", "email"],
            scope: ["public_profile", "email"],
        },
        fbCallback
    )
);

// Kakao Strategy
passport.use(
    new KakaoStrategy({
        clientID: process.env.KakaoID,
        clientSecret: "", // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
        callbackURL: `http://localhost:3000${routes.kakaoCallback}`
    }, kakaoLoginCallback)
)

// Cookie에 해킹당해도 상관없는 User ID를 담아서 서버로 보낸다.
passport.serializeUser(User.serializeUser());
// 서버에서는 다시 복호화한다.
passport.deserializeUser(User.deserializeUser());