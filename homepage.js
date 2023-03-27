// EEVNT LISTENERS 
// OPEN CLOSE SIDEBAR

const $sidebarContent = $("#sidebar-content");
const $sidebarButton = $("#sidebar-button");
const $tbody = $("#tbody");
const $secCol = $("#secCol");
const $titleName = $("#title-name");
const $sortToggle = $("#sort-toggle");
const $table = $("#table"); 
const $hof = $("#hof");
// sort by # of reigns

function sortByReign(titleName) {
    let titleArray = titleHistory[titleName]; 
    
    let uniqueKeys = {}; 
    let uniqueTitles = []; 
    //remove duplicates and vacated

    for (let i = titleArray.length-1; i >= 0; i--) {
        if (titleArray[i].name !== "VACATED") {
            if (typeof uniqueKeys[titleArray[i].name] === "undefined") {
                uniqueTitles.push(titleArray[i]);
                uniqueKeys[titleArray[i].name] = "1";
            }
        }
        
    }

    const compare = (a, b) => {
        if (a.reign > b.reign) {
            return 1; 
        } else if (a.reign < b.reign) {
            return -1; 
        } else {
            if(a.name > b.name) {
                return -1; 
            } else if (a.name < b.name) {
                return 1;
            } else {
                return 0;
            }
        }
    };

    uniqueTitles = uniqueTitles.sort(compare);
    return uniqueTitles;
}


// get individual stats

function getStats(superstar) {
    let superstarObj = {
        "name": superstar,
    }
    for (let i = titleHistory.RAW.length - 1; i >= 0; i--) {
        if (titleHistory.RAW[i].name === superstar) {
            superstarObj["RAW"] = titleHistory.RAW[i].reign;
            break;
        }
    }
    for (let i = titleHistory.SMACKDOWN.length - 1; i >= 0; i--) {
        if (titleHistory.SMACKDOWN[i].name === superstar) {
            superstarObj["SMACKDOWN"] = titleHistory.SMACKDOWN[i].reign;
            break;
        }
    }
    for (let i = titleHistory.NXT.length - 1; i >= 0; i--) {
        if (titleHistory.NXT[i].name === superstar) {
            superstarObj["NXT"] = titleHistory.NXT[i].reign;
            break;
        }
    }

    // for (let i = titleHistory["SDTAG"].length - 1; i >= 0; i--) {
    //     if (titleHistory["SDTAG"][i].name === "VACATED") {
    //         // do nothing
    //     }
    //     else if ((titleHistory["SDTAG"][i].members).includes(superstar)) {
    //         let str = titleHistory["SDTAG"][i].members;
    //         let splitArr = str.split("&");
    //         let reign = splitArr[0].includes(superstar) ? splitArr[0].substr(splitArr[0].length-2, 1) : splitArr[1].substr(splitArr[1].length-2, 1);
            
    //         superstarObj["SDTAG"] = reign;
    //         break;
    //     }
    // }
    for (let i = titleHistory["TAG"].length - 1; i >= 0; i--) {
        if (titleHistory["TAG"][i].name === "VACATED") {
            // do nothing
        }
        else if ((titleHistory["TAG"][i].members).includes(superstar)) {
            let str = titleHistory["TAG"][i].members;
            let splitArr = str.split("&");
            let reign = splitArr[0].includes(superstar) ? splitArr[0].substr(splitArr[0].length-2, 1) : splitArr[1].substr(splitArr[1].length-2, 1);

            superstarObj["TAG"] = reign;
            break;
        }
    }

    if (typeof titleHistory["ELIMINATION_CHAMBER"][superstar] !== "undefined") {
        superstarObj["ELIMINATION_CHAMBER"] = titleHistory["ELIMINATION_CHAMBER"][superstar];
    }

    if (typeof titleHistory["MITB"][superstar] !== "undefined") {
        superstarObj["MITB"] = titleHistory["MITB"][superstar];
    }

    return superstarObj;
    // calculate sd
}


// RENDER TABLE FOR TITES 

function getDefenses(defArray){
    let $tableCell = $("<td/>");
    let $row = $("<ul class='list-group list-group-flush' /> "); 
    if (typeof defArray === "undefined") {
        return $tableCell; 
    }
    for(let key = defArray.length - 1; key >= 0 ; key--) {
        let $def = $(`<li class="list-group-item no-bg">Def. ${defArray[key].replaceAll("_", " ").replaceAll("&", " & ")}</li>`)

        $row.append($def);
    }
    $tableCell.append($row);


    return $tableCell;
}

function renderTable(titleArray, byReign=false) {
    // let titleArray = titleHistory[title];
    $tbody.empty();

    let isTag = typeof titleArray[0].members !== "undefined";
    

    for (let i = titleArray.length - 1; i >= 0; i--) {
        let isCurrent = i === titleArray.length-1; 
        let $row = $("<tr/>");
        let reignNumStr = typeof titleArray[i].reign !== "undefined" && titleArray[i].reign != 1 && !byReign ? `(${titleArray[i].reign})` : ""; 
        let currTxt = isCurrent && !byReign ? "(Current) " : ""; 
        let champName = titleArray[i].name.replace("_", " ");
        let $name = $(`<td>${champName + " " + reignNumStr + " " + currTxt}</td>`);
        let picName = champName.replace(" ", "").toLowerCase();

        if (titleArray[i].name !== "VACATED" && !isTag) {
            let $profilepic = $(`<img src="https://dawong8.github.io/portfolio/public/${picName}.png" onerror="this.src='./public/vacant.png';this.onerror='';" class="profile-pic"/>`);
            $name.append($profilepic);
        } else if (isTag && titleArray[i].name !== "VACATED") {
            let parsedText = titleArray[i].members.replaceAll("[", "(").replaceAll("]", ")").replaceAll("_", " ");
            let splitArr = parsedText.split("&");
            let member1 = splitArr[0].charAt(splitArr[0].length-2) == "1" ? splitArr[0].split("(")[0] : splitArr[0];
            let member2 = splitArr[1].charAt(splitArr[1].length-2) == "1" ? splitArr[1].split("(")[0] : splitArr[1];
            let $members = $(`<span class="tag-member">${member1} & ${member2}</span>`);
            $name.append($members);
        } else {
            $name.css({color: "grey"});
        }

        // if current Champ 
        if (isCurrent && !byReign) {
            $name.css({color: "gold"})
        }

        $row.append($name); 
        if (!byReign) {
            $row.append(getDefenses(titleArray[i].defenses));
        } else {
            let $reignCol = $(`<td>${titleArray[i].reign}</td>`); 

            $row.append($reignCol)
        }

        $tbody.append($row);
    }
}

renderTable(titleHistory["RAW"]);

// RENDER SUPERSTAR PROFILE






$("#sidebar").mouseenter(function() {
    $sidebarButton.html("");
    $(this).animate({width: "65%", opacity: ".9"}, {
        complete: () => {$sidebarButton.html("x");}
    });    
    $sidebarContent.removeClass("hide");
}); 

$("#sidebar-button").click(function() {
    $("#sidebar").animate({width: "5%"});
    $(this).html("❯");
    $sidebarContent.addClass("hide");
});

let shortHandDictionary = {
    "RAW" : "RAW", 
    "SD" : "SMACKDOWN",
    "TAG": "TAG",
    "NXT": "NXT",
    "HD": "HARDCORE",
    "AT": "ALPHA-TOP",
    "WT": "WORLD-TOP"
};
$(".nav-title").click(function() {
    $hof.addClass("hide");
    $table.removeClass("hide");
    $sortToggle.removeClass("hide");
    $(".selected").removeClass("selected");
    let $term = $(this).html().trim();
    let titleName = shortHandDictionary[$term]; 
    $(this).addClass("selected");

    if ($term === "HoF") {
        $titleName.html("Hall of Fame");
        $table.addClass("hide");
        $hof.removeClass("hide");
        $sortToggle.addClass("hide");
        return;
    } 
    if ($term === "TAG") {
        $sortToggle.addClass("hide");
    }

    $titleName.html(titleName + " Championship");

    let sortText = $sortToggle.text().trim(); 
    renderTable(titleHistory[titleName]);
    $sortToggle.html("SORT BY REIGNS");

});


$sortToggle.click(function() {
    let currentText = $(this).text().trim(); 
    let currentTitle = $titleName.text().split(" ")[0];

    if (currentText === "SORT BY REIGNS") {
        renderTable(sortByReign(currentTitle), true);
        $secCol.html("TOTAL # OF REIGNS");
        $(this).html("SORT BY HISTORY");
    } else {
        renderTable(titleHistory[currentTitle]); 
        $(this).html("SORT BY REIGNS");
        $secCol.html("DEFENSES");
    }

}
);


// EVERYTHING IS LOADED 

$(window).on("load", function() {
    // weave your magic here.
    console.log("Everything is loaded")
});