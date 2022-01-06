console.log("Drug calculation script initialised");

const drugNames = ["cocaine", "heroine", "meth", "weed", "lsd", "moonshine", "p-cocaine", "p-heroine", "p-meth", "p-weed"];

// VEHICLE TRUNK VALUES
// HEMTT Box, HEMTT Fuel, Huron, Caesar-BTT, Xi'an, Orca, MH-9(Stripped), MH-9, Backpack
const trunkArray = [700, 600, 375, 300, 250, 75, 30, 25, 0];
const trunkCells = document.getElementsByClassName("trunk");

// LOOP FOR VEHICLE TRUNK VALUES
for (i=0; i < trunkArray.length; i++) {
  trunkCells[i].value = trunkArray[i];
}

// DRUG INFORMATION TABLE

// gather all weight, price and unitprofit values under 3 variables
let drugWeight = document.getElementsByClassName("weight");
let drugPrice = document.getElementsByClassName("price");
let drugUnitProfit = document.getElementsByClassName("unitProfit");

// calculate the number of rows in the table, assuming all columns are same size
let rowCount = drugWeight.length;

// create a loop to go through and calculate unit profit by dividing price by weight
for ( let i=0; i < rowCount; i++ ) {
  drugUnitProfit[i].value = Math.round(drugPrice[i].value / drugWeight[i].value);
}

// DRUG MENU TABLE

// default the drug multiplier value to default option (Kavala = x1.4)
let drugMultiplier = 1.4;

// define variables for each input area
let drugLevel = document.getElementById("drugLevel");
let drugDealer = document.getElementById("drugDealer");

let backpackType = document.getElementById("backpackType");
let backpackLevel = document.getElementById("backpackLevel");

// on change in input calculate new drug multiplier value
function drugMultiplierUpdate() {
  drugMultiplier = drugLevel.value * drugDealer.value;
  console.log("Drug multiplier: " + drugMultiplier);
  runProfitUpdate();
}

// create a variable to calculate size of backpack, default to no backpack
let backpackSize = 0;

// on change in input calculate new backpack size
// figure out which backpack, then multiply by the perk level
function backpackUpdate() {
  switch (backpackType.value) {
    case "none":
      backpackSize = 0;
      break;
    case "carryall":
      backpackSize = 82;
      break;
    case "bergen":
      backpackSize = 106;
      break;
    default:
      backpackSize = 0;
  }
  backpackSize = Math.floor(backpackSize * backpackLevel.value);
  console.log("Backpack size: " + backpackSize);
  runProfitUpdate();
}

// update all drug profits
// top level loop to multiply each column of drugs
// bottom level loop to multiply each value in the column by the appropriate trunk size
function runProfitUpdate() {
  for (i = 0; i < drugNames.length; i++) {
    let toMultiply = document.getElementsByClassName(drugNames[i]);

    for (let j = 0; j < trunkCells.length; j++) {
      toMultiply[j].value = ((Math.floor(trunkArray[j]/drugWeight[i].value) + Math.floor(backpackSize/drugWeight[i].value)) * drugPrice[i].value * drugMultiplier).toLocaleString('en');

    }
  }
  console.log("Run profits updated");
}

runProfitUpdate();
