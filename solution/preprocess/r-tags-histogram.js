var bigXml = require('big-xml-streamer');
var fs = require("fs");
var clear = require('clear');

var rTags = {};
var rowCounter = 0;
var findingCounter = 0;
var mainTagName = "r";

var reader = bigXml.createReader('../Posts.xml', /^(row)$/, { gzip: false });
fs.writeFileSync(`${mainTagName}-tags.csv`, ""); // create or clear tags csv file

reader.on('record', function (record) {

    // if post is "question" then that have tags attribute
    if (record.attrs.PostTypeId == "1") {
        
        clear();
        console.info(++rowCounter);

        var tags = record.attrs.Tags.toLowerCase();
        if (tags && tags.indexOf(`<${mainTagName}>`) > -1) { // tags are about "r"

            // convert to tags array
            var arrTags = tags.replace(/</g, "").split(">").filter(v => v != "" && v != "r");
            if (arrTags.length > 0) {
                var corrolatedTags = arrTags.join(",");
                console.warn(++findingCounter);
                console.warn(corrolatedTags);

                // write any post tags which have 'R' tag
                fs.appendFileSync(`${mainTagName}-tags.csv`, corrolatedTags + "\n")

                arrTags.forEach(tag => {
                    var tagCount = rTags[tag];
                    rTags[tag] = tagCount ? tagCount + 1 : 1;
                });

                fs.writeFileSync(`${mainTagName}-tags-histogram.json`, JSON.stringify(rTags));
            }
        }
    }
});

reader.on('error', function (err) {
    console.error(err);
});