console.log("parks_specific widget");

function getParkInfoFromObjectID(objectID,callback = false){
	//add the object ID to the ajax string
	var ajaxString = "https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=OBJECTID%3D" + objectID + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson";
	console.log(ajaxString);
	var newAjaxString = "https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=OBJECTID%3D80&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson";
	console.log(newAjaxString);
	jQuery.ajax({
		url : ajaxString
	}).done(function(parkInfo){
		parkInfo = JSON.parse(parkInfo);
		if(callback){
			debugger;
			callback(parkInfo);
		}else{
			return parkInfo;
		}
	});
}

function getNamedParkInfo(devmode = false){
	//function to get the name of the park that's in the search box, and get the associated park ID

	//get the string that's in the search box
	var searchBoxString = jQuery("#SearchInput").val();

	if(devmode){
		searchBoxString = searchBoxString.substring(0,searchBoxString.length - 6);
	}

	//set up list of parks

	function CORPark(parkNames,parkID){
		this.parkNames = parkNames;
		this.parkID = parkID;

		this.parkNameMatch = function(parkName){
			var returnVal = false;
			this.parkNames.forEach(function(arrParkName){
				if(arrParkName == parkName){
					returnVal = true;
				}
			});
			return returnVal;
		}
		this.getInfo = function(callback=false){
			if(callback){
				debugger;
				getParkInfoFromObjectID(this.parkID,function(parkInfo){debugger;callback(parkInfo);})			}else{
				return getParkInfoFromObjectID(this.parkID);
			}
		}

		this.parkImageUrl = function(){
			var baseURL = "https://maps.raleighnc.gov/parklocator/images/photos/";
			var imgType = ".jpg";
			var imgName = this.parkNames[0].replace(/\s+/g, '');

			return baseURL + imgName + imgType;
		}
	}

	var CORParks = {}

	//hard coded list of parks

	CORParks.pullen = new CORPark(['pullen park'], 80);
	CORParks.lakeJohnson = new CORPark(['lake johnson'], 48);
	CORParks.lakeLynn = new CORPark(['lake lynn'], 50);
	CORParks.lakeWheeler = new CORPark(['lake wheeler'], 51);
	CORParks.laurelHills = new CORPark(['laurel hills'], 54);
	CORParks.millbrookExchange = new CORPark(['millbrook exchange'], 67);
	CORParks.mordecai = new CORPark(['mordecai historic park',"mordecai park"], 54);
	CORParks.fredFletcher = new CORPark(['fred fletcher park'], 31);
	CORParks.andersonPoint = new CORPark(['anderson point park'], 1);
	CORParks.durantNaturePreserve = new CORPark(['durant nature preserve'], 25);


	var matchingPark = false;
	Object.keys(CORParks).forEach(function(corPark){
		if(CORParks[corPark].parkNameMatch(searchBoxString)){
			matchingPark = CORParks[corPark];
		}
	});
	return matchingPark;

}

var namedParkObject = getNamedParkInfo(true)

namedParkObject.getInfo(function(parkInfo){
	console.log(this.parkImageUrl);
	console.log(parkInfo);
});

