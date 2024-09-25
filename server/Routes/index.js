import usersRouter from "./Users/index.js";

const routes = {
    users : {
        path:"/profile",
        router: usersRouter,
    }
}

export default routes;