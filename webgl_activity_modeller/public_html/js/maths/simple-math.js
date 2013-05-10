/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;

  return [d, h, m, s];
};

/*
 * @Kris Code - Generates randon UUID (this needs to be improved)
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

//function guid() {
//  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//         s4() + '-' + s4() + s4() + s4();
//}

function create_guid() {
  return s4() + s4() + '' + s4() + '' + s4() + '' +
         s4() + '' + s4() + s4() + s4();
}
function create_simple_guid() {
  return s4() + s4();
}
function midpoint(p1, p2)
{
//    console.log("P1: " + p1);
//    console.log("P1 Float "+ parseFloat(p1));
    return (parseFloat(p1) + parseFloat(p2))/2;
}