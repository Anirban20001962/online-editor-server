import { spawn } from "child_process";

type listener<T = any> = (chunks: T) => void;
interface options {
    cmd: string;
    args: string[];
    onData: listener;
    onError: listener;
}
export const fileRunner = ({ cmd, args, onData, onError }: options) => {
    const cp = spawn(cmd, args);
    cp.stdout.on("data", onData);
    cp.stderr.on("data", onError);

    return cp;
};
