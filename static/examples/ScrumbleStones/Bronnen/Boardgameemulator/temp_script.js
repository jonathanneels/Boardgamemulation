//gizmoManager= null;    
isDraggingAllowed= false;
isMeshesPostAllowed=false;
if(!isAdmin)
{
	isActivePlayer=false;
	$("#btnReset").hide();
	
}
ResetProject();
  isResetProjectAllowed=false;
 
function checkRoutineActions(){
 gizmoManager.positionGizmoEnabled =false;// isAdmin;
gizmoManager.rotationGizmoEnabled = false;//right click show
gizmoManager.scaleGizmoEnabled = false;//isAdmin;
gizmoManager.boundingBoxGizmoEnabled = false; 

} 
setInterval(function(){
isResetProjectAllowed=false;
	if(!isActivePlayer){  isMeshesPostAllowed=false;} else{isMeshesPostAllowed=true;}
}, 5);// not the cleanest way...



if(isAdmin){
for (i = 0; i < scene.materials.length; i++) { 
if(scene.materials[i].id =="skyBox" || scene.materials[i].id =="default material"|| scene.materials[i].id =="default" || scene.materials[i].id =="ground"){continue;}
scene.materials[i].dispose();		 }}


 var materialClickMat = new BABYLON.StandardMaterial("dMaterialClickMat", scene);
 materialClickMat .alpha= 0.5;

 var materialNonMat = new BABYLON.StandardMaterial("dMaterialNonMat", scene);
    materialNonMat.diffuseTexture = new BABYLON.Texture("/static/images/textures/dice_Abigalia_Metalen.png",scene);

 var materialNA = new BABYLON.StandardMaterial("dMaterialMetalen", scene);
    materialNA.diffuseTexture = new BABYLON.Texture("/static/images/textures/dice_Abigalia_Metalen.png",scene);

    var materialNB = new BABYLON.StandardMaterial("dMaterialVael", scene);
    materialNB.diffuseTexture = new BABYLON.Texture("/static/images/textures/dice_Abigalia_Vael.png",scene);


    var materialNC = new BABYLON.StandardMaterial("dMaterialGevleugelden", scene);
    materialNC.diffuseTexture = new BABYLON.Texture("/static/images/textures/dice_Abigalia_Gevleugelden.png",scene);


    var materialND = new BABYLON.StandardMaterial("dMaterialStaartigen", scene);
    materialND.diffuseTexture = new BABYLON.Texture("/static/images/textures/dice_Abigalia_Staartige.png",scene);
var rotationArray=[0,90,180,270];

 if(isAdmin){

var t=0;
while (t<10){
	var col1Count=0;
var col2Count=0;
var col3Count=0;
var col4Count=0;

	t+=1; // making sure all meshes are included in the equation (not the cleanest way...).
  		 scene.meshes.forEach(function(m) {
 
if(m.name.indexOf("dice") > -1 && m.id.startsWith("D"))
{ var nameparts = m.id.split("_");
m.material = null; 


if(parseInt($("#txtPLayerCount").val()) < parseInt(nameparts[1].replace("P","").trim()))
{
//m.setEnabled(false);
//m.dispose();
m.material = materialNonMat;
m.material.diffuseColor = BABYLON.Color3.Gray(); 
m.material.alpha =0.0;


}else{

if(parseInt($("#txtPLayerCount").val()) == 3)
{
if(parseInt(nameparts[0].replace("D",""))> 6)
{
m.material = materialNonMat;
m.material.diffuseColor = BABYLON.Color3.Gray(); 
m.material.alpha =0.0;
return true;
}}
else if(parseInt($("#txtPLayerCount").val()) == 4)
{
 if(parseInt(nameparts[0].replace("D",""))> 5)
{
m.material = materialNonMat;
m.material.diffuseColor = BABYLON.Color3.Gray(); 
m.material.alpha =0.0;
return true;
}}


 m.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(rotationArray[ getRndInteger(0,3)]),0, BABYLON.Tools.ToRadians(rotationArray[ getRndInteger(0,3)]))

var randM= getRndInteger(0,4);

  if(randM ===0 && col1Count <5)
{col1Count+=1;
m.material = materialNA;
m.material.diffuseColor = BABYLON.Color3.Gray(); 

 }else  if(randM ===1 && col2Count <5 ||  col1Count >5 &&  col2Count <5 )
{col2Count+=1;
m.material = materialNB;
m.material.diffuseColor = BABYLON.Color3.Green(); 

 } else  if(randM ===2 && col3Count <5 ||  col2Count >5 &&  col3Count <5 )
{col3Count+=1;
m.material = materialNC;
m.material.diffuseColor = BABYLON.Color3.Yellow(); 

 } else  
{col4Count+=1;
m.material = materialND;
m.material.diffuseColor = BABYLON.Color3.Purple(); 
 
}
}} else if(m.name.indexOf("dice") > -1){m.material =materialClickMat;}
});}}

/*if(isAdmin==true){
 
  var playerCount=$("#txtPLayerCount").val(); prompt("Playercount (2 to 4)?", 2);

if (playerCount== null || playerCount.trim() == "" || parseInt(playerCount)< 2 || parseInt(playerCount)>4) {
$("#txtPLayerCount").val(2)
playerCount= $("#txtPLayerCount").val();
}  
 else{
$("#txtPLayerCount").val(playerCount) } 

}*/

var localLastobj;
var isAllowedToReroll= true;
	  scene.onPointerObservable.add((pointerInfo) => { 
 				     var pickRes = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
        var point = pickRes.pickedPoint;

    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
checkRoutineActions()
        if ( (typeof(point) !== "undefined" && point != null )   ) {
 if( localLastobj !== undefined && localLastobj.id.startsWith("D") &&  pickResult.pickedMesh!==undefined && localLastobj  !== pickResult.pickedMesh && pickResult.pickedMesh.material !== undefined && pickResult.pickedMesh.material.id === "dMaterialClickMat"   && pickResult.pickedMesh.name !== undefined && pickResult.pickedMesh.name.indexOf("dice") >-1 && !pickResult.pickedMesh.id.startsWith("D") ){ // pickResult.pickedMesh.name.indexOf("board") >-1 ){
              //   var  groundP= getGroundPosition(pointerInfo.event);
//console.log(groundP)
  
 localLastobj.position=pickResult.pickedMesh.position;
 pickResult= undefined;

//endTurn();=> frisky


}
else        if(pickResult !== undefined   && pickResult.pickedMesh !== undefined   && pickResult.pickedMesh.id !== undefined && pickResult.pickedMesh.id.startsWith("D") && pickResult.pickedMesh.name.indexOf("dice") >-1 && !pickResult.pickedMesh.name.indexOf("board")> -1 &&  !pickResult.pickedMesh.name.indexOf("skyBox")> -1){
localLastobj=pickRes.pickedMesh;
}else{localLastobj=undefined;
}




}break;

        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:

if(!isAllowedToReroll || !isActivePlayer){break; }
//checkRoutineActions();
        if ( (typeof(point) !== "undefined" && point != null )  ) {
          var p = point;
         var  pickedObj = (pickRes.pickedMesh);
if(pickedObj !== undefined  && pickedObj.id.startsWith("D") && !pickedObj.name.indexOf("board")> -1 &&  !pickedObj.name.indexOf("skyBox")> -1){
          //  if(   pickResult.pickedMesh.name.indexOf("board")>-1 || scene.getMeshByID( pickedObj.id).name.indexOf("Dice") < 0){return;}

scene.getMeshByID( pickedObj.id).rotation  = new BABYLON.Vector3(BABYLON.Tools.ToRadians(rotationArray[ getRndInteger(0,3)]), scene.getMeshByID( pickedObj.id).rotation.y, BABYLON.Tools.ToRadians(rotationArray[ getRndInteger(0,3)]))


 
scene.getMeshByID( pickedObj.id).position.y= 1.5;

 	$("#chatboxrespons").val("%0AI've rolled die " +localLastobj.id.toString()  ); 
SendchatMessage(); 
pickedObj=undefined;
//setTimeout(function(){ isAllowedToReroll=true;}, 1000);
}
}
break;
}
});

$(function() {
      $("#btnReset").click( function()
           { isResetProjectAllowed=true;// in default button handler is this not available.
ResetProject(); 
           }
      );
});


