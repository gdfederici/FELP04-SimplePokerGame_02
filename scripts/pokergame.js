
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
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : "H"});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : "D"});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : "C"});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : "S"});        
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
    hand.sort(function (a, b) { return a.card - b.card; }); // Ordinare la mano del giocatore. / Order the player's hand.
    return hand;
}

// IT- Mostro il contenuto, per controllo.
// EN- Show for check.
function show(nowISeeYou) {
    document.getElementById("simplepokergame").innerHTML = nowISeeYou.map(function(item) {
        return item.card + "-" + item.suit
    }).join("<br />");
}

playDeck = createDeck();
playerHand = createHand();
show(playerHand);