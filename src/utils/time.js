export const formatTimeDate = (time) => {
    const timeDate = new Date(Number(time)).toLocaleString()
    if (timeDate === "Invalid Date") {
        return false
    } else {
        return timeDate
    }
}