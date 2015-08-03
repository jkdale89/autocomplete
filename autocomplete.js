//Create autocomplete constructor to add methods

function Autocomplete() {

};

// We're making a method that takes a string and adds 
// each character to the tree. 

Autocomplete.prototype._addWord = function(word, i){
	//Grab current letter
	var letter = word[i];

	//If at end of the word, add word boundary to terminal node
	//else traverse the autocomplete, adding new nodes when necessary
	if (i==word.length) {
		//word boundaries set with $
		this.$ = 1;
	}
	else if (typeof this[letter] === 'object') {
		//Keep traversing
		this[letter]._addWord(word, i+1);
	}
	else {
		//create a new node if we're at the end
		this[letter] = new Autocomplete();
		//keep traversing the tree
		this[letter]._addWord(word, i+1);
	}
	return this;
};

// This method adds a word by calling the _addWord method
// with index 0

	Autocomplete.prototype.addWord = function(word) {
		//Call _addWord method starting with index 0
		return this._addWord(word, 0);
	};

	// Method returning all siblings, excluding
	// word boundaries and prototype methods
	Autocomplete.prototype.siblings = function(){
		var siblings = [];

		for (var ltr in this){
			if (ltr in this.constructor.prototype) continue;

			if(ltr === '$') continue;

			siblings.push(ltr);
		}

		return siblings;
	};

	Autocomplete.prototype._find = function(prefix, i) {
		// If we've reached end of prefix return the remaining
		// otherwise keep traversing
		if (prefix.length === 1) {
			// return results
			return this;
		}
		else if (!(prefix[i] in this)) {
			// if no prefix, return null
			return null;
		}
		else {
			//recursively search
			return this[prefix[i]]._goto(prefix, i+1);
		}
	};
	// This method calls the _find method with index 0
	Autocomplete.prototype.find = function(prefix) {
		return this._find(prefix, 0);
	};

	Autocomplete.prototype._lookup = function(suffix) {
		//get siblings at current level
		var siblings = this.siblings();
		// If word boundary, make array with current suffix
		// Otherwise, set it to empty array
		var arr = !!this.$ ?
			Array.prototype.slice.call(arguments) : [];
		//if no siblings, return suffix array
		//or else search for boundaries for each sibling
		if(siblings.length ===0) {
			return arr;
		}
		// else go through siblings in siblings array
		// building up suffix and calling lookup on each node
		// with new suffix
		else {
			for (var i = 0; i < siblings.length; i++) {
				// grab the letter
				var letter = siblings[i];

				//access the branch in the letter
				var branch = this[letter];
				//if suffix undefined, make it empty string
				var sfx = suffix || '';
				// build up suffix by adding letter to end of previous
				var newSuffix = sfx + letter;
				//call _lookup on the branch
				//which will return an empty orray, or an array of suffixes
				var sfxs = branch._lookup(newSuffix);
				//add the suffixes to the total array of suffixes
				arr = arr.concat(sfxs);
			}

				return arr;
			}
		};
	
	//Takes a prefix and calls the find method
	// which searches to that part in the tree and creates
	// an array of word boundary suffixes, return an array of 
	// prefix and suffix values
		Autocomplete.prototype.lookup = function(prefix) {
			//Go to that position in the tree
			var prefixBranch = this.find(prefix);

			if(!prefixBranch) return [];

			var sfxs = prefixBranch._lookup();

			return sfxsl.map(function(sfx) {return prefix + sfx; });
		};
	
	Autocomplete.prototype.stringify = function() {
		return JSON.stringify(this);
	};

module.exports = Autocomplete;