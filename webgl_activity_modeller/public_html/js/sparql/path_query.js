/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function save_path_query(){


    var r=confirm("Warning: If you click OK to load paths, all unsaved paths will be lost");
    if (r===false)
    {
        return;
    }//END OF IF

    var bool = true;
    path_node_array = new Array();
    previous_path_node = new PathNode();
    //current_path_node = new PathNode();
    
    var query = "SELECT ?path_id ?x1 ?y1 ?z1 ?pathTo"+
        "WHERE{"+
        "?path  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?path_id."+
        "?path  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#isStartPath>  \"true\"."+
        "?pathTo <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
        "?pathPlacement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX1Coord> ?x1."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY1Coord> ?y1."+
        "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ1Coord> ?z1."+
        "}";
    var result_object = sparql_query (query);
    
    if(result_object.results.bindings.length!=0)
    {
    
        for(var i = 0; i<result_object.results.bindings.length; i++)
        {
            current_path_node = new PathNode();
            current_path_node.id = result_object.results.bindings[i].path_id.value;
            current_path_node.p1X = result_object.results.bindings[i].x1.value;
            current_path_node.p1Y = result_object.results.bindings[i].y1.value;
            current_path_node.p1Z = result_object.results.bindings[i].z1.value;
            current_path_node_array.push(current_path_node);
            
            if(result_object.results.bindings[i].pathTo.value=="<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathEnd"){
                
                bool = false;
                
            }
            
            while(bool)
            {
                
                var query = "SELECT ?x1 ?y1 ?z1 ?pathTo "+
                "WHERE{"+
                "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#"+result_object.results.bindings[i].pathTo.value+">"+
                "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type><http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathNode>;"+
                "?pathTo <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasNextPath> ?hasNextPath."+
                "?pathPlacement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasPlacement> ?placement."+
                "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX1Coord> ?x1."+
                "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY1Coord> ?y1."+
                "?placement <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ1Coord> ?z1."+
                "}";
                var result_object2 = sparql_query (query);
                
                current_path_node = new PathNode();

                if(result_object.results.bindings[i].pathTo.value=="<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#PathEnd"){
                
                    bool = false;
                
                }
                
            }

            

            
        }
    
    
    }
        
}
function delete_path_sparql(path_id){


    var r=confirm("Warning: This will delete this path from the database");
    
    if (r===false)
    {
        return; //End function
    }//END OF IF
    
    query = "DELETE WHERE{"+
        "?path  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Path>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+path_id+"\"."+
       "}"   
    
    var result_object = sparql_update (query);
    console.log(JSON.stringify(result_object));
    


}//END OF FUNCTION