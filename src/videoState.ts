// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const videoState: Record<"plus" | "minus", any> = {
    plus: null,
    minus: null,
};
// @ts-expect-error no type
window.videoState = videoState;

window.addEventListener("message", (e) => {
    console.debug("[DEBUG]", e.data);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const { data, playerId }: { data: any; playerId: string } = e.data;
    if (playerId === undefined) {
        return;
    }
    if (playerId !== "plus" && playerId !== "minus") {
        return;
    }

    videoState[playerId] = {
        ...videoState[playerId],
        ...data,
    };
});
