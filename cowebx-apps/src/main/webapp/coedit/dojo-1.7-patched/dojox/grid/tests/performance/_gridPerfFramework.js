/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

define(["dojo","dijit","dojox","dojo/data/ItemFileWriteStore"],function(_1,_2,_3){_1.getObject("dojox.grid.tests.performance._gridPerfFramework",1);(function(){var _4=[{col1:"normal",col2:false,col3:"new",col4:"But are not followed by two hexadecimal",col5:29.91,col6:10,col7:false},{col1:"important",col2:false,col3:"new",col4:"Because a % sign always indicates",col5:9.33,col6:-5,col7:false},{col1:"important",col2:true,col3:"read",col4:"Signs can be selectively",col5:19.34,col6:0,col7:true},{col1:"note",col2:false,col3:"read",col4:"However the reserved characters",col5:15.63,col6:0,col7:true},{col1:"normal",col2:true,col3:"replied",col4:"It is therefore necessary",col5:24.22,col6:5.5,col7:true},{col1:"important",col2:false,col3:"replied",col4:"To problems of corruption by",col5:9.12,col6:-3,col7:true},{col1:"note",col2:false,col3:"replied",col4:"Which would simply be awkward in",col5:12.15,col6:-4,col7:false}];var _5={rows:"100",layout:"single",rowSelector:"false",doProfiling:"false"};var _6=100;var _7=100;var _8=100;var _9={};_1.setObject("getStore",function(_a,_b){if(_b){delete _9[_a];}if(!_9[_a]){var _c={identifier:"id",label:"id",items:[]};for(var i=0,l=_4.length;i<_a;i++){_c.items.push(_1.mixin({id:i},_4[i%l]));}_9[_a]=new _1.data.ItemFileWriteStore({data:_c});}return _9[_a];});_1.setObject("getLayout",function(_d){switch(_d.toLowerCase()){case "dual":return [{cells:[{name:"Column 0",field:"id",width:"100px"},{name:"Column 1",field:"col1",width:"100px"},{name:"Column 2",field:"col2",width:"100px"},{name:"Column 3",field:"col3",width:"100px"}],noscroll:true},{cells:[{name:"Column 4",field:"col4",width:"300px"},{name:"Column 5",field:"col5",width:"150px"},{name:"Column 6",field:"col6",width:"150px"},{name:"Column 7",field:"col7",width:"150px"},{name:"Column 8",field:"col8",width:"150px"}]}];case "single":default:return [[{name:"Column 0",field:"id",width:"10%"},{name:"Column 1",field:"col1",width:"10%"},{name:"Column 2",field:"col2",width:"10%"},{name:"Column 3",field:"col3",width:"10%"},{name:"Column 4",field:"col4",width:"20%"},{name:"Column 5",field:"col5",width:"10%"},{name:"Column 6",field:"col6",width:"10%"},{name:"Column 7",field:"col7",width:"10%"},{name:"Column 8",field:"col3",width:"10%"}]];}});_1.setObject("searchParamsAsObj",function(_e){var s=(window.location.search||"").replace(/^\?/,"");var p=s.split("&");var o={};_1.forEach(p,function(i){var b=i.split("=");o[b[0]]=b[1];});if(_e===true){_e=_5;}return _1.mixin(_1.clone(_e||{}),o);});_1.setObject("getRLSTests",function(_f,_10,_11){var _12=(window.top==window);var obj=searchParamsAsObj(_5);var _13=parseInt(obj.rows,10);var _14=obj.layout;var _15=(obj.rowSelector.toLowerCase()=="true");var _16=_12&&_1.isMoz&&obj.doProfiling.toLowerCase()=="true";var _17=_14+" Layout"+(_15?" w/ Row Selector":"");var t={name:_17,runTest:_f(_13,_14,_15,_16,false)};if(_10){t.setUp=_10(_13,_14,_15,_16,false);}if(_11){t.tearDown=_11(_13,_14,_15,_16,false);}var _18=[t];if(_12&&!window._buttonsAdded){var n=_1.query(".heading")[0];n=_1.create("span",{innerHTML:"Rows: "},n,"after");n=_1.create("input",{type:"text",value:_13,size:5,onchange:function(){v=parseInt(this.value,10);if(v&&!isNaN(v)){window.location.search="?rows="+v+"&layout="+_14+"&rowSelector="+(_15?"true":"false")+"&doProfiling="+(_16?"true":"false");}}},n,"after");n=_1.create("button",{innerHTML:_14=="single"?"Dual Layout":"Single Layout",onclick:function(){window.location.search="?rows="+_13+"&layout="+(_14=="single"?"dual":"single")+"&rowSelector="+(_15?"true":"false")+"&doProfiling="+(_16?"true":"false");}},n,"after");n=_1.create("button",{innerHTML:_15?"Remove Row Selector":"Add Row Selector",onclick:function(){window.location.search="?rows="+_13+"&layout="+_14+"&rowSelector="+(!_15?"true":"false")+"&doProfiling="+(_16?"true":"false");}},n,"after");if(_1.isMoz){n=_1.create("button",{innerHTML:_16?"No Profiling":"Do Profiling",onclick:function(){window.location.search="?rows="+_13+"&layout="+_14+"&rowSelector="+(_15?"true":"false")+"&doProfiling="+(!_16?"true":"false");}},n,"after");}window._buttonsAdded=true;}else{if(!_12){t={name:"Perf "+_17,testType:"perf",trialDuration:_7,trialIterations:_6,trialDelay:_8,runTest:_f(_13,_14,_15,_16,true)};if(_10){t.setUp=_10(_13,_14,_15,_16,true);}if(_11){t.tearDown=_11(_13,_14,_15,_16,true);}_18.push(t);}}return _18;});})();});require(["dojox/grid/tests/performance/_gridPerfFramework"]);