var bigXml = require('big-xml-streamer');
var fs = require("fs");
var clear = require('clear');

var rTags = {};
var rowCounter = 0;
var rCounter = 0;

var reader = bigXml.createReader('../Posts.xml', /^(row)$/, { gzip: false });
fs.writeFileSync('R-tags.csv', "");

reader.on('record', function (record) {
    if (record.attrs.PostTypeId == "1") { // if post is "question" then that have tags attribute
        clear();
        console.info(++rowCounter);

        var tags = record.attrs.Tags.toLowerCase();
        if (tags && tags.indexOf("<r>") > -1) { // tags are about "r"
            var arrTags = tags.replace(/</g, "").split(">").filter(v => v != "" && v != "r"); // convert to tags array
            if (arrTags.length > 0) {
                console.warn(++rCounter);

                fs.appendFileSync("R-tags.csv", arrTags.join(",") + "\n") // write any post tags which have 'R' tag

                arrTags.forEach(tag => {
                    var tagCount = rTags[tag];
                    rTags[tag] = tagCount ? tagCount + 1 : 1;
                });

                fs.writeFileSync('histogram.json', JSON.stringify(rTags));
            }
        }
    }
});

reader.on('error', function (err) {
    console.error(err);
});

reader.on('finish', () => {
    Console.warn("finish");
});