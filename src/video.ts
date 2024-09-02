type VideoEvents =
    | { eventName: "play" }
    | { eventName: "pause" }
    | { eventName: "mute"; data: { mute: boolean } }
    | { eventName: "seek"; data: { time: number } };

// operation
export async function op(event: VideoEvents, target: "all" | "plus" | "minus") {
    const opHeader = `[OP ${event.eventName} for ${target}]`;
    console.log(`${opHeader} begin`);

    const videos = (() => {
        const query = `iframe[src^='https://embed.nicovideo.jp/watch/']`;
        switch (target) {
            case "all":
                return [...document.querySelectorAll<HTMLIFrameElement>(query)];
            case "plus":
                return [document.querySelectorAll<HTMLIFrameElement>(query)[0]];
            case "minus": {
                return [document.querySelectorAll<HTMLIFrameElement>(query)[1]];
            }
            default: {
                throw new Error("invalid target");
            }
        }
    })();
    console.debug(`${opHeader}`, "videos", videos);

    const tasks = videos.map((video, index) => {
        const playerId =
            target !== "all" ? target : index === 0 ? "plus" : "minus";

        return new Promise((resolve) => {
            function listener(receivedEvent: MessageEvent) {
                console.log(`${opHeader} TASK ${index}`, receivedEvent.data);
                if (
                    checkCondition(
                        receivedEvent.data,
                        event.eventName,
                        playerId,
                    )
                ) {
                    window.removeEventListener("message", listener);
                    resolve(receivedEvent.data);
                }
            }

            window.addEventListener("message", listener);

            video.contentWindow?.postMessage(
                { ...event, sourceConnectorType: 1, playerId },
                "https://embed.nicovideo.jp",
            );
        });
    });

    const results = await Promise.all(tasks);
    console.debug(`${opHeader} done`, results);
    return;
}

function checkCondition(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    receivedEvent: any,
    expectEventName: VideoEvents["eventName"],
    playerId: string,
) {
    if (receivedEvent.playerId !== playerId) {
        return false;
    }

    switch (expectEventName) {
        case "play":
            return (
                receivedEvent.eventName === "playerStatusChange" &&
                receivedEvent.data.playerStatus === 2
            );
        case "pause":
            return (
                receivedEvent.eventName === "playerStatusChange" &&
                receivedEvent.data.playerStatus === 3
            );
        case "mute":
            return true;
        case "seek":
            return (
                receivedEvent.eventName === "seekStatusChange" &&
                receivedEvent.data.seekStatus === 0
            );
    }
}
