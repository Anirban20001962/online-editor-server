import { Socket } from "socket.io";
// import { spawn } from 'node-pty';
import path from "path";
import fs from "fs";
import { LANGUAGES, EVENTS } from "../constants";
import { RunEventData } from "../interfaces";
import { fileRunner } from "../utils/fileRunner";

export default function handler(socket: Socket) {
    const runOptions = {
        onData(data: any) {
            if (data instanceof Buffer) {
                socket.emit(EVENTS.OUTPUT, data.toString());
                return;
            }
            socket.emit(EVENTS.OUTPUT, data);
        },
        onError(data: any) {
            if (data instanceof Buffer) {
                console.log(data.toString());
                socket.emit(EVENTS.OUTPUT, data.toString());
                return;
            }
            console.log(data.message);
            socket.emit(EVENTS.OUTPUT, data.message);
        },
    };
    //run
    socket.on(EVENTS.RUN, (data: RunEventData) => {
        const { ext, content, language } = data;

        const filename = `./run/${socket.id}${ext}`;
        const stream = fs.createWriteStream(path.join(process.cwd(), filename));
        stream.write(content);
        stream.end();
        if (language === LANGUAGES.JS) {
            fileRunner({
                ...runOptions,
                cmd: "node",
                args: [filename],
            });
        }
        if (language === LANGUAGES.PYTHON) {
            fileRunner({
                ...runOptions,
                cmd: "python",
                args: [filename],
            });
        }
        if (language === LANGUAGES.TS) {
            fileRunner({
                ...runOptions,
                cmd: "ts-node",
                args: [filename],
            });
        }
        if (language === LANGUAGES.C) {
            fileRunner({
                ...runOptions,
                cmd: "gcc",
                args: [
                    filename,
                    "-o",
                    `./run/${socket.id}`,
                    "&&",
                    `./run/${socket.id}`,
                ],
            });
        }
        if (language === LANGUAGES.CPP) {
            console.log("C++ running");
            fileRunner({
                ...runOptions,
                cmd: "g++",
                args: [
                    filename,
                    "-o",
                    `./run/${socket.id}`,
                    "&&",
                    `./run/${socket.id}`,
                ],
            });
        }
    });

    socket.on("disconnect", async () => {
        const regex = new RegExp(socket.id);
        const target = "./run";
        const files = await fs.promises.readdir(target);
        const filesToRemove = files
            .filter((file) => {
                return regex.test(file);
            })
            .map((file) => fs.promises.unlink(path.join(target, file)));
        await Promise.all(filesToRemove);
    });
}
