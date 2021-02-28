
// Inizializzo il mazzo inserendo le carte da Asso a Re con 4 cicli, uno per ogni seme. / Create the deck by inserting cards A -> King with 4 cycles, one for each suit.
// Asso/Ace = 14, Goobo/Jack = 11, Donna/Queen = 12, Re/King = 13
// Cuori/Hearts = 4, Quadri/Diamonds = 3, Fiori/Clubs = 2, Picche/Spades = 1 
function createDeck() { 
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : 4});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : 3});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : 2});        
    }
    for (i=2; i<=14; i++) {
        deck.push({"card" : i, "suit" : 1});        
    }
}