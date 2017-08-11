function wildCardWord( to_match ){

    this.to_match = to_match;

	this.getMatchArray = function( word_tree , caret, tilde){

   		//this is a wrapper function for the form search function that does the real work
   		//It returns a 1D array of words that match the form of this.to_match
   		
   		//caret is an array of letters to use
   		//tilde is an array of letters to avoid. In this wrapper, it gets changed to its inverse, essentially. That's how the next function uses it.
   
   		//three different wild cards
   		//letters will be -, vowels will be *, consonants will be #
   		var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
   		var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"];
   		var vowels = ["a", "e", "i", "o", "u", "y"];
   
   
   		var tilde_inverse = letters.slice(0);
   		for( var i = 0; i < tilde.length ; i++ ){
      		tilde_inverse = tilde_inverse.slice(0, tilde_inverse.indexOf(tilde[i])).concat(tilde_inverse.slice(tilde_inverse.indexOf(tilde[i]) + 1));
   		}
   		
   		//now rename so that the tilde array is letters minus the letters to avoid
   		tilde = tilde_inverse;

   		var matchArray = [];

   		addMatches( this.to_match.toLowerCase() , word_tree , matchArray, letters, consonants, vowels, caret, tilde );
   
   		return matchArray;

	};

	function addMatches( to_match , word_tree , matchArray, letters, consonants, vowels, caret, tilde){

   		//base cases
   		//console.log( to_match );
   		//form is a complete word and a match is found
   		if( word_tree.contains( to_match ) ){
      		matchArray.push( to_match );
	  		return;
   		}
   
   		//otherwise, we get the part of to_match up to a wild card character and check that prefix
   		//If it's not in the word_tree, we return
   		var prefix = findPrefix( to_match );
   
   		if( !word_tree.containsPrefix( prefix, to_match.length ) ){
      		return;
   		}
   
   		//if we get here, we need to change the first wild card to each possibility and call addMatch
   		var wildcard = to_match.substring( prefix.length, prefix.length + 1);
   		var after_wildcard = to_match.substring(prefix.length + 1); //everything after the first wildcard

   		if( wildcard == "-" ){
   
      	letters.forEach( function(entry){
	     		var next_to_match = prefix + entry + after_wildcard;
	     		addMatches( next_to_match, word_tree , matchArray, letters, consonants, vowels, caret, tilde)
      		});
   		} else if ( wildcard == "*" ) {
      		vowels.forEach( function(entry){
	     		var next_to_match = prefix + entry + after_wildcard;
	     		addMatches( next_to_match, word_tree , matchArray, letters, consonants, vowels, caret, tilde)
      		});
   		} else if ( wildcard == "#" ) {
      		consonants.forEach( function(entry){
	     		var next_to_match = prefix + entry + after_wildcard;
	     		addMatches( next_to_match, word_tree , matchArray, letters, consonants, vowels, caret, tilde)
      		});
   		} else if ( wildcard == "^" ) {
      		caret.forEach( function(entry){
	     		var next_to_match = prefix + entry + after_wildcard;
	     		addMatches( next_to_match, word_tree , matchArray, letters, consonants, vowels, caret, tilde)
      		});
   		} else if ( wildcard == "~" ) {
      		tilde.forEach( function(entry){
	     		var next_to_match = prefix + entry + after_wildcard;
	     		addMatches( next_to_match, word_tree , matchArray, letters, consonants, vowels, caret, tilde)
      		});
   		}
   
   		return;
	}

	function findPrefix( str ){

   		for( var i = 0 ; i < str.length ; i++ ){
      		if( (str[i] == "-") || (str[i] == "*") || (str[i] == "#") || (str[i] == "^") || (str[i] == "~")){
	     		return str.substring(0, i);
	  		}
   		}
   
   		return str;
	}

}