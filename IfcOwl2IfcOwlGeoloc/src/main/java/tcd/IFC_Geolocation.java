package tcd;


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.jena.datatypes.RDFDatatype;
import org.apache.jena.datatypes.TypeMapper;
import org.apache.jena.ext.com.google.common.collect.Lists;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;

/*
 * Copyright 2017 Kris McGlinn, Adapt Centre, Trinity College University, Dublin, Ireland 
 * This code builds upon code developed by Pieter Pauwels for deleting geoemtry from IFC models, 
 * called SimpleBIM - https://github.com/pipauwel/IFCtoSimpleBIM/blob/master/src/main/java/be/ugent/Cleaner.java
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License atf
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

public class IFC_Geolocation {	
	
    String inputfile = "";
    String outputfile = "";

    private static Model model;

    private static Property ifcSiteProperty;
    private static Resource ifcSiteResource;
    private static List latitude = new ArrayList();
    private static List longitude = new ArrayList();
    
    private static String ns1 = "http://www.buildingsmart-tech.org/ifcOWL/IFC2X3_TC1#";
    private String ns2 = "http://linkedbuildingdata.net/ifc/resources20170627_105709/";
    private String ns3 = "https://w3id.org/list#";
    private String ns_geo = "http://www.opengis.net/ont/geosparql#";
    private String ns5 = "https://w3id.org/express#";
    

    public IFC_Geolocation() {	
    }

    /**
     * @param arg0: filename + extension (inputfile)
     * @param arg1: filename + extension (outputfile)
     * @throws IOException 
     */
    public static void main(String[] args) throws IOException {		
        
        System.out.println("Working Directory = " +
        System.getProperty("user.dir"));
        
        IFC_Geolocation c = new IFC_Geolocation();
        
        if(args.length == 0)
        {
            c.inputfile = "smallhouse.ttl";
            String s[] = c.inputfile.split("\\.");
            c.outputfile = s[0] + "_geoloc."+s[1];        
        }
        else
        {           
            c.inputfile = args[0];  
        }
        if(args.length == 1)
        {
            c.inputfile = args[0]; 
            String s[] = c.inputfile.split("\\.");
            c.outputfile = s[0] + "_geoloc."+s[1];      
        }
        if(args.length == 2)
        {
            c.inputfile = args[0]; 
            c.outputfile = args[1]; ;
        }
        
        System.out.println("Loading File"); 
        model = c.loadFile();
        ifcSiteProperty = model.createProperty( ns1 + "IfcSite" );
       
        System.out.println("Adding WKT Geolocation to Model");   
        c.returnLongLat(model);

        model = c.addWKTGeometryToModel(model, ifcSiteResource);
        c.writeModel(model);
        
        System.out.println("WKT Geolocation succesfully added to Model");

    }



    //Author Kris McGlinn - This function takes the Model and a resources, and adds it to that resourse in the model
    //For wkt literal, a seperate class WktLiteral java is required, to add the literal datatype to the Model
    private Model addWKTGeometryToModel(Model original, Resource r)
    {
        original.setNsPrefix("geo", ns_geo);
        Model m = original;//ModelFactory.createDefaultModel().add(original);
        
        String wktLiteralID = "urn:geom:pt:";
        Property geo_hasGeometry = m.createProperty( ns_geo + "hasGeometry" );      
        Property unique_guid = m.createProperty( ns1 + "globalId_IfcRoot" );
        Property unique_guid_string = m.createProperty( ns5 + "hasString" );
        
        StmtIterator iter = m.listStatements(r, unique_guid , (RDFNode) null ); 
        
        
        while ( iter.hasNext() ) 
        {
            Statement stmt = iter.nextStatement(); 
            iter = m.listStatements(stmt.getResource(), unique_guid_string , (RDFNode) null );             
            
            while ( iter.hasNext() ) 
            {

                wktLiteralID = wktLiteralID + iter.nextStatement().getLiteral().toString();
//                System.out.println(wktLiteralID);

            }
            
        }
        
        Resource rr = m.createResource(wktLiteralID);
        
        m.getResource(r.toString()).addProperty(geo_hasGeometry, rr);
           
        iter = m.listStatements(r, geo_hasGeometry , (RDFNode) null );
        
        
        Property geo_asWKT = m.createProperty( ns_geo + "asWKT" );
        
        
        latitude = longLatNegativeConvert(latitude);
        latitude.set(latitude.size()-1, (latitude.get(latitude.size()-1)+"."));
        String s1 = StringUtils.join(Lists.reverse(latitude), "");
        longitude = longLatNegativeConvert(longitude);
        longitude.set(longitude.size()-1, (longitude.get(longitude.size()-1)+"."));
        String s2 = StringUtils.join(Lists.reverse(longitude), "");
        //Have to swith long and lat for WKT
        String wkt_point = "POINT ("+s2+" "+s1+")";
//        Resource r_wktpoint = m.createResource(wkt_point);
//        System.out.println(wkt_point);
        //String datatype = ns_geo + "wktLiteral";
        
        RDFDatatype rtype = WktLiteral.wktLiteralType; 
        TypeMapper.getInstance().registerDatatype(rtype);     
        Literal l = m.createTypedLiteral(wkt_point, rtype);
        m.getResource(wktLiteralID).addProperty(geo_asWKT, l);
//        
        iter = m.listStatements(m.getResource(wktLiteralID), geo_asWKT , (RDFNode) null ); 
        
        
        while ( iter.hasNext() ) 
        {
            
            Statement stmt = iter.nextStatement();
            System.out.println(stmt);
            
        }   

        
        return m;
    }
    
    
    //Author Kris McGlinn - This method changes the sign of the longitude or latitude values in a List
    private List longLatNegativeConvert(List l)
    {
        //
        String s = (String)l.get(l.size()-1);
        int x = Integer.parseInt(s);
        if(x<0)
        {
            
            for(int i = 0; i <l.size()-1; i++)
            {
                s = (String)l.get(i);
                l.set(i, s.substring(1));
                
            }

        }
        
        return l;
    }
    
    //Author Kris McGlinn - This method traverses the RDF express list and recursively adds latitude and longitude values to a Java list
    private Statement traverseList(Model original, Statement stmt, boolean lat)
    {
        
        Model m = ModelFactory.createDefaultModel().add(original);
        Property listHasContents = m.createProperty( ns3 + "hasContents" );
        Property listHasNext = m.createProperty( ns3 + "hasNext" );
        boolean moreInList = false;
        String s[];

                  
        StmtIterator iter = m.listStatements( stmt.getObject().asResource(), null, (RDFNode) null );
        
        while ( iter.hasNext() ) 
        {
            Statement stmt1 = iter.nextStatement();

            if(stmt1.getPredicate().equals(listHasContents))
            {
                StmtIterator iter2 = m.listStatements( stmt1.getObject().asResource(), null, (RDFNode) null );
                while ( iter2.hasNext() ) 
                    {
                        Statement stmt2 = iter2.nextStatement();

                        if(stmt2.getObject().isLiteral())
                        {
                            if(lat)
                            {
//                                System.out.println("Lat value "+count+" is: " + stmt2.getObject());
                                s = stmt2.getObject().toString().split("\\^\\^http");                               
                                latitude.add(s[0]);
                                
                            }
                            else {
//                                System.out.println("Long value "+count+" is: " + stmt2.getObject());
                                s = stmt2.getObject().toString().split("\\^\\^http");
                                longitude.add(s[0]);

                            }
                        }

                        
                    }
            }
            else if(stmt1.getPredicate().equals(listHasNext))
            {
//                System.out.println("Adding 1 to count: " + (count+1));
                //count++;
                moreInList = true;
                traverseList(original, stmt1, lat);
//                System.out.println("Has next item in list");
            }

        }
        
        if(!moreInList)
        {
//            System.out.println("List is at end");
            stmt = null;
            return stmt;
        }
        
        return stmt;
    }
    
    //Author Kris McGlinn - This method returns the longitude and latitude by making use of traverseList()
    private Model returnLongLat(Model original){
        
        Model m = ModelFactory.createDefaultModel().add(original);
        
                
        Property refLatitude_IfcSite = m.createProperty( ns1 + "refLatitude_IfcSite" );
        Property refLongitude_IfcSite = m.createProperty( ns1 + "refLongitude_IfcSite" );
        
        StmtIterator iter = m.listStatements( null, RDF.type, ifcSiteProperty );

        while ( iter.hasNext() ) {
            Statement stmt = iter.nextStatement();
//            System.out.println( stmt);
            StmtIterator iter2 = m.listStatements( stmt.getSubject(), refLatitude_IfcSite, (RDFNode) null );
            ifcSiteResource = stmt.getSubject();
            while ( iter2.hasNext() ) 
            {
                
                stmt = iter2.nextStatement();    
//                System.out.println( stmt);
                traverseList(m, stmt, true);
                
            }
        }

  
        iter = m.listStatements( null, RDF.type, ifcSiteProperty );

        while ( iter.hasNext() ) {
            Statement stmt = iter.nextStatement();

            StmtIterator iter2 = m.listStatements( stmt.getSubject(), refLongitude_IfcSite, (RDFNode) null );
            while ( iter2.hasNext() ) 
            {
                
                stmt = iter2.nextStatement();    

                traverseList(m, stmt, false);
                
            }
        }

        return original;
    }
    
    //Original author Pieter Pauwels - This method writes the model to a turtle file (additional code K. McGlinn to output to an output directory
    private Model writeModel(Model m){
        try 
        {
            String s1 = outputfile;

            javaCreateDirectory();

            OutputStreamWriter char_output = new OutputStreamWriter(
                            new FileOutputStream("output\\"+s1), Charset.forName(
                                            "UTF-8").newEncoder());
            long size = m.size();
            BufferedWriter out = new BufferedWriter(char_output);
            m.write(out, "TTL");
            System.out.println("Successfully generated " + "TTL"
                            + " file at " + outputfile + " : triple count = " + size);
        } catch (IOException e) {
                System.out.println("Unable to generate " + "TTL"
                                + " file at " + outputfile);
                e.printStackTrace();
        } return m;
    }
        
    //Original author Pieter Pauwels - This method loads the turtle input file. 
    private Model loadFile(){
        Model m = null;
        try {
            m = FileManager.get().loadModel(inputfile, "TTL");
            //infmodel = ModelFactory.createRDFSModel(m);
            long size = m.size();
            System.out.println("Opened " + "TTL"
                            + " file at " + inputfile + " : triple count = " + size);
        } catch (org.apache.jena.riot.RiotException e) {
            System.out.println("Unable to parse " + "TTL" + " file at "
                            + inputfile);
            System.out.println("Unable to generate " + "TTL" + " file at "
                            + outputfile);
            System.out.println("RiotException " + e);
        }	
        return m;
    }


    //This method creates a directory
    public static void javaCreateDirectory()
    {

        File dir = new File("output");

        // attempt to create the directory here
        boolean successful = dir.mkdir();
        if (successful)
        {
          // creating the directory succeeded
          System.out.println("directory was created successfully");
        }
        else
        {
          // creating the directory failed
//              System.out.println("failed trying to create the directory");
        }

    }
}
