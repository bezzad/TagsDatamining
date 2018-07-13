# declare 25 color for 25 cluster
colors = c("red", "blue", "green", "black", "gray", "#189693", "#58f2ac", "#123456", "#556622", "#305088", 
           "#11aa55", "#2E9FDF", "#acd451", "#115566", "#44ac55", "#4c5d6b", "#00AFBB", "#5c1893", "#009695", "#453455",
           "#984563", "#199936", "#15ac51", "#aa55aa", "#125a9f", "#5c9512")

# read distance matrix from csv file
distanceMat <- read.delim("../results/distance-matrix.csv", header = TRUE, sep=",")

# Compute distances and hierarchical clustering
d <- dist(as.matrix(distanceMat))     # find distance matrix 
hc <- hclust(d, method = "complete")  # apply hirarchical clustering by complete linkage method

# cutting the dendrogram in 25 clusters
clusters = cutree(hc, 25)

# store clusters
write.table(data.frame(clusters) , file="../results/clusters.txt", row.names=TRUE, col.names=FALSE)


# -------------------------------------------------------------------------
# -------------------- plot the dendrogram --------------------------------
# -------------------------------------------------------------------------

# Put the labels at the same height: hang = -1
plot(hc, labels = NULL, hang = -1, cex = 0.7, main = "Tags Cluster Dendrogram", ylab = "Height")
rect.hclust(hc, k = 25, border = 2:5)

# Change edge color
hcd <- as.dendrogram(hc) # Convert hclust into a dendrogram and plot
nodePar <- list(lab.cex = 0.5, pch = c(NA, 25), cex = 0.6, col = "blue") # Define nodePar
plot(hcd,  xlab = "Tags", nodePar = nodePar, edgePar = list(col = 2:3, lwd = 2:1)) 


# Size reflects miles per gallon
install.packages('igraph')
require("igraph")
plot(as.phylo(hc), type = "fan", tip.color = colors[clusters], label.offset = 0.1, cex = 0.6, edge.color = colors[clusters])


# by `fviz_dend` func
# reference: http://www.sthda.com/english/articles/28-hierarchical-clustering-essentials/92-visualizing-dendrograms-ultimate-guide/
install.packages(c("factoextra", "dendextend"))
library(factoextra)

# dendrogram
fviz_dend(hc, k = 25, # Cut in four groups
          cex = 0.4, # label size
          k_colors = "jco",
          color_labels_by_k = FALSE, # color labels by groups
          rect = TRUE, # Add rectangle around groups
          rect_border = "jco", 
          rect_fill = TRUE)


# Fan
fviz_dend(hc, cex = 0.5, k = 25, k_colors = colors, type = "circular")


# graph
install.packages('igraph')
require("igraph")
fviz_dend(hc, k = 25, # Cut in four groups
          k_colors = colors,
          type = "phylogenic", repel = TRUE,
          phylo_layout = "layout.gem")
