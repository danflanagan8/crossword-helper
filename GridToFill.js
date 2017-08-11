function GridToFill( to_fill ){
  
  	//to_fill is a rectangular array with letters, hyphens(blanks), and periods (black squares)
  	//getSolution attempts to find a egal solution to the grid.
  
    this.to_fill = to_fill;
    this.solutions = [];
   
	this.getSolution = function( word_tree ){

   		//this is a wrapper function for the form search function that does the real work
      
   		foundGrid = false;
   
   		var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
   		//var letters = ["e", "t", "a", "o", "i", "n", "s", "h", "r", "d", "l", "c", "u", "m", "w", "f", "g", "y", "p", "b", "v", "k", "j", "x", "q", "z"];
   
   		//make a randomized ordering of the letters each time the grid is filled
   		var random_letters = letters.slice();

		for( var i = 0; i < random_letters.length - 1; i++){
		  var indexToPut = i;
		  var indexPulledFromHat = Math.floor( Math.random() * (letters.length - i)) + i;
		  //swap
		  var holder = random_letters[i];
		  random_letters[i] = random_letters[indexPulledFromHat];
		  random_letters[indexPulledFromHat] = holder;
		}

   		var solution = findSolutionGrid( this.to_fill , word_tree , random_letters);
   		if(solution != null ) this.solutions.push( solution );
   		return solution;
	};

	function findSolutionGrid( to_fill , word_tree , letters, check_row, check_column){
		//this returns an array where all hyphens have been replaced with letters or null
    //console.log('check ' + check_row);
   		//this version to_fill uses . for a black square and capital words aren't tested
   
   		//to_fill should be an array of strings that are each the same length

   		//start by picking off all the words into a 1D array
   		var words = [];
   
   		//first pick the rows
   		for( var i = 0 ; i < to_fill.length ; i++ ){
      		var newword = "";
			//walk through each row      
	     	for( var j = 0 ; j < to_fill[0].length ; j++ ){
         
            	if(to_fill[i][j] == "." ){
               		if( newword != "" ){
                      var check = false;
                      if( i === check_row || check_row === undefined) check = true;
               	  		if(!allUpperCase( newword )) words.push([newword, check]);
               	  		newword = "";
               		}
            	} else {
               		newword += to_fill[i][j];
            	}
         	}
      
      		//we're at the end of the word now. If newword isn't blank, we push it
          var check = false;
          if( i === check_row || check_row === undefined) check = true;
      		if( newword != "" && !allUpperCase( newword )) words.push([newword, check]);
   		}
   
   
   		//now the columns. This is clumsier. 
   		for( var j = 0; j < to_fill[0].length; j++ ){
      		var newword = "";
      		for( var i = 0; i < to_fill.length ; i++ ) {
         
         		if(to_fill[i][j] == "." ){
             		if( newword != "" ){
                    var check = false;
                    if( j === check_column || check_column === undefined) check = true;
               			if(!allUpperCase( newword )) words.push([newword, check]);
               			newword = "";
             		}
         		} else {
               		newword += to_fill[i][j];
         		}
      		}
      		//don't keep it if it's all upper case
          var check = false;
          if( j === check_column || check_column === undefined) check = true;
      		if(!allUpperCase( newword )) words.push([newword, check]);
   		}
   
   		//console.log(words);
   
   		//base case: grid is full (no hyphens). Is it all legal words? If so print and set foundGrid to true. If not return.
   		var gridIsFull = true;
   		words.forEach( function(entry) {
    	//is there a hyphen in this word?
      		if( entry[0].indexOf("-") > -1 ){
         		gridIsFull = false;  
      		}
   		});

   		if( gridIsFull ){
      		//here we check that the word tree contains all the words
      		//console.log("The grid is full\n");
      		var allLegalWords = true;
      		words.forEach( function(entry) {
         		//is there a hyphen in this word?
         		if( !word_tree.contains( entry[0].toLowerCase())) {
            		allLegalWords = false;
            		//console.log(entry + " is not a word");
            		return;//get out of dodge
            		//console.log("this should not print");
        		 }
      		});

      		if( allLegalWords ) {
         		to_fill.forEach( function(entry) {
            		//print the word
            		console.log(entry);
         		});
         		//showSolution(to_fill);
         		//and tell the code a good grid has been found
	     		return to_fill;
      		} else {
        		//the grid is full but not all words.
        		return;
      		}
   		}

   
   		//If the grid is not full, check that all the words have legal forms. If not, return.
   		var allLegalForms = true;
   		if( !gridIsFull ){
      		//here we check that the word tree contains all the word prefixes
      		var allLegalForms = true;
      		words.forEach( function(entry) {
         		//is this form in the tree
            if( entry[1] === true ){
           		if( !word_tree.hasMatch( findRegExp(entry[0].toLowerCase()), findPrefix(entry[0]).toLowerCase(), entry[0].length )){
              		allLegalForms = false;
              		//return;
           		}
            }
      		});
   		}

   
   		//If yes, find the first hyphen in the grid. Then make a new grid with "a" in that place and run returnGrid on that grid. Then make a new grid with "b", "c", etc.
   		if( allLegalForms ){
      		//find the first hyphen (scan the top row, then the next row, etc. moving left to right
      		var wildCardRow = 0;
      		var wildCardColumn = 0;
      		for( var i = 0 ; i < to_fill.length ; i++){
        		if( to_fill[i].indexOf("-") > -1 ){
            		wildCardRow = i;
            		wildCardColumn = to_fill[i].indexOf("-");
            		break;
        		}   
      		}
      		
      		/*
      		//make a randomized ordering of the letters each time the grid is filled
			var random_letters = [];
			var dummy_letters = letters.slice();
			while( dummy_letters.length > 0 ){
	   
				//get a random element
				var rand_index = Math.floor( Math.random() * dummy_letters.length );	
				random_letters.push( dummy_letters[rand_index] );
				//now get that element out of the array
				dummy_letters = dummy_letters.slice(0, rand_index).concat(dummy_letters.slice(rand_index+1));
			}
			*/
			var random_letters = letters.slice();

			for( var i = 0; i < random_letters.length - 1; i++){
			  var indexToPut = i;
			  var indexPulledFromHat = Math.floor( Math.random() * (letters.length - i)) + i;
			  //swap
			  var holder = random_letters[i];
			  random_letters[i] = random_letters[indexPulledFromHat];
			  random_letters[indexPulledFromHat] = holder;
			}
   
   			//we have found the first hyphen.
   			//now we loop through the letters, and place each letter in place of the hyphen
      		for( var i = 0; i < letters.length ; i++ ){
				var next_to_fill = to_fill.slice(0);
        		next_to_fill[wildCardRow] = to_fill[wildCardRow].substring(0,wildCardColumn) + letters[i] + to_fill[wildCardRow].substring(wildCardColumn + 1)
       			var possible_solution = findSolutionGrid( next_to_fill, word_tree, random_letters, wildCardRow, wildCardColumn );
				if( possible_solution != null) return possible_solution;
				//if the previous statement is true, then we end up popping out of the stack
	  		}
   
   		}
   
        //if we get here, we have tried all letters in place of the hyphen and no solution was found.
        //this was a dead end
   		return;

	}

	function findPrefix( str ){

   		for( var i = 0 ; i < str.length ; i++ ){
      		if( (str[i] == "-") ){
	     		return str.substring(0, i);
	  		}
   		}
   
   		return str;
	}

	function allUpperCase( str ){

   		return ((str == str.toUpperCase()) && (str.indexOf("-") == -1));

	}

	function findRegExp( word ){
   
   		//basically replace hyphens with "\w"
   		var reg_str = "";
   		for( var i = 0; i < word.length ; i++ ){
      		if( word[i] == "-" ){
         		reg_str += "\\w";
      		}else{
         		reg_str += word[i];
      		}
   		}

   		var regexp = new RegExp("\\b" + reg_str + "\\b");
   
   		return regexp;

	}

}
