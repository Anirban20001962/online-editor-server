"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const handler_1 = __importDefault(require("./socket/handler"));
const app = express_1.default();
const port = process.env.PORT || 3000;
app.use(express_1.default.static(path_1.default.join(process.cwd(), "./client/build")));
app.use(["/", "/*"], (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "./client/build/index.html"));
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        credentials: true,
        methods: "*",
        origin: "*",
    },
});
io.on("connection", handler_1.default);
server.listen(port, () => {
    console.log("Server started @ ", port);
});
//# sourceMappingURL=index.js.map