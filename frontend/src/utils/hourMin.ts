export function hourMin(time: string) {
    const date = new Date(time)
    return `${date.getHours()}:${date.getMinutes()}`
}