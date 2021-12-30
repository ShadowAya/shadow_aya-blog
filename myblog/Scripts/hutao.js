var weaponBaseValues = {
    "Staff of Homa" : {
        "atk" : "46",
        "sub" : "cdmg%14.4",
        "passives" : [
            "Reckless Cinnabar",
            {"conditions" : null,
            "text" : "HP increased by #. Additionally, provides an ATK Bonus based on # of the wielder's Max HP.",
            "effects" : [
                ["HP%20", "HP%25", "HP%30", "HP%35", "HP%40"],
                ["HPtoATK%0.8", "HPtoATK%1", "HPtoATK%1.2", "HPtoATK%1.4", "HPtoATK%1.6"]
            ]},
            {"conditions" : ["Under 50% HP", "Above 50% HP"],
            "text" : "When the wielder's HP is less than 50%, this ATK bonus is increased by an additional # of Max HP.",
            "effects" : [
                ["HPtoATK%1", "HPtoATK%1.2", "HPtoATK%1.4", "HPtoATK%1.6", "HPtoATK%1.8"]
            ]}
        ]
    },
    "Blackcliff Pole" : {
        "atk" : "42",
        "sub" : "cdmg%12",
        "passives" : [
            "Press the Advantage",
            {"conditions" : 3,
            "text" : "After defeating an enemy, ATK is increased by # for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independed of the others.",
            "effects" : [
                ["ATK%12", "ATK%15", "ATK%18", "ATK%21", "ATK%24"]
            ]}
        ]
    },
    "Beginner's Protector" : {
        "atk" : "23",
        "sub" : ["none+","none+","none+","none+","none+"],
    }
    
}

var weaponBaseAttackValues = {
    "46" : [457,488,532,563,608],
    "42" : [],
    "23" : [185],
    "cdmg%14.4" : ["cdmg%54.5", "cdmg%54.5", "cdmg%60.3", "cdmg%60.3", "cdmg%66.2"],
    "cdmg%12" : ["cdmg%45.5", "cdmg%45.5", ],
    "none+" : ["none+","none+","none+","none+","none+"]
}

var characterBaseValues = { /* 70,70+,80,80+,90 */
    "hp" : [11899,12637,13721,14459,15552],
    "atk" : [81,86,94,99,106],
    "sub" : ["cdmg%69.2","cdmg%78.8","cdmg%78.8","cdmg%88.4","cdmg%88.4"]
}

var myValues = {
    "character_level" : "70",
    "talent_aa" : "6",
    "talent_e" : "6",
    "talent_q" : "6",
    "weapon_level" : "70",
    "weapon" : "Beginner's Protector",
    "stats" : {}
}

var statToString = {
    'hp' : 'HP',
    "atk" : "ATK",
    "cdmg" : "Crit Damage",
    "dmg" : "Damage",
    "none" : "None"
}

function switchPage(index) {
    let pages = document.getElementsByClassName('content');
    let buttons = document.getElementById('nav').children;
    for (let i = 0; i < pages.length; i++) {

        let page = pages[i];
        let button = buttons[i];
        if (i == index) {
            $(page).css({
                'display' : 'flex'
            })
            $(button).css({
                'background-color': '#dddddd',
                'color': '#000000'
            })

            if (index == 1) {
                $(button.children[2]).css({
                    "opacity" : "1",
                    "pointer-events": "auto"
                })
            }

        } else {
            $(page).css({
                'display' : 'none'
            })
            $(button).css({
                'background-color': '#191919',
                'color': '#ffffff'
            })
            $(button.children[2]).css({
                "opacity" : "0",
                "pointer-events": "none"
            })
        }
        
    }

}

window.addEventListener('load', () => {
    switchPage(0);
    weaponUpdater("Staff of Homa");

    globalUpdater();

    window.addEventListener('scroll', () => {
        nav = document.getElementById('nav');
        if (window.scrollY > 50) {
            nav.classList.remove('shrinknav-class')
            nav.classList.add('expandnav-class')
        } else {
            nav.classList.remove('expandnav-class')
            nav.classList.add('shrinknav-class')
        }
        void nav.offsetWidth;
    })

})

function parseStat(stat) {

    let returnVal;

    if (stat.includes("+")) {
        let list = stat.split("+")
        returnVal = [list[0], parseInt(list[1]), "flat"];
    
    } else if (stat.includes("%")) {
        let list = stat.split("%");
        returnVal = [list[0], parseFloat(list[1]), "percentage"];
    
    } else {
        return ["dmg", 0, "percentage"];
    }
    if (Number.isNaN(returnVal[1])) {
        returnVal[1] = 0;
    }
    return returnVal;
    
}

function createDropdown(place, displayName, name, values) {
    let element, appendElement, appendElement2, appendElement3;

    element = document.createElement("div");

    if ($.type(displayName) == "string") {
        displayName = [displayName];
    }

    displayName.forEach(label => {
        appendElement = document.createElement("label");
        appendElement.innerHTML = label;
        element.appendChild(appendElement);
    });
    if (name == null) {
        place.appendChild(element);
        return;
    }

    appendElement = document.createElement("div");
    appendElement.classList.add("dropdown");
    appendElement.setAttribute("name", name);

    appendElement.insertAdjacentHTML(
        "afterbegin",
        `<button class="dropdown-field" onclick="toggleDropdownContent(this)">${values[0]}</button>`
    )

    appendElement2 = document.createElement("div");
    appendElement2.classList.add("dropdown-content");
    appendElement2.classList.add("dropdown-content-animate");
    values.forEach(value => {
        appendElement2.insertAdjacentHTML(
            "beforeend",
            `<p onclick="sendData(this)">${value}</p>`
        )
    });
    appendElement.appendChild(appendElement2);
    element.appendChild(appendElement);
    place.appendChild(element);
}

function globalUpdater() {
    console.log(myValues);

    let subParsed;

    // character

    let characterLevelIndex = ["70", "70+", "80", "80+", "90"].indexOf(myValues["character_level"]);

    myValues["character_hp"] = characterBaseValues["hp"][characterLevelIndex];
    myValues["character_atk"] = characterBaseValues["atk"][characterLevelIndex];
    myValues["stats"]["character"] = characterBaseValues["sub"][characterLevelIndex];

    subParsed = parseStat(myValues["stats"]["character"]);

    document.getElementById('character-stat-hp').children[2].innerHTML = myValues["character_hp"];
    document.getElementById('character-stat-atk').children[2].innerHTML = myValues["character_atk"];
    document.getElementById('character-stat-sub').children[1].innerHTML = statToString[subParsed[0]];
    document.getElementById('character-stat-sub').children[2].innerHTML = subParsed[1] + (subParsed[2]=="percentage" ? "%" : "");

    // weapon

    let weaponLevelIndex = ["70", "70+", "80", "80+", "90"].indexOf(myValues["weapon_level"]);
    let weaponDetails = weaponBaseValues[myValues["weapon"]];

    myValues["weapon_atk"] = weaponBaseAttackValues[weaponDetails["atk"]][weaponLevelIndex];
    myValues["stats"]["weapon"] = weaponBaseAttackValues[weaponDetails["sub"]][weaponLevelIndex]; //weaponDetails["sub"][weaponLevelIndex];

    subParsed = parseStat(myValues["stats"]["weapon"]);
    console.log(subParsed);

    document.getElementById('weapon-stat-atk').children[2].innerHTML = myValues["weapon_atk"];
    document.getElementById('weapon-stat-sub').children[1].innerHTML = statToString[subParsed[0]];
    document.getElementById('weapon-stat-sub').children[2].innerHTML = (subParsed[1]==0 ? "" : subParsed[1]) + (subParsed[2]=="percentage" ? "%" : "");
}

function weaponUpdater(weaponName) {
    myValues["weapon"] = weaponName;
    myValues["weapon_level"] = "70";

    document.getElementById('weapon-img').src = `Media/hutao/weapons/${myValues["weapon"]}.png`;

    weaponPickers = document.getElementById("weapon").getElementsByClassName("pickers")[0];
    Array.from(weaponPickers.children).forEach(element => {
        element.remove()
    });

    if (!("passives" in weaponBaseValues[myValues["weapon"]])) {
        createDropdown(
            weaponPickers,
            ["Weapon Level", "70"]
        )
    } else {
        createDropdown(
            weaponPickers,
            "Weapon Level",
            "weapon_level",
            ["70", "70+", "80", "80+", "90"]
        )
    }
}

function sendData(e) {
    let value = e.innerHTML;

    let dropdownEl = e.parentElement.parentElement;
    let dropdownField = dropdownEl.getElementsByTagName('button')[0];
    let dataField = dropdownEl.getAttribute("name");

    myValues[dataField] = value;
    dropdownField.innerHTML = value;

    globalUpdater();
}

function toggleDropdownContentAnimationHandler(e) {
    let dropdownField = e;
    let dropdownContent = e.parentElement.getElementsByTagName('div')[0];

    dropdownField.insertAdjacentHTML(
        "afterend",
        `<button class="dropdown-field" onclick="toggleDropdownContent(this)">${dropdownField.innerHTML}</button>`
    )
    dropdownField.remove()
    dropdownContent.classList.add("dropdown-content-animate");
}

function toggleDropdownContent(e) {
    let dropdownContent = e.parentElement.getElementsByTagName('div')[0];
    let dropdownField = e.parentElement.getElementsByTagName('button')[0];

    if (dropdownContent.classList.contains("dropdown-content-static")) {
        
        if (!window.matchMedia("(pointer: coarse)").matches) {

            dropdownField.setAttribute("onmouseleave", "toggleDropdownContentAnimationHandler(this)")
            dropdownField.insertAdjacentHTML(
                "afterend",
                `<button class="dropdown-field" onmouseleave="toggleDropdownContentAnimationHandler(this)" onclick="toggleDropdownContent(this)">${dropdownField.innerHTML}</button>`
            )
            dropdownField.remove()
        }
        dropdownContent.classList.remove("dropdown-content-static");
        
    } else {
        dropdownContent.classList.add("dropdown-content-static");
        dropdownContent.classList.remove("dropdown-content-animate");
    }

}