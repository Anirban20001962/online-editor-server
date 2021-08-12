"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_pty_1 = require("node-pty");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../constants");
const shell = os_1.default.platform() === "win32" ? "powershell.exe" : "bash";
function handler(socket) {
    const ptyProcess = node_pty_1.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 20,
        cwd: process.cwd(),
        //@ts-ignore
        env: process.env,
    });
    // output
    ptyProcess.onData((data) => {
        socket.emit(constants_1.EVENTS.OUTPUT, data);
    });
    //input
    socket.on(constants_1.EVENTS.INPUT, (data) => {
        ptyProcess.write(data);
    });
    //run
    socket.on(constants_1.EVENTS.RUN, (data) => {
        const { ext, content, language } = data;
        const filename = `./run/app${ext}`;
        const stream = fs_1.default.createWriteStream(path_1.default.join(process.cwd(), filename));
        stream.write(content);
        stream.end();
        if (language === constants_1.LANGUAGES.JS) {
            ptyProcess.write(`node ${filename}\r`);
        }
        if (language === constants_1.LANGUAGES.PYTHON) {
            ptyProcess.write(`python ${filename}\r`);
        }
        if (language === constants_1.LANGUAGES.TS) {
            ptyProcess.write(`npx ts-node ${filename}\r`);
        }
    });
    socket.on("disconnect", async () => {
        const regex = /app./;
        const target = "./run";
        const files = await fs_1.default.promises.readdir(target);
        const filesToRemove = files
            .filter((file) => {
            console.log(file);
            return regex.test(file);
        })
            .map((file) => fs_1.default.promises.unlink(path_1.default.join(target, file)));
        await Promise.all(filesToRemove);
    });
}
exports.default = handler;
//# sourceMappingURL=handler.js.map