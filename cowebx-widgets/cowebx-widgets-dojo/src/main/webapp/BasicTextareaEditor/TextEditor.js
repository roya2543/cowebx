define([
    'dojo',
	"dijit/_Widget",
	"dijit/_TemplatedMixin",
	"dijit/_Contained",
	"dojo/text!./TextEditor.html",
	'coweb/main',
	'coweb/ext/attendance',
    './ld',
    './AttendeeList',
    './ShareButton',
    'dijit/layout/ContentPane',
    'dijit/layout/BorderContainer',
    './rangy/rangy-core',
    './rangy/uncompressed/rangy-selectionsaverestore'
], function(dojo, _Widget, _TemplatedMixin, _Contained, template, coweb, attendance, ld, AttendeeList, ShareButton){

	return dojo.declare("TextEditor", [_Widget, _TemplatedMixin, _Contained], {
	    // widget template
		templateString: template,
		
        postCreate: function(){
            window.foo = this;
            
			//1. Process args
	        this.id = 'TextEditor';
	        this.go = true;

	        //2. Build stuff
	        dojo.create('textarea', {style:'width:100%;height:100%;' }, dojo.byId('divContainer'));
	        this._attendeeList = new AttendeeList({domNode:dojo.byId('innerList'), id:'_attendeeList'});
            this.util = new ld({});
	        nicEditors.allTextAreas();
            this._textarea = dojo.query('.nicEdit-main')[0];
            this._toolbar = dojo.query('.nicEdit-panel')[0];
            this._shareButton = new ShareButton({
                'domNode':dojo.byId('infoDiv'),
                'listenTo':this._textarea,
                'id':'shareButton',
                'displayButton':false
            });
            this.style();
            
            //3. parameters
            this.oldSnapshot = this.snapshot();
            this.newSnapshot = null;
            this.t = null;
            this.q = [];
            this.value = '';
            this.interval = 500;

            //4. connect
            this.connect();
   
            if(this.go == true)
               this.listenInit();
		},
		
		onCollabReady : function(){
	        this.collab.pauseSync();
	        this.resize();
	    },

	    listenInit : function(){
	        this.collab.pauseSync();
	        this.t = setTimeout(dojo.hitch(this, 'iterate'), this.interval);
	    },

	    iterate : function() { 
	        this.iterateSend();
	        this.iterateRecv();
	    },

	    iterateSend : function() {
	        this.newSnapshot = this.snapshot();
	        if(this.oldSnapshot && this.newSnapshot){
	            if(this.oldSnapshot != this.newSnapshot)
	                var syncs = this.util.ld(this.oldSnapshot, this.newSnapshot);
	            //Send syncs
	            if(syncs){
	                syncs = this.fix(syncs);
	                console.log(syncs);
	                var s = '';
	                for(var i=0; i<syncs.length; i++){
	                    if(syncs[i] != undefined){
	                       this.collab.sendSync('editorUpdate', syncs[i].ch, syncs[i].ty, syncs[i].pos);
	                       s = s+syncs[i].ch;
	                    }
	                }
	            }
	        }
	    },

	    iterateRecv : function() {
	        this.collab.resumeSync();
	        this.collab.pauseSync();
	        if(this.q.length != 0 && !this.hasIncompleteTags(this.q)){
	            this.runOps();
	            this.q = [];
	        }
	        this.oldSnapshot = this.snapshot();
	        this.t = setTimeout(dojo.hitch(this, 'iterate'), this.interval);
	    },

	    onRemoteChange : function(obj){
	        this.q.push(obj);
	    },

	    onUserChange : function(params) {
	        //Break if empty object
	        if(!params.users[0])
	            return;
	        if(params.type == "join"){
	            //Locally create a new listItem for the user
	            this._attendeeList.onLocalUserJoin(params.users);
	        }else if(params.type == "leave"){
	            //Locally delete listItem for the user
	            this._attendeeList.onUserLeave(params.users);
	        }
	    },

	    runOps : function(){
            var sel = rangy.saveSelection();
            this.value = this._textarea.innerHTML;
	        for(var i=0; i<this.q.length; i++){
	            if(this.q[i].type == 'insert')
	                this.insertChar(this.q[i].value, this.q[i].position);
	            if(this.q[i].type == 'delete')
	                this.deleteChar(this.q[i].position);
	            if(this.q[i].type == 'update')
	                this.updateChar(this.q[i].value, this.q[i].position);
	        }
	        this._textarea.innerHTML = this.value;
            rangy.restoreSelection(sel);
	    },

	    insertChar : function(c, pos) {
	        var p = this.fixPos(pos);
	        this.value = this.value.substr(0, p) + c + this.value.substr(p);
	    },

	    deleteChar : function(pos) {
            var p = this.fixPos(pos);
	        this.value = this.value.substr(0, p) + this.value.substr(p+1);
	    },

	    updateChar : function(c, pos) {
            var p = this.fixPos(pos);
	        this.value = this.value.substr(0, p) + c + this.value.substr(p+1);
	    },
	    
	    fixPos: function(pos){
	        var start = this.value.search('<span style="line-height: 0; display: none;" id="selectionBoundary_1">');
	        if(start == -1)
	            var start = this.value.search('<span id="selectionBoundary_1" style="line-height: 0; display: none;">');
	        
	        if(start != -1){
	            var end = this.value.search('<span style="line-height: 0; display: none;" id="selectionBoundary_2">﻿')-78;
    	        if(end == -79)
    	            var end = this.value.search('<span id="selectionBoundary_2" style="line-height: 0; display: none;">')-78;   
                if(pos>=end){
    	            pos = pos + 156;
    	        }else if(pos>start && pos<end){
    	            pos = pos + 78;
    	        } 
	        }else if(start == -1){
	            var end = this.value.search('<span style="line-height: 0; display: none;" id="selectionBoundary_2">﻿');
    	        if(end == -1)
    	            var end = this.value.search('<span id="selectionBoundary_2" style="line-height: 0; display: none;">');
    	        if(end != -1){
    	            if(pos>=end)
        	            pos = pos + 78;
    	        }
	        }
	        
	        return pos;
	    },
	    
	    clearSelection: function(){
            
	    },
	    
	    hasIncompleteTags : function(arr){
            var openCount = 0;
            var closeCount = 0;
            for(var i=0; i<arr.length; i++){
                if(arr[i].value == '<')
                    openCount++;
                if(arr[i].value == '>')
                    closeCount++;
            }
            return !(openCount == closeCount);
	    },
	    
	    fix: function(arr){
	        var temp = dojo.clone(arr);
            for(var i=0; i<arr.length; i++){
                if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3]&&arr[i+4]&&arr[i+5])&&(arr[i].ch=='&'&&arr[i+1].ch=='n'&&arr[i+2].ch=='b'&&arr[i+3].ch=='s'&&arr[i+4].ch=='p'&&arr[i+5].ch==';')){
                    temp[i].ch = '&nbsp;';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                    delete temp[i+4];
                    delete temp[i+5];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3]&&arr[i+4])&&(arr[i].ch=='&'&&arr[i+1].ch=='n'&&arr[i+2].ch=='s'&&arr[i+3].ch=='p'&&arr[i+4].ch==';')){
                    temp[i].ch = '&nbsp;';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                    delete temp[i+4];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='b'&&arr[i+2].ch=='r'&&arr[i+3].ch=='>')){
                    temp[i].ch = '<br>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='b'&&arr[i+2].ch=='r'&&arr[i+3].ch=='>')){
                    temp[i].ch = '<br>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='u'&&arr[i+2].ch=='l'&&arr[i+3].ch=='>')){
                    temp[i].ch = '<ul>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='l'&&arr[i+2].ch=='i'&&arr[i+3].ch=='>')){
                    temp[i].ch = '<li>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='/'&&arr[i+2].ch=='u'&&arr[i+3].ch=='l'&&arr[i+4].ch=='>')){
                    temp[i].ch = '</ul>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                    delete temp[i+4];
                }else if(temp[i]&&(arr[i+1]&&arr[i+2]&&arr[i+3])&&(arr[i].ch=='<'&&arr[i+1].ch=='/'&&arr[i+2].ch=='l'&&arr[i+3].ch=='i'&&arr[i+4].ch=='>')){
                    temp[i].ch = '</li>';
                    delete temp[i+1];
                    delete temp[i+2];
                    delete temp[i+3];
                    delete temp[i+4];
                }
            }
            return temp;
	    },

	    snapshot : function(){
	        return this._getValue();
	    },
	    
	    connect : function(){
	        this.collab = coweb.initCollab({id : this.id});  
	        this.collab.subscribeReady(this,'onCollabReady');
	        this.collab.subscribeSync('editorUpdate', this, 'onRemoteChange');
	        this.collab.subscribeStateRequest(this, 'onStateRequest');
	    	this.collab.subscribeStateResponse(this, 'onStateResponse');
	        dojo.connect(this._textarea, 'onfocus', this, '_onFocus');
	        dojo.connect(this._textarea, 'onblur', this, '_onBlur');
	        dojo.connect(dojo.byId('url'),'onclick',this,function(e){ this.selectElementContents(e.target) });
            dojo.connect(dojo.byId('url'),'onblur',this,function(e){ e.target.innerHTML = window.location; });
	        dojo.connect(window, 'resize', this, 'resize');
	        dojo.connect(dojo.byId('saveButton'),'onclick',this,function(e){
	            dojo.publish("shareClick", [{}]);
	        });
	        attendance.subscribeChange(this, 'onUserChange');
	    },

	    onStateRequest : function(token){
	        var state = {
	            snapshot: this.newSnapshot,
	            attendees: this._attendeeList.attendees
	        };
	        this.collab.sendStateResponse(state,token);
	    },

	    onStateResponse : function(obj){
	        this._textarea.innerHTML = obj.snapshot;
	        this.newSnapshot = obj.snapshot;
	        this.oldSnapshot = obj.snapshot;
	        for(var i in obj.attendees){
	            var o = {
	                value: {
	                    'site':i,
	                    'name':obj.attendees[i]['name'],
	                    'color':obj.attendees[i]['color']
	                }
	            };
	            this._attendeeList.onRemoteUserJoin(o);
	        }
	    },
 
	    _getValue : function() {
	        return this._textarea.innerHTML;
	    },

	    _onFocus : function(event) {
	        this._focused = true;
	    },

	    _onBlur : function(event) {
	        this._focused = false;
	    },

	    selectElementContents: function(el){
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        },
         
	    resize: function(){
	        dojo.style(dojo.byId('editorTable'),'height',dojo.byId('editorTable').parentNode.offsetHeight+'px');
	        dojo.style(dojo.byId('innerList'),'height',(dojo.byId('editorTable').parentNode.offsetHeight-dojo.byId('infoDiv').offsetHeight)+'px');
	        dojo.style(dojo.byId('divContainer'),'height',dojo.byId('editorTable').parentNode.offsetHeight+'px');
	    },

	    _loadTemplate : function(url) {
	        var e = document.createElement("link");
	        e.href = url;
	        e.type = "text/css";
	        e.rel = "stylesheet";
	        e.media = "screen";
	        document.getElementsByTagName("head")[0].appendChild(e);
	    },
	    
	    style: function(){
	        //dojo.attr(this._textarea, 'innerHTML', 'To begin, just start click and start <strong>typing</strong>...');
	        this._loadTemplate('../lib/cowebx/dojo/BasicTextareaEditor/TextEditor.css');
	        dojo.addClass(this._textarea.parentNode, 'textareaContainer');
	        dojo.style(this._textarea.parentNode, 'border', '1px solid #CACACA');
            dojo.addClass(this._textarea, 'textarea');
            dojo.style(this._toolbar.parentNode.parentNode,'width','100%');
            dojo.style(this._toolbar.parentNode.parentNode,'height','37px');
            dojo.style(this._toolbar.parentNode,'height','37px');
            dojo.style(this._toolbar,'height','37px');
            dojo.style(this._toolbar.parentNode,'width','100%');
            dojo.style(this._toolbar, 'width','100%');
            dojo.style(this._toolbar, 'margin','0px');
            for(var i=0; i<this._toolbar.childNodes.length; i++){
                dojo.style(this._toolbar.childNodes[i],'margin','5px');
                if(i>3)
                    dojo.style(this._toolbar.childNodes[i],'display','none');
            }
            dojo.attr('url','innerHTML',window.location);
            
            //HIDE UNUSED BUTTONS
            
	    },
	    
	    cleanup : function() {
	        if(this.t != null){
	            clearTimeout(this.t);
	            this. t = null;
	        }
	    }
	});
});
