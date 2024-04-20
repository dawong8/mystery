
const $content = $("#content");
const $rosterContent = $("#roster_content");
const $champions = $("#champions");
const $profile = $("#profile");
const $roster = $("#roster_content_container");
//  Generate Roster Cotent Section 





function renderChampion(name, title, brand){
    let superStar = name.replace("_", " ");
    let picName = superStar.replace(" ", "").toLowerCase();
	let $frame = $(`<div class='frame-container champion-container cursor' data-brand='${brand}' data-name='${name}' data-gender='${title === "World Top Men's Champion" ? "M" : "F"}'> <img class='profile-pic roster-pic' src='https://dawong8.github.io/portfolio/public/${picName}.png' /> 
		<div class='name-plate' ><h5> ${superStar}</h5> <p>${title} </p> </div> </div>  `) 
	$champions.append($frame);

}

function renderRoster(arr) {

	$champions.empty();
	$rosterContent.empty(); 

	// handle the champions 

	let rawChamp = titleHistory["RAW"][titleHistory["RAW"].length-1].name; 
	let sdChamp = titleHistory["SMACKDOWN"][titleHistory["SMACKDOWN"].length-1].name; 
	let menChamp = titleHistory["WORLD-TOP"][titleHistory["WORLD-TOP"].length-1].name; 
	let nxtChamp = titleHistory["NXT"][titleHistory["NXT"].length-1].name; 

	renderChampion(rawChamp, "Raw Women's Champion", "RAW")
	renderChampion(sdChamp, "SD Women's Champion", "SD")
	renderChampion(menChamp, "World Top Men's Champion", "RAW")
	renderChampion(nxtChamp, "NXT Women's Champion", "NXT")

	// handle the rest of the roster 

	for(let a = 0; a < arr.length; a++) {


		// do not render champions
		if (arr[a].name === rawChamp || arr[a].name === menChamp ||arr[a].name === nxtChamp ||arr[a].name === sdChamp ) {
			continue;
		}	

        let superStar = arr[a].name.replace("_", " ");
        let picName = superStar.replace(" ", "").toLowerCase();

		let $frame = $(`<div class='frame-container cursor' data-brand='${arr[a].brand}' data-gender='${arr[a].gender}' data-name='${arr[a].name}'> <img class='profile-pic roster-pic' src='https://dawong8.github.io/portfolio/public/${picName}.png' /> <div class='name-plate' ><h5> ${superStar}</h5> </div> </div>  `) 
		$rosterContent.append($frame);

	}


}


function sortAlpha(a,b) {
	if (a.name < b.name) {
		return -1; 
	} else if (a.name > b.name) {
		return 1; 
	} else {
		return 0;
	}
}



$("#sort-roster").on('change', function() {

	let tempArr; 
	switch(this.value.toUpperCase()) {
		case "RAW": 
		case "SD":
			tempArr = rosterArray.filter((x) => x.brand === this.value.toUpperCase() || (x.gender === "M" && x.brand !== "NXT") ); 
			break;
		case "NXT": 
			tempArr = rosterArray.filter((x) => x.brand === this.value.toUpperCase()); 
			break;
		case "MEN":
			tempArr = rosterArray.filter((x) => x.gender === "M"); 
			break; 
		case "WOMEN":
			tempArr = rosterArray.filter((x) => x.gender === "F"); 
			break;
		case "ALUMNI": 
			tempArr = alumniArray; 
			break;
		default:
			tempArr = rosterArray;




	}
    renderRoster(tempArr.sort(sortAlpha)); 

});


function handleFunctionClick() {
	$("#home").animate({height: "50vh" });
	$("#sort-roster").val("all");
    renderRoster(rosterArray.sort(sortAlpha)); 

	$roster.removeClass("hide");
	$sidebarContent.addClass("hide");
	$profile.addClass("hide");
}


$("#roster").on("click", function() {
	handleFunctionClick();
});


$("#titles").on("click", function() {
	$("#home").animate({height: "50vh" });

	$sidebarContent.removeClass("hide");
	$roster.addClass("hide");
	$profile.addClass("hide");
});

$(".name-logo").on("click", function() {
	$("#home").animate({height: "100vh" });
});



function figureReignCount(titleArray, name) {


	for(let a = 0; a < titleArray.length; a++) {
		if (name === titleArray[a].name) {
			return titleArray[a].reign; 
		}
	}

	return 0; // if not found; 
}

function figureTagReignCount(titleArray, name) {


	for(let a = 0; a < titleArray.length; a++) {
		if(titleArray[a].name === "VACATED") {
			continue;
		}
		if (titleArray[a].members.includes(name)) {
			let index = titleArray[a].members.indexOf(name); 
			let reign = titleArray[a].members.substring(index+name.length+1, index+name.length+2);
			console.log("what is ", titleArray[a].members, index, reign)

			return reign; 
		}
	}

	return 0; // if not found; 
}

$('body').on('click', '.frame-container', function() {
    
	$roster.addClass("hide");
	$sidebarContent.addClass("hide");
	$profile.removeClass("hide");

	$("#home").animate({height: "50vh"});


	let name = $(this).attr("data-name"); 
	let gender = $(this).attr("data-gender"); 
	let brand = $(this).attr("data-brand"); 

    let superStar = name.replace("_", " ");
	let picName = superStar.replace(" ", "").toLowerCase();

	let $frame = $(`<div class='frame-container frame-profile'> <img class='profile-pic profile-pic-a' src='https://dawong8.github.io/portfolio/public/${picName}.png' /> </div>  `) 
	let $accolade = $(`<div class='accolade'> <h1 class='nav-title'> ${superStar}</h1>  </div>`)
	let $back = $("<div class='return nav-title cursor'> BACK </div>")
	$profile.empty();

	let $brand = $(`<h5 class='nav-title brand-profile'>${gender === "M" && brand !== "NXT" ? "RAW & SD" : brand }</h5>`);
	$accolade.append($brand);

	// figure out accolades: 

	if (gender === "F") {
		const possibletitles = ["RAW", "SMACKDOWN", "NXT", "TAG", "TRIOS", "HARDCORE", "US"];

		for(let a = 0; a < possibletitles.length; a++) {

			let desiredTitle = [...titleHistory[possibletitles[a]]];

			let reignCount; 
			if(possibletitles[a] === "TAG" || possibletitles[a] === "TRIOS") {
				reignCount = figureTagReignCount(desiredTitle.reverse(), name); 

			} else {
				reignCount = figureReignCount(desiredTitle.reverse(), name); 

			}

			if (reignCount !== 0) {
				let $titleAccolade = $(`<p class='nav-title'>${reignCount}x ${possibletitles[a]} CHAMPION</p>`);
				$accolade.append($titleAccolade);
			}
		}

		if(name === "LIV_MORGAN") {
			//world top
			let $titleAccolade = $(`<p class='nav-title'>1x WORLD-TOP CHAMPION</p>`);
			$accolade.append($titleAccolade);
		}

	} else { // guys
		const possibletitles = ["WORLD-TOP", "DOM-TOP", "ALPHA-TOP", "MENS-TAG", "MENS-NXT"];

		for(let a = 0; a < possibletitles.length; a++) {

			let desiredTitle = [...titleHistory[possibletitles[a]]];

			let reignCount; 
			if(possibletitles[a] === "MENS-TAG") {
				reignCount = figureTagReignCount(desiredTitle.reverse(), name); 

			} else {
				reignCount = figureReignCount(desiredTitle.reverse(), name); 

			}

			if (reignCount !== 0) {
				let $titleAccolade = $(`<p class='nav-title'>${reignCount}x ${possibletitles[a]} CHAMPION</p>`);
				$accolade.append($titleAccolade);
			}
		}

	}

	// handle MITB AND ELIMINATION CHAMPTER AND ROYAL RUMBLE
	
	const specialAccolates = ["MITB", "ELIMINATION_CHAMBER", "ROYAL_RUMBLE"];
	for (let t = 0; t < specialAccolates.length; t++ ) {
		if (Object.hasOwn(titleHistory[specialAccolates[t]], name)) {
			let $titleAccolade = $(`<p class='nav-title'>${titleHistory[specialAccolates[t]][name]}x ${specialAccolates[t]} WINNER</p>`);
			$accolade.append($titleAccolade);
		}
	}


	$profile.append($frame); 
	$profile.append($accolade);
	$profile.append($back);
});


$('body').on('click', '.return', function() {
	handleFunctionClick();
});