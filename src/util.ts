// https://zenn.dev/ossamoon/articles/694a601ee62526
export const getKeys = <T extends { [key: string]: unknown }>(
    obj: T,
): (keyof T)[] => {
    return Object.keys(obj);
};
