import os from "os";

enum LANGUAGES {
    PYTHON = "python",
    TS = "typescript",
    JS = "javascript",
    //future features
    C = "c",
    CPP = "cpp",
    JAVA = "java",
}

export enum EXT {
    PYTHON = ".py",
    TS = ".ts",
    JS = ".js",
    //future features
    C = ".c",
    CPP = ".cpp",
    JAVA = ".java",
}

export const CMD = {
    python: os.platform() === "win32" ? "python" : "python3",
    typescript: "ts-node",
    javascript: "node",
    c: "gcc",
    cpp: "g++",
    java: "javac",
};
export default LANGUAGES;
