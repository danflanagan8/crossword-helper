//The control for Dan's Crossword Helper
//uses object WordForest, WordTree, WildCardWord, and GridToFill
//uses ajax.js library

//dictionary is a global variable used by the controls
var dictionary = new WordForest();


//a file loading function based on http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
function readInFile() {
  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = document.getElementById('fileDisplayArea');

  fileInput.addEventListener('change', function(e) { 
    var file = fileInput.files[0];
    var textType = /text.*/;
    
    if (file.type.match(textType)) {
  		var reader = new FileReader();   

  		reader.onload = function(e) {
    		//The stuff in here is now mine.
  			//try to read the file line by line into an array
  			var wordArray = reader.result.split(/[\n\r]/);
  			
  			//now we put the words into the word list randomly
  			//it needs to be random since I use a binary tree.
  			//It's slow but necessary.
  			putWordsIntoDictionary(wordArray);
  		}
  	
  	    reader.readAsText(file);  
	
	} else {
  		fileDisplayArea.innerText = "File not supported!";
	}
  });
}

function putWordsIntoDictionary( wordArray ){

	//this function builds the word forest.
	//It adds the wordArray elements in a random order since the WordForest uses binary trees.
	//Binary trees don't do well if we put in ordered elements.
	
	dictionary = new WordForest();

	while( wordArray.length > 0 ){
       
       //get a random element
       var rand_index = Math.floor( Math.random() * wordArray.length );	
	   dictionary.add( wordArray[rand_index] );
	   //now get that element out of the array
	   wordArray = wordArray.slice(0, rand_index).concat(wordArray.slice(rand_index+1));
	   
	}
	
}

function printMatchArray( matchArray ){
	//this prints all of the possible matches below the wildWord input field
	
	var node = document.getElementById("wildWordMatches");

	//clear the grid
	while( node.firstChild ){
		node.removeChild(node.firstChild);
	}

	if(matchArray.length == 0 ) matchArray.push("No matches found!");
	matchArray.forEach( function(entry){
		var text = document.createTextNode(entry + "\n");
		node.appendChild(text);
	});

}

function addWord( word ){
    
    
    if( word.indexOf("-") == -1 && word.indexOf("*") == -1 && word.indexOf("#") == -1 && word.indexOf("^") == -1){
    
       dictionary.add(word.toLowerCase());
    
    }
    
}

function removeWord( word ){
    
    
    if( word.indexOf("-") == -1 && word.indexOf("*") == -1 && word.indexOf("#") == -1 && word.indexOf("^") == -1){
    
       dictionary.remove(word.toLowerCase());
    
    }
    
}

//by default, danswordlist.txt gets loaded by the page. The next two functions handle that along with the ajax.js library

function loadDansWords(){

    ajaxCallback = putDansWordsInDictionary;
	ajaxRequest("danswordlist.txt");

}

function putDansWordsInDictionary(){

   var list = ajaxreq.responseText;
   var words = list.split(/[\n\r]/);
   
   words.forEach( function( entry ){
       
	   dictionary.add(entry);
   
   });

}


function findAndShowMatches(){

    //handles the button in the Word Finder div

    //get the pattern from the wildWord field
    var to_match = new wildCardWord( document.getElementById('wildWord').value );
    
    //get caret array from the caret field
    var caret = [];
   	var caret_string = document.getElementById("caret").value;
   	for( var i = 0; i < caret_string.length ; i++ ){
      	caret.push(caret_string[i]);
  	}
  	
  	//get the tilde array from the tilde field
  	var tilde = [];
   	var tilde_string = document.getElementById("tilde").value;
   	for( var i = 0; i < tilde_string.length ; i++ ){
      	tilde.push(tilde_string[i]);
  	}
	
	printMatchArray( to_match.getMatchArray( dictionary, caret, tilde ) );

}

function findAndShowGrid(){

   //handles the button in the Grid Filler div (along with showSolution() )
   var to_fill_string = document.getElementById("to_fill").value;
   var words = to_fill_string.split("\n");
   //remove blank lines
   for( var i = words.length - 1; i >= 0 ; i-- ){
      if( words[i].length === 0 ){
        words.splice(i, 1);
      }
   }
   //check that all the lines are the same length
   for( var i = 0; i < words.length; i++ ){
      if( words[i].length !== words[0].length ){
        document.getElementById("solution").value = "Error: not a rectangular grid";
        return;
      }
   }

   var grid = new GridToFill( words );
   
   var solution = grid.getSolution( dictionary );
    
   showSolution( solution );

   console.log( grid.solutions );

}

function showSolution(solution){

   if( solution == null ){
        document.getElementById("solution").value = "No solution found!";
   }else{
      var sol_str = ""
      for( var i = 0 ; i < solution.length ; i++){
         sol_str += (solution[i] + "\n");
      }
      document.getElementById("solution").value = sol_str.toUpperCase();
   }
  
}





