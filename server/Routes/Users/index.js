import express from "express"
import queries from "./queries.js"
const usersRouter = express.Router()

usersRouter.use("/", queries)

export default usersRouter;