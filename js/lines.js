   var linesed = [];
				var linesListInfo=[];
             linesed[0] = new BABYLON.Vector3(0, 0, 0);
			 var startingPoint;
            var currentMesh;
                        var lineNumber=0;
						var isPreventPointerAction= false;
						var isLinesAreLoadedFromExtern= false;

  function clearDrawing()
            {
            if($('#chDrawMode').is(":checked")){
            var stopCheck=false;
              scene.meshes.sort().reverse().forEach(function (mesh)
                    {
                        if(mesh.id.indexOf("lines") > -1 && !stopCheck){
                            mesh.dispose();
                                                                                 // console.log(mesh.id);
                                                                                  stopCheck=true;
                                                                                  ;// stop after 1 finding.
                                                                                  }
        
                    });
            }}
         function handleLines(JSONfeedbackdata)
 {                     
linesListInfo=[];
 var linesConverted= JSON.parse(JSONfeedbackdata.linesobjectinfo);
	 			 for (i = 0; i < linesConverted.length; i++) { 
				// console.log(JSON.parse(JSONfeedbackdata.linesobjectinfo)[2].id);
 				            var  Newlines =  BABYLON.Mesh.CreateLines("lines", linesConverted[i].path, scene);
							   Newlines.id = linesConverted[i].id;
							   										Newlines.isPickable=false;
								// lines.material  = 	 scene.getMaterialByName(lines.materialId);
							Newlines.color =linesConverted[i].color;//new BABYLON.Color3(Math.random(), Math.random(), Math.random());
										 			 
						      linesListInfo.push({path: linesConverted[i].path, id:Newlines.id, color: Newlines.color});
							                             lineNumber=parseInt(linesConverted[i].id.replace("lines","")); 
														 

							

}
 isLinesAreLoadedFromExtern=true;
 }
            var getGroundPosition = function () {
                // Use a predicate to get position on the ground
                var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == groundObj; });
                if (pickinfo.hit) {
                    return pickinfo.pickedPoint;
                }
        
                return null;
            }