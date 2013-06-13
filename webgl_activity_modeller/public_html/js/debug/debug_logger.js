/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var log_data = "LOG BEGINS HERE/n -------------------------------- /n";
var session_time = new Date();

function append_log_data(string)
{
 
    log_data = log_data + string;
    
}

function send_log_data()
{

    log_data = escape(log_data);
    

    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Debug.Time"+session_time.getTime()+".UserID"+userID+">"+
            "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Debug>; "+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+session_time.getTime()+".UserID"+userID+"\";"+ 
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasUserID> \""+userID+"\";"+ 
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasLogData> \"" + log_data +"\";"+  
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasTime> \"" + session_time.getTime() +"\";"+  
            "}";

//    console.log(query);
    result_object = sparql_update (query);
    
}

function retrieve_log_data()
{
    
        var query = "SELECT ?debug ?log_data "+
        "WHERE{"+
        "?debug  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Debug>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasUserID> \""+ userID +"\"."+
        "?debug <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasLogData> ?log_data."+
        "}";

    
    var result_object = sparql_query (query);
    var log_data_array = new Array();
    if(result_object.results.bindings.length!=0)
    {
        console.log("Log Length: " + result_object.results.bindings.length); 
        console.log("-------------------------\n-------------------------\n-------------------------\n"); 
        for(var i = 0; i<result_object.results.bindings.length; i++)
        {
            console.log("Log Number: " + i); 
            console.log("-------------------------\n-------------------------\n"); 
            log_data_array.push(result_object.results.bindings[i].log_data.value);
            console.log(unescape(result_object.results.bindings[i].log_data.value));                  
        }
    }
}