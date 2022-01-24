import { Socket } from 'socket.io';
// import { spawn } from 'node-pty';
import path from 'path';
import fs from 'fs';
import { LANGUAGES, EVENTS } from '../constants';
import { RunEventData } from '../interfaces';
import { fileRunner } from '../utils/fileRunner';
import { CMD } from '../constants/languages';

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

		socket.emit(EVENTS.RUNNING, 'Running file.....');

		const filename = `./run/${socket.id}${ext}`;
		const stream = fs.createWriteStream(path.join(process.cwd(), filename));
		stream.write(content);
		stream.end();

		if (language === LANGUAGES.JS) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [filename],
			});
		}
		if (language === LANGUAGES.PYTHON) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [filename],
			});
		}
		if (language === LANGUAGES.TS) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [filename],
			});
		}
		if (language === LANGUAGES.C) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [
					'-o',
					`./run/${socket.id}`,
					filename,
					'&&',
					`${process.cwd()}/run/${socket.id}`,
				],
			});
		}
		if (language === LANGUAGES.CPP) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [
					'-o',
					`./run/${socket.id}`,
					filename,
					'&&',
					`${process.cwd()}/run/${socket.id}`,
				],
			});
		}
		if (language === LANGUAGES.JAVA) {
			fileRunner({
				...runOptions,
				cmd: CMD[language],
				args: [filename, '&&', `java -cp ${process.cwd()}/run Main`],
			});
		}
	});

	socket.on('disconnect', async () => {
		const regex = new RegExp(socket.id);
		const target = './run';
		const files = await fs.promises.readdir(target);
		const filesToRemove = files
			.filter((file) => {
				return regex.test(file) || file.split('.')[1] === 'class';
			})
			.map((file) => fs.promises.unlink(path.join(target, file)));
		try {
			await Promise.all(filesToRemove);
		} catch (err) {}
	});
}
