import { LANGUAGES } from "../constants";

export interface RunEventData {
    ext: string;
    language: LANGUAGES;
    content: string;
}
