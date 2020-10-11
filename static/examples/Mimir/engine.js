var isDebugMode= false; 
  var camera;  
  var canvas = document.getElementById("renderCanvas");
   var engine = new BABYLON.Engine(canvas, true);
engine.renderEvenInBackground = true;

var ambientSound;//handled ingame (gui)
var confirmSound;

  var lastScrollHeight=0; 

var isGameLaunched= false;
  // This begins the creation of a function that we will 'call' just after it's built
  var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
      camera = new BABYLON.ArcRotateCamera("camera1",3,3,3, new BABYLON.Vector3(0, 5, -15), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, -10), scene);
    light.intensity = 2.7;

	 if(isDebugMode){  //scene.debugLayer.show();
}
  
 
 scene.collisionsEnabled = false 

 
    return scene;

  }; 
  
  
    var scene = createScene();
  engine.runRenderLoop(function () {
 
window.onfocus = function () { 
  scene.paused = false; 
}; 

window.onblur = function () { 
  scene.paused = true; 
}; 

 
	                  if(!scene.paused){
scene.unfreezeActiveMeshes(); 
    scene.render();
	
	
	
	///SETUP game
	$( document ).ready(function() {	

if(!isGameLaunched){return;}	
//	feedTxtObj.dispose();
 //feedTxtObj=generateTextObject( $("#divGameLog").html().split("\n")[ $("#divGameLog").html().split("\n").length-1],"bold 20px verdana",0,4.5);
$("#chatboxdata").val($("#divGameLog").html().replace(new RegExp('<br>', 'gi'), '\n').replace(new RegExp('<hr>', 'gi'), '\n'));//pers ref: https://www.designcise.com/web/tutorial/how-to-replace-all-occurrences-of-a-word-in-a-javascript-string
		 //textarea (added) 
		 if(lastScrollHeight != $('#chatboxdata')[0].scrollHeight){
                 $('#chatboxdata').scrollTop($('#chatboxdata')[0].scrollHeight); 
				  lastScrollHeight= $('#chatboxdata')[0].scrollHeight;
				}
						 scene.meshes.forEach(function(m) { 
 	if( m.name.indexOf("pawn_") > -1 )
															{
					m. material.diffuseColor = new   BABYLON.Color4.FromHexString("#FD6304FF");
  m.material.alpha= 0.2;
  m.playerOwnedId = -1;
 		}
});
				gameSettings.diceObjList.forEach(function(entry) {
						 scene.meshes.forEach(function(m) { 
 	if( m.name.indexOf("pawn_") > -1 )
															{
																var pawnNameParts = m.name.split("_");
 																var babylonMaxEyeObj = pawnNameParts[1].replace("D","");
																if(entry.maxeyes== babylonMaxEyeObj && entry.currenteye== pawnNameParts[2] ){
										if(m. playerOwnedId !=    -1 ){
											//COLOR REF & INSPIRATION: https://stackoverflow.com/questions/56594109/babylon-js-rendering-order-of-instances
														m.material.diffuseColor = new    BABYLON.Color3.FromHexString("#824529");//   BABYLON.Color3.FromHexString("#824529");//  BABYLON.Color3(60,0,50); m.material.alpha= 0.6; 

																}else{											
																	
		
		if(entry.userid=="Player1" || entry.userid=="AI2" ){  m.playerOwnedId =  1;			m.material.diffuseColor = new       BABYLON.Color3.FromHexString("#F8DBAF");//   BABYLON.Color3(200,200,200); 
		m.material.alpha= 0.6; 	
		}
		else{ m.playerOwnedId =  2; m.material.diffuseColor = new            BABYLON.Color3.FromHexString("#3E211B");// BABYLON.Color3( 20,255,0); 
		m.material.alpha= 0.6;}
	/*		console.log("==>" + (pawnNameParts[0]+"_"+pawnNameParts[1]+"_"+(parseInt(pawnNameParts[2])-1).toString()) );if(entry.currenteye <=babylonMaxEyeObj && entry.currenteye > 1){var alterother = scene.meshes.filter(function (x) {            return x.name==(pawnNameParts[0]+"_"+pawnNameParts[1]+"_"+parseInt(pawnNameParts[2])-1).toString() ;        });console.log(alterother);}*/
   }
 		}}
});

});


});

	
	
	
	
	
	
	 }
	 else{scene.freezeActiveMeshes();
}
  });
  window.addEventListener("resize", function () {
    engine.resize();
  });


 
