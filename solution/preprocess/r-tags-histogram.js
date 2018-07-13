var bigXml = require('big-xml-streamer');
var fs = require("fs");
var clear = require('clear');

var rTags = {};
var rowCounter = 0;
var findingCounter = 0;

var reader = bigXml.createReader('../Posts.xml', /^(row)$/, { gzip: false });
fs.writeFileSync(`${__dirname}/results/r-tags.csv`, ""); // create or clear r-tags.csv file

reader.on('record', function (record) {

    // if post is "question" then that have tags attribute
    if (record.attrs.PostTypeId == "1") {
        
        clear();
        console.info(++rowCounter);

        var tags = record.attrs.Tags.toLowerCase();
        if (tags && tags.indexOf(`<r>`) > -1) { // tags are about "r"

            // convert to tags array
            var arrTags = tags.replace(/</g, "").split(">").filter(v => v != "" && v != "r");
            if (arrTags.length > 0) {
                var correlatedTags = arrTags.join(",");
                console.warn(++findingCounter);
                console.warn(correlatedTags);

                // write any post tags which have 'R' tag
                fs.appendFileSync(`${__dirname}/results/r-tags.csv`, correlatedTags + "\n")

                arrTags.forEach(tag => {
                    var tagCount = rTags[tag];
                    rTags[tag] = tagCount ? tagCount + 1 : 1;
                });

                fs.writeFileSync(`${__dirname}/results/r-tags-histogram.json`, JSON.stringify(rTags));
            }
        }
    }
});

reader.on('error', function (err) {
    console.error(err);
});