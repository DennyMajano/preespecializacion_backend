const RandomCodes = require("random-codes");
const config = {
    // A string containing available chars
    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",

    // Separator char used to divide code parts
    separator: "",

    // Char used to mask code
    mask: "*",

    // Number of parts the code contains
    parts: 3,

    // Size of each part
    part_size: 4,

    // Function used to get a random char from the chars pool
    // (Please use a better one)
    getChar: function (pool) {
        var random = Math.floor(Math.random() * pool.length);
        return pool.charAt(random);
    },
};
module.exports = () => {
    rc = new RandomCodes(config);
    return rc.generate();
};
