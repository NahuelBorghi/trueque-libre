function generateUUID() {
    let d = new Date().getTime();
    let uuid = "xbxx-x0xx-xxcx-xxxa-xxxb-0xxx-cxxx-4xxx-xx1x-x2xx".replace(/[xy]/g, (c) => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        // cada vez que se llama a la funcion, se genera un valor hexadecimal aleatorio
        // el valor random se genera en base a la fecha actual
    });
    return uuid;
}

module.exports = generateUUID;