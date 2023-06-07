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
const $nameCol = $("#nameCol");
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
    let isTrio = titleArray[0].name === "THE STARDOM THREEDOM";
    

    for (let i = titleArray.length - 1; i >= 0; i--) {
        let isCurrent = i === titleArray.length-1; 
        let $row = $("<tr/>");
//         let $reignNo = $(`<td>${titleArray[i].number}</td>`);
//         $row.append($reignNo);
        let reignNumStr = typeof titleArray[i].reign !== "undefined" && titleArray[i].reign != 1 && !byReign ? `(${titleArray[i].reign})` : ""; 
        let currTxt = isCurrent && !byReign ? "(Current) " : ""; 
        let champName = titleArray[i].name.replace("_", " ");
        let $name = $(`<td class="name-cell"></td>`);
        let picName = champName.replace(" ", "").toLowerCase();
        let $nameplate = $(`<p>${champName + " " + reignNumStr + " " + currTxt} </p>`);

        // let $picture = $(`<td/>`);

        if (titleArray[i].name !== "VACATED" && !isTag) {
            let $profilepic = $(`<img src="https://dawong8.github.io/portfolio/public/${picName}.png" onerror="this.src='./public/vacant.png';this.onerror='';" class="profile-pic"/>`);
            $name.append($profilepic);
        } else if (isTag && titleArray[i].name !== "VACATED") {

            let parsedText = titleArray[i].members.replaceAll("[", "(").replaceAll("]", ")").replaceAll("_", " ");
            let splitArr = parsedText.split("&");
            let memberName1 = splitArr[0].split("(")[0];
            let memberName2 = splitArr[1].split("(")[0];
            let memberName3; 
            let member1 = splitArr[0].charAt(splitArr[0].length-2) == "1" ? memberName1 : splitArr[0];
            let member2 = splitArr[1].charAt(splitArr[1].length-2) == "1" ? memberName2 : splitArr[1];
            let member3; 
            
            // handle tag pics

            memberName1 = memberName1.replaceAll(" ", "").toLowerCase();
            memberName2 = memberName2.replaceAll(" ", "").toLowerCase();

            

            let $picContainer = $(`<div/>`)
            let $pic1 = $(`<img src="https://dawong8.github.io/portfolio/public/${memberName1}.png" onerror="this.src='./public/vacant.png';this.onerror='';" class="profile-pic"/>`);
            let $pic2 = $(`<img src="https://dawong8.github.io/portfolio/public/${memberName2}.png" onerror="this.src='./public/vacant.png';this.onerror='';" class="profile-pic"/>`);
            let $pic3; 

            $picContainer.append($pic1);
            $picContainer.append($pic2);

            // handle texts and names 

            if (isTrio) {
                memberName3 = splitArr[2].split("(")[0];
                member3 = splitArr[2].charAt(splitArr[2].length-2) == "1" ? memberName3 : splitArr[2];
                memberName3 = memberName3.replaceAll(" ", "").toLowerCase();
                $pic3 = $(`<img src="https://dawong8.github.io/portfolio/public/${memberName3}.png" onerror="this.src='./public/vacant.png';this.onerror='';" class="profile-pic"/>`);
                $picContainer.append($pic3);
            }

            $name.append($picContainer);


            let $members = $(`<span class="tag-member">${member1} & ${member2} ${typeof member3 !== "undefined" ? `& ${member3}` : ""}</span>`);
            $name.append($members);
        } else {
            $name.css({color: "grey"});
        }
        $name.append($nameplate)

        // if current Champ 
        if (isCurrent && !byReign) {
            $name.css({color: "gold"})
        }

        $row.append($name); 
        // $row.append($picture); 

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




function openBar() {
    $sidebarButton.html("");
    $("#sidebar").animate({width: "100%", opacity: ".9"}, {
        complete: () => {$sidebarButton.html("x");}
    });    
    $sidebarContent.removeClass("hide");
}

$("#sidebar").mouseenter(function() {
    openBar();
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
    "TRIO": "TRIOS",
    "NXT": "NXT",
    "MNXT": "MENS-NXT",
    "HD": "HARDCORE",
    "US": "US",
    "AT": "ALPHA-TOP",
    "WT": "WORLD-TOP",
    "MTAG": "MENS-TAG",
    "DT": "DOM-TOP"
};
$(".nav-title").click(function() {
    $hof.addClass("hide");
    $table.removeClass("hide");
    $sortToggle.removeClass("hide");
    $nameCol.removeClass("name-width");
    $nameCol.removeClass("tag-width");
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
    if ($term === "TRIO" || $term === "TAG" || $term === "MTAG") {
        $sortToggle.addClass("hide");
        
        $nameCol.addClass("tag-width");
    } else {
        $nameCol.addClass("name-width");
    }

    $titleName.html(titleName + " Championship");

    // let sortText = $sortToggle.text().trim(); 
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
    console.log("Everything is loaded");


    openBar();
});
