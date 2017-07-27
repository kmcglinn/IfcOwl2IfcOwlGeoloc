# IfcOwl2IfcOwlGeoloc

This is a Java Maven project. Once you build the project, you can execute the code with the resulting JAR file.

On execution, without arguments, the code will look for the smallhouse.ttl file in the directory the JAR file is in. 
Working correctly it will then generate a "smallhouse_geoloc.ttl" file. 

Alternatively you can specify the name of the input file as args[0], e.g. smallhouse.ttl, which will generate an 
output named smallhouse_geoloc.ttl. You may also specify both the input and output name, e.g. x.ttl and y.ttl.

The output will be written into a folder "output". 
