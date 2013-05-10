// * Javascript name: office_user_activities_sparql
// *
// * Version: 0.1
// * 
// * Date: 18.02.2013
// *  
// * Author: Kris McGlinn
// * 
// * Last Modified: 18/08/13
// * 
// * Copyright: 	Knowledge and Data Engineering Group, 
// * 				Department of Computer Science,
// * 				Faculty of Engineering and Systems Science,
// * 				Trinity College
// * 				Dublin 2
// * 				Ireland  
// * 
// 
// $.getScript('/path/to/imported/script.js', function()
// {
//     // script is now loaded and executed.
//     // put your dependent JS here.
// });
// */


var zone_id, zone_type, zone_volume_x1, zone_volume_y1, zone_volume_z1, zone_volume_x2, zone_volume_y2, zone_volume_z2;


function query_zones(/*exists*/){

//    if(exists == true)
//    {
        var r=confirm("Warning: If you click OK to load zones, all unsaved zones will be lost");
        if (r==true)
        {
            zone_activity_array = new Array(); //Reset Array of zones, and re-populate with those saved in ontology 
            current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0); //Create an empty zone for the current zone
            zone_activity_array.push(current_activity_zone); //The first object in the array stores a reference to the (current) zone which is currently being drawn.

        }//END OF IF
        else
        {
            return; //End function
        }//END OF ELSE
//    }
    var query = "SELECT ?zone_id ?zone_type ?zone_volume ?x1 ?y1 ?z1 ?x2 ?y2 ?z2 "+
        "WHERE{"+
        "?zone  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?zone_id."+
        "?zone  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZoneType> ?zone_type."+
        "?zone  <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasVolume> ?zone_volume."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX1Coord> ?x1."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY1Coord> ?y1."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ1Coord> ?z1."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX2Coord> ?x2."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY2Coord> ?y2."+
        "?zone_volume <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ2Coord> ?z2."+
        "}";

    //alert(query);  
    
    var result_object = sparql_query (query);
//    alert(JSON.stringify(result_object));
    
    if(result_object.results.bindings.length!=0)
    {

        for(var i = 0; i<result_object.results.bindings.length; i++)
        {
            zone_id = result_object.results.bindings[i].zone_id.value;
            zone_type = result_object.results.bindings[i].zone_type.value;
            zone_x1 = result_object.results.bindings[i].x1.value;
            zone_y1 = result_object.results.bindings[i].y1.value;
            zone_z1 = result_object.results.bindings[i].z1.value;
            zone_x2 = result_object.results.bindings[i].x2.value;
            zone_y2 = result_object.results.bindings[i].y2.value;
            zone_z2 = result_object.results.bindings[i].z2.value;
            //alert(zone_x1);
            
            var temp_zone = new Zone(zone_type, zone_id, zone_x1, zone_y1, zone_z1, zone_x2, zone_y2, zone_z2);
            zone_activity_array.push(temp_zone);
            
        }
    }
    //alert(zone_activity_array[0].getInfo());

}//END OF FUNCTION


function update_zone(zone){


    var r=confirm("Warning: This will save the current zone to the database");
    if (r==true)
    {
        

    }//END OF IF
    else
    {
        return; //End function
    }//END OF ELSE

    var query = "SELECT ?zone "+
        "WHERE{"+
        "?zone  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone"+zone.id+">;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?"+zone.id+"."+
        "?zone <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZoneType> \"" + zone.type +"\"."+
        "}";
    
    var result_object = sparql_query (query);
    
    console.log(JSON.stringify(result_object));
    
    if(result_object.results.bindings.length!=0)
    {
        
        r=confirm("Warning: A zone with this ID already exists, do you wish to overwrite it?");
        if (r==true)
        {


        }//END OF IF
        else
        {
            return; //End function
        }//END OF ELSE
        
    }
    

    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone"+zone.id+">"+
            "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone>; "+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"" + zone.id +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZoneType> \"" + zone.type +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasVolume> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Volume" + zone.id +">;"+      
            "}";

    console.log(query);
    result_object = sparql_update (query);
    
    console.log(JSON.stringify(result_object));
    
    query = "INSERT DATA{ <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Volume"+zone.id+">"+
            "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>" +
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Volume>; "+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"Volume" + zone.id +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX1Coord> \"" + zone.p1X +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY1Coord> \"" + zone.p1Y +"\";"+   
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ1Coord> \"" + zone.p1Z +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasX2Coord> \"" + zone.p2X +"\";"+   
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasY2Coord> \"" + zone.p2Y +"\";"+
            "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasZ2Coord> \"" + zone.p2Z +"\";"+   
            "}";

    console.log(query);
    result_object = sparql_update (query);
    console.log(JSON.stringify(result_object));
    //PROBABLY NEED TO CHECK TO SEE WE ARE NOT DOUBLING UP ON VOLUME I.D.s!!!
//    query = "SELECT ?volume_id"+
//        "WHERE{"+
//        "?zone  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Volume>;"+
//        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> ?"+volume.id."+
//        "}";
//
//    //alert(query);  
//    
//    result_object = sparql_query (query);
//    
//    if(result_object.results.bindings.length!=0)
//    {
//        
//        r=confirm("Warning: A zone with this ID already exists, do you wish to overwrite it?");
//        if (r==true)
//        {
//
//
//        }//END OF IF
//        else
//        {
//            return; //End function
//        }//END OF ELSE
//        
//    }


}//END OF FUNCTION

function delete_zone_sparql(zone_id){


    var r=confirm("Warning: This will delete this zone from the database");
    if (r==true)
    {
        

    }//END OF IF
    else
    {
        return; //End function
    }//END OF ELSE

    query = "DELETE WHERE{"+
        "?zone  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Zone>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \""+zone_id+"\"."+
       "}"   
    
    var result_object = sparql_update (query);
    console.log(JSON.stringify(result_object));
    
    query = "DELETE WHERE{"+
        "?zone  <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#Volume>;"+
        "<http://www.semanticweb.org/ontologies/2012/9/knoholem.owl#hasGuid> \"Volume"+zone_id+"\"."+
    "}"   
    
    result_object = sparql_update (query);
    console.log(JSON.stringify(result_object));


}//END OF FUNCTION





function sparql_update_path(){




}//END OF FUNCTION