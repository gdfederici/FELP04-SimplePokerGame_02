var playDeck = [];
var allPlayersHands = [];
var allPlayersScore = [];
var howManyPlayers = 0;
var score = ["High card",
            "Pair",
            "Two Pair",
            "Three of a Kind",
            "Straight",
            "Straight Ace",
            "Flush",
            "Full House",
            "Four of a Kind",
            "Straight Flush",
            "Royal Flush" ];
var playerWinner = 0;


// IT- Il gioco.
// EN- The game.
function pokerGame(players) {
    howManyPlayers = players;
    playDeck = createDeck();
    createPlay(howManyPlayers);
    playerWinner = isWinner(howManyPlayers, allPlayersHands);
    showPlayers(howManyPlayers, allPlayersHands);
    showWinner(playerWinner);
    document.getElementById("choose-players").classList.remove("get-in");
    document.getElementById("choose-players").classList.add("get-out");
    document.getElementById("restart").classList.remove("get-out");
    document.getElementById("restart").classList.add("get-in");
}


// IT- Inizializzo il mazzo inserendo le carte da Asso a Re con 4 cicli, uno per ogni seme.
// EN- Create the deck by inserting cards A -> King with 4 cycles, one for each suit.
// Asso/Ace = 14, Goobo/Jack = 11, Donna/Queen = 12, Re/King = 13
// Cuori/Hearts = 4, Quadri/Diamonds = 3, Fiori/Clubs = 2, Picche/Spades = 1 
function createDeck() {
    let deck = []; 
    for (let j=1; j<=4; j++) {
        for (let i=2; i<=14; i++) {
            deck.push({"rank" : i, "suit" : j});        
        }
    }
    return deck;
}

// IT- Creo le mani per tutti i giocatori.
// EN- Create hands for all players.
function createPlay(numPlayers) {
    for (let i=0; i<numPlayers; i++) {
        allPlayersHands.push(createHand());
    };
    return allPlayersHands;
}

// IT- Creo la mano del giocatore.
// EN- Create player's hand.
function createHand() {
    let hand = [];
    for (let i=0; i<5; i++) { 
        let luck = Math.floor(Math.random() * playDeck.length); // Numero casuale che individua una carta all'interno del mazzo. / Random number that identifies a card in the deck.
        hand = hand.concat(playDeck.splice(luck,1)); // Inserire la carta casuale nella mano dal giocatore e al contempo eliminarla dal mazzo. / Insert the random card into the player's hand and remove it from the deck at the same time.
    }
    hand.sort(function (a, b) { return a.rank - b.rank; }); // Ordinare la mano del giocatore. / Order the player's hand.
    return hand;
}


// IT- Calcolo del vincitore.
// EN- Computing winner.
function isWinner(players, allPlayers) {
    let scorePlayers = [];
    let winner = 0;
    for (let i=0; i<players; i++) {
        scorePlayers.push(finalScore(allPlayers[i]));
        scorePlayers[i].player = i;
    }
    allPlayersScore = scorePlayers.map(x => x); // Copia i risultati nella variabile globale (che non viene ordinata). / Copy results with no order.
    scorePlayers.sort(function (a, b) { return b.points - a.points; }); // Ordinare i risultati. / Order results.
    console.log("risultati");
    console.log(scorePlayers);
    if (scorePlayers[0].points !== scorePlayers[1].points) {
        winner = scorePlayers[0].player;
    }
    else { winner = isDraw(players, scorePlayers); }
    return winner;
}

// IT- Calcolo del vincitore in caso di stessa mano.
// EN- Computing winner in the same hand event.
function isDraw(numPlayers, scoreDraw) {
    let tieScore = [];
    let tieScore2 = [];
    let tie = 0;
    let winnerDraw = "";
    while ( ( tie+1 < numPlayers) && (scoreDraw[tie].points === scoreDraw[tie+1].points) ) {
        tie++;
    }
    tieScore = scoreDraw.slice(0, tie+1);
    console.log("spareggio");
    console.log(tieScore);
    switch (tieScore[0].points) {
        case 10: // Pareggio con scala reale -> controllo seme. / Draw with royal flush -> check suit.
        case 6: // Pareggio con colore -> controllo seme. / Draw with flush -> check suit.
        case 0: // Pareggio con carta più alta -> controllo seme. / Draw with high card -> check suit. 
            tieScore.sort(function (a, b) {return b.suit - a.suit; });
            winnerDraw = tieScore[0].player;
            break;
        case 9: // Pareggio con scala colore -> controllo valore scala. / Draw with straight flush -> check first card's rank.
        case 4: // Pareggio con scala -> controllo valore scala. / Draw with straight -> check first card's rank.
            tieScore.sort(function (a, b) {return b.card2 - a.card2; });
            winnerDraw = tieScore[0].player;
            break;
        case 8: // Pareggio con poker -> controllo valore carte poker. / Draw with four of a kind -> check four of a kind cards' rank.
        case 7: // Pareggio con full -> controllo valore carte tris. / Draw with full house -> check three of a kind cards' rank.
        case 3: // Pareggio con tris -> controllo valore carte tris. / Draw with three of a kind -> check three of a kind cards' rank.
        case 1: // Pareggio con coppia -> controllo valore carte coppia. / Draw with pair -> check pair cards' rank.
            tieScore.sort(function (a, b) {return b.card1 - a.card1; });
            winnerDraw = tieScore[0].player;
            break;
        case 2: // Pareggio con doppia coppia -> controllo valore carte delle due coppie. / Draw with double pair -> check double pair cards' rank.
            tieScore.sort(function (a, b) {return b.card1 - a.card1; });
            if (tieScore[0].points !== tieScore[1].points) {
                winnerDraw = tieScore[0].player;
                break;
            }
            else { // Quando la prima coppia ha stesso valore -> controllo seconda coppia. / Draw with first pair -> check second pair cards' rank.
                tieScore2 = tieScore.slice(0);
                console.log("spareggio doppie coppie");
                console.log(tieScore2);
                tieScore2.sort(function (a, b) {return b.card2 - a.card2; });
                winnerDraw = tieScore2[0].player;
                break;
            }
    }
    return(winnerDraw); 
}

// IT- Calcolo valore mano.
// EN- Computing player's hand value.
function finalScore(cardsHand) {
    let scoreFinal = {'points' : 0, 'card1' : 0, 'card2' : 0, 'suit' : 0,};
    let flush = isFlush(cardsHand);
    let straight = isStraight(cardsHand);
    if (flush && straight) { // Scala reale. / Royal flush.
        cardsHand[3].rank === 13 ? scoreFinal.points = 10 : scoreFinal.points = 9;
        scoreFinal.card1 = cardsHand[3].rank;
        scoreFinal.card2 = cardsHand[0].rank;
        scoreFinal.suit = cardsHand[4].suit;
        return scoreFinal; 
    };
    if (straight) { 
        cardsHand[3].rank === 13 ? scoreFinal.points = 5 : scoreFinal.points = 4;
        scoreFinal.card1 = cardsHand[3].rank;
        scoreFinal.card2 = cardsHand[0].rank;
        return scoreFinal;
    };
    if (flush) { 
        scoreFinal.points = 6;
        return scoreFinal;
    };
    scoreFinal = isSame(cardsHand);
    return scoreFinal;
}

// IT- Controllo colore.
// EN- Check for flush.
function isFlush(cardsHand) {
    return  cardsHand.every(checkSuit => checkSuit.suit === cardsHand[0].suit);
}

// IT- Controllo scala.
// EN- Check for straight.
function isStraight(cardsHand) {
    let checkStraight = true;
    if (cardsHand[0].rank !== 2 && cardsHand[4].rank !== 14) {
        for (let i=0; i<4; i++) {
            if (cardsHand[i].rank+1 !== cardsHand[i+1].rank) { checkStraight = false; break; }
        }
    } else {
        for (let i=0; i<3; i++) {
            if (cardsHand[i].rank+1 !== cardsHand[i+1].rank) { checkStraight = false; break; }
        }
    }
    return checkStraight;
}

// IT- Controllo carte dello stesso valore.
// EN- Check for cards of the same rank.
function isSame(cardsHand) {
    let sameRank = 0;
    let differentRank = [];
    let sameResult = {'points' : 0, 'card1' : 0, 'card2' : 0, 'suit' : 0,};
    for (let i=0; i<cardsHand.length-1; i++) {
        if (cardsHand[i].rank == cardsHand[i+1].rank) { sameRank++; }
        else { differentRank = differentRank.concat(i); }
    }
    // IT- Grazie alla mano ordinata, il numero di carte uguali e la posizione delle diverse permettono la valutazione.
    // EN- Thanks to the orderly hand, the number of identical cards and the position of the different ones allow evaluation.
    switch (sameRank) {
        case 3: // Poker e full. / Four of a Kind and Full House.
            if (cardsHand[1].rank === cardsHand[3].rank) { 
                sameResult.points = 8;
                (cardsHand[0].rank === cardsHand[1].rank) ? sameResult.card1 = cardsHand[0].rank : sameResult.card1 = cardsHand[1].rank; // Valore del poker. / Rank of four of a kind.
            }
            else { 
                sameResult.points = 7;
                if (cardsHand[0].rank === cardsHand[2].rank) { // Valore del tris e della coppia. / Rank of three of a kind and of pair.
                    sameResult.card1 = cardsHand[0].rank; 
                    sameResult.card2 = cardsHand[3].rank;
                }
                else {
                    sameResult.card1 = cardsHand[3].rank;
                    sameResult.card2 = cardsHand[0].rank;
                }
            }
            break;
        case 2: // Tris e Doppia Coppia. / Three of a Kind and Two Pair.
            if ( (differentRank[0] === 2 && differentRank[1] === 3) || (differentRank[0] === 0 && differentRank[1] === 3) || (differentRank[0] === 0 && differentRank[1] === 1) ) {
                sameResult.points = 3;
                if (cardsHand[0].rank === cardsHand[2].rank ) { sameResult.card1 = cardsHand[0].rank; } // Valore del tris. / Rank of three of a kind.
                else { (cardsHand[1].rank === cardsHand[3].rank) ? sameResult.card1 = cardsHand[1].rank : sameResult.card1 = cardsHand[2].rank; }
            }
            else { 
                sameResult.points = 2;
                if (cardsHand[0].rank === cardsHand[1].rank) { // Valore della doppia coppia. / Rank of double pair.
                    sameResult.card2 = cardsHand[0].rank;
                    (cardsHand[2].rank === cardsHand[3].rank) ? sameResult.card1 = cardsHand[2].rank : sameResult.card1 = cardsHand[3].rank;
                }
                else {
                    sameResult.card2 = cardsHand[1].rank;
                    sameResult.card1 = cardsHand[3].rank;
                }
            }
            break;
        case 1: // Coppia. / Pair.
            sameResult.points = 1;
            for (i=0; i<=3; i++) {
                if (differentRank[i] !== i) { // Valore della coppia. / Rank of pair.
                    sameResult.card1 = cardsHand[i].rank;
                    break;
                }
            }
            break;
        case 0: // Carta più alta. / High card.
            sameResult.points = 0;
            sameResult.card1 = cardsHand[4].rank; // Valore della carta più alta. / Rank of high card.
            break;
        default: // Errore. / Some go wrong.
            points = -10000;
    }
    return sameResult;
}


// IT- Mostro la mano del giocatore e il suo punteggio.
// EN- Show player's card and its score.
function showPlayers(players, playerHands) {
    let showCards = "";
    for (let i=0; i<players; i++) {
        //showCards += "<div class='player'>"
        showCards += "<div id='player" + i + "' class='player'>"
        showCards += "<h3>Player " + (i+1) + "</h3>";
        showCards += "<div id='player_hand'>" + showHand(playerHands[i]) + "</div>";
        showCards += "<div class='player_score'>" + displayPoints(allPlayersScore[i]) + "</div>"
        showCards += "</div>"
    }
    document.getElementById("simplepokergame").innerHTML = showCards;
}

// IT- Mostro la mano del giocatore.
// EN- Show player's card.
function showHand(playerHand) {
    let cardValue = "";
    messageStart = "<p class='hand_display'>";
    for (let i=0; i<playerHand.length; i++) {
        switch (playerHand[i].rank) {
            case 13:
                cardValue = "img/13";
                break;
            case 12:
                cardValue = "img/12";
                break;
            case 11:
                cardValue = "img/11";
                break;
            case 10:
                cardValue = "img/10";
                break;
            case 9:
                cardValue = "img/9";
                break;
            case 8:
                cardValue = "img/8";
                break;
            case 7:
                cardValue = "img/7";
                break;
            case 6:
                cardValue = "img/6";
                break;
            case 5:
                cardValue = "img/5";
                break;
            case 4:
                cardValue = "img/4";
                break;
            case 3:
                cardValue = "img/3";
                break;
            case 2:
                cardValue = "img/2";
                break;
            case 14:
                cardValue = "img/14";
                break;
        }
        switch (playerHand[i].suit) {
            case 4:
                cardValue +="H.jpg";
                break;
            case 3:
                cardValue +="D.jpg";
                break;
            case 2:
                cardValue +="C.jpg";
                break;
            case 1:
                cardValue +="S.jpg";
                break;
        }
        messageStart += '<img src="' + cardValue + '" width="100" height="153" loading="lazy" alt="A card" />';
        cardValue = "";
    }
    messageStart += "<br/>";
    return messageStart;
}

// IT- Mostro il punteggio della mano del giocatore.
// EN- Show player' score.
function displayPoints (playerScore) {
    var finalPoint = "<p class='hand_points'>";
    switch (playerScore.points) {
        case 10:  
            finalPoint += "Royal Flush";
            break;
        case 9:  
            finalPoint += "Straight Flush";
            break;
        case 8:  
            finalPoint += "Four of a Kind";
            break;
        case 7:  
            finalPoint += "Full House";
            break;
        case 6:  
            finalPoint += "Flush";
            break;
        case 5:  
            finalPoint += "Straight Ace";
            break;
        case 4:  
            finalPoint += "Straight";
            break;
        case 3:  
            finalPoint += "Three of a Kind";
            break;
        case 2:  
            finalPoint += "Two Pair";
            break;
        case 1:  
            finalPoint += "Pair";
            break;
        case 0:  
            finalPoint += "High Card";
            switch (playerScore.card1) {
                case 14:
                    finalPoint += " -> Ace";
                    break;
                case 13:
                    finalPoint += " -> King";
                    break;
                case 12:
                    finalPoint += " -> Queen";
                    break;
                case 11:
                    finalPoint += " -> Jack";
                    break;
                case 10:
                case 9:
                case 8:
                case 7:
                case 6:
                case 5:
                case 4:
                case 3:
                case 2:
                    finalPoint += " -> " + playerScore.card1;
                    break;
            }
            break;
        }
    finalPoint += "</p>";
    return finalPoint;
}

// IT- Mostro il vincitore.
// EN- Show winner.
function showWinner(nowISeeYou) {
    //document.getElementById("player"+nowISeeYou).innerHTML = "winner";
    document.getElementById("player"+nowISeeYou).classList.add("winner-special");
}


function restart() {
    window.location.reload();
}



/*function modeGod() {
    let hand = [
        [ {'rank' : 2, 'suit' : 2}, {'rank' : 3, 'suit' : 4}, {'rank' : 4, 'suit' : 1}, {'rank' : 10, 'suit' : 3}, {'rank' : 11, 'suit' : 1},],
        [ {'rank' : 4, 'suit' : 3}, {'rank' : 6, 'suit' : 4}, {'rank' : 9, 'suit' : 1}, {'rank' : 11, 'suit' : 4}, {'rank' : 13, 'suit' : 4},],
        [ {'rank' : 4, 'suit' : 2}, {'rank' : 7, 'suit' : 1}, {'rank' : 8, 'suit' : 1}, {'rank' : 12, 'suit' : 2}, {'rank' : 13, 'suit' : 1},],
        [ {'rank' : 3, 'suit' : 1}, {'rank' : 5, 'suit' : 4}, {'rank' : 6, 'suit' : 3}, {'rank' : 9, 'suit' : 3}, {'rank' : 14, 'suit' : 3},],
    ];
    return hand;
}
allPlayersHands = modeGod();*/


