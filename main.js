"use strict"
$(document).ready( () => {
	var images = [];
	var cards = [];
	var numCards= sessionStorage.getItem("numCards") || 48;
	var totalSelections = 0;
	var correctSelections = 0;
    
	// Form the images array
	for (var i = 1; i <= numCards; i++) {
		images.push("images/card_" + i + ".png");
	}
	// Prepare the cards array to load 2 cards at once
	for (var i = 0; i < numCards/2; i++) {
		cards.push({ image: images[i], matched: false });
		cards.push({ image: images[i], matched: false });
	}

	// Generate the required html
	var cardHtml = "";
	numCards = sessionStorage.getItem("numCards");

	for (var i = 0; i < images.length; i++) {
		cardHtml += '<a id="' + i + '" href="#" class="card"><img src="images/back.png" alt="" /></a>';
	}	

	// Append cards to the "cards" div
	$("#cards").html(cardHtml);

	// Shuffle the cards array
	cards.sort(() => Math.random() - 0.5);
	
	// Implement the game logic
	var flippedCards = [];
	$(".card").on("click", function() {
	  var cardIndex = $(this).attr("id");
  
	  // Check if the card is already flipped or matched
	  if (!cards[cardIndex].matched && flippedCards.length < 2) {
		// Flip the card
		$(this).children("img").attr("src", cards[cardIndex].image);
		flippedCards.push({ index: cardIndex, image: cards[cardIndex].image });
  
		// Check for a match after 2 cards are flipped
		if (flippedCards.length === 2) {
		  setTimeout(function() {
			totalSelections += 2;
			if (flippedCards[0].image === flippedCards[1].image) {
			  // Matched
			  correctSelections += 2;
			  cards[flippedCards[0].index].matched = true;
			  cards[flippedCards[1].index].matched = true;
			  $("#"+flippedCards[0].index).css("visibility","hidden");
			  $("#"+flippedCards[1].index).css("visibility","hidden");
			} else {
			  // Not matched
			  $("#" + flippedCards[0].index + " img, #" + flippedCards[1].index + " img").attr("src", "images/back.png");
			}
			flippedCards = [];
			updateScore();
		  }, 1000);
		}
	  }
	});

	function updateScore() {
		var percentage = (correctSelections / totalSelections) * 100;
		var highScore = localStorage.getItem("highScore") || 0;
		$("#correct").text("Correct: " + percentage.toFixed(2) + "%");

		if (percentage > highScore) {
			localStorage.setItem("highScore", percentage);
			$("#high_score").text("High Score: " + percentage.toFixed(2) + "%");
		}
	}
	
	// Save settings and reload page
	$("#save_settings").on("click", function() {
		var playerName = $("#player_name").val();
		numCards = $("#num_cards").val();
	
		// Save settings in session storage
		sessionStorage.setItem("playerName", playerName);
		sessionStorage.setItem("numCards", numCards);
		// Reload the page
		location.reload();
	});

	// Display player name and high score
	var playerName = sessionStorage.getItem("playerName") || "Player";
	var highScore = localStorage.getItem("highScore") || 0;
	$("#player").text("Player: " + playerName);
	$("#high_score").text("High Score: " + highScore);

	// New Game link
	$("#new_game a").on("click", function(event) {
		event.preventDefault();
		location.reload();
	});
	
	// Using the tabs widget from JQuery UI library
	$( "#tabs" ).tabs({
		active: 1
	});
});
