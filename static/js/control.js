  window.addEventListener('resize', function() {
      engine.resize();
  })
        

	$("#selBoard").change(function(){
    	  	        groundObj.material.diffuseTexture = new BABYLON.Texture("static/images/board/"+$("#selBoard").val(), scene);
					    groundObj.material.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iBoardColor").value);
					updateProjectOnServer();//	updateProjectOnServer(); }, 500); not working tbc (now add object to change board.
 

 
});

$( "#btnCreateShape" ).click(function() {
createShape($("#selShape").val(),true); isUpdateMeshesInteractableList=true; updateProjectOnServer();});

function setZoom()
{
		camera.radius=parseInt( document.getElementById("slZoom").value);

}
 $(document).keydown(function(e) { // requires jQuery
    console.log(e.keyCode);
    if (e.keyCode === 189 || e.keyCode === 109) { // minus
	if( camera.radius <70 ){// camera.fov <3 ){
     //   camera.fov +=0.1;
		camera.radius+=0.5;
		}
         
    }
    if (e.keyCode === 187 || e.keyCode === 107) { // plus
	if(camera.radius >0.20  ){//camera.fov >0.20  ){
  // camera.fov -=0.1;
   		camera.radius-=0.5;

   }
         
    }
	
	 if (e.keyCode === 72) {//37 ||  e.keyCode === 39 ) { // arrow left REF: https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript & https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		                      // no free camera movement, as in stepping movement
camera.position =  new BABYLON.Vector3(-1, 0, -5);
            return;

		  // e.keyCode === 38 || e.keyCode === 40 up & down is zoom & ok.
    } 
 });
 
 	 function ControlsObservables(){// made in function for babylon.load instances
	  scene.onPointerObservable.add((pointerInfo) => { 
	  

    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
		            console.log("POINTER DOWN");

		if(isPreventPointerAction){return;}
		
		                                       if($('#chDrawMode').is(":checked")){

                if (pointerInfo.event.button !== 0) {
                            if (pointerInfo.event.button === 2) {
                                                                                  clearDrawing();        
                }
                    return;
                }
        
                // check if we are under a mesh
                var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== groundObj; });
               lines =  BABYLON.Mesh.CreateLines("lines", linesed, scene);
                  lines.name="lines";
				  										lines.isPickable=false;
				  currentMesh = pickInfo.pickedMesh;
                    startingPoint = getGroundPosition(pointerInfo.event);
        
                    if (startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            camera.detachControl(canvas);
                       }, 0);
                    }
               
            }
        else{
   //if(postMeshes()){countPostGetMeshesAction=0;} via RenderLoop
					     pickResult = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);

					        if(pointerInfo.event.which == 2 || pointerInfo.event.which == 3)
{
  if (pickResult.hit   ) {
    		 	console.log(pickResult.pickedMesh.name);
				$("#lblclickedMeshName").text(pickResult.pickedMesh.id);
						  		  		  lastTouchedObj= pickResult.pickedMesh;
										  
										   camera.setTarget(  new BABYLON.Vector3(pickResult.pickedMesh.position.x, 2, pickResult.pickedMesh.position.z)); 

 if(lastTouchedObj.name=="board" || lastTouchedObj.name.indexOf("Torus_")>-1||lastTouchedObj.name.indexOf("Box_")>-1)
		 {
			  gizmoManager.rotationGizmoEnabled = false;
  gizmoManager.scaleGizmoEnabled = false;
  gizmoManager.positionGizmoEnabled = false;

			 return;} 

 gizmoManager.rotationGizmoEnabled = true;
  gizmoManager.scaleGizmoEnabled = isAdmin;
  gizmoManager.positionGizmoEnabled = isAdmin;

} 

   
 } else{ 
   if (pickResult.hit   ) {
    		 	console.log(pickResult.pickedMesh.name);
				$("#lblclickedMeshName").text(pickResult.pickedMesh.id);
						  		  		  lastTouchedObj= pickResult.pickedMesh;
}else{
 				$("#lblclickedMeshName").text("Select Object");}
 if(lastTouchedObj.name=="board" || lastTouchedObj.name.indexOf("Torus_")>-1||lastTouchedObj.name.indexOf("Box_")>-1)
		 {
			 			  gizmoManager.rotationGizmoEnabled = false;
  gizmoManager.scaleGizmoEnabled = false;
  gizmoManager.positionGizmoEnabled = false;

			 return;} 

 gizmoManager.rotationGizmoEnabled = false; gizmoManager.scaleGizmoEnabled = false; gizmoManager.positionGizmoEnabled = isAdmin;//left click
 }}
            break; 
        case BABYLON.PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
//setTimeout(function(){   	   if(postMeshes()){countPostGetMeshesAction=0;} }, 600);
 if (startingPoint) {

                                    linesListInfo.push({path: linesed, id:lines.id, color: lines.color});
                                    linesed = [];
                                   i = 0;
                    camera.attachControl(canvas, true);
                    startingPoint = null;
                    return;
                }
             
            break;
	/*		        case BABYLON.PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");			 
            break;*/

       case BABYLON.PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
					if(isPreventPointerAction){return;}

			if($('#chDrawMode').is(":checked")){

                if (!startingPoint) {
                    return;
                }
        
                var current = getGroundPosition(pointerInfo.event);
        
                if (!current) {
                    return;
                }
        
                       
						                        lines.dispose();
							try{
							if(isLinesAreLoadedFromExtern)
							{   clearDrawing();//prevent scenerialize error.
							linesed = [];
                                   i = 0;
                    camera.attachControl(canvas, true);
                    startingPoint = null;

							isLinesAreLoadedFromExtern=false;
							return;
							}
                         lines =  BABYLON.Mesh.CreateLines("lines"+lineNumber.toString() , linesed, scene);
                                        lines.name="lines";
										lines.isPickable=false;

						if( $('#chRandomColors').is(':checked')){
											  lines.color =   new BABYLON.Color3(Math.random(), Math.random(), Math.random());                    
						}else{
					  lines.color =    BABYLON.Color3.FromHexString($('#iColorPencil').val());                     
                        }
                        
                        linesed[i] = getGroundPosition(pointerInfo.event);  
            
                                   i++;
                                                           lineNumber+=1;
                startingPoint = current;} catch(err){linesListInfo.pop();clearDrawing();//prevent scenerialize error.
							linesed = [];
                                   i = 0;
                    camera.attachControl(canvas, true);
}
        }
            break;
  /*     case BABYLON.PointerEventTypes.POINTERPICK:   console.log("POINTER PICK");
            break;
        case BABYLON.PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;  */
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
   //if(postMeshes()){countPostGetMeshesAction=0;} via RenderLoop
   
       // console.log((("Pointer : " + (scene.pointerX)) + " , ") + (scene.pointerY));
 				     var pickRes = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);

        var point = pickRes.pickedPoint;
        if ( (typeof(point) !== "undefined" && point != null )  ) {
          var p = point;
         var  pickedObj = (pickRes.pickedMesh);
		  		  		  lastTouchedObj= pickedObj;

						 
          let obj = pickedObj;
          while ((typeof((obj.parent)) !== "undefined" && (obj.parent) != null ) ) {
            obj = (obj.parent);
          };
          pickedObj = obj;
  //  pickedObj.material.diffuseColor = BABYLON.Color3.Random();

		// commented out, when working with clones, stranger things are happening.
		/*  var d = (pickedObj).data; 
          if ( (typeof(d) !== "undefined" && d != null )  ) {
            if( typeof(d) === 'string' ) //union case for string  
			{
              var str = d;
              console.log(str);
            };
          }*/
		  console.log(obj.name);
        /*  var meta = obj.data;
          if ( (typeof(meta) !== "undefined" && meta != null )  ) {
            if( meta instanceof ObjMeta ) //union case  
			{
              var data = meta;
              if ( (typeof(data.physics) !== "undefined" && data.physics != null )  ) {
			  */
			  
			  
              //  if ( obj == dice ) {
			//		   confirmSound = new BABYLON.Sound("confirmSoundAudio", confirmSoundFile, scene, null, { loop: false, autoplay: true });
			//confirmSound.play();

if(!isWithPhysics){return;}
                  diceThrow = true;
                  diceStabileCnt =  getRndInteger(4,11);//10 default
              //  }

	/* UNUSED FILEHANDLER (with the reset of the entire scene, but not that good, as mentioned above the method.
	if(obj.data === undefined){// THIS: https://stackoverflow.com/questions/53050721/cannon-js-how-to-prevent-objects-clipping-floor-on-update
			  if(obj.name.indexOf("stone") >-1 ||obj.name == ("stone")){
      var dData = new ObjMeta();
      obj.data = dData;
      obj.name = "stone";

 setPhysicsByMeshSortName( "stone",obj);
}else{ 	  

      var dData = new ObjMeta();
      obj.data = dData;
      dData.name =  obj.name.substr(0, 4);

 setPhysicsByMeshSortName( obj.name.substr(0, 4),obj);//all current meshes, except stone, are 4 of length as name object.
}}*/


obj.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
obj.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

				if(obj.name.indexOf("dice") < 0 && obj.name.indexOf("coin") < 0 )// ==="card")
				{  //  obj.material.diffuseColor = BABYLON.Color3.Random();

				// data.physics.applyImpulse(new BABYLON.Vector3(0,5,0), p ) ;
				// obj.applyImpulse(new BABYLON.Vector3(0,5,0), p ) ;
obj.applyImpulse(new BABYLON.Vector3(0,3,0),0 ) ;
				return;
				}
				
                 obj.applyImpulse(new BABYLON.Vector3(0, getRndInteger(10,20),0), p ) ;
                 var randB = getRndInteger(0,2);
				 if(randB==0){				 obj.applyImpulse(new BABYLON.Vector3(getRndInteger(5,10), 0,0), p ) ;}
				 else if(randB==1){				 obj.applyImpulse(new BABYLON.Vector3(0,0,getRndInteger(5,10) ), p ) ;}

           //   }
           // };
        //  }
		  
        }


            break;
    }
});


	  }
	  
	  
 ////////////////////////LINKED TO DOM ELEMENTS//////////////////////////////////
	  function setCloneLoad()
 {
 if( $('#chCloneOnLoad').is(':checked')){
 alert("With too many complex shapes (ex. stone) and/or clones the webbrowser might crash!");
 } }
 function setBabylondebug()
 {
 BABYLON.DebugLayer.InspectorURL = window.location.origin+'/static/lib/babylon.inspector.bundle.js';//REF: https://doc.babylonjs.com/how_to/debug_layer
  if( $('#chbabylondebug').is(':checked')){
    scene.debugLayer.show({embedMode: true});	//  scene.debugLayer.show();


}
else{
    setTimeout(() => {//REF: https://www.babylonjs-playground.com/#20OAV9#1605
        scene.debugLayer.hide();
    }, 500);

}
 }
 function setGravity()
 {
 if( $('#chGravity').is(':checked')){
 isWithPhysics= true;

 }
 else{ isWithPhysics= false;
}
	     document.getElementById("chGravity").checked = isWithPhysics;

 }
 
 function updateProjectOnServer()
 {
 if( $('#chLaunchServer').is(':checked')){
  var serializedall = sceneSerializer();
  	      var jsdata = JSON.stringify(serializedall);
 postProject(jsdata);
   postMeshes() ;  

   }
 }
	function CopyObject()
	{if(lastTouchedObj === undefined){return;}
	for (i = 0; i < scene.meshes.length; i++) { 
	 		 if(scene.meshes[i].name=="board" || scene.meshes[i].name.indexOf("Torus_")>-1|| scene.meshes[i].name.indexOf("Box_")>-1 || scene.meshes[i].id.indexOf("skyBox")>-1)
		 {
		 continue;
		 }

  if(scene.meshes[i].id == lastTouchedObj.id.replace("sideB",""))
  {  var uniqueInstance=uuidv4();//Math.random().toString().replace(".","");
   var newInstancea = scene.meshes[i].clone("");// issue with shared material! same for createInstance
      	  newInstancea.data = new ObjMeta();
         newInstancea.name =  scene.meshes[i].name  ; 
		          newInstancea.id =scene.meshes[i].name+  uniqueInstance ;  
 	   			   newInstancea.makeGeometryUnique();  
  		  //note: clones have .name. in front?! tbc
		  
		//	var	newInstancea=	  generateInstanceFromExistingObject(scene.meshes[i] );
//newInstancea.material  = 	 scene.getMaterialByID(scene.meshes[i].materialId);

 isUpdateMeshesInteractableList=true;
   break;
   }
}
updateProjectOnServer() 
	}
	function ResetProject()
	{ 
	$("#chatboxrespons").val("I've reset the game."); 
SendchatMessage(); 
	handleJSONsaveFileByNewObjects(restoreDefaultScene);
	updateProjectOnServer();
	}
	function DeleteObject()
	{
	for (i = 0; i < scene.meshes.length; i++) { 
	 		 if(scene.meshes[i].name=="board" || scene.meshes[i].name.indexOf("Torus_")>-1|| scene.meshes[i].name.indexOf("Box_")>-1|| scene.meshes[i].id.indexOf("skyBox")>-1)
		 {
		 continue;
		 }

   if(scene.meshes[i].id == lastTouchedObj.id)// if(scene.meshes[i].name == lastTouchedObj.name)
  {  
  for (g = 0; g <  scene.meshes[i].getChildMeshes().length; g++) {
  scene.meshes[i].getChildMeshes()[g].setEnabled (false);
  scene.meshes[i].getChildMeshes()[g].dispose();
  }
   if(    scene.meshes[i].parent !== undefined &&    scene.meshes[i].parent !== null &     scene.meshes[i].parent !== "undefined"){
     scene.meshes[i].parent.setEnabled (false);
scene.meshes[i].parent.dispose();
}else{
  scene.meshes[i].setEnabled (false);
 // scene.meshes[i]=null;
scene.meshes[i].dispose();}
  break;}
}
 
	}
	    function setSoundPieceRelease()
  {
    setTimeout(function(){ 
    piecedropSoundFile ="static/audio/sounds/"+ $("#selPieceRelease").val();
			     piecedropSound = new BABYLON.Sound("piecedropSound", piecedropSoundFile, scene, null, { loop: false, autoplay: true });
 updateProjectOnServer();
 }, 300);

  }
    function setMusicTurn()
  {
    setTimeout(function(){ 
 	  					if(ambientMusic !== undefined && ambientMusic !== "undefined" && ambientMusic !== null){
				  ambientMusic.stop(); 
				   }

  ambientMusicFile ="static/audio/music/"+ $("#selBackgroundMusic").val();
  		     ambientMusic = new BABYLON.Sound("ambientMusic",ambientMusicFile, scene, null, { loop: true, autoplay: true,   spatialSound: true  });//REF: https://doc.babylonjs.com/how_to/playing_sounds_and_music
	  					if(ambientMusic !== undefined && ambientMusic !== "undefined" && ambientMusic !== null){
				  ambientMusic.play(); 
				   }

 updateProjectOnServer();
 }, 300);

  }

  function setSoundEndTurn()
  {
  setTimeout(function(){ 
  
    endTurnSoundFile ="static/audio/sounds/"+ $("#selEndTurn").val();
			     endTurnSound = new BABYLON.Sound("endTurnSound", endTurnSoundFile, scene, null, { loop: false, autoplay: true });

  updateProjectOnServer();
}, 300);

  }
function promptShowDevObjName()
{

var meshOName=  $("#lblclickedMeshName").text().replace("sideB","");
var meshNName = prompt("Selected object name is "+ $("#lblclickedMeshName").text(), $("#lblclickedMeshName").text());

if (meshNName == null || meshNName.trim() == "") {
meshNName=  $("#lblclickedMeshName").text().replace("sideB","");}  

 scene.getMeshByID( meshOName).id =  meshNName; $("#lblclickedMeshName").text(meshNName)
 if( scene.getMeshByID( "sideB"+meshOName) !== undefined &&  scene.getMeshByID( "sideB"+meshOName) !== null){
 scene.getMeshByID( "sideB"+meshOName).id = "sideB"+ meshNName;}

 }
function opencopycode()
{
if(isAdmin){
prompt("Connection-code is "+admincode+"n\ Complete url:", window.location.href.split("?")[0].replace("/adminpage","")+"/project"+admincode);
}
else{prompt("Connection-code is "+admincode+"n\ Complete url:", window.location.href);
}
}