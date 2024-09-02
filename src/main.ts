import "./lucide";
import { elementsRecord as ui } from "./ui";
import { getKeys } from "./util";
import { op } from "./video";
import { videoState } from "./videoState";

async function syncVideoPause() {
    let pausePromises = getKeys(videoState)
        .map((key) => {
            const state = videoState[key];
            console.log("state", state);
            if (!state) return;

            const isPlaying = state.playerStatus === 2;
            if (isPlaying) {
                return op({ eventName: "pause" }, key);
            }
        })
        .filter((e) => e);

    if (pausePromises.length === 2) {
        pausePromises = [op({ eventName: "pause" }, "all")];
    }
    await Promise.all(pausePromises);
}

const offset = 2100;

ui.playOffset.addEventListener("click", async () => {
    await syncVideoPause();
    await op({ eventName: "mute", data: { mute: true } }, "all");
    await op({ eventName: "play" }, "all");
    await op({ eventName: "pause" }, "all");
    await op({ eventName: "seek", data: { time: 0 } }, "plus");
    await op({ eventName: "seek", data: { time: offset } }, "minus");
    await op({ eventName: "mute", data: { mute: false } }, "all");
    await op({ eventName: "play" }, "all");
});

ui.play.addEventListener("click", async () => {
    await syncVideoPause();
    await op({ eventName: "play" }, "all");

    ui.play.classList.add("hidden");
    ui.pause.classList.remove("hidden");
});

ui.pause.addEventListener("click", async () => {
    await syncVideoPause();

    ui.play.classList.remove("hidden");
    ui.pause.classList.add("hidden");
});

ui.seekTo.addEventListener("click", async () => {
    const seekTo = prompt("Seek to? (ms)", "126000");
    await syncVideoPause();
    await op({ eventName: "seek", data: { time: Number(seekTo) } }, "plus");
    await op(
        { eventName: "seek", data: { time: Number(seekTo) + offset } },
        "minus",
    );
    await op({ eventName: "play" }, "all");
});

ui.layoutVertical.addEventListener("click", () => {
    ui.layout.classList.add("flex-col");
    ui.layout.classList.remove("flex-row");
    for (const iframe of ui.layout.querySelectorAll("iframe")) {
        iframe.className = "h-[50%] w-full";
    }

    ui.layoutVertical.classList.add("hidden");
    ui.layoutHorizontal.classList.remove("hidden");
});

ui.layoutHorizontal.addEventListener("click", () => {
    ui.layout.classList.add("flex-row");
    ui.layout.classList.remove("flex-col");
    for (const iframe of ui.layout.querySelectorAll("iframe")) {
        iframe.className = "h-full w-[50%]";
    }

    ui.layoutHorizontal.classList.add("hidden");
    ui.layoutVertical.classList.remove("hidden");
});

ui.about.addEventListener("click", () => {
    document.querySelector("dialog")?.showModal();
});

ui.aboutClose.addEventListener("click", () => {
    document.querySelector("dialog")?.close();
});

ui.aboutDialog.addEventListener("click", (e) => {
    // close if clicked outside
    if (e.target === ui.aboutDialog) {
        ui.aboutDialog.close();
    }
});
