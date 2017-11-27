export function round(num) {
    return (0.5 + num) | 0;
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
