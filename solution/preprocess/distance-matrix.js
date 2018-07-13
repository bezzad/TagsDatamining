// The distance for two tags is a number between [0, 1]
// So, 1 is farest distance and 0 is distance of a tag from self

var fs = require("fs");
var distanceMatrix = {};

// read r related tags
fs.readFile(__dirname + "/results/r-tags.csv", 'utf8', function (err, postsTags) {
    if (err) throw err;

    var aryPostTags = postsTags.split("\n");

    // read r related top 200 frequency tags
    fs.readFile(__dirname + "/results/top-freq-tags.json", 'utf8', function (err, topFreqTags) {
        if (err) throw err;
        var objTopFreqTags = JSON.parse(topFreqTags);

        // initial matrix to 
        //               [ 
        //                  [ 0, 1, ..., 1], 
        //                  [ 1, 0, ..., 1],
        //                  . 
        //                  . 
        //                  .
        //                  [ 1, 1, ..., 0]
        //               ]
        //
        for (var itag in objTopFreqTags) {
            distanceMatrix[itag] = {}
            for (var jtag in objTopFreqTags) {
                if (itag === jtag)
                    distanceMatrix[itag][jtag] = 0;
                else
                    distanceMatrix[itag][jtag] = 1;
            }
        }
        //
        // read posts tags
        var itemsProcessed = 0;
        aryPostTags.forEach(tags => {
            var aPostTags = tags.split(",");
            for (let i = 0; i < aPostTags.length; i++) {
                var iTag = aPostTags[i];

                if (objTopFreqTags[iTag]) { // is iTag frequency tag?

                    for (let j = i + 1; j < aPostTags.length; j++) {
                        var jTag = aPostTags[j];

                        if (objTopFreqTags[jTag]) { // is jTag frequency tag?
                            distanceMatrix[iTag][jTag]++;
                            distanceMatrix[jTag][iTag]++;
                        }
                    }
                }
            }

            if (++itemsProcessed === aryPostTags.length) {
                //
                // create distance-matrix file
                //
                var headers = Object.getOwnPropertyNames(objTopFreqTags);
                var matrix_csv = headers.join(",") + "\n";
                for (var itag in objTopFreqTags) {
                    matrix_csv += itag; // row header
                    for (var jtag in objTopFreqTags) {
                        // calc distance for a number between [0, 1]
                        if (itag !== jtag) // Denominator must not be zero
                            distanceMatrix[itag][jtag] = 1 / distanceMatrix[itag][jtag];

                        // store in csv line
                        matrix_csv += "," + distanceMatrix[itag][jtag]; // row values
                    }
                    matrix_csv += "\n";
                }
                fs.writeFile(__dirname + "/results/distance-matrix.csv", matrix_csv, err => {
                    console.error(err);
                });
                console.log("completed");
            }
        });
    });
});