/* Full real card; only provider I/O and a differentiable vortex field are synthetic. */
const {temperatureFixture}=require('./temperature-browser-fixture.cjs');
function flowFixture({ref=null,decorate=html=>html}={}){return temperatureFixture({ref,decorate:html=>decorate(html.replace('window.windRequests=[];',"window.windRequests=[];windTransport.vortex=true;").replace("window.temperatureRequests=[];","window.temperatureRequests=[];")
 .replace('u.push(9+5*Math.sin(lat*Math.PI/60)+2*Math.cos(lon*Math.PI/180));v.push(3*Math.cos(lon*Math.PI/180)+4*Math.sin(lat*Math.PI/90));',`u.push(options.vortex?-(Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*180/Math.PI-54.856749)*12:12);v.push(options.vortex?(lon-8)*12:3);`)
 .replace('u.push(10);v.push(3);rate.push(.6*Math.sin(lon*Math.PI/40));',`u.push(-(Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*180/Math.PI-54.856749)*12);v.push((lon-8)*12);rate.push((lon-8)*.18);`))});}
module.exports={flowFixture};
