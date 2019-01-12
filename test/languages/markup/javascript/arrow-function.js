const sum = (a, b) => a + b;
const getTime = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return `${hours}:${minutes}`;
};
