/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

// AMD-ID "dojox/math/random/Simple"
define(["dojo"], function(dojo) {

dojo.declare("dojox.math.random.Simple", null, {
	// summary:
	//	Super simple implementation of a random number generator,
	//	which relies on Math.random().

	destroy: function(){
		// summary:
		//	Prepares the object for GC. (empty in this case)
	},

	nextBytes: function(/* Array */ byteArray){
		// summary:
		//	Fills in an array of bytes with random numbers
		// byteArray: Array:
		//	array to be filled in with random numbers, only existing
		//	elements will be filled.
		for(var i = 0, l = byteArray.length; i < l; ++i){
			byteArray[i] = Math.floor(256 * Math.random());
		}
	}
});

return dojox.math.random.Simple;
});