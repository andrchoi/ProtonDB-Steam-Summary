'use strict';

const SUMMARYID = 'PDBRSAddon_summary';
const REPORTSID = 'PDBRSAddon_reports';
const METABLOCKID = 'PDBRSAddon_info';

let summary;
let reports;

let appID = getSteamAppID();

function handleSummary(res) {
    if (summary !== null) {
        summary = res;
    }
    updateSummary(summary);
    
}

function handleReports(res) {
    reports = res;
    if (reports === {}) {
        summary = null
    }
    updateReports(reports);
}

function updateReports(reports) {
    let reportsBlock = document.getElementById(REPORTSID);

    let fixes = getReportedFixes(reports)
    console.log(fixes);
    if (fixes.length > 0) {
        let fixesBlock = document.createElement('div');
        let title = document.createElement('span');
        title.innerText = 'Recommended Fixes: ';
        fixesBlock.appendChild(title);

        let firstInList = true;
        fixes.forEach(function (fix) {
            let fixText = document.createElement('span');
            if (!firstInList) {  
                fixText.innerText = ', ';
            }
            firstInList = false;
            fixText.innerText += fix.name;

            fixesBlock.appendChild(fixText);
        })
        reportsBlock.appendChild(fixesBlock)

        let cfgLinkContainer = document.createElement('div');
        reportsBlock.appendChild(cfgLinkContainer);

        let configLink = document.createElement('a');
        configLink.href = 'https://github.com/ValveSoftware/Proton#runtime-config-options';
        configLink.target = '_blank';
        configLink.innerText = 'Click here for more config information.';
        cfgLinkContainer.appendChild(configLink);

        let lineBreak = document.createElement('br');
        reportsBlock.appendChild(lineBreak);
    }

    let totalCount = document.createTextNode('Based on '+reports.length+' total reports.')
    reportsBlock.appendChild(totalCount);
}

function updateSummary(summary) {
    console.log(summary)
    let summaryBlock = document.getElementById(SUMMARYID);
    summaryBlock.firstChild.remove();

    let tierInfo;
    
    let lineBreak = document.createElement('br');
    let overallTier = document.createElement('b');
    summaryBlock.appendChild(overallTier);

    if (summary.tier !== 'pending') {
        overallTier.innerText = 'Overall Tier: ';
        tierInfo = getTierInfo(summary.tier);
        summaryBlock.appendChild(tierInfo);

        summaryBlock.appendChild(lineBreak);

        let recentTier = document.createElement('b');
        recentTier.innerText = 'Trending Tier: ';
        summaryBlock.appendChild(recentTier);

        tierInfo = getTierInfo(summary.trendingTier);
        summaryBlock.appendChild(tierInfo);
    } else {
        overallTier.innerText = 'Provisional Tier (Needs Reports!): ';

        tierInfo = getTierInfo(summary.provisionalTier);
        summaryBlock.appendChild(tierInfo);
    }

    lineBreak = document.createElement('br');
    summaryBlock.appendChild(lineBreak);
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
    link.href = 'https://www.protondb.com/app/'+appID;
    link.target = '_blank';
    link.innerText = 'See more details on ProtonDB.';
    pdbLink.appendChild(link);

    return element;
}

getProtonDBSummary(appID);
getProtonDBReports(appID);

let infoBlock = makeProtonInfoBlock();
let container = document.querySelector('.game_meta_data');
if (container) {
    container.insertBefore(infoBlock, container.firstChild);
}
