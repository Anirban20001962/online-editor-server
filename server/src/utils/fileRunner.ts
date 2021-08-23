import { exec } from 'child_process';

type listener<T = any> = (chunks: T) => void;
interface options {
	cmd: string;
	args: string[];
	onData: listener;
	onError: listener;
}

export const fileRunner = ({ cmd, args, onData, onError }: options) => {
	exec(`${cmd} ${args}`, (err, stdout, stderr) => {
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
};
