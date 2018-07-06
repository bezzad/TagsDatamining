# install.packages("XML")

# Load the package required to read XML files.
library("XML")

# Also load the other required package.
library("methods")

# Give the input file name to the function.
#result <- xmlParse(file = "D:\\Sbu\\Term2\\Data Mining\\Final Project\\Posts.xml")
xmldataframe <- xmlToDataFrame("D:\\Sbu\\Term2\\Data Mining\\Final Project\\Posts.xml")

# Print the result.
#print(result)
