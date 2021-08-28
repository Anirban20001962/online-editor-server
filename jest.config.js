/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["./server/src/test/setUpEnv.ts"],
    setupFilesAfterEnv: ["./server/src/test/setUp.ts"],
};
