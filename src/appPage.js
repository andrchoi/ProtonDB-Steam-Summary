'use strict';

const SUMMARYID = 'PDBRSAddon_summary';
const REPORTSID = 'PDBRSAddon_reports';
const METABLOCKID = 'PDBRSAddon_info';

let summary;
let reports;

let isNative = false;


function getSteamAppID() {
    let currentURL = window.location.href;
    let splitURL = currentURL.split('/');
    let appID = splitURL[splitURL.indexOf('app')+1];

    return parseInt(appID);
}

function handleSummary(appID) {
    let protonURL = 'https://www.protondb.com/';
    let protonAPI = 'api/v1/reports/summaries/';

    let url = protonURL+protonAPI+appID+'.json';
    fetch(url).then(
        res => res.json()).then(function(res) {
            summary = res;
        }
    ).catch(function(error) {
        console.log(error);
        summary = {}
    }).finally(function () {
        console.log(summary);
        updateSummary(summary);
    })    
}

function handleReports(appID) {
    let reportURL = 'https://protondb.max-p.me/games/';
    let url = reportURL+appID+'/reports';

    fetch(url).then(
        res => res.json()).then(function(res) {
            reports = res;
        }
    ).catch(function (error) {
        console.log(error);
    }).finally(function () {
        console.log(reports);
        updateReports(reports);
    })
}

function updateReports(reports) {
    let reportsBlock = document.getElementById(REPORTSID);

    let fixes = getReportedFixes(reports);
    if (fixes.length > 0) {
        let fixesBlock = document.createElement('div');
        let title = document.createElement('b');
        title.innerText = 'Recommended Tweaks: ';
        fixesBlock.appendChild(title);

        let firstInList = true;
        fixes.forEach(function (fix) {
            let fixText = document.createElement('span');
            if (!firstInList) {  
                fixText.innerText = ', ';
            }
            firstInList = false;
            fixText.innerText += fix.name;
            fixText.setAttribute('title', 'Mentioned in '+fix.count+' reports');

            fixesBlock.appendChild(fixText);
        })
        reportsBlock.appendChild(fixesBlock)
    }

    if (!isNative){
        let totalCount = document.createTextNode('Based on '+reports.length+' total reports.')
        reportsBlock.appendChild(totalCount);
    }

    let lineBreak = document.createElement('br');
    reportsBlock.appendChild(lineBreak);
    lineBreak = document.createElement('br');
    reportsBlock.appendChild(lineBreak);

    if (fixes.length > 0) {
        let cfgLinkContainer = document.createElement('div');
        reportsBlock.appendChild(cfgLinkContainer);

        let configLink = document.createElement('a');
        configLink.setAttribute('class', 'linkbar');
        configLink.href = 'https://github.com/ValveSoftware/Proton#runtime-config-options';
        configLink.target = '_blank';
        configLink.innerText = 'Click here for more config information.';
        cfgLinkContainer.appendChild(configLink);
    }
}

function newTableRatingRow(tbody, desc, tier){
    let row = document.createElement('tr');
    tbody.appendChild(row);
    
    let rowTitle = document.createElement('td');
    rowTitle.setAttribute('class', 'ellipsis')
    rowTitle.style.textAlign = 'left';
    rowTitle.innerText = desc+' Tier:';
    row.appendChild(rowTitle);

    let rowRating = document.createElement('td');
    rowRating.setAttribute('class', 'checkcol');
    rowRating.appendChild(tier);
    row.appendChild(rowRating);
}

function updateSummary(summary) {
    let summaryBlock = document.getElementById(SUMMARYID);
    summaryBlock.firstChild.remove();

    let tierInfo;
    
    let tierTable = document.createElement('table');
    tierTable.setAttribute('class', 'game_language_options');
    tierTable.style.borderCollapse = '';
    tierTable.style.width = '75%';
    let tbody = document.createElement('tbody');

    if (Object.keys(summary).length > 0) {
        if (summary.tier !== 'pending') {
            tierInfo = getTierInfo(summary.tier);
            newTableRatingRow(tbody, 'Overall', tierInfo)

            tierInfo = getTierInfo(summary.trendingTier);
            newTableRatingRow(tbody, 'Trending', tierInfo)

        } else {
            tierInfo = getTierInfo(summary.provisionalTier);
            newTableRatingRow(tbody, 'Provisional', tierInfo);
        }

        tierTable.appendChild(tbody);

    } else {
        if (isNative){
            tierInfo = getTierInfo('native');
            summaryBlock.appendChild(tierInfo);
            tierTable.appendChild(tbody);
        } else {
            tierTable = document.createElement('span');
            rowTitle.innerText = 'Need reports to generate a score.';
        }
    }
    summaryBlock.appendChild(tierTable);
}

function makeProtonInfoBlock() {
    let element = document.getElementsByClassName(METABLOCKID);
    if (element.length > 0) {
        element = element[0];
        while(element.childElementCount > 0) {
            element.firstChild.remove();
        }
    } else {
        element = document.createElement('div');
        element.className = 'block responsive_apppage_details_right game_details '+METABLOCKID;
    }

    let title = document.createElement('div');
    title.className = 'block_title';
    title.innerText = 'ProtonDB Reports';
    element.appendChild(title);

    let contentContainer = document.createElement('div');
    contentContainer.className = 'block_content';
    element.appendChild(contentContainer);

    let content = document.createElement('div');
    content.className = 'block_content_inner';
    contentContainer.appendChild(content);

    let summaryBlock = document.createElement('div');
    summaryBlock.className = 'details_block';
    summaryBlock.id = SUMMARYID;
    content.appendChild(summaryBlock);

    let loading = document.createElement('p')
    loading.innerText = 'Loading results...';
    summaryBlock.appendChild(loading);

    let reportsBlock = document.createElement('div');
    reportsBlock.className = 'details_block';
    reportsBlock.id = REPORTSID;
    content.appendChild(reportsBlock);

    let pdbLink = document.createElement('div');
    content.appendChild(pdbLink);

    let link = document.createElement('a');
    link.setAttribute('class', 'linkbar');
    link.href = 'https://www.protondb.com/app/'+appID;
    link.target = '_blank';
    link.innerText = 'See more details on ProtonDB.';
    pdbLink.appendChild(link);

    return element;
}

let appID = getSteamAppID();
handleSummary(appID);
handleReports(appID);

let checkforLinux = document.getElementsByClassName('platform_img linux');
if (checkforLinux.length > 0) {
    isNative = true;
}

let infoBlock = makeProtonInfoBlock();
let container = document.querySelector('.game_meta_data');
if (container) {
    container.insertBefore(infoBlock, container.firstChild);
}
