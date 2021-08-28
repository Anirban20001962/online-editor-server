import { createServer } from "http";
import { Server } from "socket.io";
import { io as client, Socket } from "socket.io-client";
import { EVENTS, LANGUAGES } from "../../constants";
import { EXT } from "../../constants/languages";
import handler from "../handler";

jest.setTimeout(10000);
describe("Test for the socket", () => {
    let io: Server, clientSocket: Socket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        const port = 5000;

        httpServer.listen(port, () => {
            clientSocket = client(`http://localhost:${port}`);
            io.on("connection", handler);
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    it("should listen for the RUN Event from client for js files", (done) => {
        clientSocket.on(EVENTS.OUTPUT, (data) => {
            expect(data).toBeTruthy();
            done();
        });
        clientSocket.emit(EVENTS.RUN, {
            content: "console.log('Hello')",
            language: LANGUAGES.JS,
            ext: EXT.JS,
        });
    });

    it("should listen for the RUN Event from client for ts files", (done) => {
        clientSocket.on(EVENTS.OUTPUT, (data) => {
            expect(data).toBeTruthy();
            done();
        });
        clientSocket.emit(EVENTS.RUN, {
            content: "console.log('Hello')",
            language: LANGUAGES.TS,
            ext: EXT.TS,
        });
    });

    it("should listen for the RUN Event from client for ts files", (done) => {
        clientSocket.on(EVENTS.OUTPUT, (data) => {
            expect(data).toBeTruthy();
            done();
        });

        clientSocket.emit(EVENTS.RUN, {
            content: "print('Hello')",
            language: LANGUAGES.PYTHON,
            ext: EXT.PYTHON,
        });
    });
});
