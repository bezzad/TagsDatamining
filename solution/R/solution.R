#source("https://bioconductor.org/biocLite.R")
#biocLite("ctc")
library(ctc)

ibs<-read.delim("../distance-matrix.csv",header = TRUE, sep=",")
d <- dist(as.matrix(ibs))      # find distance matrix 
hc <- hclust(d)                # apply hirarchical clustering 
plot(hc)                       # plot the dendrogram

write.table(hc2Newick(hc), file="../clusters.txt", row.names=FALSE, col.names=FALSE)