define(["doh", "require"], function(doh, require){
	if(doh.isBrowser){
		doh.register("tests.NodeList-manipulate", require.nameToUrl("./NodeList-manipulate.html"), 30000);
	}
});