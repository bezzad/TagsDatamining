var fs = require("fs");
var distanceMatrix = {};

// read r related tags
fs.readFile(__dirname + "/r-tags.csv", 'utf8', function (err, postsTags) {
    if (err) throw err;

    var aryPostTags = postsTags.split("\n");
    var maxNum = 2600; // max no for distance


    // read r related top 200 frequently tags
    fs.readFile(__dirname + "/top-freq-tags.json", 'utf8', function (err, topFreqTags) {
        if (err) throw err;
        var objTopFreqTags = JSON.parse(topFreqTags);

        // set matrix to [ 
        //                  [ maxNum, maxNum, ..., maxNum], 
        //                  [ maxNum, maxNum, ..., maxNum],
        //                  . 
        //                  . 
        //                  .
        //                  [ maxNum, maxNum, ..., maxNum]
        //               ]
        //
        for (var itag in objTopFreqTags) {
            distanceMatrix[itag] = {}
            for (var jtag in objTopFreqTags) {
                if (itag === jtag)
                    distanceMatrix[itag][jtag] = 0;
                else
                    distanceMatrix[itag][jtag] = maxNum;
            }
        }
        //
        // read posts tags
        var itemsProcessed = 0;
        aryPostTags.forEach(tags => {
            var aPostTags = tags.split(",");
            for (let i = 0; i < aPostTags.length; i++) {
                var iTag = aPostTags[i];

                if (objTopFreqTags[iTag]) { // is iTag frequently tag?

                    for (let j = i + 1; j < aPostTags.length; j++) {
                        var jTag = aPostTags[j];

                        if (objTopFreqTags[jTag]) { // is jTag frequently tag?
                            distanceMatrix[iTag][jTag]--;
                            distanceMatrix[jTag][iTag]--;
                        }
                    }
                }
            }

            if (++itemsProcessed === aryPostTags.length) {
                var headers = Object.getOwnPropertyNames(objTopFreqTags);
                var matrix_csv = headers.join(",") + "\n";
                for (var itag in objTopFreqTags) {
                    matrix_csv += itag; // row header
                    for (var jtag in objTopFreqTags) {
                        matrix_csv += "," + distanceMatrix[itag][jtag]; // row values
                    }
                    matrix_csv += "\n";
                }
                fs.writeFile(__dirname + "/../distance-matrix.csv", matrix_csv, err => {
                    console.error(err);
                });
                console.log("completed");
            }
        });
    });
});