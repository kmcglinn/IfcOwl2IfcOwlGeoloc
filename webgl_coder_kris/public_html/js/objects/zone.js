/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function Zone(type, id, p1X, p1Y, p1Z, p2X, p2Y, p2Z){
    
    this.type = type;
    this.id = id;
    this.p1X = p1X;
    this.p1Y = p1Y;
    this.p1Z = p1Z;
    this.p2X = p2X;
    this.p2Y = p2Y;
    this.p2Z = p2Z;
        
}

Zone.prototype.getInfo = function(){
    
        return 'Zone type: ' + this.type + '. Zone id: ' + this.id + 'Position 1 x, y, z: ' + this.p1X + ' : ' + this.p1Y + ' : ' + this.p1Z + '...Position 2 x, y, z: ' + this.p2X + ' : ' + this.p2Y + ' : ' + this.p2Z;
        
}
