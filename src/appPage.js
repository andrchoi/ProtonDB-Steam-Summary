'use strict';

const SUMMARYID = 'PDBRSAddon_summary';
const REPORTSID = 'PDBRSAddon_reports';
const COUNTID = 'PDBRSAddon_count';
const METABLOCKID = 'PDBRSAddon_info';

let isNative = false;


function getSteamAppID() {
    let currentURL = window.location.href;
    let splitURL = currentURL.split('/');
    let appID = splitURL[splitURL.indexOf('app') + 1];

    return parseInt(appID);
}

async function handleSummary(appID) {
    let protonURL = 'https://www.protondb.com/';
    let protonAPI = 'api/v1/reports/summaries/';

    let url = protonURL + protonAPI + appID + '.json';

    try {
        let res = await fetch(url);
        let result = await res.json();
        console.log(JSON.stringify(result));
        updateSummary(result);
    } catch(err) {
        updateSummary({})
    }
}

async function handleReports(appID) {
    let reportURL = 'https://protondb.max-p.me/games/';
    let url = reportURL + appID + '/reports';

    try {
        let res = await fetch(url);
        let result = await res.json();
        console.log(JSON.stringify(result));
        updateReports(result);
    } catch(err) {
        console.log(err);
    }
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
            fixText.setAttribute('title', 'Mentioned in ' + fix.count + ' recent reports');

            fixesBlock.appendChild(fixText);
        })
        reportsBlock.appendChild(fixesBlock)
    }
}

function newTableRatingRow(tbody, desc, tier) {
    let row = document.createElement('tr');
    tbody.appendChild(row);

    let rowTitle = document.createElement('td');
    rowTitle.setAttribute('class', 'ellipsis')
    rowTitle.style.textAlign = 'left';
    rowTitle.innerText = desc + ' Tier:';
    row.appendChild(rowTitle);

    let rowRating = document.createElement('td');
    rowRating.setAttribute('class', 'checkcol');
    rowRating.appendChild(tier);
    row.appendChild(rowRating);
}

function setReportsCount(count) {
    let countContainer = document.getElementById(COUNTID)[0];
    let reportsText = document.createElement('span');
    if (!isNative) {
        reportsText.innerText = 'Based on ' + count + ' total reports.';
        countContainer.appendChild(reportsText);
    }
}
function updateSummary(summary) {
    let summaryBlock = document.getElementById(SUMMARYID);
    summaryBlock.firstChild.remove();

    let tierInfo;

    let tierTable = document.createElement('table');
    tierTable.setAttribute('class', 'game_language_options');
    tierTable.style.borderCollapse = 'initial';
    tierTable.style.width = '75%';
    let tbody = document.createElement('tbody');

    if (isNative) {
        tierInfo = getTierInfo('native');
        newTableRatingRow(tbody, 'Overall', tierInfo);
    }
    else {
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
        }
        else {
            tierInfo = getTierInfo(false);
            summary.total = 0;
            newTableRatingRow(tbody, 'Overall', tierInfo);
        }
    }

    tierTable.appendChild(tbody);
    summaryBlock.appendChild(tierTable);

    if (!isNative) {
        let totalCount = document.createElement('div');
        totalCount.setAttribute('id', COUNTID);
        let reportsText = document.createElement('span');
        reportsText.innerText = 'Based on ' + summary.total + ' total reports.';
        totalCount.appendChild(reportsText);
        summaryBlock.appendChild(totalCount);
    }
}

function makeLink(url, text) {
    let linkContainer = document.createElement('div');

    let link = document.createElement('a');
    link.setAttribute('class', 'linkbar');
    link.href = url;
    link.target = '_blank';
    link.innerText = text;
    linkContainer.appendChild(link);

    return linkContainer;
}

function makeProtonInfoBlock() {
    let element = document.getElementsByClassName(METABLOCKID);
    if (element.length > 0) {
        element = element[0];
        while (element.childElementCount > 0) {
            element.firstChild.remove();
        }
    } else {
        element = document.createElement('div');
        element.className = 'block responsive_apppage_details_right game_details ' + METABLOCKID;
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

    let lineBreak = document.createElement('br');
    content.appendChild(lineBreak);

    let url = 'https://www.protondb.com/app/' + appID;
    let text = 'See more details on ProtonDB.';
    let link = makeLink(url, text);
    content.appendChild(link);

    url = 'https://github.com/ValveSoftware/Proton#runtime-config-options';
    text = 'More config information.';
    link = makeLink(url, text);
    content.appendChild(link);

    return element;
}

function checkForLinux() {
    let purchaseArea = document.getElementById('game_area_purchase');
    let icon = purchaseArea.getElementsByClassName('platform_img linux');
    if (icon.length > 0) {
        isNative = true;
    }
}

let appID = getSteamAppID();
handleSummary(appID);
handleReports(appID);

checkForLinux();

let infoBlock = makeProtonInfoBlock();
let container = document.querySelector('.game_meta_data');
if (container) {
    container.insertBefore(infoBlock, container.firstChild);
}
