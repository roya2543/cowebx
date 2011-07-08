define([], function() {
    var textarea = function(args){
        //Check for req'd properties
        if(!args.domNode)
            throw new Error("textarea.js: missing domNode param");

        //Build stuff
        this.div = dojo.create('div', {tabindex:0}, args.domNode);
        this.before = dojo.create('span',{id:'before'},this.div,'first');
        this.after = dojo.create('span',{id:'after'},this.div,'last');
        this.caret = dojo.create('span', {style:'background:black;visibility:hidden;', innerHTML:'|'},'before','after');
        this.caretTimer = setInterval(dojo.hitch(this, '_blink'), 500);
        
        //Do stuff
        this._style();
        this._connect();
        
        //Properties
        this.displayCaret = false;
        this.domNode = args.domNode;
        this.value = {start:0,end:0,string:''};
        this.newLine = '^';
        this.newSpace = '_';
    };
    var proto = textarea.prototype;
    
    proto.onKeyPress = function(e) {
        console.log(e)
        //backwards
        if(e.keyCode == 37){
            this.moveCaretLeft(); 
        //forwards    
        }else if(e.keyCode == 39){
            this.moveCaretRight();
        }else if(e.keyCode == 13){
            this.insertChar(this.newLine); 
        //space
        }else if(e.charCode == 32){
            this.insertChar(this.newSpace); 
        //delete
        }else if(e.keyCode == 8){
            this.deleteChar(e);
            return false; 
        //tab    
        }else if(e.keyCode == 9){  
        //ctrl    
        }else if(e.keyCode == 17){
        //up    
        }else if(e.keyCode == 38){
        //down    
        }else if(e.keyCode == 40){
            
        }else{
            this.insertChar(String.fromCharCode(e.which));
        }
    };
    
    proto.render = function() {
        var b = this._replaceAll(this.value.string.substring(0,this.value.start), this.newLine, '<br>');
        var bb = this._replaceAll(b, this.newSpace, '&nbsp;');
        var a = this._replaceAll(this.value.string.substring(this.value.start,this.value.string.length), this.newLine, '<br>');
        var aa = this._replaceAll(a, this.newSpace, '&nbsp;');
        
        this.before.innerHTML = bb;
        this.after.innerHTML = aa;
    };
    
    proto.insertChar = function(c) {
        var v = this.value
        this.value.string = v.string.substring(0,v.start)+c+v.string.substring(v.start,v.string.length);
        this.value.start++;
        this.render();
    };
    
    proto.deleteChar = function() {
        var v = this.value;
        var beforeLength = this.value.string.length+0;
        this.value.string = v.string.substring(0,v.start-1)+v.string.substring(v.start,v.string.length);
        var afterLength = this.value.string.length+0;
        if(beforeLength != afterLength)
            this.value.start--;
        this.render();
    };
    
    proto.moveCaretLeft = function() {
        if(this.value.start>0)
            this.value.start--;
        this.render();
    };
    
    proto.moveCaretRight = function() {
        if(this.value.start<this.value.string.length)
            this.value.start++;
        this.render();
    };
    
    proto.getValue = function() {
        return this.value.string;
    };
    
    proto._style = function(){
        dojo.style(this.div, 'width', '100%');
        dojo.style(this.div, 'height', '100%');
        dojo.style(this.div, 'background', 'white');
    };
    
    proto._connect = function(){
        dojo.connect(this.div, 'onfocus', this, '_onFocus');
        dojo.connect(this.div, 'onfocus', this, '_onBlur');
        dojo.connect(this.div, 'onkeypress', this, 'onKeyPress');
        document.onkeydown = this._overrideKeys;
    };
    
    proto._onFocus = function(){
        this.displayCaret = true;
    };
    
    proto._onBlur = function(){
        
    };
    
    proto._blink = function(){
        if(this.displayCaret){
            if(dojo.style(this.caret, 'visibility') == 'hidden'){
                dojo.style(this.caret, 'visibility', 'visible');
            }else if(dojo.style(this.caret, 'visibility') == 'visible'){
                dojo.style(this.caret, 'visibility', 'hidden');
            }
        }
    };
    
    proto._overrideKeys = function(e) {
        //Backspace
        if (e.which == 8){
			return false;
        }
    };
    
    proto._stripTags = function (string) {
       return string.replace(/<([^>]+)>/g,'');
    }
    
    proto._replaceAll = function(string, pattern, w) {
        var tmp = [];
        for(var i=0; i<string.length; i++){
            var c = string[i];
            if(c==pattern)
                c = w;
            tmp.push(c);
        }
        var s = '';
        for(var j=0; j<tmp.length; j++){
            s = s+tmp[j];
        }
        return s;
    };

    return textarea;
});