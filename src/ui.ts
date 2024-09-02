import { getKeys } from "./util";

const elements = {
    playOffset: document.querySelector<HTMLButtonElement>("#playOffset"),
    play: document.querySelector<HTMLButtonElement>("#play"),
    pause: document.querySelector<HTMLButtonElement>("#pause"),
    seekTo: document.querySelector<HTMLButtonElement>("#seekTo"),
    layout: document.querySelector<HTMLDivElement>("#layout"),
    layoutVertical:
        document.querySelector<HTMLButtonElement>("#layout-vertical"),
    layoutHorizontal:
        document.querySelector<HTMLButtonElement>("#layout-horizontal"),
    about: document.querySelector<HTMLButtonElement>("#about"),
    aboutClose: document.querySelector<HTMLButtonElement>("#about-close"),
    aboutDialog: document.querySelector<HTMLDialogElement>("#about-dialog"),
} as const;

for (const key of getKeys(elements)) {
    if (!elements[key]) {
        throw new Error(`Element ${key} not found`);
    }
}

export const elementsRecord = elements as {
    [K in keyof typeof elements]: Exclude<(typeof elements)[K], null>;
};
