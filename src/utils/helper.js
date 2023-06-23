export const convertObjToArr = (obj) => {
    return Object.keys(obj).map((key) => {
        return obj[key];
    });
}