/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Point(x,y){
    this.x=x;
    this.y=y;
}

function Polygon(){
    this.points=[];
    this.x_min=undefined;
    this.x_max=undefined;
    this.y_min=undefined;
    this.y_max=undefined;

    this.add = function(p){
        this.points=this.points.concat(p);
        if (p.x<this.x_min){this.x_min=p.x;}
        if (p.x>this.x_max){this.x_max=p.x;}
        if (p.y<this.y_min){this.y_min=p.y;}
        if (p.y>this.y_min){this.y_max=p.y;}
    }

    this.pointInPoly = function(p){
        var j=(this.points.length-1);  //start by testing the link from the last point to the first point
        var isOdd=false;
        
        //check the bounding box conditions
        if (p.x < this.x_min || p.x > this.x_max || p.y < this.y_min || p.y > this.y_max){
            return false;
        }
//        console.log(this.points.length);
        //if necessary use the line crossing algorithm
        for(var i=0; i<this.points.length; i++)
        {
            if ((this.points[i].y<p.y && this.points[j].y>=p.y) ||  
                (this.points[j].y<p.y && this.points[i].y>=p.y)) 
            {
                if (this.points[i].x+(p.y-this.points[i].y)/
                        (this.points[j].y-this.points[i].y)
                        *(this.points[j].x-this.points[i].x)
                        <p.x)
                { 
                    isOdd=(!isOdd);
                } 
            }
            j=i;
        }
        //console.log("WROKINGS! " + isOdd);
        return isOdd;
    }
}
