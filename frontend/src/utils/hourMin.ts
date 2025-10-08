export function hourMin(time: string) {
    const date = new Date(time)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const str = `${hours > 12 ? hours-12: hours}:${minutes} ${hours > 12?'p.m':'a.m'}`
    return str;
}