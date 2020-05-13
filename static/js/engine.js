
	//nota: drawing is experimental. When crasing it pops last entry and does a cleardrawing till game can continue. This needs a fix, cause try catch is eeeew.
	  var lastScrollHeightchat=0; 
	var pname = "anonymous";
	var userId= pname + uuidv4();
	var endTurnSound;
	var endTurnSoundFile="";//"static/audio/spaceconfirm.wav";
var ambientMusic; 
	var ambientMusicFile="";//"static/audio/music/spacesound.wav";
var piecedropSound;
var piecedropSoundFile="";//"static/audio/spaceconfirm.wav";;

	var lastTouchedObj; 
 	
 		var boardImageLoc= "static/images/board/wood.jpg"

	var  isAdmin= true;
 	var admincode= "";
	var globalObject = (typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this);
var 				   isUpdateMeshesInteractableList=false;

	var babylonDependency = (globalObject && globalObject.BABYLON) || BABYLON || (typeof require !== 'undefined' && require("babylonjs"));
var BABYLON = babylonDependency;

   var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true, {stencil: true});
  var scene = new BABYLON.Scene(engine);
  		var gizmoManager = new BABYLON.GizmoManager(scene);
 gizmoManager.positionGizmoEnabled =false;// isAdmin;
gizmoManager.rotationGizmoEnabled = false;//right click show
gizmoManager.scaleGizmoEnabled = false;//isAdmin;
gizmoManager.boundingBoxGizmoEnabled = false; 
var allowedgizmoMeshes =[];

var isResetProjectAllowed=true;
var isDraggingAllowed= true;
 var isWithPhysics= true;
 var isMeshesGetAllowed= true;
var isMeshesPostAllowed=true; 
var isActivePlayer= false;
	   var timerBeforeChatAction=150;
	   	   var countChatAction=0;
		   var timerBeforePostGetMeshes=30;
		   var countPostGetMeshesAction= 0;
	   var timerBeforeAdminCheckin=1500;
	   	   var countAdminCheckin=0;

 var lastGetContent = "";
  
 var   playerturn=""
 var isYourTurnRegistered=false;
 
 var restoreDefaultScene="";//Reset in uploadscene. Gets loaded in handleJSONsaveFileByNewObjects enters  (first time) and in postproject();
 
class ObjMeta  {
  constructor() {
    this.name = "";
  }
}
 /* static JavaSript main routine at the end of the JS file */
//function __js_main() {
  
  //gravity settings///
 	   var opt1 = {};
      opt1.mass = 0.0;
      opt1.restitution = 0.2;
      var opt2 = {};
      opt2.mass = 1.0;
      opt2.restitution = 0.7;
      opt2.friction = 0.3;
      var opt3 = {};
      opt3.mass = 0.8;
      opt3.restitution = 0.1;
      opt3.friction = 0.4;
	        var opt4 = {};
      opt4.mass = 0;
      opt4.restitution = 0 ;
      opt4.friction = 0;
	  
	  // var camera = new BABYLON.FreeCamera("cam1", (new BABYLON.Vector3(0, 11, -25)), scene);
//  camera.setTarget(new BABYLON.Vector3(0, 0, 0));
  	var  camera = new BABYLON.ArcRotateCamera("cam1",  -3 * Math.PI / 8, 3 * Math.PI / 8, 15, new BABYLON.Vector3(0, 0, 0), scene);
	camera.attachControl(canvas, true);

  var loader = new BABYLON.AssetsManager(scene);
  var m = loader.addTextureTask("board",  boardImageLoc);
  m.onSuccess = (_task)=> {
    (((event) => { 
   var hemilight=   new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
   //   hemilight.intensity=0.2;
     var dirLight= new BABYLON.DirectionalLight("light2",new BABYLON.Vector3(-1, -1, -1),scene);
   
	 /* var torusObj=generateTorusObject(scene,  -48,10, 0, 10,30,"TA");
	  var torusObjB=generateTorusObject(scene,   48,10, 0, 10,30,"TB");
	  var torusObjC=generateTorusObject(scene,   0,10,48, 10,30,"TC");
	  var torusObjD=generateTorusObject(scene,   0,10, -48, 10,30,"TD");*/
	  var boxObj=generateWallObject(scene,  0,0, 35, 35,35,"BA");
var boxObjB=generateWallObject(scene,  0,0, -35, 35,35,"BB");
var boxObjC=generateWallObject(scene,  35,0, 0, 35,35,"BC");
	boxObjC.rotation.y =  Math.PI / 2;
var boxObjD=generateWallObject(scene,  -35,0, 0, 35,35,"BD");
	boxObjD.rotation.y =  Math.PI / 2;
			applyPhysics(boxObj, opt4, BABYLON.PhysicsImpostor.BoxImpostor);
			applyPhysics(boxObjB, opt4, BABYLON.PhysicsImpostor.BoxImpostor);
			applyPhysics(boxObjC, opt4, BABYLON.PhysicsImpostor.BoxImpostor);
			applyPhysics(boxObjD, opt4, BABYLON.PhysicsImpostor.BoxImpostor);

 	   
	       /*    var newInstancea =  dice.clone(uuidv4().toString());//REF: https://www.html5gamedevs.com/topic/29278-solvedis-meshclone-better-than-new-or-meshbuildercreatexxx/
 			   		  newInstancea.position = new BABYLON.Vector3(2.5, 0.01,0.1);
      var dDataa = new ObjMeta();
      newInstancea.data = dDataa;
      newInstancea.name = "dice";
	  => clone object copies all!!
	  
	  	           var newInstancea = generateDiceObject();
				   newInstancea.position.x = 5;
    newInstancea.material.diffuseColor = BABYLON.Color3.Random();*/
 
	   
	   	  skyBox();
	  ControlsObservables();
   isUpdateMeshesInteractableList=true;// setMeshesInteractable();

	        /** unused:  var zz = -10.0   **/ 
       let diceThrow = false;
      let diceStabileCnt = 0;

 


       /** unused:  var rot = 0.0   **/ 

       engine.runRenderLoop(()=>{
	   if(isUpdateMeshesInteractableList){isUpdateMeshesInteractableList=false;setMeshesInteractable(); }
	   
	   if  ($('#chLaunchServer').is(':checked')){
	   
	   
	    if(isAdmin && admincode !== ""){
		countAdminCheckin+=1;
		
		if( countAdminCheckin >= timerBeforeAdminCheckin ){ 
 countAdminCheckin=0;
    jQuery.get( "/adminAliveCheck"+admincode, function( data ) {//alivecheck time only for admins, and in chatlimit (enough).
 //console.log( data );
 } );
 }
 }
	   
	   if(countChatAction>= timerBeforeChatAction && admincode !== ""){  
	   jQuery.get( "/chat"+admincode+"?undefined", function( data ) {
   var convData = decodeURI(data);
 $( "#chatboxdata" ).html( convData );
  		 if(lastScrollHeightchat != $('#chatboxdata')[0].scrollHeight){
                 $('#chatboxdata').scrollTop($('#chatboxdata')[0].scrollHeight); 
				  lastScrollHeightchat= $('#chatboxdata')[0].scrollHeight;
				}

 });
 

 
 
 
 countChatAction=0;
 }else{countChatAction+=1; }
 	   
  	   
if(countPostGetMeshesAction>= timerBeforePostGetMeshes && admincode !== ""){   
	   getMeshes();if(isActivePlayer){postMeshes();}countPostGetMeshesAction=0;}else{countPostGetMeshesAction+=1; }
	   

	   
	   
	    }
	    
	  		 scene.meshes.forEach(function(m) {
			
			  if(m.position.x > 36 || m.position.x < -36 || m.position.z > 36 || m.position.z < -36 || m.position.y  != null && m.position.y < -0.0)
			 {
			 			 console.log("Too far away from the field => " +m.id  );

			 m.position = new BABYLON.Vector3( 0, 2,0, 1, BABYLON.Space.WORLD);//=> center board
			 			 //alt: 		  m.position = new BABYLON.Vector3(m.position.x, 0,m.position.z, 1, BABYLON.Space.WORLD);  for m.position.y  != null && m.position.y < -0.0

			 } 
			 });

	  
        ((() => { 
           scene.render();
        })) () 
       });
    }))(_task)
      }
      loader.load();
  //  }
 //   __js_main();