//Jquery that is used for making the dynamic search input
function displaySuggestion(){
    $('.characterSelect').autocomplete({
        source: characterArray
    });
}

//Displays an error message
function displayBlankNotification(){
    const blankNotification = '<p class="errorMessage">Please enter a character into both input boxes</p>';
    $('#displayCharacterStats').html(blankNotification);
}
function displayWrongHeroNotification(){
    const wrongHeroNotification = '<p class="errorMessage">Not a valid character</p>';
    $('#displayCharacterStats').html(wrongHeroNotification);
}
function displayApiError(){
    const noInternetNotification = '<p class="errorMessage">There is a problem with the SuperHero API</p>';
    $('#displayCharacterStats').html(noInternetNotification);
}

//checks to make sure the character is a valid one
function checkForCharacters(heroName){
    for(var i = 0; i < characterArray.length; i++){
        if(heroName.toLowerCase() == characterArray[i].toLowerCase()){
            return true;
        }
    }

    return false;
}

//makes sure the two inputs are not empty and makes sure you picked a valid character
function preSuperHeroSearch(firstHero, secondHero){
    let checkForFirstHero = checkForCharacters(firstHero);
    let checkForSecondHero = checkForCharacters(secondHero);
    if(firstHero == "" || secondHero == ""){
        displayBlankNotification();
    }
    else if(checkForFirstHero == false || checkForSecondHero == false){
        displayWrongHeroNotification();
    }
    else{
        getSuperHeroData(firstHero, secondHero);
    }
}

//handles the submit button 
function submitHeroData(){
    $('#characterForm').submit(function(event){
        event.preventDefault();
        displayOriginalSubmit();
        const firstHero = $('#firstHero').val();
        const secondHero = $('#secondHero').val();
        preSuperHeroSearch(firstHero, secondHero);
    });
}
//changes from the opening big button to the original small submit button 
function displayOriginalSubmit(){
    let original = `<button type="submit" class="submitButton">
                    <img class="fightIcon" src="https://cdn.iconscout.com/public/images/icon/premium/png-512/swords-weapon-medieval-sword-fight-3e0c44d4d1f9a463-512x512.png">
                  </button>`;
    $('.submitDiv').html(original);
}

//Because the app runs the api search twice and needs both information at the same time
//this is a promise to not run the code until both hero information comes back
function getSuperHeroData(firstHeroName, secondHeroName){
    $.when(runSuperHeroApi(firstHeroName), runSuperHeroApi(secondHeroName)).done(function(firstHeroData, secondHeroData){
        let firstHero = checkForRightHero(firstHeroData, firstHeroName);
        let secondHero = checkForRightHero(secondHeroData, secondHeroName);
        displayData(firstHero, firstHeroName, secondHero, secondHeroName);
    }).fail(function(){
        displayApiError();
    });
}

//pulls information back from the super hero api
//uses a proxy server
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

//this is used to make sure the application uses the picked hero
//Ex if you type in thor, the first result is lex luTHOR
function checkForRightHero(data, heroName){
    let rightHero;
    data[0].results.forEach(function(result){
        if(result.name.toLowerCase() == heroName.toLowerCase()){
            rightHero = result;
        }
    });
    return rightHero;
}

//decides the color and text to display based on the winner and loser
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
        firstHeroResult = `<span class="winner-result greenWin">Winner: </span>`;
        secondHeroResult = `<span class="winner-result redLoss">Loser: </span>`;
    }else{
        firstImgCircle = 'loserCircle';
        secondImgCircle = 'winnerCircle';
        firstHeroResult = `<span class="winner-result redLoss">Loser: </span>`;
        secondHeroResult = `<span class="winner-result greenWin">Winner: </span>`;
    }
    return [firstImgCircle, secondImgCircle, firstHeroResult, secondHeroResult];
}

//gets needed information to display
//displays all data
function displayData(firstHero, firstHeroName, secondHero, secondHeroName){
    let heroStats = createStatList(firstHero, secondHero);
    let heroImg = getHeroImg(firstHero, secondHero);
    let winner = findWinner(firstHero, firstHeroName, secondHero, secondHeroName);
    let winInformation = winnerInfo(firstHeroName, secondHeroName, winner);

   let heroData = `<div class="row heroArea">
                        <div class="col-6">
                            <div class="heroNameDiv">
                                ${winInformation[2]}
                                <h4 class="heroName">${firstHeroName}</h4>
                            </div>
                            <div class="imgHolder">
                                <img class="imgCircle ${winInformation[0]}" src="${heroImg[0]}">
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
                                <img class="imgCircle ${winInformation[1]}" src="${heroImg[1]}">
                            </div>
                            <div class="statHolder">
                                ${heroStats[1]}
                            </div>
                        </div>
                   </div>`;
    $('#displayCharacterStats').html(heroData);

}

//creates the list of stats for each of the heros
//the if statements are used to determine which stats are higher and color codes them
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

//returns an array of the urls for the hero images
function getHeroImg(firstHero, secondHero){
    let firstHeroImg = firstHero.image.url;
    let secondHeroImg = secondHero.image.url;
    return [firstHeroImg, secondHeroImg];
}

//looks at the the stats between the two heros and returns the winner
//firstHeroName and secondHeroName are just used as the return value
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

//displays the openning screen
function openingPage(){
    let opening = `<p class="openingStatement">Enter two characters and click the fight button below to see who would win</p>
                    <button type="submit" class="submitButtonOpening">
                        <img class="fightIconOpening" src="https://cdn.iconscout.com/public/images/icon/premium/png-512/swords-weapon-medieval-sword-fight-3e0c44d4d1f9a463-512x512.png">
                    </button>`;
    $('.submitDiv').html(opening);
}


function startApplication(){
    openingPage();
    displaySuggestion();
    submitHeroData();
}
//starts the application
$(startApplication());