/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function sparql_save_path(){
    
    console.log(current_path_node_array.length);
    
    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode"+current_path_node_array[0].path_id+">"+
        "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>; "+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isStartPath>\"true\"; "+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasStartZone> \"" + current_activity_zone.id +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"" + current_path_node_array[0].path_id +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode" + current_path_node_array[1].path_id +">;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement" + current_path_node_array[0].path_id +">;"+      
        "}";

//    console.log(query);
    result_object = sparql_update (query);

    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement"+current_path_node_array[0].path_id+">"+
        "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement>; "+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"Placement" + current_path_node_array[0].path_id +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> \"" + current_path_node_array[0].p1X +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> \"" + current_path_node_array[0].p1Y +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> \"" + current_path_node_array[0].p1Z +"\";" + 
        "}";

//    console.log(query);
    result_object = sparql_update (query);


//    console.log(JSON.stringify(result_object));
    
    for(var i = 1; i<current_path_node_array.length-1; i++){
        console.log(current_path_node_array.length);
        query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode"+current_path_node_array[i].path_id+">"+
            "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>; "+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"" + current_path_node_array[i].path_id +"\";"+          
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode" + current_path_node_array[i+1].path_id +">;"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement" + current_path_node_array[i].path_id +">;"+      
            "}";

//        console.log(query);
        result_object = sparql_update (query);

        query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement"+current_path_node_array[i].path_id+">"+
            "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement>; "+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"Placement" + current_path_node_array[i].path_id +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> \"" + current_path_node_array[i].p1X +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> \"" + current_path_node_array[i].p1Y +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> \"" + current_path_node_array[i].p1Z +"\";" + 
            "}";

//        console.log(query);
        result_object = sparql_update (query);
        

//        console.log(JSON.stringify(result_object));
    }
    
    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode"+current_path_node_array[current_path_node_array.length-1].path_id+">"+
        "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>; "+       
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isEndPath>\"true\"; "+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"" + current_path_node_array[current_path_node_array.length-1].path_id +"\";"+        
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathEnd>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement" + current_path_node_array[current_path_node_array.length-1].id +">;"+      
        "}";

//    console.log(query);
    result_object = sparql_update (query);

    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement"+current_path_node_array[current_path_node_array.length-1].path_id+">"+
        "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Placement>; "+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"Placement" + current_path_node_array[current_path_node_array.length-1].path_id +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> \"" + current_path_node_array[current_path_node_array.length-1].p1X +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> \"" + current_path_node_array[current_path_node_array.length-1].p1Y +"\";"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> \"" + current_path_node_array[current_path_node_array.length-1].p1Z +"\";"+   
        "}";

//    console.log(query);
    result_object = sparql_update (query);

//    console.log(JSON.stringify(result_object));
    
}


function sparql_load_path(){

    var r=confirm("Warning: If you click OK to load paths, all unsaved paths will be lost");
    if (r===false)
    {
        return;
    }//END OF IF

    var bool = true;
    path_node_array = new Array();
    previous_path_node = new PathNode();
    var next_path_id;
    //current_path_node = new PathNode();
    
    var query = "SELECT ?path_id ?x1 ?y1 ?z1 ?hasNextPath ?next_path_id"+
        " WHERE{"+
        "?path <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?path_id."+
        "?path  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isStartPath>  \"true\"."+
        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
        "?hasNextPath <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?next_path_id."+
        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> ?x1."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> ?y1."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> ?z1."+
        "}";
    var result_object = sparql_query (query);
    console.log(query);
    console.log("NUMBER OF START NODES IN ONTOLOGY: " + result_object.results.bindings.length);
    var count = 0;
    if(result_object.results.bindings.length!==0)
    {
    
        for(var i = 0; i<result_object.results.bindings.length; i++)
        {
            current_path_node = new PathNode();
            current_path_node.path_id = result_object.results.bindings[i].path_id.value;
            current_path_node.p1X = result_object.results.bindings[i].x1.value;
            current_path_node.p1Y = result_object.results.bindings[i].y1.value;
            current_path_node.p1Z = result_object.results.bindings[i].z1.value;
            console.log("PUSHING START PATH NODE ONTO CURRENT PATH NODE ARRAY");
            current_path_node_array.push(current_path_node);
            count++;
            next_path_id = result_object.results.bindings[i].next_path_id.value;
            //console.log("NEXT PATH: "+ result_object.results.bindings[i].hasNextPath.value);
            if(next_path_id==="pathEnd"){
                
                bool = false;           
                
            }
            
            while(bool)
            {
                
                
                query = "SELECT ?x1 ?y1 ?z1 ?hasNextPath ?next_path_id"+
                    " WHERE{"+
                    "?path  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
                    "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+next_path_id+"\"."+
                    "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
                    "?hasNextPath <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?next_path_id."+
                    "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
                    "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> ?x1."+
                    "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> ?y1."+
                    "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> ?z1."+
                    "}";
                var result_object_2 = sparql_query (query);
                console.log(query);
//                console.log(result_object_2.results.bindings.length);
                current_path_node = new PathNode();
                current_path_node.path_id = next_path_id;
                current_path_node.p1X = result_object_2.results.bindings[0].x1.value;
                current_path_node.p1Y = result_object_2.results.bindings[0].y1.value;
                current_path_node.p1Z = result_object_2.results.bindings[0].z1.value;
                console.log("PUSHING NEXT PATH NODE ONTO CURRENT PATH NODE ARRAY");
                count++;
                current_path_node_array.push(current_path_node);
                next_path_id = result_object_2.results.bindings[0].next_path_id.value;
            
                if(result_object_2.results.bindings[0].hasNextPath.value==="http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathEnd"){
                
                    bool = false;
                
                }
                
            }

            if(current_path_node_array.length!==0)
            {
                console.log("PUSHING CURRENT PATH NODE ARRAY TO PATH NODE ARRAY");
                console.log("NUMBER OF NODES IN CURRENT PATH: " + count); 
                path_node_array.push(current_path_node_array);
                current_path_node = new PathNode();
                current_path_node_array = new Array();
                bool = true;
                count = 0;
            }
            
        }
        
//        console.log(path_node_array.length);
//        console.log(path_node_array[path_node_array.length-1].length);
//        console.log(path_node_array[path_node_array.length-1][path_node_array[path_node_array.length-1].length-1].id);
//        console.log(path_node_array[path_node_array.length-1][0].id);
    }
    //Throwing in this code to make sure everything is reset (Needs to be cleaned up!!!)
    console.log("RESETING PATHS NODE ARRAYS");
    path_connected = false;
    can_create_path = false;
    can_save_path = false;
    zone_selected = false;
    path_selected = false;
    current_path_node_array = new Array();
    previous_path_node = new PathNode();
    current_path_node = new PathNode();
    currentlyPressedKeys[67] = false;
    can_view_path_id = false;
    
}
/*Have to consider
 * how all the activities, user id's, etc. are connected!!!
 * 
 */
function sparql_query_start_path_activity(){
    
    var query = "SELECT ?path_id ?x1 ?y1 ?z1 ?hasNextPath ?next_path_id"+
        " WHERE{"+
        "?path <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+path_id+"\"."+
        "?path  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isStartPath>  \"true\"."+
        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
        "?hasNextPath <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?next_path_id."+
//        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> ?x1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> ?y1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> ?z1."+
        "}";
    var result_object = sparql_query (query);
    console.log(query);
    var next_path_id = result_object.results.bin
    
}

function sparql_delete_path(){

    var r=confirm("Warning: This will delete this path from the database");

    if (r===false)
    {
        return; //End function
    }//END OF IF
    
    var path_id = current_path_node_array[0].id;
    
    var query = "SELECT ?path_id ?x1 ?y1 ?z1 ?hasNextPath ?next_path_id"+
        " WHERE{"+
        "?path <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+path_id+"\"."+
        "?path  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isStartPath>  \"true\"."+
        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
        "?hasNextPath <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?next_path_id."+
//        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> ?x1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> ?y1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> ?z1."+
        "}";
    var result_object = sparql_query (query);
    console.log(query);
    var next_path_id = result_object.results.bindings[0].next_path_id.value;
    query = "DELETE WHERE{"+
        "?path  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+path_id+"\"."+
       "}";
    result_object = sparql_update (query);
    console.log(JSON.stringify(result_object));
    while(next_path_id!=="pathEnd")
    {   
   
       var query = "SELECT ?path_id ?x1 ?y1 ?z1 ?hasNextPath ?next_path_id"+
        " WHERE{"+
        "?path <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+next_path_id+"\"."+
        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
        "?hasNextPath <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?next_path_id."+
//        "?path <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasXCoord> ?x1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasYCoord> ?y1."+
//        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZCoord> ?z1."+
        "}";
        result_object = sparql_query (query);
        console.log(query);
     
        query = "DELETE WHERE{"+
            "?path  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+next_path_id+"\"."+
           "}";
        next_path_id = result_object.results.bindings[0].next_path_id.value;
        result_object = sparql_update (query);
        console.log(JSON.stringify(result_object));

    }
    
    sparql_load_path();


}//END OF FUNCTION