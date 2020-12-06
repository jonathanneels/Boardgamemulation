
function playerObject(playerID, goldCount, soldierArray)
{
	
	return { "playerID":playerID, "goldCount":goldCount, "soldierArray":soldierArray }

}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var p1Info=	playerObject(0, 0, []);  
var p2Info=	playerObject(1, 0, []);
var p3Info=	playerObject(2, 0, []);
var p4Info=	playerObject(3, 0, []);

			var aiActionsInterval;

var isWinOnlyByDominance=false;
var isWinOnlyByMaxResources=false;// maybe in future
var isWithMines=false;

var Who=0; // in case of turn-based
var WhoMe=0; //multiplayer purpose

var isAdmin=false;
var isMultiplayer=false;
var isEndgame= false;
var isMultiplayer=false;
var admincode ="";
var pname ="GAME_MASTER";
var allowGet= false;
var allowPost= true;
var WhoText= "Player " +(WhoMe+1).toString()
 
var playerCount=2;
var aICount=1;

var isTurnBased= false;
var isWithFogOfWar= false;
var isWithWeatherEffect= false;

/******/
(function(modules) { // webpackBootstrap
    /******/ // The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/
        if (installedModules[moduleId])
            /******/
            return installedModules[moduleId].exports;
        /******/
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/
            exports: {},
            /******/
            id: moduleId,
            /******/
            loaded: false
            /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/
        module.loaded = true;
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ // __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/
    return __webpack_require__(0);
    /******/
})
/************************************************************************/
/******/
([
    /* 0 */
    /***/
    function(module, exports, __webpack_require__) {

        module.exports = __webpack_require__(1);


        /***/
    },
    /* 1 */
    /***/
    function(module, exports, __webpack_require__) {

        var Resource_1 = __webpack_require__(14);
       // var Base_1 = __webpack_require__(13); preference core_1 item 0
        var Core_1 = __webpack_require__(2);
		
		/*        var Core_2 = __webpack_require__(2);//unitID =2
        var Core_3 = __webpack_require__(2);//unitID =3
        var Core_4 = __webpack_require__(2);//unitID =4
        var Core_5 = __webpack_require__(2);//unitID =4*/

        var Formations_ts_1 = __webpack_require__(6);
        var Common_1 = __webpack_require__(3);
        var Ground_1 = __webpack_require__(7);
        var Vector3 = BABYLON.Vector3;
        var CenterOfMassMarker_1 = __webpack_require__(8);
        __webpack_require__(9);
        //todo I can't figure out a way to import with webpack so I load in index.html
        //import BABYLON from 'babylonjs'
        var self; //todo not sure about this
		var camera;
        var Game = (function() {
            function Game() {
                var _this = this;
                this.startingNumberOfCores = 1;
                //todo move to remote Users
                this.enemyUnits = [];
				  this.resourceUnits = [];
				  this.minesUnits = [];

                self = this;
                // Load BABYLON 3D engine
                this.engine = new BABYLON.Engine(document.getElementById("glcanvas"), true);
                this.canvas = this.engine.getRenderingCanvas();
                this.initScene();
                this.cores = [];
								
				this.isKingP1Defeated=false;
				this.isKingP2Defeated=false;
				this.isPawnP1Defeated=false;
				this.isPawnP2Defeated=false;
				var isEndgameNotificationGiven=false;

			this.winningWho=1;
				 self.defaultSinglePlayerGame(false,isWithMines);

				
				_this.collTime=0;
                this.engine.runRenderLoop(function() {
                    self.centerOfMass.mesh.position = Formations_ts_1.default.getCentroid(_this.cores);
                    self.scene.render();
					
 
					_this.collTime+=1;
					if(_this.collTime >= 10 || (isTurnBased && _this.collTime >= 5)){
											  $('#info').scrollTop($('#info')[0].scrollHeight);

						if(self.isKingP1Defeated && self.isKingP2Defeated && !isEndgameNotificationGiven)
						{isEndgameNotificationGiven=true;
							$("#info").append("<br>Game has ended in a DRAW. Both kings are defeated.<br>");
								 if(aICount == playerCount  ){
									  $("#info").append("<br>Ai vs Ai resets in 5 seconds.<br>");
									setTimeout(function(){ self.Reset()}, 5000);  
									 }							
						}
						else if(self.isKingP1Defeated  && !isEndgameNotificationGiven)
						{isEndgameNotificationGiven=true;
													var color="red"
								if(self.winningWho ==1){color="blue"}

					//	 $("#info").append("<br>Player 2 (AI) wins.<br>");
									  $("#info").append("<br>Player "+self.winningWho.toString()+" ("+color+") wins.<br>");  
								 if(aICount == playerCount  ){
									  $("#info").append("<br>Ai vs Ai resets in 5 seconds.<br>");
									setTimeout(function(){ self.Reset()}, 5000);  
									 }
						}
						else if(self.isKingP2Defeated && !isEndgameNotificationGiven )
						{ isEndgameNotificationGiven=true; 
								var color="red"
								if(self.winningWho ==1){color="blue"}
									  $("#info").append("<br>Player "+self.winningWho.toString()+" ("+color+") wins.<br>"); 
 
								 if(aICount == playerCount  ){
									  $("#info").append("<br>Ai vs Ai resets in 5 seconds.<br>");
									setTimeout(function(){ self.Reset()}, 5000);  
									 }
							
						}else{
				 _this.scene.meshes.forEach(function(m) {
					  if(m.id=="skyBox" ||  m.id=="ground" ||  m.id=="cylinder" || m.id.indexOf("myPlane_") >-1|| m.id.indexOf("myResource") >-1 || m.id.indexOf("boxFogOfWar")>-1){return true;}//resource check through g
					 
									 _this.scene.meshes.forEach(function(g) {
										   if(g.id=="skyBox" ||  g.id=="ground" ||  g.id=="cylinder" || g.id.indexOf("myPlane_") >-1 ){return true;}
 												  if(g != m && ((g.isOwn != m.isOwn) || ( g.id.indexOf( "mine") >-1 || g.id.indexOf( "myBase") >-1 || g.id.indexOf("myResource") >-1 || g.id.indexOf("boxFogOfWar") >-1))){

											if(m.intersectsMesh(g, true))
											{
 												
									//  console.log(m.id);
									//  console.log(g.id);
									var feedIdMine= self.minesUnits.filter(function(unit) {
																	return unit.mesh.id== g.id;
																});
									 if((typeof feedIdMine !== "undefined" && feedIdMine.length >0) ){
										 var feedId1= self.cores.filter(function(unit) {
																	return unit.mesh.id== m.id;
																});
													var feedId2= self.enemyUnits.filter(function(unit) {
																	return unit.mesh.id== m.id;
																});
										 if(typeof feedId1 !== "undefined" && feedId1.length >0){
														if(feedId1[0].UnitID == 5)
																{
 													self.isPawnP1Defeated=true;

																}	
															else 	if(feedId1[0].UnitID == 0)
																{isEndgameNotificationGiven=false;
																	self.isKingP1Defeated=true;													
																	self.winningWho =2; 

																}																
											 					 camera.parent = null;
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																

										 }
										   if(typeof feedId2 !== "undefined" && feedId2.length >0){
													if(feedId2[0].UnitID == 5)
																{
 													self.isPawnP2Defeated=true;
																}
															else 	if(feedId2[0].UnitID == 0)
																{isEndgameNotificationGiven=false;
																	self.isKingP2Defeated=true;	
																	self.winningWho =  1;

																}																
																feedId2[0].UnitID=-1;
 																feedId2[0].explode();																

										 }
															 }
												else if(g.id.indexOf("boxFogOfWar") >-1)
												{ 
											var feedId1= self.cores.filter(function(unit) {
																	return unit.mesh.id== m.id;
																});
													var feedId2= self.enemyUnits.filter(function(unit) {
																	return unit.mesh.id== g.id;
																});
																if(typeof feedId1 !== "undefined" && feedId1.length >0){ //atm no ai (p2) fog clearance).
 											        self.scene.fogDensity -= 0.001*10 ;   

													g.dispose();
													}
													}
												else if(g.id.indexOf("myResource") >-1)
												{
 													if(m.isOwn){ if(p1Info.goldCount>1200){/*$("#divSelectedItem").html("1200 is the max. resource count.");*/return true;}
													p1Info.goldCount+=1;
 													}
													else if(p2Info.goldCount<1200){p2Info.goldCount+=1; 
													}
														 $("#pGold").html("<span style='color:steelblue; background-color:black;'> &#128794;"+p1Info.goldCount.toString() +"</span><br>"+ "<span style='color:indianred;background-color:black;'>&#128794;"+p2Info.goldCount.toString()+"</span>");

													}
 
												 
												 else if(m.isOwn !== g.isOwn  )
												{ 	 

										//	console.log("Hostile encounter");
											
															var feedId1= self.cores.filter(function(unit) {
																	return unit.mesh.id== m.id;
																});
													var feedId2= self.enemyUnits.filter(function(unit) {
																	return unit.mesh.id== g.id;
																});
																 
																  if((typeof feedId2 !== "undefined" && feedId2.length >0) && (typeof feedId1 !== "undefined" && feedId1.length >0)){
																	//p1 takes
																	if(feedId1[0].UnitID == 4)
																	{
 
																		if( feedId2[0].UnitID == 4 || feedId2[0].UnitID == 3 || feedId2[0].UnitID == 2 || feedId2[0].UnitID == 1 )
																	{ 
																
																/*var delIndex=0;
																for (var i= 0; i < self.enemyUnits.length; i++) {
																		  if(feedId2 == delIndex[i])
																		  {delIndex=i;
																			  break;
																		  }
																		} */
 															//	feedId2[0].mesh.dispose();
															//	feedId2[0].planeSprite.dispose();  
															//	self.enemyUnits.splice( delIndex,1);
																feedId2[0].UnitID=-1;
																feedId2[0].explode(); 
																	}
																	}
																	else if(feedId1[0].UnitID == 3)
																	{
																if(  feedId2[0].UnitID == 3 || feedId2[0].UnitID == 2 || feedId2[0].UnitID == 1 )
																	{ 
																feedId2[0].UnitID=-1;
																feedId2[0].explode(); 

																	}	 
																	
																	}
																	else if(feedId1[0].UnitID == 2)
																	{
																if(   feedId2[0].UnitID == 2 || feedId2[0].UnitID == 1 )
																	{ 
																feedId2[0].UnitID=-1;
																feedId2[0].explode(); 
																	}	 
																	
																	}
																	else if(feedId1[0].UnitID == 1)
																	{
																if(   feedId2[0].UnitID == 5|| feedId2[0].UnitID == 1 )
																	{ 
																if(feedId2[0].UnitID == 5)
																{
 													self.isPawnP2Defeated=true;
 																}
																feedId2[0].UnitID=-1;
																feedId2[0].explode(); 
																
																	}	 
																	
																	}
																 else if(feedId1[0].UnitID == 5)
																	{
																if(   feedId2[0].UnitID == 4|| feedId2[0].UnitID == 0 )
																	{ 
																if(feedId2[0].UnitID == 0)
																{isEndgameNotificationGiven=false;
																	self.isKingP2Defeated=true;
																	 self.winningWho = feedId1[0].WhoThis+1; 

																}
																feedId2[0].UnitID=-1;
																feedId2[0].explode(); 
																
																	}	 
																	
																	}
																	
																	//p2 takes
																	if(feedId2[0].UnitID == 4)
																	{
																		if( feedId1[0].UnitID == 4 || feedId1[0].UnitID == 3 || feedId1[0].UnitID == 2 || feedId1[0].UnitID == 1 )
																	{ 
																camera.parent = null;
																/* var delIndex=0;
																for (var i= 0; i < self.cores.length; i++) {
																		  if(feedId1 == delIndex[i])
																		  {delIndex=i;
																			  break;
																		  }
																		} 
																self.cores.splice( delIndex,1); */
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																
																
																	}
																	}
																	else if(feedId2[0].UnitID == 3)
																	{
																if(  feedId1[0].UnitID == 3 || feedId1[0].UnitID == 2 || feedId1[0].UnitID == 1 )
																	{ 
																camera.parent = null;
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																
																
																	}	 
																	
																	}
																	else if(feedId2[0].UnitID == 2)
																	{
																if(   feedId1[0].UnitID == 2 || feedId1[0].UnitID == 1 )
																	{ 
																camera.parent = null;
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																
																
																	}	 
																	
																	}
																	else if(feedId2[0].UnitID == 1)
																	{
																if(   feedId1[0].UnitID == 5|| feedId1[0].UnitID == 1 )
																	{
																		if(feedId1[0].UnitID == 5)
																{
															self.isPawnP1Defeated=true;
																	}	
																camera.parent = null;
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																
																 
																	
																	}}
																 else if(feedId2[0].UnitID == 5)
																	{
																if(   feedId1[0].UnitID == 4|| feedId1[0].UnitID == 0 ){
																	if(feedId1[0].UnitID == 0)
																{isEndgameNotificationGiven=false;
																	self.isKingP1Defeated=true; 
																	self.winningWho = feedId2[0].WhoThis+1; 
																}
																camera.parent = null;
																feedId1[0].UnitID=-1;
 																feedId1[0].explode();																
																
																	}	 
																	}
																	 
															////																		
 													 }

												}
											}
											}
											
						});
						
														});
						
						  if(self.isPawnP1Defeated && !self.isKingP1Defeated ) 
						{
 															 var playerABase =  self.getP1Base();
															 if(typeof playerABase[0] !== "undefined" && playerABase.length >-1){
															 var base ;
 if(playerABase[0].isOwn  ){base = new Core_1.default(self.scene, true,false,5);}else{base = new Core_1.default(self.scene, false,false,5);}															 
																 
															base.mesh.position = new Vector3(playerABase[0].mesh.position.x+1, Common_1.default.defaultY,playerABase[0].mesh.position.z+1);
													self.cores.push(base); self.isPawnP1Defeated=false;}
							
						}
						else if(self.isPawnP2Defeated && !self.isKingP2Defeated )
						{
							
							 var playerEnemyBase =  self.getEnemyBase() 

														if(typeof playerEnemyBase[0] !== "undefined" && playerEnemyBase.length >-1){
															 var base ; 
 if(playerEnemyBase[0].isOwn  ){base = new Core_1.default(self.scene, true,false,5);}else{base = new Core_1.default(self.scene, false,false,5);}															 
															
															base.mesh.position = new Vector3(playerEnemyBase[0].mesh.position.x+1, Common_1.default.defaultY, playerEnemyBase[0].mesh.position.z+1);
													self.enemyUnits.push(base); 
													self.isPawnP2Defeated=false;}
						}
													_this.collTime=0;	}}



                });

				
				
             			
				
				
                window.addEventListener("resize", function() {
                    //todo some logic
                    self.engine.resize();
                });
            }
            Game.prototype.initScene = function() {
                var _this = this;
                this.scene = new BABYLON.Scene(this.engine);
                // This creates and positions a free camera (non-mesh)
            //    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, -40), this.scene);				
				      camera = new BABYLON.ArcRotateCamera("Camera1", 0, 0, 10, new BABYLON.Vector3(0, 15, -40), this.scene);
    camera.useFramingBehavior = true;
	camera.framingBehavior.elevationReturnWaitTime=0;
		camera.framingBehavior.elevationReturnTime=0;//https://doc.babylonjs.com/api/classes/babylon.framingbehavior#elevationreturntime
  //   camera.lowerRadiusLimit = 2;
    // camera.upperRadiusLimit = 20; //REF:https://doc.babylonjs.com/how_to/camera_behaviors

                // This targets the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());
                // This attaches the camera to the canvas
                camera.attachControl(this.canvas, true);
				
				
				
////////////////////////////////// Minimap////////////////////////////////////////////////
    var mm = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(0,10,0), this.scene);
    mm.layerMask = 1;
    mm.setTarget(new BABYLON.Vector3(1,0.1,0.1));
    mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    mm.orthoLeft = -88/2;
    mm.orthoRight = 88/2;
    mm.orthoTop =  88/2;
    mm.orthoBottom = -88/2;  

    mm.rotation.y = 0;

    var xstart = 0.85,
        ystart = 0.75;
    var width = 1-xstart,
        height = 1-ystart;

    mm.viewport =new BABYLON.Viewport(0.01,0.69,0.195,0.30);// new BABYLON.Viewport(0.01,0,0.195,0.18); => default. 1st & 2nd value are x,y loc minimap
  	this.scene.activeCameras.push(camera);
      this.scene.activeCameras.push(mm);
	  
	//  mm.parent=camera;
  		this.scene.cameraToUseForPointers = camera;//this! https://forum.babylonjs.com/t/help-on-cameras-ui-and-scene-onpointerobservable/1160

////////////////////////////////////////////////////////////////////////////////////////
			
                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
                // Default intensity is 1. Let's dim the light a small amount
                light.intensity = 0.7;
                // Move the sphere upward 1/2 its height
                // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
                this.ground = new Ground_1.default(this.scene);
				          
				
				
						document.body.addEventListener('keypress', function(e) {
						  if (e.key == " ") {
													  _this.cores.forEach(function(el) {
													  $("#divSelectedItem").html(""); 
													el.deselect();
												});
													  _this.enemyUnits.forEach(function(el) {
 													el.deselect();
												});
						  }
						  
						   if (e.key == "+") {camera.radius-=5;
													if (camera.radius < 5)  {  camera.radius = 5;}

						  }
						   if (e.key == "-") {camera.radius+=5;
													if (camera.radius > 70)  {  camera.radius = 70;}
						  }
						});

				  $("#divSettingA").bind("click", function (event) { location.reload();   });
				  $("#divSettingB").bind("click", function (event) { self.Reset();  });
				  $("#divSettingC").bind("click", function (event) { 
  document.getElementById("modalHelp").style.display = "block";

				  });
				  $("#divSettingD").bind("click", function (event) {    
			//	  self.engine.switchFullscreen(true); 
				  var elem = document.getElementById("body");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }

				  });
 				
			
				  $("#divCastA").bind("click", function (event) {
					  
 
					 var playerABase =  self.getP1Base();
					 

					  if(self.aliveUnitCount(self.cores)>=12){$("#divSelectedItem").html("A max. of 10 (living) units are allowed.");return;}

					  if(p1Info.goldCount >=100 && typeof playerABase[0] !== "undefined" && playerABase.length >0){
 if(aICount == playerCount || (aICount == 1 &&  playerABase[0].isOwn==false )){$("#divSelectedItem").html("It's not your turn."); return;}

						  	 var core ;
						  if(playerABase[0].isOwn){  p1Info.goldCount-=100; core = new Core_1.default(_this.scene, true,false,1); }else{ p2Info.goldCount-=100;core = new Core_1.default(_this.scene, false,false,1); }
                     core.mesh.position =    new Vector3(playerABase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, playerABase[0] .mesh.position.z +  parseFloat("0." +self.getRndInteger(0,9).toString() ));//base loc (array item 0) alt:_this.cores[0].mesh.position.z
                     _this.cores.push(core);

					  }
					  else{$("#divSelectedItem").html("Not enough resources");}

				  });
				  $("#divCastB").bind("click", function (event) { 
					 var playerABase =  self.getP1Base();
					 					  if(self.aliveUnitCount(self.cores)>=12){$("#divSelectedItem").html("A max. of 10 (living) units are allowed.");return;}

				  					  if(p1Info.goldCount >=200 &&  typeof playerABase[0] !== "undefined" && playerABase.length >0){
 if(aICount == playerCount || (aICount == 1 &&  playerABase[0].isOwn==false )){$("#divSelectedItem").html("It's not your turn."); return;}

							  var core;
  						  if(playerABase[0].isOwn){  p1Info.goldCount-=200;core = new Core_1.default(_this.scene, true,false,2);  }else{ p2Info.goldCount-=200;core = new Core_1.default(_this.scene, false,false,2); }
									  
                    core.mesh.position =  new Vector3(playerABase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, playerABase[0].mesh.position.z + parseFloat("0." +self.getRndInteger(0,9).toString() ));//   new Vector3(-30, Common_1.default.defaultY, -20);//base loc
                     _this.cores.push(core);

									  }
					  else{$("#divSelectedItem").html("Not enough resources"); }

				  });
				  $("#divCastC").bind("click", function (event) { 
					 var playerABase =  self.getP1Base();
					 if(self.aliveUnitCount(self.cores)>=12){$("#divSelectedItem").html("A max. of 10 (living) units are allowed.");return;}

					  if(p1Info.goldCount >=300 &&  typeof playerABase[0] !== "undefined" && playerABase.length >0){
 if(aICount == playerCount || (aICount == 1 &&  playerABase[0].isOwn==false )){$("#divSelectedItem").html("It's not your turn."); return;}
					  var core ;  
  						  if(playerABase[0].isOwn){  p1Info.goldCount-=300;core = new Core_1.default(_this.scene, true,false,3);  }else{ p2Info.goldCount-=300;core = new Core_1.default(_this.scene, false,false,3); }

 					core.mesh.position = new Vector3(playerABase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY,playerABase[0].mesh.position.z + parseFloat("0." +self.getRndInteger(0,9).toString() ));//    new Vector3(-30, Common_1.default.defaultY, -20);//base loc
                     _this.cores.push(core);

					  }
					  else{$("#divSelectedItem").html("Not enough resources"); }

				  });
				  $("#divCastD").bind("click", function (event) { 
					 var playerABase =  self.getP1Base();
						 if(self.aliveUnitCount(self.cores)>=12){$("#divSelectedItem").html("A max. of 10 (living) units are allowed.");return;} 
					  if(p1Info.goldCount >=600 &&  typeof playerABase[0] !== "undefined" && playerABase.length >0){ 
 if(aICount == playerCount || (aICount == 1 &&  playerABase[0].isOwn==false )){$("#divSelectedItem").html("It's not your turn."); return;} 
										var core ;  
  						  if(playerABase[0].isOwn){  p1Info.goldCount-=600;core = new Core_1.default(_this.scene, true,false,4); }else{ p2Info.goldCount-=600;core = new Core_1.default(_this.scene, false,false,4); }
 					core.mesh.position = new Vector3( playerABase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, playerABase[0].mesh.position.z + parseFloat("0." +self.getRndInteger(0,9).toString() ));//    new Vector3(-30, Common_1.default.defaultY, -20);//base loc
                     _this.cores.push(core);

					  }
					  else{$("#divSelectedItem").html("Not enough resources"); }

				  });

 				var dblClickCounter=0;
				var dblClickTimeout;
				var isShiftSel=true;
                this.scene.onPointerDown = function(evt, pickResult) {  
										dblClickCounter+=1;
										var dblClickTimeout=setTimeout(function(){ dblClickCounter=0; }, 200); 
					 if (evt.button === 2 || dblClickCounter >= 2) {//https://www.html5gamedevs.com/topic/33340-gui-left-right-click-possible/
                    dblClickCounter=0;
					clearTimeout(dblClickTimeout);
						//cam follow
						var selCount=0;
					  _this.cores.filter(function(el) {
						  if(el.isSelected){
							  selCount+=1;
							  //camera.position.x = el.mesh.position.x;
						// camera.position.y =  el.mesh.position.y;
							camera.parent = el.mesh;}
							
                         }) 
						 ////
					//check for enemy targeted
                    for (var i = 0; i < _this.enemyUnits.length; i++) {
                        if (pickResult.pickedMesh === _this.enemyUnits[i].mesh) {
                            _this.cores.filter(function(el) {
                                return el.isSelected;
                            }).forEach(function(el) {
                              //  el.weapon.fire(el, _this.enemyUnits[i], _this.scene); // DISABLED FIRING 
                            self.addMoveCommand(pickResult.pickedPoint);// alt firing command (disable this if fire is desirable.
							  
							 
                            });
							
							 if(selCount>0){ // mesh selected
							
							  setTimeout(function(){ self.SwitchEnemiesFriendlies();		 }, 100);
							  }
                            return;
                        }
                    }
					
					
					//check for mines
                                    for (var i = 0; i < _this.minesUnits.length; i++) {
                        if (pickResult.pickedMesh === _this.minesUnits[i].mesh) {
                            _this.cores.filter(function(el) {
                                return el.isSelected;
                            }).forEach(function(el) {
                             self.addMoveCommand(pickResult.pickedPoint);  
							 
                            });
							
							 if(selCount>0){ // mesh selected
							 
							  setTimeout(function(){ self.SwitchEnemiesFriendlies();		 }, 100);
							  }
							  
                            return;
                        }
                    }
					

					
					
                    //check for ground hit
                    if (pickResult.pickedMesh === self.ground.mesh || pickResult.pickedMesh.id === "myResource" || pickResult.pickedMesh.id.indexOf( "boxFogOfWar") >-1) {
						
						if(selCount>0){ // mesh selected
						 
							  setTimeout(function(){ self.SwitchEnemiesFriendlies();		 }, 100);

							  					  }

                        //ground hit, now check if any units selected
                        if (self.cores.filter(function(item) {
                                return item.isSelected;
                            }).length) {
                            self.addMoveCommand(pickResult.pickedPoint);
                        }
                   
if(pickResult.pickedMesh.id === "myResource"){$("#divSelectedItem").html("Resources gathering");}
				   } else {
						
						  _this.cores.filter(function(el) {
                            return pickResult.pickedMesh !== el.mesh;
                        }).forEach(function(el) {
							 $("#divSelectedItem").html(""); 
                            el.deselect();
                        });
								  _this.enemyUnits.forEach(function(el) {
 										 el.deselect();
								 });

                        return;

					}
						return;
                    }

                    //ignore if not click
                    if (evt.button !== 0) {
                         return;
                    }
							//added manually
						var preventNextAction=true;
						_this.cores.filter(function(el) {
                            return pickResult.pickedMesh === el.mesh;
                        }).forEach(function(el) {
							
                          if(isShiftSel && el.isSelected){//setTimeout(function(){   el.deselect();}, 50);
						  preventNextAction=false;return;}//if true, selected one gets unselected 
						  
                        });
						
						if(preventNextAction){ $("#divSelectedItem").html("");}
var selUnitId=-1;
var selHostId=-1;
var selMineId=-1;
 if (  pickResult.pickedMesh.id === "myResource"  ) {
	 $("#divSelectedItem").html("Focus on a resource.");
	 return;
 }
                    //deselction of of other units if todo add to selection (shift
                    var isOwnUnitHit = _this.cores.some(function(el) {
						selUnitId=el.UnitID
                        return pickResult.pickedMesh === el.mesh;
                    });
					
					 _this.enemyUnits.some(function(el) {
						 setTimeout(function(){ 	 el.deselect();}, 50);
						 if(pickResult.pickedMesh === el.mesh){ 
						selHostId=el.UnitID
                        //return false; => give change to deselect others
						}
                    });

				_this.minesUnits.some(function(el) {
						 setTimeout(function(){ 	 el.deselect();}, 50);

						 if(pickResult.pickedMesh === el.mesh){
						selMineId=el.UnitID
                      //  return false;
						}
                    });
 
 
                    if (isOwnUnitHit && selUnitId !=-1 &&!preventNextAction) {							 
					if(selUnitId ==4){selUnitId =6;//queen
					}else if(selUnitId ==0){selUnitId =7;//king
					}
					$("#divSelectedItem").html("last selected unit (eyes): "  + selUnitId+"<br>"+"<img  class='infoImg'   src='static/images/units/v_"+selUnitId+".png' alt='infoImage'>");

                        if (evt.shiftKey) {
                            return; // the unit will select itself in the events manager
                        }
                        //desselect others
                        _this.cores.filter(function(el) {
                            return pickResult.pickedMesh !== el.mesh;
                        }).forEach(function(el) {
							
                          if(!isShiftSel){  el.deselect();}//if false, only one item get selected
						  
                        });
						
                         return;
                    }  
					else if(selHostId !=-1){ 
 										if(selHostId ==4){selHostId =6;//queen
					}else if(selHostId ==0){selHostId =7;//king
					}

					$("#divSelectedItem").html("Focus on hostile unit (eyes): "  + selHostId +"<br>"+"<img  class='infoImg'   src='static/images/units/v_"+selHostId+".png' alt='infoImage'>");} 
					else if(selMineId !=-1){ 
 					$("#divSelectedItem").html("Mine focused. Bad idea!"+"<br>"+"<img  class='infoImg'   src='static/images/units/v_chess_zero.png' alt='infoImage'>");} 

                
                };
                // Skybox
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 750.0, this.scene);
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.emissiveColor = new BABYLON.Color3(0, 0.0, 0.0);
                skybox.material = skyboxMaterial;
				
            }; 
			
			Game.prototype.SwitchEnemiesFriendlies= function(isSkipWhoIncrease)
			{
				if(isTurnBased && !isSkipWhoIncrease){  Who+=1;
							  if(Who> playerCount -1)
							  {
								  Who=0;
							  }}
				if(aICount == playerCount || aICount==0){ // in this case no player 3 and 4, so no different equation required.
			
			var tempFriends= self.cores;
				var tempFiends= self.enemyUnits;
				self.enemyUnits=[];
								self.cores=[];

				self.enemyUnits = tempFriends;
				 self.cores = tempFiends;
				 
				 $("#divSelectedItem").html("");					

				 				var playerABase=  self.getP1Base(); 
				if(  typeof playerABase[0] !=="undefined" && playerABase.length >-1){
				   camera.parent = playerABase[0].mesh;
					}
					

}
			if(isTurnBased){	$("#info").append("<br>Player "+(Who+1).toString()+" turn<br>");}

			}
			 Game.prototype.aiActions = function( ) {
				 clearInterval(aiActionsInterval);
				 
			 if(aICount >0){
				aiActionsInterval= setInterval(function(){ 
				console.log(Who);
				 				 if(aICount < playerCount && isTurnBased && Who !=1){ return;}

				var enemyBase=self. getEnemyBase();  
				
				var playerABase=  self.getP1Base();
				
				if(typeof enemyBase[0] !=="undefined" && enemyBase.length >-1 && typeof playerABase[0] !=="undefined" && playerABase.length >-1){
					
									var eyesOneCount=self.getUnitsById(self.enemyUnits,1);
								var eyesTwoCount=self.getUnitsById(self.enemyUnits,2);
				var eyesThreeCount=self.getUnitsById(self.enemyUnits,3);
				var eyesSixCount=self.getUnitsById(self.enemyUnits,4);

									var eyesOneCountP1=self.getUnitsById(self.cores,1);
								var eyesTwoCountP1=self.getUnitsById(self.cores,2);
				var eyesThreeCountP1=self.getUnitsById(self.cores,3);
				var eyesSixCountP1=self.getUnitsById(self.cores,4);
				var pawnP1=self.getUnitsById(self.cores,5);
 
				  if(self.aliveUnitCount(self.enemyUnits)<12){
				     if(p2Info.goldCount > 100 &&eyesOneCount.length <4||eyesSixCount.length >=2)
				  {
					   var Nunit  ; 
					   if(enemyBase[0].isOwn  ){Nunit = new Core_1.default(self.scene, true,false,1); p1Info.goldCount -= 100;}else{ Nunit = new Core_1.default(self.scene, false,false,1);p2Info.goldCount -= 100;}
                    Nunit.mesh.position = new Vector3(enemyBase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, enemyBase[0].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ));
                    self.enemyUnits.push(Nunit);

				  }
				 /*  else  if(p2Info.goldCount > 200 &&eyesTwoCount.length <1)//needed?
				  { 
					   var Nunit;
					   if(enemyBase[0].isOwn  ){Nunit = new Core_1.default(self.scene, true,false,2);  p1Info.goldCount -= 200;}else{Nunit = new Core_1.default(self.scene, false,false,2); p2Info.goldCount -= 200;}					   
                    Nunit.mesh.position = new Vector3(enemyBase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, enemyBase[0].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ));
                    self.enemyUnits.push(Nunit);

				  }*/
				   else  if(p2Info.goldCount > 300 &&eyesThreeCount.length <3)
				  { 
					   var Nunit ; 
					   if(enemyBase[0].isOwn  ){Nunit = new Core_1.default(self.scene, true,false,3);  p1Info.goldCount -= 300;}else{ Nunit = new Core_1.default(self.scene, false,false,3); p2Info.goldCount -= 300;}					   
                    Nunit.mesh.position = new Vector3(enemyBase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, enemyBase[0].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ));
                    self.enemyUnits.push(Nunit);

				  }
				  else if(p2Info.goldCount > 600&&eyesSixCount.length <2)
				  { 
					   var Nunit ;
					   if(enemyBase[0].isOwn  ){Nunit = new Core_1.default(self.scene, true,false,4);  p1Info.goldCount -= 600;}else{Nunit = new Core_1.default(self.scene, false,false,4); p2Info.goldCount -= 600;}					   
                    Nunit.mesh.position = new Vector3(enemyBase[0].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, enemyBase[0].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ));
                    self.enemyUnits.push(Nunit);

				  }
				//  console.log("Enemy units:"+self.enemyUnits.length);
				}
					var eyesOneLoopedCount= 0;
					
				    for (var i = 0; i < self.enemyUnits.length; i++) {
						if (isTurnBased)
						{
							i = self.getRndInteger(0,self.enemyUnits.length)
						}
						var dumarray=[];  
						if(typeof  self.enemyUnits[i].mesh ==="undefined" || self.enemyUnits[i].UnitID==-1){continue;}// in renderloop initially splice the item. This causes crashes (async handling). So items are kept for now, but not handled.
						
						dumarray.push(self.enemyUnits[i]); // I choose to handle each unit seperately, but all selection is possible (and needed in some cases).
						
						if(self.enemyUnits[i].UnitID==5){ 
														  if(eyesSixCountP1.length >0){
								  self.addAiMoveCommand(dumarray,eyesSixCountP1[0].mesh.position);
								  } else if (playerABase.length >0)
								  {
								 	 self.addAiMoveCommand(dumarray,playerABase[0].mesh.position);
  
								  }
								  else 	 // gather

								  {
									  // no else possible here
								  }
						}
							if(self.enemyUnits[i].UnitID==2){ 
														  if(eyesOneCountP1.length >0){
								  self.addAiMoveCommand(dumarray,eyesOneCountP1[0].mesh.position);
								  } else   if(eyesTwoCountP1.length >0){

 									 self.addAiMoveCommand(dumarray,eyesTwoCountP1[0].mesh.position);
  
								  }
								  else 	 // gather

								  {
							var resourcePos=  new Vector3(self.resourceUnits[2].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[2].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable
 							if(self.enemyUnits[i].WhoThis ==0)
							{
							   resourcePos=  new Vector3(self.resourceUnits[3].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[3].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable

							}
							self.addAiMoveCommand(dumarray,resourcePos);//or resourceUnits[0]
								  }
						}
							if(self.enemyUnits[i].UnitID==3){ 
											  if(eyesTwoCountP1.length >0){

 									 self.addAiMoveCommand(dumarray,eyesTwoCountP1[0].mesh.position);
  
								  } 	   else if(eyesOneCountP1.length >0){
								  self.addAiMoveCommand(dumarray,eyesOneCountP1[0].mesh.position);
								  }  
								   else   if(eyesThreeCountP1.length >0){

 									 self.addAiMoveCommand(dumarray,eyesThreeCountP1[0].mesh.position);
  
								  }
								  else 	 // gather

								  {
							var resourcePos=  new Vector3(self.resourceUnits[2].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[2].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable
 							if(self.enemyUnits[i].WhoThis ==0)
							{
							   resourcePos=  new Vector3(self.resourceUnits[3].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[3].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable

							}
							self.addAiMoveCommand(dumarray,resourcePos);//or resourceUnits[0]
								  }
						}
						if(self.enemyUnits[i].UnitID==4){ 
									   if(eyesThreeCountP1.length >0){

 									 self.addAiMoveCommand(dumarray,eyesThreeCountP1[0].mesh.position);
  
								  }
									else if(eyesTwoCountP1.length >0){

 									 self.addAiMoveCommand(dumarray,eyesTwoCountP1[0].mesh.position);
  
								  } 	   else if(eyesOneCountP1.length >0){
								  self.addAiMoveCommand(dumarray,eyesOneCountP1[0].mesh.position);
								  }  
								    else if(eyesSixCountP1.length >0){
								  self.addAiMoveCommand(dumarray,eyesSixCountP1[0].mesh.position);
								  }  
								  else 	 // gather

								  {
							var resourcePos=  new Vector3(self.resourceUnits[3].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[3].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable
 							  							if(self.enemyUnits[i].WhoThis ==0)
							{
							   resourcePos=  new Vector3(self.resourceUnits[2].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[2].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable

							}

							 self.addAiMoveCommand(dumarray,resourcePos);//or resourceUnits[0]
								  }
						}
						else if(self.enemyUnits[i].UnitID==0){
							var resourcePos=  new Vector3(self.resourceUnits[0].mesh.position.x- 0.5, Common_1.default.defaultY, self.resourceUnits[0].mesh.position.z);// not on 0 point, otherwise not attackable
                              	if(self.enemyUnits[i].WhoThis ==0)
							{
                    resourcePos=  new Vector3(self.resourceUnits[1].mesh.position.x- 0.5, Common_1.default.defaultY, self.resourceUnits[1].mesh.position.z);// not on 0 point, otherwise not attackable
  
							  }
							  self.addAiMoveCommand(dumarray,resourcePos);//or resourceUnits[3]
						}
							else if(self.enemyUnits[i].UnitID==1){
								if( eyesOneLoopedCount <3){
								//	 var resourcePos=  new Vector3(self.resourceUnits[3].mesh.position.x+ 0.5, Common_1.default.defaultY, self.resourceUnits[3].mesh.position.z);// not on 0 point, otherwise not attackable
							var resourcePos=  new Vector3(self.resourceUnits[3].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[3].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable
 							  							if(self.enemyUnits[i].WhoThis ==0)
							{
							   resourcePos=  new Vector3(self.resourceUnits[1].mesh.position.x+ parseFloat("0." +self.getRndInteger(0,9).toString() ), Common_1.default.defaultY, self.resourceUnits[1].mesh.position.z+ parseFloat("0." +self.getRndInteger(0,9).toString() ) );// not on 0 point, otherwise not attackable

							}

							 self.addAiMoveCommand(dumarray,resourcePos);//or resourceUnits[0]
							  
							   eyesOneLoopedCount+=1;

							  }
							  else{//start hunting
								  if(pawnP1.length    >0){
								  self.addAiMoveCommand(dumarray,pawnP1[0].mesh.position);
								  } 
							  }
						}
						
						if (isTurnBased)
						{
							break;
						}
                     }
				
self.SwitchEnemiesFriendlies(); }
				 }, 3000); // ai action once in 3 sec atm (switching ai in aivsai mode).
				 

				
}
				  };

				  Game.prototype. getRndInteger=function(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

				  Game.prototype.defaultSinglePlayerGame  = function(skipDecor, mines) {
					  if(!skipDecor){
					   var spriteManagerTrees = new BABYLON.SpriteManager("trees", "static/images/decor/tree.png", 1000, 400, this.scene);	

            for (var i = 0; i < 1000; i++) {
               var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
               tree.position.x = Math.random() * 100 - 50;
               tree.position.z = Math.random() * 100 - 50;
			    tree.position.y = 0.2;

               tree.isPickable = true;

               //Some "dead" trees
               if (Math.round(Math.random() * 5) === 0) {
                  tree.angle = Math.PI * 90 / 180;
                  tree.position.y = -0.3;
               }
            }
 
           spriteManagerTrees.isPickable = true;
		   }
				self.Weather(isWithFogOfWar,isWithWeatherEffect);
					  
					  
					  
					  if(mines)
					  {
						   for (var i = 0; i < self.getRndInteger(0,16); i++) {
                    var mine = new Core_1.default(self.scene, false,false,6);
                    mine.mesh.position = new Vector3(self.getRndInteger(-25,25), Common_1.default.defaultY,self.getRndInteger(-15,15));
                     self.minesUnits.push(mine);
					 					                    mine.planeSprite.material.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.8);
                    mine.planeSprite.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

                } 
						  
					  }
					  /* var base = new Base_1.default(this.scene, true);
                base.mesh.position = new Vector3(-30, Common_1.default.defaultY, -20);
                this.cores.push(base);*/

				 var res = new Resource_1.default(this.scene, true);// closest to p2
                res.mesh.position = new Vector3(30, Common_1.default.defaultY, 30);
				this.resourceUnits.push(res);

				 var res1 = new Resource_1.default(this.scene, true);
                res1.mesh.position = new Vector3(-34, Common_1.default.defaultY, -30);
				this.resourceUnits.push(res1);

				 var res2 = new Resource_1.default(this.scene, true);
                res2.mesh.position = new Vector3( 34, Common_1.default.defaultY, -30);
				this.resourceUnits.push(res2);

				 var res3 = new Resource_1.default(this.scene, true);
                res3.mesh.position = new Vector3(-30, Common_1.default.defaultY, 30);// close  to p2
				this.resourceUnits.push(res3);

			//	 var resCenter = new Resource_1.default(this.scene, true);
             //   resCenter.mesh.position = new Vector3(-0, Common_1.default.defaultY, 0);
				//this.resourceUnits.push(resCenter);
				
				                 self.cores = self.createInitialPlayerUnits();

                self.setUpDummyEnemys();

 				if(isTurnBased){
				   Who= self.getRndInteger(0,2); // set startplayer

 
  }


self.collTime=0;

					 var playerABase;
					 if(Who==1){		self.SwitchEnemiesFriendlies(true);	 }else{
						if(isTurnBased){ $("#info").html("Player " +(parseInt(Who)+1).toString()+" turn");}
						 }
 playerABase =  self.getP1Base();
                this.centerOfMass = new CenterOfMassMarker_1.default(this.scene, true);
                this.centerOfMass.mesh.position = Formations_ts_1.default.getCentroid(this.cores);


					  if ( typeof playerABase[0] !== "undefined" && playerABase.length >0){ 
  camera.parent = playerABase[0].mesh;
   //camera.dispose();camera = new BABYLON.ArcRotateCamera("Camera1", 0, 0, 10, new BABYLON.Vector3(0, 15, -40), this.scene);

			}	};

            Game.prototype.Reset = function() {
				self.collTime=0;
				 camera.parent = null;

				self.winningWho=-1;
				
				self.enemyUnits.filter(function(unit) {unit.UnitID=-1;unit.explode();});
				 self.cores.filter(function(unit) {unit.UnitID=-1;unit.explode();});
				 self.resourceUnits.filter(function(unit) {unit.UnitID=-1;unit.explode();});
				 self.minesUnits.filter(function(unit) {unit.UnitID=-1;unit.explode();});

				self.cores=[];
				 self.enemyUnits=[];
				  self.resourceUnits = [];
				  self.minesUnits=[];
				  
  p1Info=	playerObject(0, 0, []);  
  p2Info=	playerObject(1, 0, []);
  p3Info=	playerObject(2, 0, []);
  p4Info=	playerObject(3, 0, []);

	 $("#pGold").html("<span style='color:steelblue;background-color:black;'> &#128794;"+p1Info.goldCount.toString() +"</span><br>"+ "<span style='color:indianred;background-color:black;'>&#128794;"+p2Info.goldCount.toString()+"</span>");
	 $("#guide").html("" );
	  $("#divSelectedItem").html(""); 

				 self.scene.meshes.forEach(function(m) {
				//	if(m.id.indexOf("sphere_") >-1){
						if(m.id.indexOf("boxFogOfWar") >-1){
						m.dispose();
					}
					
				}); 
				
					self.isKingP1Defeated=false;
				self.isKingP2Defeated=false;
				self.isPawnP1Defeated=false;
				self.isPawnP2Defeated=false;
				
				if(typeof self.particleSystem !== "undefined"){
				self.particleSystem.dispose();}

			self.defaultSinglePlayerGame(true,isWithMines);
					};
            //todo from mouse/keyboard
            Game.prototype.addMoveCommand = function(pickResult) {
                console.log(pickResult);
                var selectedUnits = this.cores.filter(function(unit) {
                    return unit.isSelected;
                });
                var formation = Formations_ts_1.default.circularGrouping(selectedUnits.length, pickResult);
                for (var i = 0; i < selectedUnits.length; i++) {
                    var unit = selectedUnits[i];
                    //pythagoras
                    var distance = Math.sqrt(Math.pow(pickResult.x - unit.mesh.position.x, 2) + Math.pow(pickResult.z - unit.mesh.position.z, 2));
					if( isNaN(distance)|| typeof distance === "undefined"){continue;}//object is killed
                    var framesNeeded = Math.round((distance / Common_1.default.MEDIUM_SPEED) * Common_1.default.ANIMATIONS_FPS)+1;// added a +1 frame (otherwise some items dissapear visually).
                     if(isTurnBased)
				   {
					    framesNeeded =framesNeeded/10; 
				   }
				   console.log('dist: ' + distance + ' frames' + framesNeeded);
                    var animationBezierTorus = new BABYLON.Animation("animationCore", "position", Common_1.default.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    var keysBezierTorus = [];
                   
				   keysBezierTorus.push({
                        frame: 0,
                        value: new BABYLON.Vector3( unit.mesh.position.x, 1, unit.mesh.position.z, 1, BABYLON.Space.WORLD)  //unit.mesh.position
                    });
                    keysBezierTorus.push({
                        frame: framesNeeded,
                        value:new BABYLON.Vector3( formation[i].x, 1, formation[i].z, 0.3, BABYLON.Space.WORLD)  // unit.mesh.position = formation[i]  => no heights
                    });
                    animationBezierTorus.setKeys(keysBezierTorus);
                    // var bezierEase = new BABYLON.BezierCurveEase(0.445, 0.05, 0.55, 0.95);
                    //animationBezierTorus.setEasingFunction(bezierEase);
                    unit.mesh.animations.push(animationBezierTorus);
                    this.scene.beginAnimation(unit.mesh, 0, framesNeeded, true);
                };
                //todo investigate queued commands
            };
			 Game.prototype.aliveUnitCount = function(list ) {
 				return	list.filter(function(unit) {
                 return  unit.UnitID >-1;
                }).length; 
				
 				}
 				 Game.prototype.getP1Base = function( ) {
 					var playerABase=  self.cores.filter(function(unit) {
                 return  unit.UnitID ==0;
                }); 
				
				return playerABase;
				}
				
  				 Game.prototype.getEnemyBase = function( ) {
				var enemyBase=self.enemyUnits.filter(function(unit) {
                 return  unit. UnitID ==0;
                });
				 return enemyBase;

				}
				 Game.prototype.getUnitsById = function(list,id ) {
				var feed=list.filter(function(unit) {
                 return  unit. UnitID ==id;
                });
				 return feed;

				}
			 Game.prototype.addAiMoveCommand = function(selectedUnits,pickResult) {
                 
                var formation = Formations_ts_1.default.circularGrouping(selectedUnits.length, pickResult);
				
                for (var i = 0; i < selectedUnits.length; i++) {
					

                    var unit = selectedUnits[i];
                    //pythagoras
                    var distance = Math.sqrt(Math.pow(pickResult.x - unit.mesh.position.x, 2) + Math.pow(pickResult.z - unit.mesh.position.z, 2));
					if( isNaN(distance)|| typeof distance === "undefined"){continue;}//object is killed                  
				  var framesNeeded = Math.round((distance / Common_1.default.MEDIUM_SPEED) * Common_1.default.ANIMATIONS_FPS)+1; // added a +1 frame (otherwise some items dissapear visually).
                   if(isTurnBased)
				   {
					    framesNeeded =framesNeeded/10; 
				   }
				   console.log('dist: ' + distance + ' frames' + framesNeeded);
                    var animationBezierTorus = new BABYLON.Animation("animationCore", "position", Common_1.default.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    var keysBezierTorus = [];
                   
				   keysBezierTorus.push({
                        frame: 0,
                        value: new BABYLON.Vector3( unit.mesh.position.x, 1, unit.mesh.position.z, 1, BABYLON.Space.WORLD)  //unit.mesh.position
                    });
                    keysBezierTorus.push({
                        frame: framesNeeded,
                        value:new BABYLON.Vector3( formation[i].x, 1, formation[i].z, 0.3, BABYLON.Space.WORLD)  // unit.mesh.position = formation[i]  => no heights
                    });
                    animationBezierTorus.setKeys(keysBezierTorus);
                    // var bezierEase = new BABYLON.BezierCurveEase(0.445, 0.05, 0.55, 0.95);
                    //animationBezierTorus.setEasingFunction(bezierEase);
                    unit.mesh.animations.push(animationBezierTorus);
                    this.scene.beginAnimation(unit.mesh, 0, framesNeeded, true);
                };
                //todo investigate queued commands
            };
			
			Game.prototype.Weather=function (isWithFog,isWithRainFall){
				if(isWithFog){
 // - pos
					 var  boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3(0, 0, 10) 
						//boxFogOfWar.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
						boxFogOfWar.visibility=false;
						
						 					    boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3(0, 0, 0) 
					 	boxFogOfWar.visibility=false;

 					    boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3(0, 0, -10) 
						boxFogOfWar.visibility=false;
 
 // | pos
  					    boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3(-10, 0,  0) 
						boxFogOfWar.visibility=false;
         boxFogOfWar.rotate(BABYLON.Axis.Y, 1.57, BABYLON.Space.WORLD);
 
   					    boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3( 10, 0,  0) 
						boxFogOfWar.visibility=false;
         boxFogOfWar.rotate(BABYLON.Axis.Y, 1.57, BABYLON.Space.WORLD);

   					    boxFogOfWar = BABYLON.MeshBuilder.CreatePlane("boxFogOfWar" +uuidv4() , {height: 1.1, width: 3000.1, depth: 0.1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, this.scene); 
                     boxFogOfWar.position= new Vector3( 0, 0,  0) 
						boxFogOfWar.visibility=false;
         boxFogOfWar.rotate(BABYLON.Axis.Y, 1.57, BABYLON.Space.WORLD);


				 this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        this.scene.fogDensity =(0.001*10)*6 ;//0.02 is nice => * 6 == amount of lines (see above) * 5 => quite misty in start
        this.scene.fogColor = new BABYLON.Color3(0.4, 0.9, 0.5);//la vie en rose: new BABYLON.Color3(10.9, 0.9, 0.85);
}

if(isWithRainFall){
// weather REF: https://www.babylonjs-playground.com/#10XN2J#8 ///////////////////////////////////////
            // Create & launch a particule system
            this.particleSystem = new BABYLON.ParticleSystem("spawnParticles", 3600, this.scene);    // 3600 particles to have a continue effect when computing circle positions
            this.particleSystem.particleTexture = new BABYLON.Texture("static/images/particles/flare.png", this.scene);
            this.particleSystem.color1 = new BABYLON.Color4(.9, .9, .95, 1.0);
            this.particleSystem.color2 = new BABYLON.Color4(0.2, 0.2, .3, .5);
            this.particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
            this.particleSystem.emitter = new BABYLON.Vector3(0, 20, 0);
            this.particleSystem.minSize = 0.1;
            this.particleSystem.maxSize = 0.5;// this!!
            this.particleSystem.emitRate = 500;
            this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;     // to manage alpha
            this.particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
            //this.particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
            //this.particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
            this.particleSystem.minEmitPower = -10;
            this.particleSystem.maxEmitPower = -100;
            //this.particleSystem.updateSpeed = 0.1;
        
            var radius = 150;
        
            // Custom function to get the circle effect
            this.particleSystem.startPositionFunction = function(worldMatrix, positionToUpdate)
            {
                var rndAngle = 2 * Math.random() * Math.PI;
                var randX = Math.random() *radius * Math.sin(rndAngle);
                var randY = this.minEmitBox.y;
                var randZ = Math.random() *radius * Math.cos(rndAngle);
                
                BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
            }
			
			
            this.particleSystem.updateFunction = function(particles) {

        for (var index = 0; index < particles.length; index++) {
            var particle = particles[index];
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                this.recycleParticle(particle);
                index--;
                continue;
            }
            else {
                particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
                particle.color.addInPlace(this._scaledColorStep);
                if (particle.color.a < 0)
                    particle.color.a = 0;
                particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
                particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle.position.addInPlace(this._scaledDirection);
                this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                particle.direction.addInPlace(this._scaledGravity);
                 
             }
        }
            };

 
            // Start
            this.particleSystem.start();
 				
				}
			};
            Game.prototype.createInitialPlayerUnits = function() {
                //var cores = Array<IGameUnit>;
                var cores = [];
				
												
				/* var base = new Base_1.default(this.scene, true); 
                base.mesh.position = new Vector3(-30, Common_1.default.defaultY, -20);
                 cores.push(base);*/
				      var base = new Core_1.default(this.scene, true,true,0); 
                    base.mesh.position = new Vector3(-26, Common_1.default.defaultY, -26);
                     cores.push(base);

                for (var i = 0; i < this.startingNumberOfCores; i++) {
                    var core = new Core_1.default(this.scene, true);
                    core.mesh.position = new Vector3(-23, Common_1.default.defaultY, -23);
                     cores.push(core);
                }
				/*
				 for (var i = 0; i < this.startingNumberOfCores; i++) {
                    var core = new Core_1.default(this.scene, true,false,2);//new Core_2.default(this.scene, true,false,2);
                    core.mesh.position.y = Common_1.default.defaultY;
                     cores.push(core);
                }
				
					 for (var i = 0; i < this.startingNumberOfCores; i++) {
                    var core = new Core_1.default(this.scene, true,false,3);
                    core.mesh.position.y = Common_1.default.defaultY;
                     cores.push(core);
                }
					 for (var i = 0; i < this.startingNumberOfCores; i++) {
                    var core = new Core_1.default(this.scene, true,false,4);
                    core.mesh.position.y = Common_1.default.defaultY;
                     cores.push(core);
                }*/
				

				
				      var pawn = new Core_1.default(this.scene, true,true,5); 
                    pawn.mesh.position = new Vector3(-20, Common_1.default.defaultY, -20);
                     cores.push(pawn);

				
                return cores;
            };
            Game.prototype.setUpDummyEnemys = function() {
								
				/*var base = new Base_1.default(this.scene, false); 
                base.mesh.position = new Vector3(11, Common_1.default.defaultY, 2);
                this.enemyUnits.push(base);*/

				      var base = new Core_1.default(this.scene, false,false,0); 
                    base.mesh.position = new Vector3(26, Common_1.default.defaultY, 26);
                    this.enemyUnits.push(base);

                var core = new Core_1.default(this.scene, false);
                core.mesh.position = new Vector3(23, Common_1.default.defaultY, 23);
                this.enemyUnits.push(core);/*
                var core2  = new Core_1.default(this.scene, false,false,2);
                core2.mesh.position = new Vector3(11, Common_1.default.defaultY, 11);
                this.enemyUnits.push(core2);
				 var core3  = new Core_1.default(this.scene, false,false,3);
                core3.mesh.position = new Vector3(11, Common_1.default.defaultY, 8);
                this.enemyUnits.push(core3);*/

				      var pawn = new Core_1.default(this.scene, false,false,5); 
                    pawn.mesh.position = new Vector3(20, Common_1.default.defaultY, 20);
                    this.enemyUnits.push(pawn);

		 	self.aiActions( );
			
            };
            return Game;
        })();
        //start up the game
        new Game();


        /***/
    },
    /* 2 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
        var Laser_1 = __webpack_require__(4);
        /**
         *
         * Controllable unit
         */
        //todo team colours, friendlies
        var Core = (function() {
            /**
             *
             * @param scene
             * @param isOwn
             * @param isSelected
             */
            function Core(scene, isOwn, isSelected, uID) {
                if (isSelected === void 0) {
                    isSelected = false;
                }
                this.isSelected = false; //selected units can receive new commands
                this.hitPoints = 10;
                this.baseSpeed = Common_1.default.MEDIUM_SPEED;
                this.weapon = new Laser_1.default();
                this.mass = 1;
                this.mesh = BABYLON.Mesh.CreateSphere("sphere_"+uuidv4(), 8, Common_1.default.MEDIUM_UNIT_SIZE, scene);
                // this.mesh.parentClass = this;
                this.isSelected; //selected units receive commands
                this.modifiers = []; //powerups,shields etc
                this.isOwn = isOwn;
				 this.mesh.isOwn = isOwn;				
                this.material = new BABYLON.StandardMaterial("green", scene);
				
				if(typeof uID === "undefined"){uID=1;}
				
									 this.UnitID=uID;
					 this.planeSprite = new BABYLON.MeshBuilder.CreatePlane("myPlane_"+uuidv4(), {width: 1, height: 1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
					   this.planeSprite.material = new BABYLON.StandardMaterial("myPlanemat_"+uuidv4(), scene);
					   this.planeSprite.material.diffuseTexture= new BABYLON.Texture("static/images/units/v_blanco_tiny.png", scene);
					   this.planeSprite.parent= this.mesh;
					   	this.planeSprite.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;//REF:https://www.html5gamedevs.com/topic/25381-how-to-make-mesh-face-camera/

			  this.mesh .visibility = false;
			  
			if(this.UnitID ==0){  this.planeSprite.rotation.z=-3.15;}  //king. Alt. from using the apart Base object (more streamlined).
			if(this.UnitID ==1){this.planeSprite.rotation.z= 2.35;} //horse
			else  if(this.UnitID ==2){ this.planeSprite.rotation.z=-0.8;} //bishop
			else  if(this.UnitID ==3){this.planeSprite.rotation.z=0.8;} //rook
			else  if(this.UnitID ==4){this.planeSprite.rotation.z=-2.35; } //queen
		//	else  if(this.UnitID ==5){this.planeSprite.rotation.z=-3.15;}//simple pawn base has this rotation
			else  if(this.UnitID ==6){ this.planeSprite.material.diffuseTexture= new BABYLON.Texture("static/images/units/v_chess_zero.png", scene);this.mesh.id="mine"+uuidv4()}// MINE
            else  if(this.UnitID ==7){ this.planeSprite.material.diffuseTexture= new BABYLON.Texture("static/images/units/v_chess_zero.png", scene);//alt:v_chess_zero_Rotated
			this.planeSprite.rotation.z=-0.8;} // GOLD
			
			if (isOwn) {
				this.WhoThis=0;
                    this.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
					
					                    this.planeSprite.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                    this.planeSprite.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);

                } else {
					this.WhoThis=1;
                    this.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
					
					                    this.planeSprite.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
                    this.planeSprite.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

                }
                // this.material.emissiveColor = BABYLON.Color3.Green();
                this.mesh.material = this.material;
                this.mesh.actionManager = new BABYLON.ActionManager(scene);
                //show bounding box for selected elements
                this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, this.select.bind(this)));//initial:OnPickTrigger
                //show user where mouse is hovering over
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh.material, "diffuseColor", BABYLON.Color3.White()));
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh.material, "diffuseColor", this.material.diffuseColor));
            }
            Core.prototype.select = function(e) {
				if(this.isSelected){this.deselect();}else{
                this.isSelected = true;
                e.meshUnderPointer.showBoundingBox = true;
												this.planeSprite.showBoundingBox = true;}

            };
            Core.prototype.deselect = function() {
                this.isSelected = false;
                this.mesh.showBoundingBox = false;
												this.planeSprite.showBoundingBox = false;

            };
            Core.prototype.currentSpeed = function() {
                //todo speed modifiers
                return this.baseSpeed;
            };
            Core.prototype.takeDamage = function(damage) {
                this.hitPoints -= damage;
                if (this.hitPoints < 1) {
                    this.explode();
                }
            };
            /**
             * Removes mesh
             * //todo expode graphics + hitpoints
             */
            Core.prototype.explode = function() {
				this.deselect();
                this.mesh.dispose();
				 this.planeSprite.dispose();

            };
            return Core;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Core;


        /***/
    },
    /* 3 */
    /***/
    function(module, exports) {

        /**
         * Stuff that's shared among a lot of things in this game
         */
        var Common = (function() {
            function Common() {}
            Common.defaultY = 1; // presently all the objects are on the same horizontal plane
            Common.MEDIUM_UNIT_SIZE = 1;
            Common.MEDIUM_SIZE_MAP = 80;
            Common.MEDIUM_SIZE_MAP_SUBDIVISIONS = 40;
            Common.MEDIUM_SPEED = 3;
            Common.ANIMATIONS_FPS = 30; //this is distance units per second
            return Common;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Common;
        exports.KEYS = {
            BACKSPACE: 8,
            TAB: 9,
            RETURN: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
            HOME: 36,
            END: 35,
            PAGEUP: 33,
            PAGEDOWN: 34,
            INSERT: 45,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            A: 65,
            L: 76,
            P: 80,
            Q: 81,
            TILDA: 192
        };


        /***/
    },
    /* 4 */
    /***/
    function(module, exports, __webpack_require__) {

        var WeaponModifier_1 = __webpack_require__(5);
        var Formations_1 = __webpack_require__(6);
        var Common_1 = __webpack_require__(3);
        /**
         * Fires a laser from one game object to another
         *
         * For simplicity it fires and renders instantly(speed of light) and remains 1 second afterglow
         *
         * //todo add range dependant laser damage for lasers that diffuse through area like this one
         */
        var Laser = (function() {
            function Laser() {
                this.initialDamage = 5;
                this.weaponModifier = new WeaponModifier_1.default();
            }
            /**
             * Fires laser from one unit to another
             * @param from
             * @param to
             */
            Laser.prototype.fire = function(from, to, scene) {
                //todo apply damage to target
                to.takeDamage(this.initialDamage);
                var distance = Formations_1.default.Distance2D(from.mesh.position, to.mesh.position);
                var mesh = BABYLON.Mesh.CreateCylinder("cylinder", distance, 0.02, 0.2, 36, 2, scene, true);
                mesh.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));
                mesh.position = from.mesh.position;
                var v1 = from.mesh.position.subtract(to.mesh.position);
                v1.normalize();
                var v2 = new BABYLON.Vector3(0, 1, 0);
                // Using cross we will have a vector perpendicular to both vectors
                var axis = BABYLON.Vector3.Cross(v1, v2);
                axis.normalize();
                console.log(axis);
                // Angle between vectors
                var angle = BABYLON.Vector3.Dot(v1, v2);
                console.log(angle);
                // Then using axis rotation the result is obvious
                mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, -Math.PI / 2 + angle);
                var material = new BABYLON.StandardMaterial("green", scene);
                material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                material.emissiveColor = BABYLON.Color3.Green();
                mesh.material = material;
                var animationFadeOut = new BABYLON.Animation("animationCore", "position", Common_1.default.ANIMATIONS_FPS, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
              
 			   
			  /*    var keys = [];
                    keys.push({frame: 0, value: 1});
	        
                    keys.push({
                      frame: Common.ANIMATIONS_FPS * 2, //fade lasting n seconds
                      value: 0
                    });*/
                // animationFadeOut.setKeys(keys);
                //  scene.beginAnimation(material.alpha, 0, Common.ANIMATIONS_FPS * 21,true,1, ()=> mesh.dispose());
                return;
            };
            return Laser;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Laser;


        /***/
    },
    /* 5 */
    /***/
    function(module, exports) {

        /**
         * Modifies the stats of a weapon
         */
        var WeaponModifier = (function() {
            function WeaponModifier() {
                this.DamageAddition = 0;
                this.DamageMultiplier = 1;
            }
            return WeaponModifier;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = WeaponModifier;


        /***/
    },
    /* 6 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
        var Vector3 = BABYLON.Vector3;
        var Formations = (function() {
            function Formations() {}
            /**
	     * returns array of vector3 on the edge of a circle equally spaced around a given point
	  
	     * @param amount
	     * @param center
	     * @param spacing
	     * @returns {Array<Vector3>}
	     */
            Formations.circularGrouping = function(amount, center, spacing) {
                if (spacing === void 0) {
                    spacing = 1;
                }
                if (amount < 1) {}
                var arr = [];
                if (amount === 1) {
                    arr.push(center);
                    return arr;
                }
                for (var i = 0; i < amount; i++) {
                    var angleDeg = i * (360 / amount);
                    var angleRad = (angleDeg / 360) * 2 * Math.PI;
                    var customVector = new BABYLON.Vector3(-Math.cos(angleRad) * spacing, Common_1.default.defaultY * spacing, -Math.sin(angleRad) * spacing);
                    arr.push(center.add(customVector));
                }
                return arr;
            };
            /**
             * Gets centroid (center of mass) of units
             * @param units
             * @returns {BABYLON.Vector3}
             */
            Formations.getCentroid = function(units) {
                var totalMass = 0;
                var totalX = 0;
                var totalZ = 0;
                units.forEach(function(unit) {
                    totalMass += unit.mass;
                    totalX += unit.mesh.position.x * unit.mass;
                    totalZ += unit.mesh.position.z * unit.mass;
                });
                return new Vector3(totalX / totalMass, Common_1.default.defaultY, totalZ / totalMass);
            };
            Formations.Distance2D = function(from, to) {
                return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.z - to.z, 2));
            };
            return Formations;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Formations;


        /***/
    },
    /* 7 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
        /**
         *
         * The ground (actually a grid in space) that the game sits upon
         */
        var Ground = (function() {
            function Ground(scene) {
                //Creation of a plane with a texture
                this.mesh = BABYLON.Mesh.CreatePlane("ground", Common_1.default.MEDIUM_SIZE_MAP, scene);
                var matGround = new BABYLON.StandardMaterial("matGround", scene);
                matGround.diffuseTexture = new BABYLON.Texture("static/images/assets/img/background_unique.png", scene);//background.png", scene);
                matGround.diffuseTexture.uScale = 8;//Common_1.default.MEDIUM_SIZE_MAP_SUBDIVISIONS;
                matGround.diffuseTexture.vScale = 8;//Common_1.default.MEDIUM_SIZE_MAP_SUBDIVISIONS;
                matGround.specularColor = new BABYLON.Color3(0, 0, 0);
                this.mesh.material = matGround;
                this.mesh.rotation.x = Math.PI / 2;
                this.mesh.position = new BABYLON.Vector3(0, 0, 0);
            }
            return Ground;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Ground;


        /***/
    },
    /* 8 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
        /**
         * CenterOfMassMarker
         *
         * Shows center of mass of all units
         */
        //todo team colours, friendlies
        var CenterOfMassMarker = (function() {
            /**
             *
             * @param scene
             * @param isOwn
             */
            function CenterOfMassMarker(scene, isOwn) {
                this.mesh = BABYLON.MeshBuilder.CreateBox("sphere1", {
                    width: 0.1,//Common_1.default.MEDIUM_UNIT_SIZE,
                    height: 0.1,//Common_1.default.MEDIUM_UNIT_SIZE
                }, scene);
                this.isOwn = isOwn;
				this.mesh.isOwn = isOwn;
                var material = new BABYLON.StandardMaterial("green", scene);
                if (isOwn) {
                    material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    material.specularColor = new BABYLON.Color3(1, 1, 1);
                } else {
                    material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                    material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                }
                material.emissiveColor = BABYLON.Color3.Green();
                this.mesh.material = material;				
										  this.mesh .visibility = false;// hide mass
            }
			            return CenterOfMassMarker;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = CenterOfMassMarker;


        /***/
    },
    /* 9 */
    /***/
    function(module, exports, __webpack_require__) {

        // style-loader: Adds some css to the DOM by adding a <style> tag

        // load the styles
        var content = __webpack_require__(10);
        if (typeof content === 'string') content = [
            [module.id, content, '']
        ];
        // add the styles to the DOM
        var update = __webpack_require__(12)(content, {});
        if (content.locals) module.exports = content.locals;
        // Hot Module Replacement
        if (false) {
            // When the styles change, update the <style> tags
            if (!content.locals) {
                module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./main.styl", function() {
                    var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/stylus-loader/index.js!./main.styl");
                    if (typeof newContent === 'string') newContent = [
                        [module.id, newContent, '']
                    ];
                    update(newContent);
                });
            }
            // When the module is disposed, remove the <style> tags
            module.hot.dispose(function() {
                update();
            });
        }

        /***/
    },
    /* 10 */
    /***/
    function(module, exports, __webpack_require__) {

        exports = module.exports = __webpack_require__(11)();
 
        /***/
    },
    /* 11 */
    /***/
    function(module, exports) {

        /*
        	MIT License http://www.opensource.org/licenses/mit-license.php
        	Author Tobias Koppers @sokra
        */
        // css base code, injected by the css-loader
        module.exports = function() {
            var list = [];

            // return the list of modules as css string
            list.toString = function toString() {
                var result = [];
                for (var i = 0; i < this.length; i++) {
                    var item = this[i];
                    if (item[2]) {
                        result.push("@media " + item[2] + "{" + item[1] + "}");
                    } else {
                        result.push(item[1]);
                    }
                }
                return result.join("");
            };

            // import a list of modules into the list
            list.i = function(modules, mediaQuery) {
                if (typeof modules === "string")
                    modules = [
                        [null, modules, ""]
                    ];
                var alreadyImportedModules = {};
                for (var i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    if (typeof id === "number")
                        alreadyImportedModules[id] = true;
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    // skip already imported module
                    // this implementation is not 100% perfect for weird media query combinations
                    //  when a module is imported multiple times with different media queries.
                    //  I hope this will never occur (Hey this way we have smaller bundles)
                    if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                        if (mediaQuery && !item[2]) {
                            item[2] = mediaQuery;
                        } else if (mediaQuery) {
                            item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                        }
                        list.push(item);
                    }
                }
            };
            return list;
        };


        /***/
    },
    /* 12 */
    /***/
    function(module, exports, __webpack_require__) {

        /*
        	MIT License http://www.opensource.org/licenses/mit-license.php
        	Author Tobias Koppers @sokra
        */
        var stylesInDom = {},
            memoize = function(fn) {
                var memo;
                return function() {
                    if (typeof memo === "undefined") memo = fn.apply(this, arguments);
                    return memo;
                };
            },
            isOldIE = memoize(function() {
                return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
            }),
            getHeadElement = memoize(function() {
                return document.head || document.getElementsByTagName("head")[0];
            }),
            singletonElement = null,
            singletonCounter = 0,
            styleElementsInsertedAtTop = [];

        module.exports = function(list, options) {
            if (false) {
                if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
            }

            options = options || {};
            // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
            // tags it will allow on a page
            if (typeof options.singleton === "undefined") options.singleton = isOldIE();

            // By default, add <style> tags to the bottom of <head>.
            if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

            var styles = listToStyles(list);
            addStylesToDom(styles, options);

            return function update(newList) {
                var mayRemove = [];
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i];
                    var domStyle = stylesInDom[item.id];
                    domStyle.refs--;
                    mayRemove.push(domStyle);
                }
                if (newList) {
                    var newStyles = listToStyles(newList);
                    addStylesToDom(newStyles, options);
                }
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (domStyle.refs === 0) {
                        for (var j = 0; j < domStyle.parts.length; j++)
                            domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        }

        function addStylesToDom(styles, options) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) {
                        domStyle.parts[j](item.parts[j]);
                    }
                    for (; j < item.parts.length; j++) {
                        domStyle.parts.push(addStyle(item.parts[j], options));
                    }
                } else {
                    var parts = [];
                    for (var j = 0; j < item.parts.length; j++) {
                        parts.push(addStyle(item.parts[j], options));
                    }
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }

        function listToStyles(list) {
            var styles = [];
            var newStyles = {};
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var id = item[0];
                var css = item[1];
                var media = item[2];
                var sourceMap = item[3];
                var part = {
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                if (!newStyles[id])
                    styles.push(newStyles[id] = {
                        id: id,
                        parts: [part]
                    });
                else
                    newStyles[id].parts.push(part);
            }
            return styles;
        }

        function insertStyleElement(options, styleElement) {
            var head = getHeadElement();
            var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
            if (options.insertAt === "top") {
                if (!lastStyleElementInsertedAtTop) {
                    head.insertBefore(styleElement, head.firstChild);
                } else if (lastStyleElementInsertedAtTop.nextSibling) {
                    head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
                } else {
                    head.appendChild(styleElement);
                }
                styleElementsInsertedAtTop.push(styleElement);
            } else if (options.insertAt === "bottom") {
                head.appendChild(styleElement);
            } else {
                throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
            }
        }

        function removeStyleElement(styleElement) {
            styleElement.parentNode.removeChild(styleElement);
            var idx = styleElementsInsertedAtTop.indexOf(styleElement);
            if (idx >= 0) {
                styleElementsInsertedAtTop.splice(idx, 1);
            }
        }

        function createStyleElement(options) {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            insertStyleElement(options, styleElement);
            return styleElement;
        }

        function createLinkElement(options) {
            var linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            insertStyleElement(options, linkElement);
            return linkElement;
        }

        function addStyle(obj, options) {
            var styleElement, update, remove;

            if (options.singleton) {
                var styleIndex = singletonCounter++;
                styleElement = singletonElement || (singletonElement = createStyleElement(options));
                update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
                remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
            } else if (obj.sourceMap &&
                typeof URL === "function" &&
                typeof URL.createObjectURL === "function" &&
                typeof URL.revokeObjectURL === "function" &&
                typeof Blob === "function" &&
                typeof btoa === "function") {
                styleElement = createLinkElement(options);

                remove = function() {
                    removeStyleElement(styleElement);
                    if (styleElement.href)
                        URL.revokeObjectURL(styleElement.href);
                };
            } else {
                styleElement = createStyleElement(options);
                update = applyToTag.bind(null, styleElement);
                remove = function() {
                    removeStyleElement(styleElement);
                };
            }

            update(obj);

            return function updateStyle(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
                        return;
                    update(obj = newObj);
                } else {
                    remove();
                }
            };
        }

        var replaceText = (function() {
            var textStore = [];

            return function(index, replacement) {
                textStore[index] = replacement;
                return textStore.filter(Boolean).join('\n');
            };
        })();

        function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;

            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = replaceText(index, css);
            } else {
                var cssNode = document.createTextNode(css);
                var childNodes = styleElement.childNodes;
                if (childNodes[index]) styleElement.removeChild(childNodes[index]);
                if (childNodes.length) {
                    styleElement.insertBefore(cssNode, childNodes[index]);
                } else {
                    styleElement.appendChild(cssNode);
                }
            }
        }

        function applyToTag(styleElement, obj) {
            var css = obj.css;
            var media = obj.media;
            var sourceMap = obj.sourceMap;

            if (media) {
                styleElement.setAttribute("media", media)
            }

            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = css;
            } else {
                while (styleElement.firstChild) {
                    styleElement.removeChild(styleElement.firstChild);
                }
                styleElement.appendChild(document.createTextNode(css));
            }
        }

     


        /***/
    },
	  /* 13 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
     //   var Laser_1 = __webpack_require__(4);
        /**
         *
         * Controllable unit
         */
        //todo team colours, friendlies
        var Base = (function() {
            /**
             *
             * @param scene
             * @param isOwn
             * @param isSelected
             */
            function Base(scene, isOwn, isSelected) {
                if (isSelected === void 0) {
                    isSelected = false;
                }
                this.isSelected = false; //selected units can receive new commands
                this.hitPoints = 10;
                this.baseSpeed = Common_1.default.MEDIUM_SPEED;
            //    this.weapon = new Laser_1.default();
                this.mass = 1;
                this.mesh = BABYLON.MeshBuilder.CreateBox("myBase_"+uuidv4(), {height: 5, width: 2, depth: 0.5}, scene);   
                // this.mesh =BABYLON.MeshBuilder.CreatePlane("myBase", {width: 5, height: 5,sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);// BABYLON.MeshBuilder.CreateBox("myBase", {height: 0.5, width: 2, depth: 2}, scene); 
				 
			 // this.mesh.parentClass = this;
                this.isSelected; //selected units receive commands
                this.modifiers = []; //powerups,shields etc
                this.isOwn = isOwn;
				this.mesh.isOwn = isOwn;
                this.material = new BABYLON.StandardMaterial("basemat_"+uuidv4(), scene);
				
				
				/*var meshForSprite = this.mesh; pretty cool though:
				//    this.material.diffuseTexture = new BABYLON.Texture("v_blanco.png", scene);
				this.spriteManagerPlayer = new BABYLON.SpriteManager("playerManager","v_blanco_tiny.png", 1, {width: 400, height: 400}, scene);
					var player = new BABYLON.Sprite("player", this.spriteManagerPlayer);
			this.spriteUpdater=	setInterval(function(){   
 	    player.position.x =meshForSprite.getAbsolutePosition().x;
		 	    player.position.z =meshForSprite.getAbsolutePosition().z;
		 	    player.position.y =meshForSprite.getAbsolutePosition().y;
					player.rotation.x +=1;
					 }, 100);*/
					 
					 this.UnitID=0;
					 this.planeSprite = new BABYLON.MeshBuilder.CreatePlane("myPlane_"+uuidv4(), {width: 1, height: 1,sideOrientation:BABYLON.Mesh.DOUBLESIDE}, scene);
					   this.planeSprite.material = new BABYLON.StandardMaterial("myPlanemat_"+uuidv4(), scene);
					   this.planeSprite.material.diffuseTexture= new BABYLON.Texture("static/images/units/v_blanco_tiny.png", scene);
					   this.planeSprite.parent= this.mesh;
 					 this.planeSprite.rotation.z=-3.15;
					 					   	this.planeSprite.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;//REF:https://www.html5gamedevs.com/topic/25381-how-to-make-mesh-face-camera/

			  this.mesh .visibility = false;

                if (isOwn) {
                    this.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
					
					 this.planeSprite.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
					 this.planeSprite.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);

                } else {
                    this.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
					
				  this.planeSprite.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
				  this.planeSprite.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

                }
                // this.material.emissiveColor = BABYLON.Color3.Green();
                this.mesh.material = this.material;
                this.mesh.actionManager = new BABYLON.ActionManager(scene);
                //show bounding box for selected elements
                this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.select.bind(this)));
                //show user where mouse is hovering over
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh.material, "diffuseColor", BABYLON.Color3.White()));
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh.material, "diffuseColor", this.material.diffuseColor));
            }
            Base.prototype.select = function(e) {
                this.isSelected = true;
                e.meshUnderPointer.showBoundingBox = true;
				this.planeSprite.showBoundingBox = true;
            };
            Base.prototype.deselect = function() {
                this.isSelected = false;
                this.mesh.showBoundingBox = false;
								this.planeSprite.showBoundingBox = false;

            };
            Base.prototype.currentSpeed = function() {
                //todo speed modifiers
                return this.baseSpeed;
            };
            Base.prototype.takeDamage = function(damage) {
                this.hitPoints -= damage;
                if (this.hitPoints < 1) {
                    this.explode();
                }
            };
            /**
             * Removes mesh
             * //todo expode graphics + hitpoints
             */
            Base.prototype.explode = function() {
								this.deselect();
                this.mesh.dispose();
				//clearInterval(this.spriteUpdater);
				//this.spriteManagerPlayer.dispose();
				this.planeSprite.dispose();
            };
            return Base;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Base;


        /***/
    },
		  /* 14 */
    /***/
    function(module, exports, __webpack_require__) {

        var Common_1 = __webpack_require__(3);
         /**
         *
         * Controllable unit
         */
        //todo team colours, friendlies
        var Resource = (function() {
            /**
             *
             * @param scene
             * @param isOwn
             * @param isSelected
             */
            function Resource(scene, isOwn, isSelected) {
                if (isSelected === void 0) {
                    isSelected = false;
                }
                this.isSelected = false; //selected units can receive new commands
                this.hitPoints = 10;
                this.baseSpeed = Common_1.default.MEDIUM_SPEED;
                 this.mass = 1;
                this.mesh = BABYLON.MeshBuilder.CreateBox("myResource" , {height: 0.05, width: 4.1, depth: 4.1}, scene);   
 				
                // this.mesh.parentClass = this;
                this.isSelected; //selected units receive commands
                this.modifiers = []; //powerups,shields etc
                this.isOwn = isOwn;
				 this.mesh.isOwn = isOwn;
                this.material = new BABYLON.StandardMaterial("matResource_"+uuidv4(), scene);
                if (isOwn) {
                    this.material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.8);
                } else {
                    this.material.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.4);
                    this.material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                }
                // this.material.emissiveColor = BABYLON.Color3.Green();
                this.mesh.material = this.material;
				
                this.mesh.actionManager = new BABYLON.ActionManager(scene);
                 this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.select.bind(this))); 
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, this.mesh.material, "diffuseColor", BABYLON.Color3.White()));
                this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, this.mesh.material, "diffuseColor", this.material.diffuseColor));
             
			// this.mesh.pickable =false;
			  this.mesh .visibility = false;
			    // Create a particle system
    this.particleSystem = new BABYLON.ParticleSystem("particles_"+uuidv4(), 500, scene);
 
 //Texture of each particle
    this.particleSystem.particleTexture = new BABYLON.Texture("static/images/particles/flare.png", scene);

    // Where the particles come from
    this.particleSystem.emitter = this.mesh;//BABYLON.Vector3.Zero(); // the starting location

    // Colors of all particles
    this.particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    this.particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    this.particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    this.particleSystem.minSize = 2;
    this.particleSystem.maxSize = 8;

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 1.5;
    this.particleSystem.maxLifeTime = 1.5;

    // Emission rate
    this.particleSystem.emitRate = 50;


    // Emission type
    var hemisphericEmitter =new BABYLON.HemisphericParticleEmitter();
    hemisphericEmitter.radiusRange = 0;
    hemisphericEmitter.radis = 1.2;

    this.particleSystem.particleEmitterType = hemisphericEmitter;

    // Limit velocity
    this.particleSystem.addLimitVelocityGradient(0, 1);
    this.particleSystem.addLimitVelocityGradient(0.120, 0.983);
    this.particleSystem.addLimitVelocityGradient(0.445, 0.780);
    this.particleSystem.addLimitVelocityGradient(0.691, 0.502);
    this.particleSystem.addLimitVelocityGradient(0.930, 0.05);
    this.particleSystem.addLimitVelocityGradient(1.0, 0);

    this.particleSystem.limitVelocityDamping = 0.6;

    // Size over lifetime
    this.particleSystem.addSizeGradient(0, 0.641);
    this.particleSystem.addSizeGradient(0.344, 0.883);
    this.particleSystem.addSizeGradient(0.615, 0.965);
    this.particleSystem.addSizeGradient(1.0, 1.0);

    // Speed
    this.particleSystem.minEmitPower = 30;
    this.particleSystem.maxEmitPower = 60;
    this.particleSystem.updateSpeed = 1/60;

    // Start the particle system
    this.particleSystem.start();

			
			
			}
			
 

            Resource.prototype.select = function(e) {
                this.isSelected = true;
                e.meshUnderPointer.showBoundingBox = true;
            };
            Resource.prototype.deselect = function() {
                this.isSelected = false;
                this.mesh.showBoundingBox = false;
            };
            Resource.prototype.currentSpeed = function() {
                //todo speed modifiers
                return this.baseSpeed;
            };
            Resource.prototype.takeDamage = function(damage) {
                this.hitPoints -= damage;
                if (this.hitPoints < 1) {
                    this.explode();
                }
            };
             Resource.prototype.explode = function() {
				 				this.deselect();
                this.mesh.dispose();
            }; 
            return Resource;
        })();
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = Resource;


        /***/
    },
    /******/
]);


 //   modal
  var span = document.getElementsByClassName("close")[0];
     document.getElementById("modalHelp").style.display = "none";// close when loaded

 
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  document.getElementById("modalHelp").style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === document.getElementById("glcanvas")) {
    document.getElementById("modalHelp").style.display = "none";
  }
}
  
  
 function isMobile()//REF:https://redstapler.co/detect-mobile-device-with-javascript/#:~:text=The%20basic%20and%20easy%20way,extract%20the%20information%20like%20this.&text=alert(%22You're%20using,userAgent.
{
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i))
 {
 return true;
}
else{return false;}
} 
  	 $(document).on('click', "#btnLaunchSinglePlayer",function (event) {  

        launchNewGame();
     
});
function launchNewGame()
{

playerCount = $("#txtPlayerCount").val();
isWinOnlyByDominance=$("#chDominance").prop("checked");
isWinOnlyByMaxResources = $("#chMaxResourcesWin").prop("checked");
isWithMines = $("#chMines").prop("checked");
isTurnBased=$("#chTurnBased").prop("checked");
 isWithFogOfWar  =$("#chFogOfWar").prop("checked");
isWithWeatherEffect=$("#chWeatherEffects").prop("checked");

if(!isMultiplayer){$("#sChatContainer").hide(); }else{
 admincode =$("#lblAdminCode").html();
 $("#txtAIPlayers").val(0);
WhoMe=0; isAdmin=true;
   pname = "Game_Master";
WhoText = "("+pname+") ";
$("#hHeaderInfo").before("<small style='position:absolute;'>Share code: &nbsp;<input type='text' class='' readonly='true' id='txtShareCodeMain' name='txtShareCodeMain' value='"+admincode+"'/></small> ");
	if(isMultiplayer){ isEndgame=false;  }
}

    if($('#radVSAI').is(':checked')) {   
 aICount = $("#txtAIPlayers").val();

$('#divSettingB').trigger('click');
 }
else   if($('#radVSPlayer').is(':checked') || isMultiplayer) {  
aICount =0; playerCount=2;
$('#divSettingB').trigger('click');
  }
else   if($('#radAIVSAI').is(':checked')) {   
 aICount = playerCount;
 $('#divSettingB').trigger('click');

 }
 
   document.getElementById("modalStart").style.display = "none";
}


$.fn.Blink = function (interval = 100, iterate = 1) {//https://stackoverflow.com/questions/5205445/jquery-blinking-highlight-effect-on-div
    for (i = 1; i <= iterate; i++)
        $(this).fadeOut(interval).fadeIn(interval);
} 

 $(document).ready(function(){
	 
	 $('#btnHELP').Blink(100, 5);

// LaunchGame();
  if(isMobile())//   REF: https://bitsofco.de/making-abbr-work-for-touchscreen-keyboard-mouse/
{ $("head").append('<style>abbr[title]:hover::after,abbr[title]:focus::after {  content: attr(title);   position: absolute;  left: 65px;'+
  'bottom: -20px;  width: auto;  white-space: nowrap;    background-color: #1e1e1e;  color: #fff;  border-radius: 3px;'+  
  'box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.4);  z-index:1; font-size: 12px;  padding: 3px 5px;  border:1px  solid white;}        </style>'); 
}
 
 if(typeof $("#lblAdminCode").html() != "undefined") // let page load and then.
{
$("#txtShareCode").val($("#lblAdminCode").text());
}

if(window.location.href.includes("?"))
{
admincode = window.location.href.split("?")[1];
console.log(admincode)
$("#txtJoinGame").val(admincode);
 //launchGuestMultiplayer();
}
      });