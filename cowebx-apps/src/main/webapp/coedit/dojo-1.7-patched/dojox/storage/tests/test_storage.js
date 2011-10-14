/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

define(["dojo","dijit","dojox","dojox/storage"],function(_1,_2,_3){_1.getObject("dojox.storage.tests.test_storage",1);var _4={currentProvider:"default",currentNamespace:null,initialize:function(){if(_3.storage.manager.available==false){var o=document.createElement("option");o.appendChild(document.createTextNode("None"));o.value="None";o.selected=true;var _5=_1.byId("currentStorageProvider");_5.disabled=true;_5.appendChild(o);alert("No storage provider is available on this browser");return;}this._determineCurrentNamespace();_1.byId("storageNamespace").value=this.currentNamespace;_1.byId("storageNamespace").disabled=false;_1.byId("storageKey").value="";_1.byId("storageKey").disabled=false;_1.byId("storageValue").value="";_1.byId("storageValue").disabled=false;this._printAvailableProviders();this._printAvailableNamespaces();this._printAvailableKeys();var _6=_1.byId("currentStorageProvider");_1.connect(_6,"onchange",this,this.providerChange);var _7=_1.byId("namespaceDirectory");_1.connect(_7,"onchange",this,this.namespaceChange);var _8=_1.byId("directory");_1.connect(_8,"onchange",this,this.directoryChange);var _9=_1.byId("storageValue");_1.connect(_9,"onkeyup",this,this.printValueSize);var _a=_1.byId("storageKey");_1.connect(_a,"onfocus",function(_b){_8.selectedIndex=-1;});var _c=_1.byId("buttonContainer");var _d=_c.firstChild;while(_d.nextSibling!=null){if(_d.nodeType==1){var _e=_d.id;var _f=_e.match(/^(.*)Button$/)[1];_1.connect(_d,"onclick",this,this[_f]);_d.disabled=false;}_d=_d.nextSibling;}this._printProviderMetadata();if(_3.storage.hasSettingsUI()==false){_1.byId("configureButton").disabled=true;}},providerChange:function(evt){var _10=evt.target.value;var _11="";if(window.location.href.indexOf("forceStorageProvider")==-1){_11="?";}else{_11="&";}window.location.href+=_11+"forceStorageProvider="+_10;},namespaceChange:function(evt){var ns=evt.target.value;this.currentNamespace=ns;this._printAvailableKeys();_1.byId("storageNamespace").value=this.currentNamespace;_1.byId("storageKey").value="";_1.byId("storageValue").value="";},directoryChange:function(evt){var key=evt.target.value;var _12=_1.byId("storageKey");_12.value=key;this._handleLoad(key);},load:function(evt){evt.preventDefault();evt.stopPropagation();var key=_1.byId("storageKey").value;if(key==null||typeof key=="undefined"||key==""){alert("Please enter a key name");return;}this._handleLoad(key);},loadMultiple:function(evt){evt.preventDefault();evt.stopPropagation();var dir=_1.byId("directory");if(dir.selectedIndex<0){alert("Please select a key from the 'All Keys' list");return;}var _13=[dir.value],i;for(i=dir.options.selectedIndex+1;i<dir.options.length&&_13.length<10;i++){_13.push(dir.options[i].value);}for(i=dir.options.selectedIndex-1;i>=0&&_13.length<10;i--){_13.push(dir.options[i].value);}this._handleLoadMultiple(_13);},save:function(evt){evt.preventDefault();evt.stopPropagation();var key=_1.byId("storageKey").value;var _14=_1.byId("storageValue").value;var _15=_1.byId("storageNamespace").value;if(key==null||typeof key=="undefined"||key==""){alert("Please enter a key name");return;}if(_14==null||typeof _14=="undefined"||_14==""){alert("Please enter a key value");return;}this.printValueSize();this._save(key,_14,_15);},saveMultiple:function(evt){evt.preventDefault();evt.stopPropagation();var key=_1.byId("storageKey").value;var _16=_1.byId("storageValue").value;var _17=_1.byId("storageNamespace").value;if(key==null||typeof key=="undefined"||key==""){alert("Please enter a key name");return;}if(_16==null||typeof _16=="undefined"||_16==""){alert("Please enter a key value");return;}this.printValueSize();var _18=[],_19=[];for(var i=0;i<10;i++){_18.push(key+i);_19.push(i+") "+_16);}this._saveMultiple(_18,_19,_17);},clearNamespace:function(evt){evt.preventDefault();evt.stopPropagation();_3.storage.clear(this.currentNamespace);this._printAvailableNamespaces();this._printAvailableKeys();},_saveMultiple:function(_1a,_1b,_1c){this._printStatus("Saving 10 keys, starting with '"+_1a[0]+"'...");var _1d=this;var _1e=function(_1f,_20){if(_1f==_3.storage.FAILED){alert("You do not have permission to store data for this web site. "+"Press the Configure button to grant permission.");}else{if(_1f==_3.storage.SUCCESS){_1.byId("storageKey").value="";_1.byId("storageValue").value="";_1d._printStatus("Saved '"+_1a[0]+"' and "+(_1a.length-1)+" others");if(typeof _1c!="undefined"&&_1c!=null){_1d.currentNamespace=_1c;}_1d._printAvailableKeys();_1d._printAvailableNamespaces();}}};try{if(_1c==_3.storage.DEFAULT_NAMESPACE){_3.storage.putMultiple(_1a,_1b,_1e);}else{_3.storage.putMultiple(_1a,_1b,_1e,_1c);}}catch(exp){alert(exp);}},configure:function(evt){evt.preventDefault();evt.stopPropagation();if(_3.storage.hasSettingsUI()){var _21=this;_3.storage.onHideSettingsUI=function(){_21._printAvailableKeys();};_3.storage.showSettingsUI();}},remove:function(evt){evt.preventDefault();evt.stopPropagation();var _22=_1.byId("directory");var _23=_1.byId("storageKey");var _24=_1.byId("storageValue");var key;if(_22.selectedIndex!=-1){key=_22.value;var _25=_22.childNodes;for(var i=0;i<_25.length;i++){if(_25[i].nodeType==1&&_25[i].value==key){_22.removeChild(_25[i]);break;}}}else{key=_23.value;}_23.value="";_24.value="";this._printStatus("Removing '"+key+"'...");if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){_3.storage.remove(key);}else{_3.storage.remove(key,this.currentNamespace);}this._printAvailableNamespaces();this._printStatus("Removed '"+key);},removeMultiple:function(evt){evt.preventDefault();evt.stopPropagation();if(confirm("Are you sure you want to delete the entry for the selected key and up to 10 more entries?")){var dir=_1.byId("directory");if(dir.selectedIndex<0){alert("Please select a key from the 'All Keys' list");return;}var _26=[];for(var i=dir.options.selectedIndex;i<dir.options.length&&_26.length<10;i++){_26.push(dir.options[i].value);}this._printStatus("Removing '"+(dir.options.selectedIndex-i)+"' keys starting with '"+dir.options[dir.options.selectedIndex].value+"' ...");if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){_3.storage.removeMultiple(_26);}else{_3.storage.removeMultiple(_26,this.currentNamespace);}var _27=directory.childNodes;for(i=dir.options.selectedIndex;i<dir.options.length&&(i-dir.options.selectedIndex)<10;i++){directory.removeChild(_27[i]);}}},printValueSize:function(){var _28=_1.byId("storageValue").value;var _29=0;if(_28!=null&&typeof _28!="undefined"){_29=_28.length;}var _2a;if(_29<1024){_2a=" bytes";}else{_2a=" K";_29=_29/1024;_29=Math.round(_29);}_29=_29+_2a;var _2b=_1.byId("valueSize");_2b.innerHTML=_29;},saveBook:function(evt){this._printStatus("Loading book...");var d=_1.xhrGet({url:"resources/testBook.txt",handleAs:"text"});d.addCallback(_1.hitch(this,function(_2c){this._printStatus("Book loaded");this._save("testBook",_2c);}));d.addErrback(_1.hitch(this,function(_2d){alert("Unable to load testBook.txt: "+_2d);}));if(!typeof evt!="undefined"&&evt!=null){evt.preventDefault();evt.stopPropagation();}return false;},saveXML:function(evt){this._printStatus("Loading XML...");var d=_1.xhrGet({url:"resources/testXML.xml",handleAs:"text"});d.addCallback(_1.hitch(this,function(_2e){this._printStatus("XML loaded");this._save("testXML",_2e);}));d.addErrback(_1.hitch(this,function(_2f){alert("Unable to load testXML.xml: "+_2f);}));if(!typeof evt!="undefined"&&evt!=null){evt.preventDefault();evt.stopPropagation();}return false;},_save:function(key,_30,_31){this._printStatus("Saving '"+key+"'...");var _32=this;var _33=function(_34,_35){if(_34==_3.storage.FAILED){alert("You do not have permission to store data for this web site. "+"Press the Configure button to grant permission.");}else{if(_34==_3.storage.SUCCESS){_1.byId("storageKey").value="";_1.byId("storageValue").value="";_32._printStatus("Saved '"+key+"'");if(typeof _31!="undefined"&&_31!=null){_32.currentNamespace=_31;}_32._printAvailableKeys();_32._printAvailableNamespaces();}}};try{if(_31==_3.storage.DEFAULT_NAMESPACE){_3.storage.put(key,_30,_33);}else{_3.storage.put(key,_30,_33,_31);}}catch(exp){alert(exp);}},_printAvailableKeys:function(){var _36=_1.byId("directory");_36.innerHTML="";var _37;if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){_37=_3.storage.getKeys();}else{_37=_3.storage.getKeys(this.currentNamespace);}for(var i=0;i<_37.length;i++){var _38=document.createElement("option");_38.appendChild(document.createTextNode(_37[i]));_38.value=_37[i];_36.appendChild(_38);}},_handleLoadMultiple:function(_39){this._printStatus("Loading '"+_39+"'...");var _3a;if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){_3a=_3.storage.getMultiple(_39);}else{_3a=_3.storage.getMultiple(_39,this.currentNamespace);}for(var i=0;i<_3a.length;i++){if(typeof _3a[i]!="string"){_3a[i]=_1.toJson(_3a[i]);}}this._printStatus("Loaded '"+_39[0]+"' and "+(_39.length-1)+" others");_1.byId("storageValue").value="";for(i=0;i<_3a.length;i++){_1.byId("storageValue").value+=_3a[i]+"\n----\n";}this.printValueSize();},_printAvailableNamespaces:function(){var _3b=_1.byId("namespaceDirectory");_3b.innerHTML="";var _3c=_3.storage.getNamespaces();for(var i=0;i<_3c.length;i++){var _3d=document.createElement("option");_3d.appendChild(document.createTextNode(_3c[i]));_3d.value=_3c[i];if(this.currentNamespace==_3c[i]){_3d.selected=true;}_3b.appendChild(_3d);}},_handleLoad:function(key){this._printStatus("Loading '"+key+"'...");var _3e;if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){_3e=_3.storage.get(key);}else{_3e=_3.storage.get(key,this.currentNamespace);}if(typeof _3e!="string"){_3e=_1.toJson(_3e);}this._printStatus("Loaded '"+key+"'");_1.byId("storageValue").value=_3e;this.printValueSize();},_printProviderMetadata:function(){var _3f=_3.storage.manager.currentProvider.declaredClass;var _40=_3.storage.isAvailable();var _41=_3.storage.getMaximumSize();var _42=_3.storage.isPermanent();var _43=_3.storage.hasSettingsUI();var _44="";if(_3.storage.manager.currentProvider.declaredClass=="dojox.storage.FlashStorageProvider"){_44="Flash Version "+_3.flash.info.version;}_1.byId("currentStorageProvider").innerHTML=_3f;_1.byId("isSupported").innerHTML=_40;_1.byId("isPersistent").innerHTML=_42;_1.byId("hasUIConfig").innerHTML=_43;_1.byId("maximumSize").innerHTML=_41;_1.byId("moreInfo").innerHTML=_44;},_printStatus:function(_45){var top=_1.byId("top");for(var i=0;i<top.childNodes.length;i++){var _46=top.childNodes[i];if(_46.nodeType==1&&_46.className=="status"){top.removeChild(_46);}}var _47=document.createElement("span");_47.className="status";_47.innerHTML=_45;top.appendChild(_47);_1.fadeOut({node:_47,duration:2000}).play();},_determineCurrentNamespace:function(){this.currentNamespace=_3.storage.DEFAULT_NAMESPACE;var _48=_3.storage.getNamespaces();if(this.currentNamespace==_3.storage.DEFAULT_NAMESPACE){var _49=false;for(var i=0;i<_48.length;i++){if(_48[i]==_3.storage.DEFAULT_NAMESPACE){_49=true;}}if(!_49&&_48.length){this.currentNamespace=_48[0];}}},_printAvailableProviders:function(){window.setTimeout(function(){var _4a=_1.byId("currentStorageProvider");var p=_3.storage.manager.providers;for(var i=0;i<p.length;i++){var _4b=p[i].declaredClass;var o=document.createElement("option");o.appendChild(document.createTextNode(_4b));o.value=_4b;if(_3.storage.manager.currentProvider==p[i]){o.selected=true;}_4a.appendChild(o);}},1);}};_1.addOnLoad(function(){if(_3.storage.manager.isInitialized()==false){_1.connect(_3.storage.manager,"loaded",_4,_4.initialize);}else{_1.connect(_1,"loaded",_4,_4.initialize);}});});require(["dojox/storage/tests/test_storage"]);