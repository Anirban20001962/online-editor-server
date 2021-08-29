import path from "path";
import crypto from "crypto";
import { fileRunner } from "../fileRunner";
import fs from "fs";

const createRandFile = () => {
    const filename = crypto.randomBytes(5).toString("hex") + ".js";
    const file = path.join(process.cwd(), `run/${filename}`);

    const stream = fs.createWriteStream(file);

    stream.write("console.log('Hello')");
    stream.end();

    return {
        file,
        deleteFile: () => {
            fs.unlink(file, () => {});
        },
    };
};

it("should execute and call the onData mock func", (done) => {
    const { file, deleteFile } = createRandFile();

    const onData = jest.fn((data) => {
        expect(data).toBeTruthy();
        deleteFile();
        done();
    });

    const onError = jest.fn(() => {});

    fileRunner({
        cmd: "node",
        args: [file],
        onData,
        onError,
    });
});

it("should execute and call the onError mock func if its running non file command", (done) => {
    const onData = jest.fn(() => {});

    const onError = jest.fn((data) => {
        expect(data).toBeTruthy();
        done();
    });

    fileRunner({
        cmd: "meowmeow",
        args: [],
        onData,
        onError,
    });
});
