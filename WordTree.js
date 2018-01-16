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

	this.remove = function( word_to_remove ){
	
	  if( word_to_remove < this.word){
	
         if( this.left != null && word_to_remove == this.left.word  ){
	     	
		 	this.left = this.left.mergeLeftAndRight();
		 	return;
		 }else{
		    if(this.left != null ) this.left.remove( word_to_remove );
		    return;
		 }
		 
	  } else {
	     
	     if( this.right != null && word_to_remove == this.right.word  ){
	     	//paint over this.left.word
		 	this.right = this.right.mergeLeftAndRight();
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

   this.toArray = function(){
   	 if(this.left === null && this.right === null){
   	 	return [this.word];
   	 }else if( this.left === null ){
   	 	return [this.word].concat(this.right.toArray());
   	 }else if( this.right === null ){
   	 	return [this.word].concat(this.left.toArray());
   	 }
   	 
     return [this.word].concat(this.left.toArray(), this.right.toArray());
   }

   this.merge = function( other_tree ){
   	 if(other_tree === null){
   	 	return this;
   	 }
     var this_array = this.toArray();
     var that_array = other_tree.toArray();
     var all_words = this_array.concat(that_array);
     all_words = randomize(all_words);
     var new_tree = new WordTree(all_words[0]);
     for(var i = 1; i < all_words.length; i++){
     	new_tree.add(all_words[i]);
     }
     return new_tree;
   }

   //A function used when removing a word.
   this.mergeLeftAndRight = function(){
     if( this.left === null && this.right === null){
     	return null;
     }else if( this.left === null){
     	return this.right;
     }else if( this.right === null){
     	return this.left;
     }else{
     	return this.left.merge(this.right);
     }
   }

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

   function randomize(array){
      for( var i = 0; i < array.length - 1; i++){
		  var indexToPut = i;
		  var indexPulledFromHat = Math.floor( Math.random() * (array.length - i)) + i;
		  //swap
		  var holder = array[i];
		  array[i] = array[indexPulledFromHat];
		  array[indexPulledFromHat] = holder;
	  }
	  return array;
   }
}

