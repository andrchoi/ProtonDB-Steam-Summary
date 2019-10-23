'use strict';

const TIERS = {
    'NATIVE': 'native',
    'PLAT': 'platinum',
    'GOLD': 'gold',
    'SILVER': 'silver',
    'BRONZE': 'bronze',
    'BORK': 'borked'
}

function getSteamAppID() {
    let currentURL = window.location.href;
    let splitURL = currentURL.split('/');
    let appID = splitURL[splitURL.indexOf('app')+1];

    return parseInt(appID);
}

function getProtonDBSummary(appID) {
    let protonURL = 'https://www.protondb.com/';
    let protonAPI = 'api/v1/reports/summaries/';

    fetch(protonURL+protonAPI+appID+'.json').then(
        res => res.json()).then(function(res) {
            console.log(res);
            if (res !== []) {
                handleSummary(res)
            } else {
                handleSummary([]);
            }
        }
    ).catch(function(error) {
        console.log(error);
    })    
}

function test() {

    console.log(error)
}
function handleXHR() {
    handleSummary(JSON(this.responseText));
}

function getTierInfo(tier) {
    let info = {
        'title': getFormattedTier(tier),
        'description': null 
    }
    if (tier === TIERS.NATIVE){
        info.description = 'Runs natively on Linux. Hooray!';
    }
    else if (tier === TIERS.PLAT){
        info.description = 'Runs as well as Windows without changes.';
    }
    else if (tier === TIERS.GOLD){
        info.description = 'Runs as well as Windows after minor fixes.';
    }
    else if (tier === TIERS.SILVER){
        info.description = 'Runs after tweaks and/or minor issues.';
    }
    else if (tier === TIERS.BRONZE){
        info.description = 'Runs with tweaks but has crashes and/or major issues.';
    }
    else if (tier === TIERS.BORK){
        info.description = 'Unplayable issues or will not start.';
    } 
    else {
        info.description = 'Not enough reports to generate a score.';
    }

    let textBlock = document.createElement('span');
    textBlock.innerText = info.title;
    textBlock.setAttribute('title', info.description);
    return textBlock;
}


function getFormattedTier(tier) {
    let ans = 'N/A';
    if (tier){
        ans = tier.charAt(0).toUpperCase() + tier.slice(1);
    }
    return ans
}