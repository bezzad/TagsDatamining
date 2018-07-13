var fs = require("fs");

fs.readFile(__dirname + '/results/clusters.txt', 'utf8', function (err, tags) {
    if (err) throw err;

    var clusters = [], counter = 0;
    tags = tags.split("\n");

    tags.forEach(tcn => {
        var strClusterNum = tcn.match(/(\"\s\d*)/g);
        if (strClusterNum) {
            var clusterName = parseInt(strClusterNum[0].replace(/\"\s/g, ""));
            if (clusters[clusterName] == null)
                clusters[clusterName] = [];

            clusters[clusterName].push(tcn.replace(strClusterNum, "").replace('"', "").replace("\r", ""));
        }

        if (++counter === tags.length) {
            var results = "clusters, tags\n";
            for (let i = 1; i < clusters.length; i++) {
                results += `${i},  ${clusters[i].join(",")}\n`;
            }
            fs.writeFile(`${__dirname}/results/clusters.csv`, results, err => {
                if (err) throw err;
            });

            console.log("Finish");
        }
    });
});