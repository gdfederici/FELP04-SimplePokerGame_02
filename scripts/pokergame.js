
var playDeck = [];
var playerHand = [];
var allPlayersHands = [];
var players = 4;

// IT- Inizializzo il mazzo inserendo le carte da Asso a Re con 4 cicli, uno per ogni seme.
// EN- Create the deck by inserting cards A -> King with 4 cycles, one for each suit.
// Asso/Ace = 14, Goobo/Jack = 11, Donna/Queen = 12, Re/King = 13
// Cuori/Hearts = 4, Quadri/Diamonds = 3, Fiori/Clubs = 2, Picche/Spades = 1 
function createDeck() {
    let deck = []; 
    for (j=1; j<=4; j++) {
        for (i=2; i<=14; i++) {
            deck.push({"rank" : i, "suit" : j});        
        }
    }
    return deck;
}

// IT- Creo la mano del giocatore.
// EN- Create player's hand.
function createHand() {
    let hand = [];
    for (i=0; i<5; i++) { 
        let luck = Math.floor(Math.random() * playDeck.length); // Numero casuale che individua una carta all'interno del mazzo. / Random number that identifies a card in the deck.
        hand = hand.concat(playDeck.splice(luck,1)); // Inserire la carta casuale nella mano dal giocatore e al contempo eliminarla dal mazzo. / Insert the random card into the player's hand and remove it from the deck at the same time.
    }
    hand.sort(function (a, b) { return a.rank - b.rank; }); // Ordinare la mano del giocatore. / Order the player's hand.
    return hand;
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
        for (i=0; i<4; i++) {
            if (cardsHand[i].rank+1 !== cardsHand[i+1].rank) { checkStraight = false; break; }
        }
    } else {
        for (i=0; i<3; i++) {
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
    let points = 0;
    for (i=0; i<cardsHand.length-1; i++) {
        if (cardsHand[i].rank == cardsHand[i+1].rank) { sameRank++; }
        else { differentRank = differentRank.concat(i); }
    }
    // IT- Grazie alla mano ordinata, il numero di carte uguali e la posizione delle diverse permettono la valutazione.
    // EN- Thanks to the orderly hand, the number of identical cards and the position of the different ones allow evaluation.
    switch (sameRank) {
        case 3: // Poker e full. / Four of a Kind and Full House.
            if (cardsHand[1].ran==cardsHand[3].rank) { points = 800; }
            else { points = 700; }
            break;
        case 2: // Tris e Doppia Coppia. / Three of a Kind and Two Pair.
            if ( (differentRank[0] == 2 && differentRank[1] == 3) || (differentRank[0] == 0 && differentRank[1] == 3) || (differentRank[0] == 0 && differentRank[1] == 1) ) { points = 300; }
            else { points = 200; }
            break;
        case 1: // Coppia. / Pair.
            points = 100;
            break;
        case 0: // Carta più alta. / High card.
            points = 0;
            break;
        default: // Errore. / Some go wrong.
            points = 0;
    }
    return points;
}

// IT- Calcolo valore carte del giocatore.
// EN- Computing player's card rank value.
function isSum(cardsHand) {
    let valueCards = cardsHand.map(a => a.rank);
    var sum = valueCards.reduce( (total, value) => total + value);
    return sum;
}

// IT- Calcolo valore mano.
// EN- Computin player's hand value.
function finalScore(cardsHand) {
    let scoreFinal = 0;
    let flush = isFlush(cardsHand);
    let straight = isStraight(cardsHand);
    let rankSum = isSum(cardsHand);
    if (flush && straight) { 
        cardsHand[3].card === 13 ? scoreFinal = 1000 : scoreFinal = 900;
        return scoreFinal + rankSum; 
    };
    if (straight) { 
        cardsHand[3].card === 13 ? scoreFinal = 500 : scoreFinal = 400;
        return scoreFinal + rankSum;
    };
    if (flush) { 
        scoreFinal = 600;
        return scoreFinal + rankSum;
    };
    scoreFinal = isSame(cardsHand);
    return scoreFinal + rankSum;
}


// IT- Mostro il contenuto, per controllo.
// EN- Show for check.
function show(nowISeeYou) {
    document.getElementById("simplepokergame").innerHTML = nowISeeYou.map(function(item) {
        return item.rank + "-" + item.suit
    }).join("<br />");
}

playDeck = createDeck();
playerHand = createHand();

show(playerHand);
console.log(finalScore(playerHand));