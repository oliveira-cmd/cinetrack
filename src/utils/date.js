async function dateNow() {

    var d = Date.now();
    var date = new Date(+d);
    const dateFormated = date.toLocaleTimeString()
    return dateFormated;
}

module.exports = {dateNow}