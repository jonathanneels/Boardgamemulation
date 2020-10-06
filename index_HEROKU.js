var cluster = require('cluster');

const http = require('http');
 const fs = require('fs');
var os = require( 'os' );
const path = require('path');

const { parse } = require('querystring');

 

 var Chatdict = {
  "guid-unique1Test" :  ["bla","ble"],
  "guid-unique2Test" :  [ "dsfsfsmkj"],
 }
 var gameAlivedict={
	   "codename" :  "2020-01-01 20:29:20"
 }
  var playerdict = { 
  "guid-unique1Test" :  ["Game Master" ],
 }
 var playerturndict = {
  "guid-unique1Test" :   "Game Master"  
 }
var Projectsdict = {
  "guid-unique1Test" : "htmlcontent",
  "guid-unique2Test" :  "<html>",
 };
var Meshesdict = {
  "guid-unique1Test" : "mesh:a",
  "guid-unique2Test" :  "mesh:b",
 };
 
const directoryPath = path.join(__dirname, 'static');

 var port = process.env.PORT || 8000;;//REF:https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
  
	if(cluster.isMaster) {//REF: https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/ & https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
	
	
} else {
	launchServer();}
	
	process
  .on('unhandledRejection', (reason, p) => {//https://shapeshed.com/uncaught-exceptions-in-node/ & https://stackoverflow.com/questions/40867345/catch-all-uncaughtexception-for-node-js-app
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
  
	setInterval(serverTimerActions, 1000);

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function removeA(arr) {//REF: https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function dateTimeNow()//REF: https://usefulangle.com/post/187/nodejs-get-date-time
{
	
	let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
 let minutes = date_ob.getMinutes();
 let seconds = date_ob.getSeconds();

 return(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

}

var olderThanRemoveDateTime; 
var CountBeforeUpdateOlderThanCheckSeconds= 750;//1500 = 25 min
var CurrentSecondBeforeUpdateOlderThanCheckSeconds=749;
var CountUpdatePublicGamesList= 30;
var CurrentSecondUpdatePublicGamesList=0;
var PublicGamesList=[];
var PublicGamesByAdminCodeList=[];

function IsJsonString(str) {
    try {
        JSON.parse(str);
		
    } catch (e) {
        return false;
    }
    return true;
}


function serverTimerActions() {
   
  CurrentSecondBeforeUpdateOlderThanCheckSeconds+=1;
  CurrentSecondUpdatePublicGamesList+=1;
   if(CurrentSecondUpdatePublicGamesList >= CountUpdatePublicGamesList)
  {PublicGamesList=[];PublicGamesByAdminCodeList=[];
	  for (var key in Projectsdict) {
 
 if (IsJsonString(Projectsdict[key]) && Projectsdict.hasOwnProperty(key)) {
 			if(JSON.parse(Projectsdict[key]).publicserver === true)
		{var convdata = JSON.parse(Projectsdict[key]);
			PublicGamesList.push( convdata.projectname);
			PublicGamesByAdminCodeList.push(convdata.AdminCode);
			}}
			}
 		
	  CurrentSecondUpdatePublicGamesList= 0;
//	  console.log("Public games: " + PublicGamesList.join("**"))
	  }
	  
	  
  if(CurrentSecondBeforeUpdateOlderThanCheckSeconds >= CountBeforeUpdateOlderThanCheckSeconds)
  {
			// older than handler
			for (var key in gameAlivedict) {
    // check if the property/key is defined in the object itself, not in parent
    if (gameAlivedict.hasOwnProperty(key)) { 
if(Date.parse(gameAlivedict[key]) < Date.parse(olderThanRemoveDateTime)){
 				 	delete gameAlivedict[key]
					 	delete Chatdict[key];
				 	delete playerdict[key];
				 	delete playerturndict[key];
					 delete Projectsdict[key];
				 	delete Meshesdict[key];}
 
    }
}
 
			//then;
 
 olderThanRemoveDateTime= dateTimeNow()
	  	    console.log('Will delete unresponsive games older than; '+olderThanRemoveDateTime); 
	  CurrentSecondBeforeUpdateOlderThanCheckSeconds= 0; 
  }
}

function launchServer(){
const server = http.createServer((req, res) => {
  if (req.url === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } 
	else  if (req.url.includes( '/adminpage')) {//else  if (req.url === '/adminpage') { //ref: https://stackoverflow.com/questions/37991995/passing-a-variable-from-node-js-to-html
        res.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile("playfield.html", "utf8", function(err, data) { 
		var adCode=uuidv4().toString();
				gameAlivedict[adCode] = dateTimeNow();
	 	playerdict[adCode]=[]; 
              res.end(data + "<label id='lblAdminCode'>"+adCode  +"</label><label id='lblisAdmin'>true</label>"); 
			  });			  }
				else  if (req.url.includes( '/addorgetplayer')) {  
		var playerandadminhandler= req.url.replace('/addorgetplayer','');
		var admincode = playerandadminhandler.split("?")[0].trim();
 
 			var array=[];
			 if(playerandadminhandler.split("?")[1] === undefined ||playerdict[admincode]===undefined   ){
	
				 if(playerandadminhandler.split("?")[1] === undefined || playerandadminhandler.split("?")[1].trim() ==""){
					 					res.end("");	return;	
 					 
				 }
				 playerdict[admincode]=[];
				 }
				else{			 
			var player = playerandadminhandler.split("?")[1].trim();
				array = playerdict[admincode];
				if(array.includes(player) || player.trim() =="" ){ // player.trim() =="" => if it's just getting the list
					res.writeHead(200);
					res.end(playerdict[admincode].join("\n"));	return;	

				}
				
				}
			array.push(player);
			playerdict[admincode]=array;  
				        res.writeHead(200); 
res.end(playerdict[admincode].join("\n"));		
   }
   else  if (req.url.includes( '/playerturn')) {  
		var playerandadminhandler= req.url.replace('/playerturn','');
		var admincode = playerandadminhandler.split("?")[0].trim();
				var player = playerandadminhandler.split("?")[1].trim();
 			 if(playerdict[admincode]===undefined){
 					 					res.end("No players found.");	return;	 

				 }
				else{		 
				var array = playerdict[admincode];
				for (i = 0; i < array.length; i++) {
					//console.log(array[i] +"--"+ player);
					if(array[i] === player)
					{						if(i === array.length -1)
						{
							playerturndict[admincode]=array[0];
						}
						else
						{ 
						 playerturndict[admincode]=array[i+1];

						}
						break;	
					}

						} 
  					res.writeHead(200);
					res.end(playerturndict[admincode]);	return;	 
				
				}  
			 playerturndict[admincode] = player; 
				res.writeHead(200); 
				res.end(playerturndict[admincode]);		// no other players than the current..
   }
   else  if (req.url.includes( '/removeplayer')) {  
		var playerandadminhandler= req.url.replace('/removeplayer','').trim();
		var playeradminparts=playerandadminhandler.split("?");
		var admincode = playeradminparts[0].trim();
				var player = playeradminparts[1].trim();

			var array=[];
			 if(playerdict[admincode]===undefined){
 					 					res.end("Game not found.");	return;	

				 }
				else{			  array = playerdict[admincode];
			 
					if(!array.includes(player) || player.trim() =="" ){	res.end("Player not found");	return;	}

				}
 			removeA(array, player); 
			playerdict[admincode]=array;  
				        res.writeHead(200); 
res.end("Removed: "+ player);		
   }   else  if (req.url.includes( '/activeplayer')) {
	   		var admincode= req.url.replace('/activeplayer','');
 			 if(playerturndict[admincode]===undefined){
 					 					res.end("Game not found.");	return;	

				 }

	res.writeHead(200); 
				res.end(playerturndict[admincode]);		   
 } 
 else  if (req.url.includes( '/adminAliveCheck')) {
	   		var admincode= req.url.replace('/adminAliveCheck','').trim();
 			 if(Projectsdict[admincode]===undefined){
 					 					res.end("Game not found.");	return;	

				 }
gameAlivedict[admincode] = dateTimeNow();

	res.writeHead(200); 
				res.end(gameAlivedict[admincode]);		   
 } 
  else  if (req.url===( '/PublicGamesList')) { 
	res.writeHead(200); 
				res.end(PublicGamesList.join("\n"));		   
 }   else  if (req.url===( '/PublicGamesListByAdmincode')) { 
	res.writeHead(200); 
				res.end(PublicGamesByAdminCodeList.join("\n"));		   
 } 

	else  if (req.url.includes( '/project')) {  
		var admincodeclienthandler= req.url.replace('/project','').trim();
		if(Projectsdict[admincodeclienthandler]===undefined || playerdict[admincodeclienthandler]===undefined ){res.end("room does not exist");return;}
		var projectdata = Projectsdict[admincodeclienthandler];
		if(JSON.parse(projectdata).maxplayer-1 < playerdict[admincodeclienthandler].length)
		{			
			 res.end("Game is full, all places are occupied. Sorry...");return;
		
		}
		fs.readFile("playfield.html", "utf8", function(err, data) {         res.writeHead(200);

              res.end(data + "<label id='lblAdminCode'>"+admincodeclienthandler +"</label><label id='lblisAdmin'>false</label><label id='lblProjectContent'>"+projectdata+"</label>"); 
			  });			
   }
	else  if (req.url.includes( '/getproject')) {  
		var admincodeclienthandler= req.url.replace('/getproject','').trim();
		if(Projectsdict[admincodeclienthandler]===undefined){res.end("room does not exist");}
		var projectdata = Projectsdict[admincodeclienthandler];
		        res.writeHead(200); 
              res.end(projectdata); 
    } 	   
	else  if (req.url === '/postProject') {//REF: https://itnext.io/how-to-handle-the-post-request-body-in-node-js-without-using-a-framework-cd2038b93190

	if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += decodeURI( chunk).toString();
    });
    req.on('end', () => {
      //  console.log(
         //   parse(body)
			          //   JSON.parse(body)  

      //  );
		   /*console.log(
            JSON.parse(body).email 
        );*/
		try{var test=JSON.parse(body)}catch(err){        res.end('corrupt JSON-data');return;}
		Projectsdict[JSON.parse(body).AdminCode.trim()]=body
		        res.writeHead(200);
        res.end('ok');
    });
}

    } 
	else  if (req.url === '/postMeshes') {  

	if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += decodeURI( chunk).toString();
    });
    req.on('end', () => {
     //   console.log(
 			        //    JSON.parse(body)  

   //     );
 		//playerturndict[admincode]=  JSON.parse(body)[0].playerturn;
		
		 	if(Meshesdict[JSON.parse(body)[0].AdminCode.trim()] === undefined || Date.parse(JSON.parse(Meshesdict[JSON.parse(body)[0].AdminCode].trim())[0].posttime) < Date.parse(JSON.parse(body)[0].posttime)){
	 
		try{var test=JSON.parse(body)}catch(err){        res.end('corrupt JSON-data');return;}

	 Meshesdict[JSON.parse(body)[0].AdminCode.trim()]=body;
	 	res.end('ok');}else{console.log("old data :"+ JSON.parse(Meshesdict[JSON.parse(body)[0].AdminCode.trim()])[0].posttime +"-"+ JSON.parse(body)[0].posttime); res.end("old data :"+ JSON.parse(Meshesdict[JSON.parse(body)[0].AdminCode])[0].posttime +"-"+ JSON.parse(body)[0].posttime);}
     });
}

    } else  if (req.url.includes( '/getMeshes')) {  
				var admincode = req.url.replace('/getMeshes','').trim();
								//console.log(admincode); 
			//	console.log(Meshesdict[admincode]);
			// Meshesdict[admincode][0]=		playerturndict[admincode] ;

  		res.writeHead(200); 
		 if(Meshesdict[admincode]===undefined || Meshesdict[admincode]===[] ){res.end("NONE");}
		else{ res.end(Meshesdict[admincode] );}
  } 
		else  if (req.url.includes( '/chat')) {  
				var feedback = req.url.replace('/chat','').trim();
 				var editedFeedList=  feedback.split("?");
				var admincode = editedFeedList[0];
		if (editedFeedList[1] !== undefined  && editedFeedList[1] !== "undefined"  ){
							var chatcontentwithoutcode = editedFeedList[1].replace((admincode+"?").trim(),""); 
			var array=[];
			 if(Chatdict[admincode]===undefined){Chatdict[admincode]=[];}
				else{			  array = Chatdict[admincode];}
				if(chatcontentwithoutcode !== array[array.length-1]){ 
			array.push(chatcontentwithoutcode);} else{console.log("Potential spamchat detected!");}
			Chatdict[admincode]=array;
        }
		res.writeHead(200);  console.log("chat:"+admincode+"----"+chatcontentwithoutcode);
		 if(Chatdict[admincode]===undefined || Chatdict[admincode]===[] ){res.end("");}
		else{ res.end(Chatdict[admincode].join("\n"));}
  } 
  
  else  if (req.url === ( '/getCustomProjectForShare')) {   
  			
	if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += decodeURI( chunk).toString();
    });
    req.on('end', () => { 


			var feedback = body.trim();//console.log(feedback);
 				var projectFeed=feedback.split("?");
				var name =  (projectFeed[0]);
				var content =  projectFeed[1].trim();
				
				if(!name.includes(".bgem")){  res.end("wrong project type (.bgem required).");return;}

  fs.writeFile("static/custom_fan_examples/" + name, content, function (err) {
  if (err) { res.end(err);console.log(err); return;}

  res.writeHead(200); 
  res.end("Project posted. Thank you");
       });       });

}

 


     }
	else  if (req.url.includes( '/directoryitems')) { 
	var flist=[]; 
fs.readdir(directoryPath+req.url.replace('/directoryitems',''), function (err, files) {//REF: https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
    //handling error
    if (err) {
        return res.end('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach 
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        flist.push(file); 
     });
 res.end(flist.join("<br>"));}); 
  } 	   
  else if (req.url.includes( '/list')){
	//  console.log(req.url);
	  var fileList= [];
	  fs.readdir(("."+req.url.replace("/list","/").trim()), (err, files) => { //REF: https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
	    files.forEach(file => { try{
			if(fs.statSync("."+req.url.replace("/list","/").trim()+"/"+file).isDirectory()){// REF: https://www.technicalkeeda.com/nodejs-tutorials/how-to-check-if-path-is-file-or-directory-using-nodejs
				console.log("dir:"+file);
				fileList.push("<a href='"+req.url+'/'+file+"'>"+file + "</a><br>");
			} 
				
			else{
  //  console.log(file);
 //fileList.push("<a href='https://"+  req.url.replace("/list",ip+":"+port )+"/"+file+"'>"+file + "</a><br>"); 
  fileList.push("<a href='"+  req.url.replace("/list","/GETFILE" )+"/"+file+"'>"+file + "</a><br>");}

  }catch(err){ 
    //console.log("File not Found :("); // prevents server crash
	  return false; 
  }});  
res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fileList.join("")); }); 
  } else if (req.url .includes( '/GETFILE') )
  {
	  fs.readFile(__dirname + req.url.replace("GETFILE","") , function (err,data) {   
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
	  
  }
   else  if (req.url.includes( '/Post2D')) {
	          res.writeHead(200, {'Content-Type': 'text/html'});
			  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += ( chunk).toString();
    });
    req.on('end', () => { 


		 	var  feedback = body.trim(); 				
 Projectsdict[JSON.parse(feedback).gameId] = body.trim();
 
  res.end("Project posted. Thank you");

         });

}
	 
 
	  
  }
   else  if (req.url.includes( '/Get2D')) {
 	          res.writeHead(200, {'Content-Type': 'text/html'});
			  var admincode = req.url.replace('/Get2D','').trim();
			  		 if(Projectsdict[admincode]===undefined  ){res.end("NONE");}
		else{ res.end(Projectsdict[admincode] );} }
   
  else  if (req.url.includes( '/Join2D')) {
	          res.writeHead(200, {'Content-Type': 'text/html'});
		var gameJoin = req.url.replace("/Join2D","").trim()	 
		var splitParts= gameJoin.split("?");
		if(splitParts.length >1){
			var admincode=splitParts[0].trim();
			      			console.log(admincode);

			  		 if(Projectsdict[admincode]===undefined  ){res.end("NONE");}
		else{
			var array = playerdict[admincode];
			if(array.includes(splitParts[1].toUpperCase())){ return res.end(array.indexOf(splitParts[1].toUpperCase()).toString()); }else{ 
				if(array.length >3){
					return res.end('Maximum users in the room has been reached.');
					
				}else{
			
		array.push(splitParts[1].toUpperCase());
		playerdict[admincode]=array;
					console.log(playerdict[admincode]);

	 return res.end((array.length-1).toString()) // => Who ID res.end('Player ' + splitParts[1] + " registered.");
	 }}}}else{
	  return res.end('The request cannot be completed.');
	
}
 
	  
  }
  else  if (req.url.includes( '/2D')) {//else  if (req.url === '/adminpage') { //ref: https://stackoverflow.com/questions/37991995/passing-a-variable-from-node-js-to-html
        res.writeHead(200, {'Content-Type': 'text/html'});
		var game = req.url.replace("/2D","").trim().toUpperCase();
		var gameAdminCode= uuidv4();
		gameAlivedict[gameAdminCode] = dateTimeNow();
	 	playerdict[gameAdminCode]=["GAME_MASTER"];
		//		playerturndict[gameAdminCode]="Game Master" ; => Handling in Projectsdict?
	//	Chatdict[gameAdminCode] = ["Admin joined the game."]
   Projectsdict[gameAdminCode] = "json content tbc"; 
 

	  if(game.includes("GABBAC")){//  if(game =="GABBAC"){ => cliënt side actions possible with include
		fs.readFile("static/examples/Gabbac/Gabbac.html", "utf8", function(err, data) { 
              res.end(data + "<label hidden id='lblAdminCode'>"+gameAdminCode +"</label><label hidden id='lblisAdmin'>true</label>"); 
			  });			  }
			  else if(game =="VROLL"){
		fs.readFile("static/examples/V/V-Roll-2D.html", "utf8", function(err, data) { 
              res.end(data + "<label hidden id='lblAdminCode'>"+gameAdminCode +"</label><label hidden id='lblisAdmin'>true</label>"); 
			  });			  }
			   else if(game.includes("V")){
		fs.readFile("static/examples/V/V-Game-2D.html", "utf8", function(err, data) { 
              res.end(data + "<label hidden id='lblAdminCode'>"+gameAdminCode +"</label><label hidden id='lblisAdmin'>true</label>"); 
			  });			  }
			  else{
				  
				  return res.end('The requested game has not been found on the server.');
			  }
			  
			  }
  else{  
  fs.readFile(__dirname + req.url, function (err,data) {//REF:https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  
  }
  
}).listen(port, () => {
    console.log("Our app is running on port ${ PORT }. (Default = 8000)");
});}

