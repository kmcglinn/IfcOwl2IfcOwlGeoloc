var room001_is_selected = false;
var result_json = "test";


// show jquery forms and energy data for room 001
function room001_selected () {
	if (room001_is_selected) {
		return;
	}
	room001_is_selected = true;
	
	// query fuseki here
	//var query = "SELECT * {?s ?p ?o}";
	//var query = "SELECT ?r WHERE{ ?r <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#RealSensorData>; <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasSensorID> '001'}";
	var query = "SELECT ?value WHERE{ ?r <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasSensorID> '001'. ?r <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasValue> ?value. ?r <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasTimeStamp> ?timestamp}ORDER BY DESC(?timestamp)";
	//var query = "SELECT ?value WHERE{ ?p <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasSensorID> "001". ?p <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasValue> ?value. ?p <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasTimeStamp> ?timestamp}";
	//result_json = 
	sparql_query (query);

	//result_json = JSON.stringify(eval("(" + result_json + ")"));
	//alert("Test");
	alert(result_json);
	//result_json = eval("(" + result_json + ")");
	//alert(result_json);
/*

	var output = $.parseJSON(test);
	var list = output.result_json;

	$.each(list,function(i,item){
		alert(item.value);
	});
*/

	return result_json;
}

// hide data/forms
function room001_deselected () {
	if (!room001_is_selected) {
		return;
	}
	room001_is_selected = false;
	
	// here
}

/* sparql query code from http://semapps.blogspot.ie/2012/05/sparql-query-from-javascript.html
using endpoint described in http://jena.apache.org/documentation/serving_data/index.html#getting-started-with-fuseki
"Query it with SPARQL using the .../query endpoint."
http://localhost:3030/ds/query
and test query:
*****
*/

var end_point = "http://phaedrus.scss.tcd.ie/fuseki/ds/query";
//var end_point = "http://kdeg-vm-46.scss.tcd.ie:3030/ds/query";
//var end_point = "http://localhost:3030/ds/query";
function sparql_query (query_str) {
	var querypart = "query=" + escape (query_str); // escape makes the string ASCII-portable
	var xmlhttp = new XMLHttpRequest (); // ajax
	xmlhttp.open ('POST', end_point, false); // GET can have caching probs, so POST. NOT ASYNCHRONOUS - WAIT
	// probably need these headers
	xmlhttp.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.setRequestHeader ("Accept", "application/sparql-results+json");
  // Set up callback to get the response asynchronously.
  xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
		 		// Do something with the results
		 		//alert (xmlhttp.responseText);
				result_json = xmlhttp.responseText;
			} else {
				// Some kind of error occurred.
				alert("Sparql query error: " + xmlhttp.status + " " + xmlhttp.responseText);
				return xmlhttp.responseText;
			}
		}
	}
	// Send the query to the endpoint.
	xmlhttp.send (querypart);
}
