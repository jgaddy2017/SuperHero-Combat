/*
function createSuggestionDrop(heroList){
    const suggestions = heroList.map(hero => `<option>${hero}</option>`);
    return `<select>${suggestions}</select>`;
}
function renderSuggestionDrop(heroList){
    const suggestionDropDown = createSuggestionDrop(heroList);
    $('.heroList').html(suggestionDropDown);
}
*/
function displaySuggestion(){
    
    $('.characterSelect').autocomplete({
        source: characterArray
    });
}
function displayBlankNotification(){
    const blankNotification = '<p class="errorMessage">Please enter a character into both input boxes</p>';
    $('#displayCharacterStats').html(blankNotification);
}
function displayWrongHeroNotification(){
    const wrongHeroNotification = '<p class="errorMessage">Not a valid character</p>';
    $('#displayCharacterStats').html(wrongHeroNotification);
}

function checkForCharacters(firstHero, secondHero){
    if(characterArray.includes(firstHero) && characterArray.includes(secondHero)){
        return true;
    }
    return false;
}
function preSuperHeroSearch(firstHero, secondHero){
    let checkForHeros = checkForCharacters(firstHero, secondHero);
    if(firstHero == "" || secondHero == ""){
        displayBlankNotification();
    }
    else if(checkForHeros == false){
        displayWrongHeroNotification();
    }
    else{
        getSuperHeroData(firstHero, secondHero);
    }
}

function submitHeroData(){
    $('#characterForm').submit(function(event){
        event.preventDefault();
        const firstHero = $('#firstHero').val();
        const secondHero = $('#secondHero').val();
        preSuperHeroSearch(firstHero, secondHero);
        //getSuperHeroData(firstHero, secondHero);
    });
}

function getSuperHeroData(firstHeroName, secondHeroName){
    $.when(runSuperHeroApi(firstHeroName), runSuperHeroApi(secondHeroName)).done(function(firstHeroData, secondHeroData){
        let firstHero = checkForRightHero(firstHeroData, firstHeroName);
        let secondHero = checkForRightHero(secondHeroData, secondHeroName);
        displayData(firstHero, firstHeroName, secondHero, secondHeroName);
    });
}

function runSuperHeroApi(superHero){
    
    return $.ajax({
        dataType: 'json',
        type: 'GET',
        crossDomain: true,
        url: `https://sleepy-plateau-97577.herokuapp.com/http://www.superheroapi.com/api.php/2423459621001222/search/${superHero}`,
        success: function(data) {
            return data;
        }
    
    });
}

function checkForRightHero(data, heroName){
    let rightHero;
    data[0].results.forEach(function(result){
        if(result.name.toLowerCase() == heroName.toLowerCase()){
            rightHero = result;
        }
    });
    return rightHero;
}

function winnerInfo(firstHeroName, secondHeroName, winner){
    let firstImgCircle, secondImgCircle, firstHeroResult, secondHeroResult;
    
    if(winner == firstHeroName && winner == secondHeroName){
        firstImgCircle = 'tiedCircle';
        secondImgCircle = 'tiedCircle';
        firstHeroResult = `<span class="winner-result">Tied: </span>`;
        secondHeroResult = `<span class="winner-result">Tied: </span>`;
    }else if(winner == firstHeroName){
        firstImgCircle = 'winnerCircle';
        secondImgCircle = 'loserCircle';
        firstHeroResult = `<span class="winner-result">Winner: </span>`;
        secondHeroResult = `<span class="winner-result">Loser: </span>`;
    }else{
        firstImgCircle = 'loserCircle';
        secondImgCircle = 'winnerCircle';
        firstHeroResult = `<span class="winner-result">Loser: </span>`;
        secondHeroResult = `<span class="winner-result">Winner: </span>`;
    }
    return [firstImgCircle, secondImgCircle, firstHeroResult, secondHeroResult];
}

function displayData(firstHero, firstHeroName, secondHero, secondHeroName){
    let heroStats = createStatList(firstHero, secondHero);
    let heroImg = getHeroImg(firstHero, secondHero);
    let winner = findWinner(firstHero, firstHeroName, secondHero, secondHeroName);
    let winInformation = winnerInfo(firstHeroName, secondHeroName, winner);

   let heroData = `<div class="row">
                        <div class="col-6">
                            <div class="heroNameDiv">
                                ${winInformation[2]}
                                <h4 class="heroName">${firstHeroName}</h4>
                            </div>
                            <div class="imgHolder">
                                <img class="${winInformation[0]}" src="${heroImg[0]}">
                            </div>
                            <div class="statHolder">
                                ${heroStats[0]}
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="heroNameDiv">
                                ${winInformation[3]}
                                <h4 class="heroName">${secondHeroName}</h4>
                            </div>
                            <div class="imgHolder">
                                <img class="${winInformation[1]}" src="${heroImg[1]}">
                            </div>
                            <div class="statHolder">
                                ${heroStats[1]}
                            </div>
                        </div>
                   </div>`;
    $('#displayCharacterStats').html(heroData);

}

function createStatList(firstHero, secondHero){
    let firstHeroStats = "";
    let secondHeroStats = "";
    Object.keys(firstHero.powerstats).forEach(function(key){
        if(parseInt(firstHero.powerstats[key]) > parseInt(secondHero.powerstats[key])){
            firstHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="higherStat">${firstHero.powerstats[key]}</span></p>`;
            secondHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="lowerStat">${secondHero.powerstats[key]}</span></p>`;
        }else if(parseInt(firstHero.powerstats[key]) < parseInt(secondHero.powerstats[key])){
            firstHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="lowerStat">${firstHero.powerstats[key]}</span></p>`;
            secondHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="higherStat">${secondHero.powerstats[key]}</span></p>`;
        }else{
            firstHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="sameStat">${firstHero.powerstats[key]}</span></p>`;
            secondHeroStats += `<p class="statPara"><span class="statKey">${key}: </span><span class="sameStat">${secondHero.powerstats[key]}</span></p>`;
        }
    });
    return [firstHeroStats, secondHeroStats];
}

function getHeroImg(firstHero, secondHero){
    let firstHeroImg = firstHero.image.url;
    let secondHeroImg = secondHero.image.url;
    return [firstHeroImg, secondHeroImg];
}
function findWinner(firstHero, firstHeroName, secondHero, secondHeroName){
    const weights = {
        'intelligence': .5,
        'strength': .5,
        'speed': .5,
        'durability': .5,
        'power': .5,
        'combat': .5
    };

    const scores = Object.keys(firstHero.powerstats).reduce((acc, key) => {
        acc = {
          heroOneScore: acc.heroOneScore + (firstHero.powerstats[key] * weights[key]),
          heroTwoScore: acc.heroTwoScore + (secondHero.powerstats[key] * weights[key]),
        };
        return acc;
    }, {heroOneScore: 0, heroTwoScore: 0})
  
    return scores.heroOneScore >= scores.heroTwoScore ? firstHeroName : secondHeroName;
    
}



function startApplication(){
    displaySuggestion();
    submitHeroData();
}
$(startApplication());