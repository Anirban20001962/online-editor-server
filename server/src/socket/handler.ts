import { Socket } from "socket.io";
import { spawn } from "node-pty";
import path from "path";
import os from "os";
import fs from "fs";
import { LANGUAGES, EVENTS } from "../constants";
import { RunEventData } from "../interfaces";

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export default function handler(socket: Socket) {
    const ptyProcess = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 20,
        cwd: process.cwd(),
        //@ts-ignore
        env: process.env,
    });

    // output
    ptyProcess.onData((data) => {
        socket.emit(EVENTS.OUTPUT, data);
    });

    //input
    socket.on(EVENTS.INPUT, (data) => {
        ptyProcess.write(data);
    });

    //run
    socket.on(EVENTS.RUN, (data: RunEventData) => {
        const { ext, content, language } = data;
        
        const filename = `./run/app${ext}`;
        const stream = fs.createWriteStream(path.join(process.cwd(), filename));
        stream.write(content);
        stream.end();
        if (language === LANGUAGES.JS) {
            ptyProcess.write(`node ${filename}\r`);
        }
        if (language === LANGUAGES.PYTHON) {
            ptyProcess.write(`python ${filename}\r`);
        }
        if (language === LANGUAGES.TS) {
            ptyProcess.write(`npx ts-node ${filename}\r`);
        }
    });

    socket.on("disconnect", async () => {
        const regex = /app./;
        const target = "./run";
        const files = await fs.promises.readdir(target);
        const filesToRemove = files
            .filter((file) => {
                console.log(file);
                return regex.test(file);
            })
            .map((file) => fs.promises.unlink(path.join(target, file)));
        await Promise.all(filesToRemove);
    });
}
