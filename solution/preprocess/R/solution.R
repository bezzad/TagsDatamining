#source("https://bioconductor.org/biocLite.R")
#biocLite("ctc")
library(ctc)

# install.packages("ape")
library("ape")

# load code of A2R function
source("http://addictedtor.free.fr/packages/A2R/lastVersion/R/code.R")

colors = c("red", "blue", "green", "black", "gray", "#189693", "#58f2ac", "#123456", "#556622", "#305088", 
           "#11aa55", "#2E9FDF", "#acd451", "#115566", "#44ac55", "#4c5d6b", "#00AFBB", "#5c1893", "#009695", "#453455")

distanceMat <- read.delim("../results/distance-matrix.csv", header = TRUE, sep=",")
#df <- scale(distanceMat) # scaling/standardizing

# Compute distances and hierarchical clustering
d <- dist(as.matrix(distanceMat))                 # find distance matrix 
hc <- hclust(d, method = "complete")              # apply hirarchical clustering by complete linkage method

# cutting the dendrogram in 20 clusters
clusters = cutree(hc, 20)

write.table(hc2Newick(hc, flat=TRUE), file="../results/clusters.txt", row.names=FALSE, col.names=FALSE)

# Put the labels at the same height: hang = -1
plot(hc, labels = NULL, hang = -1, cex = 0.7, main = "Tags Cluster Dendrogram",
     xlab = NULL, ylab = "Height")                     # plot the dendrogram
rect.hclust(hc, k = 20, border = 2:5)

# Convert hclust into a dendrogram and plot
hcd <- as.dendrogram(hc)

# Define nodePar
nodePar <- list(lab.cex = 0.6, pch = c(NA, 19), cex = 0.7, col = "blue")

# Change edge color
plot(hcd,  xlab = "Height", nodePar = nodePar, edgePar = list(col = 2:3, lwd = 2:1))
rect.hclust(hc, k = 20, border = 2:5)

# Unrooted
plot(as.phylo(hc), type = "unrooted", cex = 0.5, no.margin = FALSE)

# Fan
plot(as.phylo(hc), type = "fan", tip.color = colors[clusters],
     label.offset = 0.1, cex = 0.7)


# colored dendrogram
op = par(bg = "#FFFFFF")

A2Rplot(hc, k = 20, boxes = FALSE, col.up = "gray50", col.down = colors)

x <- as.phylo(hc)

# Size reflects miles per gallon
plot(x, type = "fan", tip.color = colors[clusters], label.offset = 0.1, 
     cex = 0.6, edge.color = colors[clusters])

plot(x, type = "fan", use.edge.length = TRUE,
     node.pos = NULL, show.tip.label = TRUE, show.node.label = FALSE,
     edge.color = colors, edge.width = 1, edge.lty = 1, font = 3,
     cex = 0.6, adj = NULL, srt = 0, no.margin = FALSE,
     root.edge = FALSE, label.offset = 0, underscore = FALSE,
     x.lim = NULL, y.lim = NULL, direction = "rightwards",
     lab4ut = NULL, tip.color = colors, plot = TRUE,
     rotate.tree = 0, open.angle = 0, node.depth = 1,
     align.tip.label = FALSE)

# install.packages(c("factoextra", "dendextend"))
library(factoextra)

fviz_dend(hc, k = 20, # Cut in four groups
          cex = 0.7, # label size
          k_colors = "jco",
          color_labels_by_k = TRUE, # color labels by groups
          rect = TRUE, # Add rectangle around groups
          rect_border = "jco", 
          rect_fill = TRUE)


fviz_dend(hc, cex = 0.5, k = 20, 
          k_colors = colors[clusters], type = "circular")

install.packages('igraph')
require("igraph")
fviz_dend(hc, k = 20, # Cut in four groups
          k_colors = colors,
          type = "phylogenic", repel = TRUE,
          phylo_layout = "layout.gem")

