//WordForest is an array of searchable word trees.


function WordForest(){
    
	this.forest = [];
	
	for( var i = 1 ; i <= 15 ; i++ ){
	   this.forest[i] = new WordTree("m");
	}
    
/////////////////////
//add method
/////////////////////

   this.add = function( newWord ){
      
      if(newWord.length == 0) return;
      if(newWord.length <= 15 ) this.forest[newWord.length].add( newWord );
   
   };
   
/////////////////////
//remove method
/////////////////////

   this.remove = function( word_to_remove ){
      
      if(word_to_remove.length <= 15 ) this.forest[word_to_remove.length].remove( word_to_remove );
   
   };
   
//////////////////   
//contains method
///////////////////

   this.contains = function( testWord ){
   
      return this.forest[testWord.length].contains( testWord );
      
   };
   
/////////////////////////
//contains prefix  method
//////////////////////////

   this.containsPrefix = function( testPrefix, wordLength ){
   
        return this.forest[wordLength].containsPrefix( testPrefix );
 
   };
   
//////////////////   
//hasMatch method
///////////////////

   this.hasMatch = function( regexp, prefix, wordLength ){

       return this.forest[wordLength].hasMatch(regexp, prefix);

   }
}

