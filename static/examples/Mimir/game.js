 /////////////VARIABLES////////////////
   var pickResult;
 var isHelpColorsActive= true; // red = unaccessible empty areas, purple is even/odd unaccessible areas.
  
 
var feedTxtObj=generateTextObject("","bold 50px verdana",0,4.5);

var MaxRingManipulatie=4;//  <6 action req.  ex. 3 ==> ring 4, 6 & 8
 
var isPaused= false;
//////////////METHODS////////////////////////
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
 ///////////////////////OBJECTS///////////////// 
 function generateDiscObject(scene=null, posX=0,posY=0,posZ=0, name= uuidv4() )
{	 
 
  var mat = new BABYLON.StandardMaterial("SpinDefaultMat_"+name, scene );
   mat.diffuseTexture = new BABYLON.Texture("static/examples/Mimir/static/images/actors/SpinDefault.png", scene);//SpinDefault.png
 
  mat.diffuseTexture.hasAlpha = true;
  mat.backFaceCulling = false;
mat.ReflectionTextureEnabled = false;
mat.specularColor = new BABYLON.Color3(0, 0, 0);//REF:https://stackoverflow.com/questions/46862168/babylon-js-remove-light-reflection-of-sphere
mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
 	
	
 var plane = BABYLON.Mesh.CreatePlane("plane_"+name, 6.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
  plane.material = mat;
  plane.position = new BABYLON.Vector3(posX,posY,posZ);
   plane.isPickable=false;

     plane.registerBeforeRender(function(){ 

     });
	 
	 return plane;
}
 
 
 function generatePawnObject(scene=null, posX=0,posY=0,posZ=0, name= uuidv4(),  box=null )
{
var material = new BABYLON.StandardMaterial("PawnMat_"+name,scene);
 material.diffuseColor = new   BABYLON.Color4.FromHexString("#FD6304FF");
  material.alpha= 0.2;

var mySphere = BABYLON.MeshBuilder.CreateSphere("pawn_"+name, {diameter: 0.3, diameterX: 0.3, diameterY: 0.3,  diameterZ: 0.3}, scene);
mySphere.material = material; 

    mySphere.position = new BABYLON.Vector3(posX,posY,posZ);
mySphere.checkCollisions=true;
  mySphere.parent = box; 
mySphere.mark=-1;
mySphere.playerOwnedId=-1;
 mySphere.isPickable=true;

 return mySphere;
}
function generateTextObject(changeTextContext="test",fontinfo="bold 22px verdana",x=0,y=0)
{
	//REF: https://www.babylonjs-playground.com/#1FL8ZL#2
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
    dynamicTexture.hasAlpha = true;
    var name = changeTextContext;//"Menion"; 
    var ctx =  dynamicTexture.getContext();
    var font = fontinfo;
    ctx.font= font; 
    var width = ctx.measureText(name).width;
    dynamicTexture.drawText(name, 256 - width/2, 52, font, "lightblue", ""); //write "red" into the last parameter to see the nameplate
    dynamicTexture.uScale = 1;
    dynamicTexture.vScale = 0.125;
    dynamicTexture.update(false);

    var result = BABYLON.Mesh.CreatePlane("nameplate", 10, scene, false);
	    result.position.y = y;
			    result.position.x = x;
    result.rotation.x = Math.PI;
    result.scaling.y = 0.125;
    result.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
	   result.isPickable = false ;


    var mat = new BABYLON.StandardMaterial("nameplateMat", scene);
    mat.diffuseTexture = dynamicTexture;
    mat.backFaceCulling = false;

    result.material = mat;

 	return result;
}


function itemsSetter()
{
	 var disc= generateDiscObject(scene,0,0,0,"Disc_"+"0");
 	   	 var pawnD4_4=	generatePawnObject(scene ,  -0.2, 0, 0,   "D4_4" ,  null );
	   	 var pawnD4_1=	generatePawnObject(scene ,  0,  0.2, 0,   "D4_1" ,  null );
	   	 var pawnD4_3=	generatePawnObject(scene ,   0.2, 0, 0,   "D4_3" ,  null );
	   	 var pawnD4_2=	generatePawnObject(scene ,  0, -0.2, 0,  "D4_2" ,  null );

 	   	 var pawnD6_1=	generatePawnObject(scene ,  -0.5,-0.2, 0,   "D6_1" ,  null );
 	   	 var pawnD6_3=	generatePawnObject(scene ,  -0.45,0.3, 0,   "D6_3" ,  null );
 	   	 var pawnD6_5=	generatePawnObject(scene ,  0.0,0.5, 0,   "D6_5" ,  null );
 	   	 var pawnD6_2=	generatePawnObject(scene ,  0.45,0.2, 0,   "D6_2" ,  null );
 	   	 var pawnD6_4=	generatePawnObject(scene ,   0.45,-0.3, 0,   "D6_4" ,  null );
 	   	 var pawnD6_6=	generatePawnObject(scene ,  -0.1,-0.5, 0,   "D6_6" ,  null );

 	   	 var pawnD8_8=	generatePawnObject(scene ,  -1.0, 0, 0,   "D8_8" ,  null );
	   	 var pawnD8_4=	generatePawnObject(scene ,  -0.75,  0.7, 0,   "D8_4" ,  null );
	   	 var pawnD8_2=	generatePawnObject(scene ,   0, 1.0, 0,   "D8_2" ,  null );
	   	 var pawnD8_7=	generatePawnObject(scene ,   0.75,  0.7, 0,  "D8_7" ,  null );
		  var pawnD8_5=	generatePawnObject(scene ,   1.0, 0, 0,   "D8_5" ,  null );
		  var pawnD8_3=	generatePawnObject(scene ,    0.8, -0.7, 0,   "D8_3" ,  null );
		  var pawnD8_1=	generatePawnObject(scene ,    0, -1.0, 0,   "D8_1" ,  null );
		  var pawnD8_6=	generatePawnObject(scene ,    -0.8, -0.7, 0,   "D8_6" ,  null );

 	   	 var pawnD10_1=	generatePawnObject(scene ,  -1.45,0.3, 0,   "D10_1" ,  null );
 	   	 var pawnD10_5=	generatePawnObject(scene ,  -1.0, 1.1, 0,   "D10_5" ,  null );
	   	 var pawnD10_3=	generatePawnObject(scene ,   0.1, 1.4, 0,   "D10_3" ,  null );
	   	 var pawnD10_9=	generatePawnObject(scene ,   0.9, 1.2, 0,   "D10_9" ,  null );
 	   	 var pawnD10_6=	generatePawnObject(scene ,   1.45, 0.5, 0,   "D10_6" ,  null );
 	   	 var pawnD10_2=	generatePawnObject(scene ,   1.45, -0.4, 0,   "D10_2" ,  null );
 	   	 var pawnD10_8=	generatePawnObject(scene ,   1.1, -1.2, 0,   "D10_8" ,  null );
 	   	 var pawnD10_4=	generatePawnObject(scene ,   0.2,-1.5, 0,   "D10_4" ,  null );
 	   	 var pawnD10_10=	generatePawnObject(scene ,   -0.7,-1.5, 0,   "D10_10" ,  null );
 	   	 var pawnD10_7=	generatePawnObject(scene ,   -1.4,-0.75, 0,   "D10_7" ,  null );

 	   	 var pawnD12_5=	generatePawnObject(scene ,   -2.0, -0.2, 0,   "D12_5" ,  null );
 	   	 var pawnD12_11=	generatePawnObject(scene ,   -1.8,  0.8, 0,   "D12_11" ,  null );
 	   	 var pawnD12_12=	generatePawnObject(scene ,  -1.2, 1.5, 0,   "D12_12" ,  null );
	   	 var pawnD12_2=	generatePawnObject(scene ,   -0.3, 2.0, 0,   "D12_2" ,  null );
	   	 var pawnD12_4=	generatePawnObject(scene ,    0.5, 2.0, 0,   "D12_4" ,  null );
 	   	 var pawnD12_10=	generatePawnObject(scene ,   1.5, 1.3, 0,   "D12_10" ,  null );
 	   	 var pawnD12_7=	generatePawnObject(scene ,   2.0, 0.5, 0,   "D12_7" ,  null );
 	   	 var pawnD12_6=	generatePawnObject(scene ,   2.0, -0.5, 0,   "D12_6" ,  null );
 	   	 var pawnD12_9=	generatePawnObject(scene ,   1.5, -1.4, 0,   "D12_9" ,  null );
 	   	 var pawnD12_3=	generatePawnObject(scene ,   0.4,-2, 0,   "D12_3" ,  null );
 	   	 var pawnD12_1=	generatePawnObject(scene ,   -0.7,-2, 0,   "D12_1" ,  null );
 	   	 var pawnD12_8=	generatePawnObject(scene ,   -1.5 ,-1.3, 0,   "D12_8" ,  null );
		 
		 var pawnD20_4=	generatePawnObject(scene ,  -2.5,0.3, 0,   "D20_4" ,  null );
		 var pawnD20_8=	generatePawnObject(scene ,  -2.3,1.2, 0,   "D20_8" ,  null );
		 var pawnD20_17=	generatePawnObject(scene ,  -1.7,1.9, 0,   "D20_17" ,  null );
		 var pawnD20_13=	generatePawnObject(scene ,  -1.1,2.3, 0,   "D20_13" ,  null );
 	   	 var pawnD20_9=	generatePawnObject(scene ,  -0.3, 2.5, 0,   "D20_9" ,  null );
 	   	 var pawnD20_1=	generatePawnObject(scene ,   0.3, 2.5, 0,   "D20_1" ,  null );
		 var pawnD20_5=	generatePawnObject(scene ,  1.1,2.3, 0,   "D20_5" ,  null );
		 var pawnD20_16=	generatePawnObject(scene ,   1.75,1.8, 0,   "D20_16" ,  null );
		 var pawnD20_20=	generatePawnObject(scene ,   2.3,1.2, 0,   "D20_20" ,  null );
		 var pawnD20_12=	generatePawnObject(scene ,   2.55,0.35, 0,   "D20_12" ,  null );
		 var pawnD20_2=	generatePawnObject(scene ,   2.55,-0.35, 0,   "D20_2" ,  null );
		 var pawnD20_7=	generatePawnObject(scene ,   2.3,-1.2, 0,   "D20_7" ,  null );
		 var pawnD20_14=	generatePawnObject(scene ,   1.9,-1.9, 0,   "D20_14" ,  null );
		 var pawnD20_18=	generatePawnObject(scene ,   1.2,-2.3, 0,   "D20_18" ,  null );
		 var pawnD20_10=	generatePawnObject(scene ,   0.45,-2.5, 0,   "D20_10" ,  null );
		 var pawnD20_3=	generatePawnObject(scene ,  - 0.45,-2.5, 0,   "D20_3" ,  null );
		 var pawnD20_6=	generatePawnObject(scene ,   -1.2,-2.3, 0,   "D20_6" ,  null );
		 var pawnD20_15=	generatePawnObject(scene ,   -1.7,-1.9, 0,   "D20_15" ,  null );
		 var pawnD20_19=	generatePawnObject(scene ,   -2.3,-1.2, 0,   "D20_19" ,  null );
		 var pawnD20_11=	generatePawnObject(scene ,   -2.5,-0.2, 0,   "D20_11" ,  null );

DecorSetter();
	
}
/////////////////////////INTERACTABLES/////////////////////////////////
 
function ActionExecution( e)
{
	
	var isActionCompleted= false;
	
	 scene.meshes.forEach(function(m) { //other part of lay-out change, see engine.js
	 if(isActionCompleted){return false;}
		gameSettings.diceObjList.forEach(function(entry) {
						if(isActionCompleted){return false;}
 	if( m.name.indexOf("pawn_") > -1 &&  m.name==e  )
															{m.material.diffuseColor = new   BABYLON.Color3(0,50,0);m.material.alpha= 0.6;
																var pawnNameParts = m.name.split("_");
 																var babylonMaxEyeObj = pawnNameParts[1].replace("D","");
																var toGoUpByOneval= parseInt(pawnNameParts[2])-1;
										console.log(entry.currenteye+"--"+ toGoUpByOneval );
										if(entry.maxeyes== babylonMaxEyeObj  && entry.currenteye==toGoUpByOneval){ console.log(entry.currentcolumn);
																	 					console.log("exact match");
																	isActionCompleted=true;
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));// mimir_core method

  		} 
	/*		else if(entry.maxeyes== babylonMaxEyeObj ){//&& entry.currenteye== pawnNameParts[2] ){=> one click 2 clic
																	 						console.log("match");	
																	isActionCompleted=true;
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));// mimir_core method
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));
																	// NOTE: need to handle more than 1x same column maxeyes!!
																	

  		}  */	
		}
});


		gameSettings.diceObjList.forEach(function(entry) { // match - exact match not in same loop, preventing wrong handling!
						if(isActionCompleted){return false;}
 	if( m.name.indexOf("pawn_") > -1 &&  m.name==e  )
															{m.material.diffuseColor = new   BABYLON.Color3(0,50,0);m.material.alpha= 0.6;
																var pawnNameParts = m.name.split("_");
 																var babylonMaxEyeObj = pawnNameParts[1].replace("D","");
																var toGoUpByOneval= parseInt(pawnNameParts[2])-1;
										console.log(entry.currenteye+"--"+ toGoUpByOneval );
									/*	if(entry.maxeyes== babylonMaxEyeObj  && entry.currenteye==toGoUpByOneval){ console.log(entry.currentcolumn);
																	 					console.log("exact match");
																	isActionCompleted=true;
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));// mimir_core method

  		} 
			else */				
			if(entry.maxeyes== babylonMaxEyeObj ){//&& entry.currenteye== pawnNameParts[2] ){=> one click 2 clic
																	 						console.log("match");	
																	isActionCompleted=true;
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));// mimir_core method
																	CalcOneUpOrRerollAction(parseInt( entry.currentcolumn));
																	// NOTE: need to handle more than 1x same column maxeyes!!
																	

  		}  			
		}
});

});
	
	
	
	
	
	
	
	
	 
		confirmSound.play();
}

scene.onPointerObservable.add((pointerInfo) => { 
    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
		
		     pickResult = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
  if (pickResult.hit   ) {
    		 	console.log(pickResult.pickedMesh.name);
				if(gameSettings.whosturn != "AI"){
 				ActionExecution(pickResult.pickedMesh.name);}
				 

   
 } 



            console.log("POINTER DOWN");
            break; 
        case BABYLON.PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
	 
            break;
			        case BABYLON.PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");			 
            break;

     /*   case BABYLON.PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
            break;
        case BABYLON.PointerEventTypes.POINTERPICK:
            console.log("POINTER PICK");
            break;
        case BABYLON.PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
            break;*/
    }
});

 window.addEventListener("mousemove", function () { 
  // We try to pick an object   var pickResult = scene.pick(scene.pointerX, scene.pointerY);
});

$(document).keydown(function(e) { // requires jQuery
    console.log(e.keyCode);
    if (e.keyCode === 189 || e.keyCode === 109) { // minus
	if(  camera.fov <3 ){
        camera.fov +=0.1;}
         
    }
    if (e.keyCode === 187 || e.keyCode === 107) { // plus
	if(camera.fov >0.20  ){
   camera.fov -=0.1;}
         
    }
	
	 if (e.keyCode === 72) {//37 ||  e.keyCode === 39 ) { // arrow left REF: https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript & https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		                      // no free camera movement, as in stepping movement
camera.position =  new BABYLON.Vector3(-1, 0, -5);
            return;

		  // e.keyCode === 38 || e.keyCode === 40 up & down is zoom & ok.
    } 
 })
 
 
 /////////////////////////////GAME LOGIC/////////////////////
 function gameLengthSetter(){
  scene.meshes.forEach(function(entry) {
if(entry.name.indexOf("pawn_") >-1){ 
  if(MaxRingManipulatie <2)
  {if(entry.name.indexOf("D20") >-1 || entry.name.indexOf("D12") >-1 || entry.name.indexOf("D10") >-1 || entry.name.indexOf("D8") >-1 || entry.name.indexOf("D6") >-1)
{entry.mark  = -100;}  }  else   if(MaxRingManipulatie <3)
  {
if(entry.name.indexOf("D20") >-1 || entry.name.indexOf("D12") >-1 || entry.name.indexOf("D10") >-1 || entry.name.indexOf("D8") >-1  )
{entry.mark = -100;}  }
  else   if(MaxRingManipulatie <4)
  {if(entry.name.indexOf("D20") >-1 || entry.name.indexOf("D12") >-1 || entry.name.indexOf("D10") >-1  )
{entry.mark = -100;}  }    else   if(MaxRingManipulatie <5)
  {if(entry.name.indexOf("D20") >-1 || entry.name.indexOf("D12") >-1   )
{entry.mark =  -100;} }     else   if(MaxRingManipulatie <6)  { 
if(entry.name.indexOf("D20") >-1   ){
entry.mark =  -100;}else// otherwise mark -1 is set, allowing the pawn to be accessible.
{//entry.mark = -1;
}  }

if(entry.mark==-100)
{
	 entry.material.diffuseColor = new     BABYLON.Color3(255,0,00); entry.material.alpha= 0.6; 
}

}
});
  }

 
 
  
   
  
 /////////////////////////////////////Beautifier/////////////////////////
 function skyBox()
 {
	 	// Skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
 /*   var files = [
        "static/images/skybox/space_left.jpg",
        "static/images/skybox/space_up.jpg",
        "static/images/skybox/space_front.jpg",
        "static/images/skybox/space_right.jpg",
        "static/images/skybox/space_down.jpg",
        "static/images/skybox/space_back.jpg",
    ];*/
	    var hdrTexture = new BABYLON.HDRCubeTexture("static/examples/Mimir/static/images/skybox/room.hdr", scene,256);// 512);

	skyboxMaterial.reflectionTexture = hdrTexture;//new BABYLON.CubeTexture.CreateFromImages(files, scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;			
skybox.isPickable = false;
	 
 }
  function DecorSetter()
 {
	  skyBox();
	  /*
	   var spriteManagerstars = new BABYLON.SpriteManager("starsManager", "static/images/actors/star2.png",2000,1000,scene); //REF:https://www.html5gamedevs.com/topic/40878-sprites-not-showing-up/
    spriteManagerstars.isPickable =  false;//true

	//We create 2000 sprites at random positions
    for (var i = 0; i < 100; i++) {
        var star = new BABYLON.Sprite("star"+i.toString(), spriteManagerstars);
        star.position.x = Math.random() * i*100 - 50;
        star.position.z =-( Math.random() * i*100 - 50);
		        star.position.y =-( Math.random() * i*100 - 50);
        star.isPickable = false;//true;
        star.size = i*10;
star.isPickable = false;//true
        //Some "dead" sprites
        if (Math.round(Math.random() * 5) === 0) {
		 star.position.y = (-0.3);
            star.angle = Math.PI * 90 / 180;}*
 }*/
 }
 