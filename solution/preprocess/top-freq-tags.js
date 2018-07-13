var fs = require("fs");

var listObj, freq, topFreq = {};
fs.readFile(__dirname + '/results/r-tags-histogram.json', 'utf8', function (err, data) {
    if (err) throw err;

    listObj = JSON.parse(data);
    //
    // desc sort tags
    freq = Object.keys(listObj).sort(function (a, b) {
        return listObj[b] - listObj[a] // desc
    })
    //
    // select top 200 frequently tags
    for (let index = 0; index < 200; index++) {
        topFreq[freq[index]] = listObj[freq[index]];
    }

    // store top 200 frequently tags
    fs.writeFile(__dirname + "/results/top-freq-tags.json", JSON.stringify(topFreq), function (err) {
        console.error(err);
    })
});