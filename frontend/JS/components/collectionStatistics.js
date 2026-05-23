const STATISTICS_ID = {
    totalGames: 'total-games',
    totalPlayTime: 'total-playtime',
    avgPlayers: 'avg-players-val',
    avgAge: 'avg-age-val',
    avgTime: 'avg-time-val'
}

export function renderCollectionStatics(gameList){
    if(!gameList || gameList.length === 0){return;} //The values ​​are zero by default

    let span = document.getElementById(STATISTICS_ID.totalGames);
    if (span) { span.textContent = gameList.length; }

    span = document.getElementById(STATISTICS_ID.totalPlayTime);
    if (span) {
        const totalMinutes = gameList.reduce((sum, game) => sum + game.Time, 0);
        span.textContent = (totalMinutes / 60).toFixed(1);
    }

    span = document.getElementById(STATISTICS_ID.avgPlayers);
    if (span) { 
        const avgMin = getAvg(gameList, 'MinPlayer'); const avgMax = getAvg(gameList, 'MaxPlayer');
        if (avgMin === avgMax)  { span.textContent = `${avgMin}`; }
        else                    { span.textContent = `${avgMin}-${avgMax}`; }
    }
    
    span = document.getElementById(STATISTICS_ID.avgAge);
    if (span) { span.textContent = `${getAvg(gameList, 'MinAge')}`; }

    span = document.getElementById(STATISTICS_ID.avgTime);
    if (span) { span.textContent = `${getAvg(gameList, 'Time')}`;}
}

function getAvg(gameList, key){
    const total = gameList.reduce((acc, game) => acc + (Number(game[key]) || 0), 0);
    return Math.round(total / gameList.length);
}