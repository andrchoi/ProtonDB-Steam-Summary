'use strict';

const TIERS = {
    'NATIVE': 'native',
    'PLAT': 'platinum',
    'GOLD': 'gold',
    'SILVER': 'silver',
    'BRONZE': 'bronze',
    'BORK': 'borked'
}

const CONFIG_OPTIONS = [
    'D9VK',
    'ESYNC',
    'FSYNC',
    'LGADD',
    'GLSTR' 
]

const CONFIG_D3D = [
    'WINED3D',
    'D3D11',
    'D3D10',
]

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
        res => res).then(function(res) {
            if (res !== []) {
                res = res.json()
            }
            console.log(res);
            handleSummary(res);
        }
    ).catch(function(error) {
        console.log(error);
    })    
}

function getProtonDBReports(appID) {
    let reportURL = 'https://protondb.max-p.me/games/';
    let url = reportURL+appID+'/reports';

    fetch(url).then(
        res => res.json()).then(function(res) {
            console.log(res);
            handleReports(res);
        }
    ).catch(function (error) {
        console.log(error)
    })
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

function findWhichD3DIndex(note){
    //TODO:
    return 0;
}

function getReportedFixes(reports) {
    let max = 20;
    if (max > reports.length){
        max = reports.length;
    }
    let list = []
    CONFIG_OPTIONS.forEach( function(option) {
        list.push({
            'name': option,
            'count': 0   
        })
    })
    CONFIG_D3D.forEach( function(option) {
        list.push({
            'name': option,
            'count': 0   
        })
    })

    for (let i = 0; i < max; i++){
        if (i === 14) 
            console.log('hi')
        let note = reports[i].notes;
        if (note !== null){
            note = note.toUpperCase();
            if (note.indexOf('D3D') !== -1) {
                list[CONFIG_OPTIONS.length+findWhichD3DIndex(note)].count++;
            }
            for (let j = 0; j < CONFIG_OPTIONS.length; j++){
                let option = CONFIG_OPTIONS[j];
                if (note.indexOf(option) !== -1) {
                    list[j].count++;
                }
            }
        }
    }

    let newList = sortByUnique(list);
    return newList;
}

function sortByUnique(list){
    let newList = list;
    newList.sort(function (a,b) {
        return a.count < b.count;
    })
    for (let i = 0; i < newList.length; i++){
        let entry = newList[i];
        if (!entry.count > 0){
            newList.splice(i,newList.length-i);
            i = list.length;
        }
    }
    return newList
}

function getFormattedTier(tier) {
    let ans = 'N/A';
    if (tier){
        ans = tier.charAt(0).toUpperCase() + tier.slice(1);
    }
    return ans
}