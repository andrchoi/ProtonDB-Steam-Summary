'use strict';

const TIERS = {
    'NATIVE': 'native',
    'PLAT': 'platinum',
    'GOLD': 'gold',
    'SILVER': 'silver',
    'BRONZE': 'bronze',
    'BORK': 'borked'
}

const COLORS = {
    'NATIVE': 'green',
    'PLAT': 'platinum',
    'GOLD': 'gold',
    'SILVER': 'silver',
    'BRONZE': 'bronze',
    'BORK': 'red'
}

function getTierInfo(tier) {
    let info = {
        'title': getFormattedTier(tier),
        'description': null, 
        'color': 'default'
    }
    if (tier){
        if (tier === TIERS.NATIVE){
            info.description = 'Runs natively on Linux. Hooray!';
            info.color = 'green';
        }
        else if (tier === TIERS.PLAT){
            info.description = 'Runs perfectly out of the box.';
            info.color = '#b4c7dc';
        }
        else if (tier === TIERS.GOLD){
            info.description = 'Runs perfectly after tweaks.';
            info.color = '#cfb53b';
        }
        else if (tier === TIERS.SILVER){
            info.description = 'Runs with minor issues, but generally is playable.';
            info.color = 'silver';
        }
        else if (tier === TIERS.BRONZE){
            info.description = 'Runs, but often crashes or has issues preventing from playing comfortably.';
            info.color = '#cd7f32';
        }
        else if (tier === TIERS.BORK){
            info.description = 'Game either won’t start or is crucially unplayable.';
            info.color = 'red';
        }
    } 
    else {
        info.description = 'Not enough reports to generate a score.';
    }

    let padding = '1em';
    let textBlock = document.createElement('span');
    textBlock.innerText = info.title;
    textBlock.setAttribute('title', info.description);
    textBlock.style.backgroundColor = info.color;
    textBlock.style.paddingLeft = padding;
    textBlock.style.paddingRight = padding;
    if (tier){
        textBlock.style.color = 'black';
    }
    return textBlock;
}

function getFormattedTier(tier) {
    let ans = 'N/A';
    if (tier){
        ans = tier.charAt(0).toUpperCase() + tier.slice(1);
    }
    return ans;
}