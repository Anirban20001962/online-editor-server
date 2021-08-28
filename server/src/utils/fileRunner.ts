<<<<<<< HEAD
import { spawn } from "child_process";
=======
import { exec } from "child_process";
>>>>>>> master

type listener<T = any> = (chunks: T) => void;
interface options {
    cmd: string;
    args: string[];
    onData: listener;
    onError: listener;
}
<<<<<<< HEAD
export const fileRunner = ({ cmd, args, onData, onError }: options) => {
    const cp = spawn(cmd, args);
    cp.stdout.on("data", onData);
    cp.stderr.on("data", onError);

    return cp;
=======

export const fileRunner = ({ cmd, args, onData, onError }: options) => {
    exec(`${cmd} ${args.join(" ")}`, (err, stdout, stderr) => {
        if (err) {
            return onError(err);
        }
        if (stdout) {
            return onData(stdout);
        }
        if (stderr) {
            return onError(stderr);
        }
    });
>>>>>>> master
};
