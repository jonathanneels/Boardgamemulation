        var   groundObj; 

 function skyBox()
 {
	 	// Skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;//REF: https://opengameart.org/content/indoors-skyboxes
    var files = [
        "static/images/skybox/posx.jpg",
        "static/images/skybox/posy.jpg",
        "static/images/skybox/posz.jpg",
        "static/images/skybox/negx.jpg",
        "static/images/skybox/negy.jpg",
        "static/images/skybox/negz.jpg",
    ];
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(files, scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;			
		    skybox.isPickable = false;
	//	    skybox.material.isPickable = false;

	 
 }
 
//////////////////////////////////////////////////////////	 
function generateD20DiceObject()
{
   
//REF: https://doc.babylonjs.com/how_to/polyhedra_shapes

     var texture;
    // d20 texture used previous UV map layout, will not render correctly (need to update the texture)
    var texture_ref = "/static/images/textures/d20.png"
     texture = texture_ref; 



  var sphere0 = BABYLON.Mesh.CreateIcoSphere("icosphere"+uuidv4(), {radius:2, flat:false, subdivisions: 1}, scene);
      sphere0.translate(new BABYLON.Vector3(-4, 5, 4), 1, BABYLON.Space.WORLD ) ;
    sphere0.material = new BABYLON.StandardMaterial("sphericMat"+uuidv4(), scene);
    //sphere0.material.diffuseColor = BABYLON.Color3.White(); // base color for diffuse before reflect
    sphere0.material.diffuseTexture = new BABYLON.Texture(texture,scene);
	      var dData = new ObjMeta();
      sphere0.data = dData;
      dData.name = "d20";
     sphere0.physicsImpostor = new BABYLON.PhysicsImpostor(sphere0, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.5, restitution: 0.9, friction: 1 })
  
var timer =0;
var goal=getRndInteger(100,400);

  sphere0.registerBeforeRender(function(){// without this, dragging caues issues.

timer+=1; 
if(timer >=goal)
{timer =0;  goal=getRndInteger(100,400);   sphere0.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
sphere0.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
//  sphere0.position =new BABYLON.Vector3(0,0,0) ;
}
	});	 
 	 // applyPhysics(sphere0 , opt2, BABYLON.PhysicsImpostor.sphereImpostor); 
 
console.log('board script executed');
} 
function generateDiceObject()
{
var dice = BABYLON.MeshBuilder.CreateBox("dice"+uuidv4(), {width:2.5, height:2.5, depth:2.5, faceUV:[(new BABYLON.Vector4(0.0, 0.0,0.33,0.5)), (new BABYLON.Vector4(0.33, 0.0,0.66,0.5)), (new BABYLON.Vector4(0.66, 0.0,1.0,0.5)), (new BABYLON.Vector4(0.0, 0.5,0.33,1.0)), (new BABYLON.Vector4(0.33, 0.5,0.66,1.0)), (new BABYLON.Vector4(0.66, 0.5,1.0,1.0))]}, scene);
      dice.translate(new BABYLON.Vector3(-4, 5, 4), 1, BABYLON.Space.WORLD ) ;
      dice.rotationQuaternion = new BABYLON.Quaternion.RotationAxis((new BABYLON.Vector3(0,0,0)), ((Math.PI) * 0.6));
      var dData = new ObjMeta();
      dice.data = dData;
      dData.name = "dice";
	   var diceMaterial = new BABYLON.StandardMaterial("dicemat"+uuidv4(), scene);
     // diceMaterial.specularColor  = new BABYLON.Color3(1.0, 0.3, 0.6);
	  diceMaterial.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);
      var text_2 = new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene);
      text_2.vScale = -1.0;
      text_2.uScale = -1.0;
      diceMaterial.diffuseTexture = text_2;
	     diceMaterial.diffuseTexture.hasAlpha = true;

      dice.material  = diceMaterial;
setPhysicsByMeshSortName("dice",dice);
dice.script=  $("#txtaMeshScript").val(); 
 	  return dice;
}
function generateTorusObject(scene=null, posX=-3,posY=0,posZ= -0.02,width=0.05,height=0.35,name= uuidv4())
{
	
	 	var purpleDonut = BABYLON.Mesh.CreateTorus("Torus_"+name, 4, 2, 30, scene, false); 
    var purpleMat = new BABYLON.StandardMaterial("TorusMat"+name,scene);
    purpleMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    purpleMat.emissiveColor = BABYLON.Color3.Purple();
    purpleDonut.material = purpleMat;
	    purpleDonut.position = new BABYLON.Vector3(posX,posY,posZ);
  	//	 	purpleDonut.rotation.x =  Math.PI / 2;//https://stackoverflow.com/questions/29907536/how-can-i-rotate-a-mesh-by-90-degrees-in-threejs
purpleDonut.scaling = new BABYLON.Vector3(width, height,width);
purpleDonut.isVisible = false;
//applyPhysics(purpleDonut, opt4, BABYLON.PhysicsImpostor.BoxImpostor);

      purpleDonut.name = "walltorus";

return purpleDonut;
}
function generateWallObject(scene=null, posX=-3,posY=0,posZ= -0.02,width=0.05,height=0.35,name= uuidv4())
{
var myBox = BABYLON.MeshBuilder.CreateBox("Box_+"+name, {height: width, width: width, depth: 0.5}, scene);
	    myBox.position = new BABYLON.Vector3(posX,posY,posZ);
myBox.scaling = new BABYLON.Vector3(width, height,width);
myBox.isVisible = false;
myBox.isPickable=false;
		//	applyPhysics(myBox, opt4, BABYLON.PhysicsImpostor.BoxImpostor); => afterwards
	        
       myBox.name = "wall";
 

 return myBox;

}
function generateStone(x,y,z,diamX,diamY)
{ 
 	    var stone = BABYLON.MeshBuilder.CreateSphere("stone"+uuidv4(),{diameter: diamX, diameterX: diamY}, scene);

	//	applyPhysics(stone, opt3, BABYLON.PhysicsImpostor.SphereImpostor);
        stone.translate(new BABYLON.Vector3(x, z,y), 1, BABYLON.Space.WORLD ) ;
     
	 var stoneMat = new BABYLON.StandardMaterial("stoneMat"+uuidv4(), scene);
	   stoneMat.diffuseTexture=new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene);
	     stoneMat.diffuseTexture.hasAlpha = true;
      stoneMat.diffuseColor = new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);//new BABYLON.Color3(0.0, 0.0, 0.0);
        stone.material  = stoneMat;
		       stone.name = "stone";	 
stone.script=  $("#txtaMeshScript").val(); 

 setPhysicsByMeshSortName("stone",stone);

return stone;
}
function generateCard(x, y, z, isWithSideB)
{      var ID=uuidv4();
var cardMaterial = new BABYLON.StandardMaterial("cardmat"+ID, scene);
      cardMaterial.diffuseColor = new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);//new BABYLON.Color3(0.2, 0.3, 0.4);
     // cardMaterial.specularColor  = new BABYLON.Color3(1.0, 0.3, 0.6);
      var text_1 = new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene);
      text_1.vScale = -1.0;
      text_1.uScale = -1.0;
      cardMaterial.diffuseTexture = text_1;
	     cardMaterial.diffuseTexture.hasAlpha = true;

         var card = BABYLON.MeshBuilder.CreateBox("card"+ID , {width:3.0, height:0.1, depth:5.0}, scene);
        card.translate(new BABYLON.Vector3(x, z,y), 1, BABYLON.Space.WORLD ) ;
        card.data = new ObjMeta();
        card.material  = cardMaterial;
        card.rotationQuaternion = new BABYLON.Quaternion.RotationAxis((new BABYLON.Vector3(1.0, 1.0,1.0)), (0.5 * (Math.sin(z))));

       

  
  
      card.name = "card"; 
  setPhysicsByMeshSortName("card",card);
 
card.script=  $("#txtaMeshScript").val(); 
if(isWithSideB){
generateCardSideB(x, y, z,card);}
 return card;
}
function generateCardSideB(x, y, z,card)
{      
 
       var cardMaterialsideB = new BABYLON.StandardMaterial("cardmatsideB"+card.id, scene);
      cardMaterialsideB.diffuseColor = new BABYLON.Color3.FromHexString(document.getElementById("iObjColorsideB").value);//new BABYLON.Color3(0.0, 0.3, 0.4);
    //  cardMaterialsideB.specularColor  = new BABYLON.Color3(0.0, 0.3, 0.6);
      var text_1cardsideB =  new BABYLON.Texture("static/images/textures/"+$("#selObjTexturesideB").val(), scene); 
      text_1cardsideB.vScale = -1.0;
      text_1cardsideB.uScale = -1.0;
      cardMaterialsideB.diffuseTexture = text_1cardsideB;
	     cardMaterialsideB.diffuseTexture.hasAlpha = true;

         var cardsideB = BABYLON.MeshBuilder.CreateBox("sideB"+card.id , {width:3.0, height:0.1, depth:5.0}, scene);
        cardsideB.translate(new BABYLON.Vector3(x, z,y), 1, BABYLON.Space.WORLD ) ;
        cardsideB.data = new ObjMeta();
         cardsideB.material  = cardMaterialsideB;

 cardsideB.parent=card;
    cardsideB.registerBeforeRender(function(){// without this, dragging caues issues.
	cardsideB.position.x =0;
cardsideB.position.z =0;
cardsideB.position.y =0+0.02;//0.1;

	});	 
  
        cardsideB.name = "card";
  setPhysicsByMeshSortName("card",cardsideB);

 
 return cardsideB;
}

function generatePawn(x,y,z)

{ 
      var points = [new BABYLON.Vector3(0, -2, 0), new BABYLON.Vector3(0, 1, 0)];
      var myTube = BABYLON.MeshBuilder.CreateTube("tube", {path: points, radiusFunction:((i, distance) => { 
        if ( i == 0 ) {
          return 1.0;
        }
        return 0.2;
      }), cap:BABYLON.Mesh.CAP_ALL}, scene);
      var head = new BABYLON.Mesh.CreateSphere("head", 16.0, 1.5, scene);
      head.translate(new BABYLON.Vector3(0, 1, 0), 1, BABYLON.Space.WORLD ) ;
       var mergemesh = BABYLON.Mesh.MergeMeshes([myTube, head]);
      mergemesh.translate(new BABYLON.Vector3(6, 0, 4), 1, BABYLON.Space.WORLD ) ;
      var redMaterial = new BABYLON.StandardMaterial("pawn"+uuidv4(), scene);
      redMaterial.diffuseColor = new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);//new BABYLON.Color3(1.0, 0.3, 0.4);
 redMaterial.diffuseTexture=new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene);
 	     redMaterial.diffuseTexture.hasAlpha = true;

 //    redMaterial.specularColor  = new BABYLON.Color3(0.8, 0.2, 1.0);
   //   redMaterial.emissiveColor   = new BABYLON.Color3(0.8, 0.2, 0.2);
       mergemesh.material  = redMaterial;
      mergemesh.scaling = new BABYLON.Vector3(0.3, 0.3,0.3);
	        mergemesh.position = new BABYLON.Vector3(	  x,y,z);

       mergemesh.name = "pawn";	  setPhysicsByMeshSortName("pawn",mergemesh);
mergemesh.script=  $("#txtaMeshScript").val(); 

	  return mergemesh;
}

function generateDisc(x,y,z,size,cornercount, isWithSideB )
{var id= uuidv4();
            var disc = BABYLON.Mesh.CreateDisc("disc"+ id,size,cornercount, scene,true,BABYLON.Mesh.FRONTSIDE);//DOUBLESIDE);//REF: https://www.tutorialspoint.com/babylonjs/babylonjs_disc.htm
   disc.thickness= 5;
   //   disc.position = new BABYLON.Vector3(x,y,z );
 	 		 //	disc.rotation.x =  Math.PI / 2;
	// disc.translate(new BABYLON.Vector3(x,y,z ), 1, BABYLON.Space.WORLD ) ;
/*
 	   	  var head = BABYLON.MeshBuilder.CreateBox("head", {width:0.2, height:0.5, depth:0.2   }, scene); // 2D movement
 
   //   head.translate(new BABYLON.Vector3(x,y,z ), 1, BABYLON.Space.WORLD ) ;
       var mergemesh = BABYLON.Mesh.MergeMeshes([disc, head]);
   //   mergemesh.translate(new BABYLON.Vector3(x,y,z ), 1, BABYLON.Space.WORLD ) ;
    */  var redMaterial = new BABYLON.StandardMaterial("discMat"+id, scene);
      redMaterial.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);// new BABYLON.Color3(1.0, 0.3, 0.4);
  redMaterial.diffuseTexture=new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene);
   	     redMaterial.diffuseTexture.hasAlpha = true;

  //  redMaterial.specularColor  = new BABYLON.Color3(0.8, 0.2, 1.0);
//redMaterial.emissiveColor   = new BABYLON.Color3(0.8, 0.2, 0.2);
mergemesh = disc;
       mergemesh.material  = redMaterial;
 	   //     mergemesh.position = new BABYLON.Vector3(	  x,y,z);// without translate movement is 3D			
 	  			        mergemesh.translate(new BABYLON.Vector3(x, y,z), 1, BABYLON.Space.WORLD ) ;

      
/*
            var discB = BABYLON.Mesh.CreateDisc("discsideB"+ uuidv4(),size,cornercount, scene,true,BABYLON.Mesh.DOUBLESIDE);//REF: https://www.tutorialspoint.com/babylonjs/babylonjs_disc.htm
       var redMaterialB = new BABYLON.StandardMaterial("discsideB"+uuidv4(), scene);
      redMaterialB.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColorsideB").value);// new BABYLON.Color3(1.0, 0.3, 0.4);
  redMaterialB.diffuseTexture=new BABYLON.Texture("static/images/textures/"+$("#selObjTexturesideB").val(), scene);
   	     redMaterialB.diffuseTexture.hasAlpha = true;
       discB.material  = redMaterialB;
 	 	     //   discB.position = new BABYLON.Vector3(	  x,y-0.8 ,z); 
 	  			        discB.translate(new BABYLON.Vector3(x, y-0.8 ,z), 1, BABYLON.Space.WORLD ) ;

 discB.parent=mergemesh;
    discB.registerBeforeRender(function(){// without this, dragging caues issues.
	discB.position.x =0;
discB.position.z =0;
discB.position.y =0+0.2;
// wrong result, too thin
	});*/



 mergemesh.name = "disc";
// discB.name = "discsideB";	
      //    applyPhysics(discB, opt2, BABYLON.PhysicsImpostor.BoxImpostor);
		  
 setPhysicsByMeshSortName("disc",mergemesh);
 mergemesh.script=  $("#txtaMeshScript").val(); 

if(isWithSideB)
{
generateDiscSideB(x,y,z,size,cornercount, disc );
}
	  return mergemesh; 
}

function generateDiscSideB(x,y,z,size,cornercount, disc )
{

            var discB = BABYLON.Mesh.CreateDisc("sideB"+ disc.id,size,cornercount, scene,true,BABYLON.Mesh.BACKSIDE);//REF: Backside fmi: https://doc.babylonjs.com/how_to/frontandbackuv
 
   var redMaterial = new BABYLON.StandardMaterial("discMatsideB"+disc.id, scene);
      redMaterial.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColorsideB").value);// new BABYLON.Color3(1.0, 0.3, 0.4);
  redMaterial.diffuseTexture=new BABYLON.Texture("static/images/textures/"+$("#selObjTexturesideB").val(), scene);
   	     redMaterial.diffuseTexture.hasAlpha = true;
        discB.material  = redMaterial;
  	  			        discB.translate(new BABYLON.Vector3(x, y,z), 1, BABYLON.Space.WORLD ) ;
 


 discB.name = "disc";
 		  
 setPhysicsByMeshSortName("disc",discB);
 
 
 discB.parent=disc;
    discB.registerBeforeRender(function(){
	discB.position.x =0;
discB.position.z =0;
discB.position.y =0  ;//+0.2

	});	 
	  return discB; 
}
  function generateCoin(x, y, z, size, isWithSideB) { 
  var id=uuidv4();
	        var orangeMaterial = new BABYLON.StandardMaterial("coinMat"+id, scene);
      orangeMaterial.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColor").value);// new BABYLON.Color3(1.0, 1.0, 0.4);

        var coin = BABYLON.MeshBuilder.CreateTube("coin"+id , {path: [(new BABYLON.Vector3(0.0, -0.1,0.0)), (new BABYLON.Vector3(0.0, 0.1,0.0))], radiusFunction:((i, distance) => { 
          return size * 1.0;
        }), cap:BABYLON.Mesh.CAP_ALL}, scene);
		coin.id="coin"+id;
        coin.translate(new BABYLON.Vector3(x, y,z), 1, BABYLON.Space.WORLD ) ;
        coin.material  = orangeMaterial;
		
		      var text_2 =  new BABYLON.Texture("static/images/textures/"+$("#selObjTexture").val(), scene); 
      text_2.vScale = -1.0;
      text_2.uScale = -1.0;
       coin.material.diffuseTexture = text_2;
 	     coin.material.diffuseTexture.hasAlpha = true;

 
  coin.name = "coin";

   setPhysicsByMeshSortName("coin",coin);
 
	  if(isWithSideB){
 generateCoinSideB(x, y, z,size,coin);}
coin.script=  $("#txtaMeshScript").val(); 

	 	return coin;
       }
	   
  function generateCoinSideB(x, y, z,size,coin) { 
 
	        var orangeMaterialsideB = new BABYLON.StandardMaterial("coinMatsideB"+coin.id, scene);
      orangeMaterialsideB.diffuseColor =new BABYLON.Color3.FromHexString(document.getElementById("iObjColorsideB").value);// new BABYLON.Color3.FromHexString(document.getElementById("iObjColorsideB").value);//new BABYLON.Color3(0.10, 0.0, 0.8);

        var coinsideB = BABYLON.MeshBuilder.CreateTube("sideB"+coin.id , {path: [(new BABYLON.Vector3(0.0, -0.1,0.0)), (new BABYLON.Vector3(0.0, 0.1,0.0))], radiusFunction:((i, distance) => { 
          return size * 1.0;
        }), cap:BABYLON.Mesh.CAP_ALL}, scene);
        coinsideB.translate(new BABYLON.Vector3(x, y-0.8,z), 1, BABYLON.Space.WORLD ) ;
         coinsideB.material  = orangeMaterialsideB;
		 		      var text_2sideB =  new BABYLON.Texture("static/images/textures/"+$("#selObjTexturesideB").val(), scene);
      text_2sideB.vScale = -1.0;
      text_2sideB.uScale = -1.0;
       coinsideB.material.diffuseTexture = text_2sideB;
 	     coinsideB.material.diffuseTexture.hasAlpha = true;

 coinsideB.parent=coin;
    coinsideB.registerBeforeRender(function(){// without this, dragging caues issues.
	coinsideB.position.x =0;
coinsideB.position.z =0;
coinsideB.position.y =0+0.02;

	});


 	  
       coinsideB.name = "coin";

   setPhysicsByMeshSortName("coin",coinsideB);

	 	return coinsideB;
       }	   
	   function groundObject(){
	              groundObj = BABYLON.MeshBuilder.CreateBox("board", {width:50.0, height:0.2, depth:50.0}, scene); 
      groundObj.translate(new BABYLON.Vector3(0,0,0), 1, BABYLON.Space.WORLD ) ;
      groundObj.data = new ObjMeta();
       var groundMaterial = new BABYLON.StandardMaterial("ground", scene); 
 	  	        groundMaterial.diffuseTexture = new BABYLON.Texture(boardImageLoc, scene);
		//groundObj.isPickable=false;
	  

   var initGrounds = ((o) => { 
        o.physicsImpostor = new BABYLON.PhysicsImpostor(o, (BABYLON.PhysicsImpostor.BoxImpostor), opt1, scene);
        o.material  = groundMaterial;
      });
      initGrounds(groundObj); 
	   }
	   
	   
////////////////////////////////////////GRAVITY/////////////////	   
	   
	   function createShape(val, isWithSideB)
{ 
var shape;
switch(val) {
  case "dice": 
 shape= generateDiceObject();
    break;
  case "card":
shape= generateCard(getRndInteger(0,10),0.05,getRndInteger(0,10),isWithSideB); 
    break;
	  case "disc":
shape= generateDisc(getRndInteger(0,10),0.05,getRndInteger(0,10),1,6,isWithSideB);  
    break;
		  case "coin":
   shape=   generateCoin(getRndInteger(0,10),0.05,getRndInteger(0,10), 1.0,isWithSideB);
    break;

  case "sphere":
 shape=   generateStone(getRndInteger(0,10),0.05,getRndInteger(0,10),0.5,0.7);
    break;
  case "pawn":
 shape=  generatePawn(getRndInteger(0,10),0.05,getRndInteger(0,10));
    break;

  default:
    // code block
}
return shape;
}

	     var applyPhysics = ((obj, opt, type) => { 
        var p_1 = new BABYLON.PhysicsImpostor(obj, type, opt, scene);
        obj.physicsImpostor = p_1;
        let meta_1 = obj.data;
        if ( typeof(meta_1) === "undefined" ) {
          meta_1 = new ObjMeta();
          obj.data = meta_1;
        }
        if ( (typeof(meta_1) !== "undefined" && meta_1 != null )  ) {
          if( meta_1 instanceof ObjMeta ) /* union case */ {
            var data_1 = meta_1;
            data_1.physics = p_1;
          };
        }
      });


function setPhysicsByMeshSortName(meshSortName,obj)
{	  		 
if(isWithPhysics){ 

switch (meshSortName) {
  case "dice":
 	  applyPhysics(obj, opt2, BABYLON.PhysicsImpostor.BoxImpostor); 
    break;
  case "stone":
         applyPhysics(obj, opt2, BABYLON.PhysicsImpostor.SphereImpostor); 
    break;
  case "card":
	        applyPhysics(obj, opt3, BABYLON.PhysicsImpostor.BoxImpostor);
    break;
  case "pawn":
         applyPhysics(obj, opt3, BABYLON.PhysicsImpostor.BoxImpostor); 
    break;
  case "disc":
         applyPhysics(obj, opt2, BABYLON.PhysicsImpostor.BoxImpostor);//CylinderImpostor);
    break;
  case "coin":
         applyPhysics(obj, opt2, BABYLON.PhysicsImpostor.BoxImpostor);
    break;
         applyPhysics(obj, opt2, BABYLON.PhysicsImpostor.BoxImpostor);
    break;

	default:
	break;
	}
}}
////////////////////////////////JSON///////////////////////////////////////////////


 function generateInstanceFromExistingObject(item )
 {
 var nShape;
				if(item.name.indexOf("stone") >-1 ||item.name == ("stone")){
			  			   nShape= createShape("sphere",false);
				}else{
 								if(item.id.indexOf("sideB") >-1 ||item.id == ("sideB")){
								var item =item.id.replace("sideB","");
								if(scene.getMeshByID(item) === null || scene.getMeshByID(item) === undefined || scene.getMeshByID(item) === "undefined"){return;}
								if(item.indexOf("card") >-1 ||item == ("card")){nShape=  generateCardSideB(0,0,0,scene.getMeshByID(item));}
								else  if(item.indexOf("coin") >-1 ||item == ("coin")){nShape=  generateCoinSideB(0,0,0,1.0,scene.getMeshByID(item));} 
								 else  if(item.indexOf("disc") >-1 ||item == ("disc")){  nShape=  generateDiscSideB(0,0,0,1,6,scene.getMeshByID(item));} 
														}else{ 
			   nShape= createShape(item.name.substr(0,4),false);}
			}  
			if(item.position !== undefined && item.position  !== "undefined" && item.position !== null){
 			           nShape.position = (new BABYLON.Vector3(Number(item.position[0]), Number(item.position[1]),Number(item.position[2])));//, 1, BABYLON.Space.local ) ;
 			if(item.rotationQuaternion  !== undefined && item.rotationQuaternion  !== "undefined" && item.rotationQuaternion  !== null){
 nShape.rotationQuaternion = new BABYLON.Quaternion(item.rotationQuaternion[0], item.rotationQuaternion[1],item.rotationQuaternion[2],item.rotationQuaternion[3]);
	   }
 			if(item.scaling  !== undefined && item.scaling  !== "undefined" && item.scaling  !== null){
	   nShape.scaling = new BABYLON.Vector3(item.scaling[0], item.scaling[1],item.scaling[2] ); }
		}	/* else{
 			     if(item.position  !== undefined && item.position  !== "undefined" && item.position  !== null){      nShape.position = (new BABYLON.Vector3(Number(item.position.x), Number(item.position.y),Number(item.position.z)));}//, 1, BABYLON.Space.local ) ;
   			if(item.rotationQuaternion  !== undefined && item.rotationQuaternion  !== "undefined" && item.rotationQuaternion  !== null){nShape.rotationQuaternion = new BABYLON.Quaternion(item.rotationQuaternion.x, item.rotationQuaternion.y,item.rotationQuaternion.z,item.rotationQuaternion.w);}
	  if(item.scaling  !== undefined && item.scaling  !== "undefined" && item.scaling  !== null){  nShape.scaling = new BABYLON.Vector3(item.scaling.x, item.scaling.y,item.scaling.z); }} 
	nShape.id =item.id;
	nShape.name =item.name;*/
  			 nShape.material  = 	 scene.getMaterialByName(item.materialId);
			 	//  nShape.material = JSON.parse(feedbackdata).material[0];

			 return nShape;
 }
 function handleMeshesAfterJSONConvert(JSONItems)
 {
  for (i = 0; i < JSONItems.length; i++) { 

if(JSONItems[i] === undefined || JSONItems[i] .name === undefined ){continue;}

    if(JSONItems[i].name.indexOf("lines") >-1)
		 {  // handled higher
   continue;
		 }
			 if(JSONItems[i].name=="board")
			 { 
			 if(groundObj.material !== undefined && groundObj.material !== "undefined" && groundObj.material !== null ){
			 groundObj.material.dispose();
			 }
  			 groundObj.material  = 	 scene.getMaterialByName(JSONItems[i].materialId);
			 if(groundObj.material !== undefined && groundObj.material !== "undefined"&& groundObj.material !== null){

			$("#selBoard").val(	groundObj.material.diffuseTexture.toString().replace("static/images/board/","").trim());}

 			 continue;
			 }
			  if(JSONItems[i].name=="wall"  || JSONItems[i].name.indexOf("Torus_")>-1|| JSONItems[i].name.indexOf("Box_")>-1|| JSONItems[i].name.indexOf("skyBox")>-1)
		 {
		 continue;
		 }
		 var intTimesCreate=1;
		 if($("#txtCloneOnLoad").val() >0 && isAdmin){// as non-admin just take over meshes. 
		  intTimesCreate=  $("#txtCloneOnLoad").val();}
		 for (g = 0; g < intTimesCreate; g++) {
				
				if(g >0)
				{
				JSONItems[i].id = JSONItems[i].id+g.toString();
				}

		 
 				if(JSONItems[i].name.indexOf("stone") >-1 ||JSONItems[i].name == ("stone")){
			  			   nShape= createShape("sphere",false);
				}else{
 								if(JSONItems[i].id.indexOf("sideB") >-1 ||JSONItems[i].id == ("sideB")){
								var item =JSONItems[i].id.replace("sideB","");
								if(scene.getMeshByID(item) === null || scene.getMeshByID(item) === undefined || scene.getMeshByID(item) === "undefined"){continue;}
								if(item.indexOf("card") >-1 ||item == ("card")){nShape=  generateCardSideB(0,0,0,scene.getMeshByID(item));}
								else  if(item.indexOf("coin") >-1 ||item == ("coin")){nShape=  generateCoinSideB(0,0,0,1.0,scene.getMeshByID(item));} 
								 else  if(item.indexOf("disc") >-1 ||item == ("disc")){ nShape=  generateDiscSideB(0,0,0,1,6,scene.getMeshByID(item));} 
														}else{ 
			   nShape= createShape(JSONItems[i].name.substr(0,4),false);}
			}  
			try{
			 if(JSONItems[i].position  !== undefined && JSONItems[i].position  !== "undefined" && JSONItems[i].position  !== null){          nShape.position = (new BABYLON.Vector3(Number(JSONItems[i].position[0]), Number(JSONItems[i].position[1]),Number(JSONItems[i].position[2])));}//, 1, BABYLON.Space.local ) ;
 if(JSONItems[i].rotationQuaternion  !== undefined && JSONItems[i].rotationQuaternion  !== "undefined" && JSONItems[i].rotationQuaternion !== null){ nShape.rotationQuaternion = new BABYLON.Quaternion(JSONItems[i].rotationQuaternion[0], JSONItems[i].rotationQuaternion[1],JSONItems[i].rotationQuaternion[2],JSONItems[i].rotationQuaternion[3]);}
if(JSONItems[i].scaling !== undefined && JSONItems[i].scaling  !== "undefined" && JSONItems[i].scaling  !== null){	    nShape.scaling = new BABYLON.Vector3(JSONItems[i].scaling[0], JSONItems[i].scaling[1],JSONItems[i].scaling[2] );}
	nShape.id =JSONItems[i].id;
	nShape.name =JSONItems[i].name;
  			 nShape.material  = 	 scene.getMaterialByName(JSONItems[i].materialId);} catch(err){console.log(err); } finally{continue;}

	//  nShape.material = JSON.parse(feedbackdata).material[0];
				}  

}
   isUpdateMeshesInteractableList=true;  
 }
  function handleJSONsaveFileByNewObjects(feedbackdata)// much more work to program and to handle, but o so much more trustworthy.
 {		 isMeshesGetAllowed=false; 
 isPreventPointerAction=true;

 var multipleClean = 0; 
 while (multipleClean < 10){// overkill? sometimes some meshes are not getting cleared first round.
 		 scene.meshes.forEach(function(m) {
			  if(m.name=="board"  || m.name=="wall"  || m.name.indexOf("Torus_")>-1|| m.name.indexOf("Box_")>-1|| m.name.indexOf("skyBox")>-1)
		 {
		 return true;
		 }	else{
		   for (g = 0; g <  m.getChildMeshes().length; g++) {
  m.getChildMeshes()[g].setEnabled (false);
  m.getChildMeshes()[g].dispose();
  }     if(m.parent !== undefined && m.parent !== null && m.parent !== "undefined"){
		  m.parent.setEnabled (false);
m.parent.dispose();}else{
		 m.setEnabled(false);	m.dispose();
		}
		 }

		 }); 
		 multipleClean+=1;
		 }
 feedbackdata=feedbackdata.trim();
 
 if(restoreDefaultScene=="")
 {
 restoreDefaultScene=feedbackdata;
 }
 var JSONfeedbackdata=JSON.parse(feedbackdata);
	var materialItems = JSONfeedbackdata.materials;
 	var JSONItems = JSONfeedbackdata.meshes;  
	
	 $("#projectinfo").html(JSONfeedbackdata.info);
 isWithPhysics= JSONfeedbackdata.gravity;
	     document.getElementById("chGravity").checked = isWithPhysics;

  $("#txtaBoardScript").val(JSONfeedbackdata.script);
    $("#txtCloneOnLoad").val(JSONfeedbackdata.timesCloneOnLoad);
	     document.getElementById("chCloneOnLoad").checked = JSONfeedbackdata.isCloneOnLoad;

  try{
	  
 if(!skippBoardLaunchScript){
	 setTimeout(function(){ eval(JSONfeedbackdata.script);}, 3000);}
  }catch(err){console.log(err);}
finally{
			 if(JSONfeedbackdata.ambientMusicFile !== undefined && JSONfeedbackdata.ambientMusicFile !== "undefined"&& JSONfeedbackdata.ambientMusicFile !== null && JSONfeedbackdata.ambientMusicFile.trim() != ""){
	$("#selBackgroundMusic").val(JSONfeedbackdata.ambientMusicFile.replace("static/audio/music/","").trim());
			     ambientMusic = new BABYLON.Sound("ambientMusic",JSONfeedbackdata.ambientMusicFile, scene, null, { loop: true, autoplay: true,   spatialSound: true  });//REF: https://doc.babylonjs.com/how_to/playing_sounds_and_music
	}
				 if(JSONfeedbackdata.piecedropSoundFile !== undefined && JSONfeedbackdata.piecedropSoundFile !== "undefined"&& JSONfeedbackdata.piecedropSoundFile !== null && JSONfeedbackdata.piecedropSoundFile.trim() != ""){
$("#selPieceRelease").val(JSONfeedbackdata.piecedropSoundFile.replace("static/audio/sounds/","").trim());
			     piecedropSound = new BABYLON.Sound("piecedropSound", JSONfeedbackdata.piecedropSoundFile, scene, null, { loop: false, autoplay: true });
}
			 if(JSONfeedbackdata.endTurnSoundFile !== undefined && JSONfeedbackdata.endTurnSoundFile !== "undefined"&& JSONfeedbackdata.endTurnSoundFile !== null && JSONfeedbackdata.endTurnSoundFile.trim() != ""){
$("#selEndTurn").val(JSONfeedbackdata.endTurnSoundFile.replace("static/audio/sounds/","").trim());
			     endTurnSound = new BABYLON.Sound("endTurnSound", JSONfeedbackdata.endTurnSoundFile, scene, null, { loop: false, autoplay: true });
}
	$("#txtPLayerCount").val(JSONfeedbackdata.maxplayer);


	if(ambientMusic !== undefined && ambientMusic !== "undefined" && ambientMusic !== null){
				  ambientMusic.play(); 
				   }

	 			 for (i = 0; i < materialItems.length; i++) { 
				 var nMat= BABYLON.StandardMaterial.Parse( materialItems[i], scene );
				 nMat.id= materialItems[i].id;
				 				 nMat.name= materialItems[i].name;

 				 }

			 handleMeshesAfterJSONConvert(JSONItems);
			  handleLines(JSONfeedbackdata); 

		isMeshesGetAllowed=true;
	 	isPreventPointerAction=false;

 }}
 function handleJSONsaveFile(feedbackdata)// doesn't work 100%, meshes not always reaction the way the should (gravity, friction issues,.... Prefering new objects.
 {		 isMeshesGetAllowed=false;// risky?
 //      opt3.mass = 0.0 => better solution is y-0.01; unlike ref: https://forum.babylonjs.com/t/cannon-js-how-to-prevent-a-physicsimpostor-from-moving-due-to-collision/2735

 	var strScene =   feedbackdata ;  
		BABYLON.SceneLoader.Load("", "data:" + strScene, engine, function (newScene) {
		
		        newScene.executeWhenReady(function () {
		
	//	scene.setEnabled(false);
			scene.dispose();
 			scene = newScene;
			camera=  	scene.activeCamera = new BABYLON.ArcRotateCamera("cam1",  -3 * Math.PI / 8, 3 * Math.PI / 8, 15, new BABYLON.Vector3(0, 0, 0), scene);
            scene.activeCamera.attachControl(canvas, true);

	        console.log('Scene Loaded');
       //     engine.runRenderLoop(function () {
          //        newScene.render();
          //   });
		    		  gizmoManager = new BABYLON.GizmoManager(scene);
gizmoManager.positionGizmoEnabled = false;
gizmoManager.rotationGizmoEnabled = false;//right click show
gizmoManager.scaleGizmoEnabled = false;
gizmoManager.boundingBoxGizmoEnabled = false;

		  ControlsObservables();
		 isUpdateMeshesInteractableList=true;
 
		 for (i = 0; i < scene.meshes.length; i++) { 
 	 if(scene.meshes[i].name=="wall" ||scene.meshes[i].name=="board" || scene.meshes[i].name.indexOf("Torus_")>-1|| scene.meshes[i].name.indexOf("Box_")>-1|| scene.meshes[i].name.indexOf("skyBox")>-1)
		 {
		 continue;
		 }
//var mesh= scene.getMeshByID(scene.meshes[i].id);
// mesh.position.y = mesh.position.y-0.001;//TBC


  }

      });
 
		}); isMeshesGetAllowed=true;
 }

function combinedProjectHandler(sceneString)// total scene overhaul & kept gravity. To be continued, handleJSONsaveFile(x) too flawed atm. If working, would be awesome (all changes on project are pushed).
{
handleJSONsaveFile(sceneString);
handleJSONsaveFileByNewObjects(sceneString);
}
 
 ///////////////////OTHER////////////////////////////////////////////////////////// 

	  function setMeshesInteractable(){
	  	    allowedgizmoObjList= []; 
					  if(!isDraggingAllowed){return; }

		 scene.meshes.forEach(function(m) {
 		 if(m.name=="board" || m.name.indexOf("Torus_")>-1|| m.name.indexOf("Box_")>-1)
		 {
		 return true;
		 }
	  allowedgizmoObjList.push(m)//s1);
      let pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});

  pointerDragBehavior.useObjectOrienationForDragging = false;//required to prenvent (minimize) floorfalling. https://doc.babylonjs.com/how_to/meshbehavior

  // 
 // Listen to drag events
    pointerDragBehavior.onDragStartObservable.add((event)=> {
		  if(!isDraggingAllowed && m.name.indexOf("dice") > -1){   
 //pointerDragBehavior.startAndReleaseDragOnPointerEvents=false;		  
		//  pointerDragBehavior.releaseDrag();//detach();//
		  } 
     //       m.visibility = 0.5;
   //if(postMeshes()){countPostGetMeshesAction=0;} via RenderLoop
      });
    pointerDragBehavior.onDragObservable.add((event)=> {
 
	    //        m.visibility = 0.1;
   
   //if(postMeshes()){countPostGetMeshesAction=0;} via RenderLoop
    });
    pointerDragBehavior.onDragEndObservable.add((event)=> {
     m.visibility = 1;
	 	if(piecedropSound !== undefined && piecedropSound !== "undefined" && piecedropSound !== null){
				  piecedropSound.play(); 
				   }
      });
	   m.addBehavior(pointerDragBehavior);

    scene.onKeyboardObservable.add((e) => { 
        if (e.event.key === " "&& m.name ==lastTouchedObj.name) { 
            pointerDragBehavior.startDrag();
        }
    });
	
}); 	 }  

  function gizmoOptions(lastTouchedObj)
{	if( lastTouchedObj === undefined){return;}

										   camera.setTarget(  new
BABYLON.Vector3(lastTouchedObj.position.x, 2, lastTouchedObj.position.z)); 

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
function MeshRoller(p,obj)
{
	if( obj === undefined){return;}
	
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

if(!isWithPhysics){
	
	
	return;
	}
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