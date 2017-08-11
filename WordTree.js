//WordTree is a searchable word bank.
//Search and adding entries goes as Log N because it's a binary tree

function WordTree( word ){
    
	this.word = word;
	this.left = null;
    this.right = null;
	
/////////////////////
//add method
/////////////////////

   this.add = function( newWord ){
      //base cases
      if( newWord < this.word && this.left == null ){
	     //make a new entry and put it here
		 this.left = new WordTree( newWord );
		 return;
	  } else if(newWord > this.word && this.right == null){
	     this.right = new WordTree( newWord );
		 return;
	  } else if(newWord == this.word){
	  	 //this word is already in the word tree
	  	 return;
	  }
	  
	  //if it's not the base case, we see whether we should add it to the left (closer to a) or right (closer to z)
	  
       if( newWord < this.word ){
	       this.left.add(newWord);
       } else {
	       this.right.add(newWord);
	   }
   
   };
   
/////////////////////
//remove method
/////////////////////

//it doesn't really remove anything. It "paints over" it.

	this.remove = function( word_to_remove ){
	
	  if( word_to_remove < this.word){
	
         if( this.left != null && word_to_remove == this.left.word  ){
	     	//paint over this.left.word
		 	this.left.word = this.word;
		 	return;
		 }else{
		    if(this.left != null ) this.left.remove( word_to_remove );
		    return;
		 }
		 
	  } else {
	     
	     if( this.right != null && word_to_remove == this.right.word  ){
	     	//paint over this.left.word
		 	this.right.word = this.word;
		 	return;
		 }else{
		    if(this.right != null ) this.right.remove( word_to_remove );
		    return;		 
		 }
	  
	  }
			
	}
   
//////////////////   
//contains method
///////////////////

   this.contains = function( testWord ){
   
      //positive test
	  if( this.word == testWord ){
	     return true;
	  }
	  
	  //negative test
	  if( testWord < this.word && this.left == null ){
	     return false;
	  } else if(testWord > this.word && this.right == null ){
	     return false;
	  }
	  
	  //continue searching
	  if( testWord < this.word ){
	      return this.left.contains( testWord );
	  } else {
	      return this.right.contains( testWord );
	  }
      
   };
   
/////////////////////////
//contains prefix  method
//////////////////////////

   this.containsPrefix = function( testPrefix ){
   
      //positive test
	  var thisWordPrefix = this.word.substring(0, testPrefix.length);
	  if( thisWordPrefix == testPrefix ){
	     return true;
	  }
	  
	  //negative test
	  if( testPrefix < this.word && this.left == null ){
	     return false;
	  } else if(testPrefix > this.word && this.right == null ){
	     return false;
	  }
	  
	  //continue searching
	  if( testPrefix < this.word ){
	      return this.left.containsPrefix( testPrefix );
	  } else {
	      return this.right.containsPrefix( testPrefix );
	  }
      
   };

/////////////////////////
// hasMatch  method
//////////////////////////

   this.hasMatch = function( regexp, prefix ){

      //base case: the prefix is the same as the current word
      if( prefix == this.word.substring(0, prefix.length)){
         //this might be a match
         if( regexp.test(this.word) ){
            return true;
         }

         //not a match. Let's see if it's the end of the line
         if( this.left == null && this.right == null ){
            return false;
         }

	//look left
         if(this.left != null){
            if( this.left.hasMatch( regexp, prefix ) ){
               return true;
            }
         }

	//look right
         if(this.right != null){
            if( this.right.hasMatch( regexp, prefix ) ){
               return true;
            }
         }
      
      } else {
        //in here if the prefix is not the same
        if( (prefix < this.word) && (this.left != null)){
           return this.left.hasMatch( regexp , prefix);
        } else if ( (prefix >= this.word) && (this.right != null)) {
           return this.right.hasMatch( regexp , prefix);
        }
      }
      //if we get here, the prefix was never found
      return false;

   };
}

