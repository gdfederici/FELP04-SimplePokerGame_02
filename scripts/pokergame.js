
var playDeck = [];
var allPlayersHands = [];
var allPlayersScore = [];
var howManyPlayers = 4;
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
function createPlay(players) {
    for (let i=0; i<players; i++) {
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
/*function testHand() {
    let hand = [ {'rank' : 10, 'suit' : 2}, {'rank' : 11, 'suit' : 2}, {'rank' : 12, 'suit' : 2}, {'rank' : 13, 'suit' : 2}, {'rank' : 14, 'suit' : 2},];
    return hand;
}*/

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
                    sameRusult.card2 = cardsHand[0].rank;
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

// IT- Calcolo somma valore tutte carte del giocatore.
// EN- Computing sum all player's card rank value.
function isSum(cardsHand) {
    let valueCards = cardsHand.map(a => a.rank);
    var sum = valueCards.reduce( (total, value) => total + value);
    return sum;
}

// IT- Calcolo valore mano.
// EN- Computing player's hand value.
function finalScore(cardsHand) {
    let scoreFinal = {'points' : 0, 'card1' : 0, 'card2' : 0, 'suit' : 0,};
    let flush = isFlush(cardsHand);
    let straight = isStraight(cardsHand);
    let rankSum = isSum(cardsHand);
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

// IT- Calcolo del vincitore.
// EN- Computing winner.
function isWinner(players, allPlayers) {
    let scorePlayers = [];
    let tieScore = [];
    let tieScore2 = [];
    let tie = 0;
    let winner ="";
    for (let i=0; i<players; i++) {
        scorePlayers.push(finalScore(allPlayers[i]));
        scorePlayers[i].player = i;
    }
    scorePlayers.sort(function (a, b) { return b.points - a.points; }); // Ordinare i risultati. / Order results.
    console.log("risultati");
    console.log(scorePlayers);
    if (scorePlayers[tie].points !== scorePlayers[tie+1]) {
        winner = "player" + scorePlayers[tie].player;
    }
    while (scorePlayers[tie].points === scorePlayers[tie+1].points && tie<players) {
        tie++;
    }
    tieScore = scorePlayers.slice(0, tie+1);
    console.log("pareggio");
    console.log(tieScore);
    switch (tieScore[0].points) {
        case 10: // Pareggio con scala reale -> controllo seme. / Draw with royal flush -> check suit.
        case 6: // Pareggio con colore -> controllo seme. / Draw with flush -> check suit.
        case 0: // Pareggio con carta più alta -> controllo seme. / Draw with high card -> check suit. 
            tieScore.sort(function (a, b) {return b.suit - a.suit; });
            winner = "player" + tieScore[0].player;
            break;
        case 9: // Pareggio con scala colore -> controllo valore scala. / Draw with straight flush -> check first card's rank.
        case 4: // Pareggio con scala -> controllo valore scala. / Draw with straight -> check first card's rank.
            tieScore.sort(function (a, b) {return b.card2 - a.card2; });
            winner = "player" + tieScore[0].player;
            break;
        case 8: // Pareggio con poker -> controllo valore carte poker. / Draw with four of a kind -> check four of a kind cards' rank.
        case 7: // Pareggio con full -> controllo valore carte tris. / Draw with full house -> check three of a kind cards' rank.
        case 3: // Pareggio con tris -> controllo valore carte tris. / Draw with three of a kind -> check three of a kind cards' rank.
        case 1: // Pareggio con coppia -> controllo valore carte coppia. / Draw with pair -> check pair cards' rank.
            tieScore.sort(function (a, b) {return b.card1 - a.card1; });
            winner = "player" + tieScore[0].player;
            break;
        case 2: // Pareggio con doppia coppia -> controllo valore carte delle due coppie. / Draw with double pair -> check double pair cards' rank.
            tieScore.sort(function (a, b) {return b.card1 - a.card1; });
            if (tieScore[0].points !== scorePlayers[1]) {
                winner = "player" + tieScore[0].player;
                break;
            }
            else { // Quando la prima coppia ha stesso valore -> controllo seconda coppia. / Draw with first pair -> check second pair cards' rank.
                tieScore2 = tieScore.slice(0, 1);
                tieScore2.sort(function (a, b) {return b.card2 - a.card2; });
                winner = "player" + tieScore2[0].player;
                break;
            }
    }
    return(winner); 
}



// IT- Mostro il contenuto, per controllo.
// EN- Show for check.
function show(nowISeeYou) {
    document.getElementById("simplepokergame").innerHTML = nowISeeYou.map(function(item) {
        return item.rank + "-" + item.suit
    }).join("<br />");
}

playDeck = createDeck();
createPlay(howManyPlayers);
console.log(allPlayersHands[0]);
console.log(allPlayersHands[1]);
console.log(allPlayersHands[2]);
console.log(allPlayersHands[3]);
var giocate = isWinner(howManyPlayers, allPlayersHands);
console.log(giocate);