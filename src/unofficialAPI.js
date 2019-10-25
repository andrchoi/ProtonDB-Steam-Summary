'use strict';

const CONFIG_OPTIONS = [
    'D9VK',
    'ESYNC',
    'FSYNC',
    'LGADD',
    'GLSTR',
    'WINED3D',
    'D3D11',
    'D3D10',
]

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

    for (let i = 0; i < max; i++){
        let report = reports[i];
        if (report.rating !== TIERS.PLAT || report.rating !== TIERS.BORK){
            let note = report.notes;
            if (note !== null){
                note = note.toUpperCase();
                for (let j = 0; j < CONFIG_OPTIONS.length; j++){
                    let option = CONFIG_OPTIONS[j];
                    if (note.indexOf(option) !== -1) {
                        list[j].count++;
                    }
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
    return newList;
}
