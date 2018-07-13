#source("https://bioconductor.org/biocLite.R")
#biocLite("ctc")
library(ctc)

# install.packages("ape")
library("ape")

distanceMat <- read.delim("../results/distance-matrix.csv", header = TRUE, sep=",")
d <- dist(as.matrix(distanceMat))      # find distance matrix 
hc <- hclust(d)                # apply hirarchical clustering 
# Put the labels at the same height: hang = -1
plot(hc, hang = -1, cex = 0.6)                     # plot the dendrogram

write.table(hc2Newick(hc, flat=TRUE), file="../results/clusters.txt", row.names=FALSE, col.names=FALSE)




# Convert hclust into a dendrogram and plot
hcd <- as.dendrogram(hc)

# Define nodePar
nodePar <- list(lab.cex = 0.6, pch = c(NA, 19), cex = 0.7, col = "blue")

# Change edge color
plot(hcd,  xlab = "Height", nodePar = nodePar, edgePar = list(col = 2:3, lwd = 2:1))


# Unrooted
plot(as.phylo(hc), type = "unrooted", cex = 0.6, no.margin = TRUE)

# Fan
plot(as.phylo(hc), type = "fan")

# Cut the dendrogram into 20 clusters
colors = c("red", "blue", "green", "black", "gray", "#189693", "yellow", "#123456", "#556622", "#305088", 
           "#11aa55", "#f5f1f8", "#acd451", "#115566", "#44ac55", "#4c5d6b", "#5f5f5f", "#5c1893", "#009695", "#453455")
clus = cutree(hc, 20)
plot(as.phylo(hc), type = "fan", tip.color = colors[clus],
     label.offset = 1, cex = 0.7)






# load code of A2R function
source("http://addictedtor.free.fr/packages/A2R/lastVersion/R/code.R")
# colored dendrogram
op = par(bg = "#EFEFEF")
A2Rplot(hc, k = 3, boxes = TRUE, col.up = "gray50", col.down = c("#FF6B6B", "#4ECDC4", "#556270"))
