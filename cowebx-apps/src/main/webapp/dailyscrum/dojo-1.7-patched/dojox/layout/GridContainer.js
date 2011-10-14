/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

define(["dojo","dijit","dojox","dojox/layout/GridContainerLite"],function(_1,_2,_3){_1.getObject("dojox.layout.GridContainer",1);_1.declare("dojox.layout.GridContainer",_3.layout.GridContainerLite,{hasResizableColumns:true,liveResizeColumns:false,minColWidth:20,minChildWidth:150,mode:"right",isRightFixed:false,isLeftFixed:false,startup:function(){this.inherited(arguments);if(this.hasResizableColumns){for(var i=0;i<this._grid.length-1;i++){this._createGrip(i);}if(!this.getParent()){_1.ready(_1.hitch(this,"_placeGrips"));}}},resizeChildAfterDrop:function(_4,_5,_6){if(this.inherited(arguments)){this._placeGrips();}},onShow:function(){this.inherited(arguments);this._placeGrips();},resize:function(){this.inherited(arguments);if(this._isShown()&&this.hasResizableColumns){this._placeGrips();}},_createGrip:function(_7){var _8=this._grid[_7],_9=_1.create("div",{"class":"gridContainerGrip"},this.domNode);_8.grip=_9;_8.gripHandler=[this.connect(_9,"onmouseover",function(e){var _a=false;for(var i=0;i<this._grid.length-1;i++){if(_1.hasClass(this._grid[i].grip,"gridContainerGripShow")){_a=true;break;}}if(!_a){_1.removeClass(e.target,"gridContainerGrip");_1.addClass(e.target,"gridContainerGripShow");}})[0],this.connect(_9,"onmouseout",function(e){if(!this._isResized){_1.removeClass(e.target,"gridContainerGripShow");_1.addClass(e.target,"gridContainerGrip");}})[0],this.connect(_9,"onmousedown","_resizeColumnOn")[0],this.connect(_9,"ondblclick","_onGripDbClick")[0]];},_placeGrips:function(){var _b,_c,_d=0,_e;var _f=this.domNode.style.overflowY;_1.forEach(this._grid,function(_10){if(_10.grip){_e=_10.grip;if(!_b){_b=_e.offsetWidth/2;}_d+=_1.marginBox(_10.node).w;_1.style(_e,"left",(_d-_b)+"px");if(!_c){_c=_1.contentBox(this.gridNode).h;}if(_c>0){_1.style(_e,"height",_c+"px");}}},this);},_onGripDbClick:function(){this._updateColumnsWidth(this._dragManager);this.resize();},_resizeColumnOn:function(e){this._activeGrip=e.target;this._initX=e.pageX;e.preventDefault();_1.body().style.cursor="ew-resize";this._isResized=true;var _11=[];var _12;var i;for(i=0;i<this._grid.length;i++){_11[i]=_1.contentBox(this._grid[i].node).w;}this._oldTabSize=_11;for(i=0;i<this._grid.length;i++){_12=this._grid[i];if(this._activeGrip==_12.grip){this._currentColumn=_12.node;this._currentColumnWidth=_11[i];this._nextColumn=this._grid[i+1].node;this._nextColumnWidth=_11[i+1];}_12.node.style.width=_11[i]+"px";}var _13=function(_14,_15){var _16=0;var _17=0;_1.forEach(_14,function(_18){if(_18.nodeType==1){var _19=_1.getComputedStyle(_18);var _1a=(_1.isIE)?_15:parseInt(_19.minWidth);_17=_1a+parseInt(_19.marginLeft)+parseInt(_19.marginRight);if(_16<_17){_16=_17;}}});return _16;};var _1b=_13(this._currentColumn.childNodes,this.minChildWidth);var _1c=_13(this._nextColumn.childNodes,this.minChildWidth);var _1d=Math.round((_1.marginBox(this.gridContainerTable).w*this.minColWidth)/100);this._currentMinCol=_1b;this._nextMinCol=_1c;if(_1d>this._currentMinCol){this._currentMinCol=_1d;}if(_1d>this._nextMinCol){this._nextMinCol=_1d;}this._connectResizeColumnMove=_1.connect(_1.doc,"onmousemove",this,"_resizeColumnMove");this._connectOnGripMouseUp=_1.connect(_1.doc,"onmouseup",this,"_onGripMouseUp");},_onGripMouseUp:function(){_1.body().style.cursor="default";_1.disconnect(this._connectResizeColumnMove);_1.disconnect(this._connectOnGripMouseUp);this._connectOnGripMouseUp=this._connectResizeColumnMove=null;if(this._activeGrip){_1.removeClass(this._activeGrip,"gridContainerGripShow");_1.addClass(this._activeGrip,"gridContainerGrip");}this._isResized=false;},_resizeColumnMove:function(e){e.preventDefault();if(!this._connectResizeColumnOff){_1.disconnect(this._connectOnGripMouseUp);this._connectOnGripMouseUp=null;this._connectResizeColumnOff=_1.connect(_1.doc,"onmouseup",this,"_resizeColumnOff");}var d=e.pageX-this._initX;if(d==0){return;}if(!(this._currentColumnWidth+d<this._currentMinCol||this._nextColumnWidth-d<this._nextMinCol)){this._currentColumnWidth+=d;this._nextColumnWidth-=d;this._initX=e.pageX;this._activeGrip.style.left=parseInt(this._activeGrip.style.left)+d+"px";if(this.liveResizeColumns){this._currentColumn.style["width"]=this._currentColumnWidth+"px";this._nextColumn.style["width"]=this._nextColumnWidth+"px";this.resize();}}},_resizeColumnOff:function(e){_1.body().style.cursor="default";_1.disconnect(this._connectResizeColumnMove);_1.disconnect(this._connectResizeColumnOff);this._connectResizeColumnOff=this._connectResizeColumnMove=null;if(!this.liveResizeColumns){this._currentColumn.style["width"]=this._currentColumnWidth+"px";this._nextColumn.style["width"]=this._nextColumnWidth+"px";}var _1e=[],_1f=[],_20=this.gridContainerTable.clientWidth,_21,_22=false,i;for(i=0;i<this._grid.length;i++){_21=this._grid[i].node;if(_1.isIE){_1e[i]=_1.marginBox(_21).w;_1f[i]=_1.contentBox(_21).w;}else{_1e[i]=_1.contentBox(_21).w;_1f=_1e;}}for(i=0;i<_1f.length;i++){if(_1f[i]!=this._oldTabSize[i]){_22=true;break;}}if(_22){var mul=_1.isIE?100:10000;for(i=0;i<this._grid.length;i++){this._grid[i].node.style.width=Math.round((100*mul*_1e[i])/_20)/mul+"%";}this.resize();}if(this._activeGrip){_1.removeClass(this._activeGrip,"gridContainerGripShow");_1.addClass(this._activeGrip,"gridContainerGrip");}this._isResized=false;},setColumns:function(_23){var z,j;if(_23>0){var _24=this._grid.length,_25=_24-_23;if(_25>0){var _26=[],_27,_28,end,_29;if(this.mode=="right"){end=(this.isLeftFixed&&_24>0)?1:0;_28=(this.isRightFixed)?_24-2:_24-1;for(z=_28;z>=end;z--){_29=0;_27=this._grid[z].node;for(j=0;j<_27.childNodes.length;j++){if(_27.childNodes[j].nodeType==1&&!(_27.childNodes[j].id=="")){_29++;break;}}if(_29==0){_26[_26.length]=z;}if(_26.length>=_25){this._deleteColumn(_26);break;}}if(_26.length<_25){_1.publish("/dojox/layout/gridContainer/noEmptyColumn",[this]);}}else{_28=(this.isLeftFixed&&_24>0)?1:0;end=(this.isRightFixed)?_24-1:_24;for(z=_28;z<end;z++){_29=0;_27=this._grid[z].node;for(j=0;j<_27.childNodes.length;j++){if(_27.childNodes[j].nodeType==1&&!(_27.childNodes[j].id=="")){_29++;break;}}if(_29==0){_26[_26.length]=z;}if(_26.length>=_25){this._deleteColumn(_26);break;}}if(_26.length<_25){_1.publish("/dojox/layout/gridContainer/noEmptyColumn",[this]);}}}else{if(_25<0){this._addColumn(Math.abs(_25));}}if(this.hasResizableColumns){this._placeGrips();}}},_addColumn:function(_2a){var _2b=this._grid,_2c,_2d,_2e,_2f,_30=(this.mode=="right"),_31=this.acceptTypes.join(","),m=this._dragManager;if(this.hasResizableColumns&&((!this.isRightFixed&&_30)||(this.isLeftFixed&&!_30&&this.nbZones==1))){this._createGrip(_2b.length-1);}for(var i=0;i<_2a;i++){_2d=_1.create("td",{"class":"gridContainerZone dojoxDndArea","accept":_31,"id":this.id+"_dz"+this.nbZones});_2f=_2b.length;if(_30){if(this.isRightFixed){_2e=_2f-1;_2b.splice(_2e,0,{"node":_2b[_2e].node.parentNode.insertBefore(_2d,_2b[_2e].node)});}else{_2e=_2f;_2b.push({"node":this.gridNode.appendChild(_2d)});}}else{if(this.isLeftFixed){_2e=(_2f==1)?0:1;this._grid.splice(1,0,{"node":this._grid[_2e].node.parentNode.appendChild(_2d,this._grid[_2e].node)});_2e=1;}else{_2e=_2f-this.nbZones;this._grid.splice(_2e,0,{"node":_2b[_2e].node.parentNode.insertBefore(_2d,_2b[_2e].node)});}}if(this.hasResizableColumns){if((!_30&&this.nbZones!=1)||(!_30&&this.nbZones==1&&!this.isLeftFixed)||(_30&&i<_2a-1)||(_30&&i==_2a-1&&this.isRightFixed)){this._createGrip(_2e);}}m.registerByNode(_2b[_2e].node);this.nbZones++;}this._updateColumnsWidth(m);},_deleteColumn:function(_32){var _33,_34,_35,_36=0,_37=_32.length,m=this._dragManager;for(var i=0;i<_37;i++){_35=(this.mode=="right")?_32[i]:_32[i]-_36;_34=this._grid[_35];if(this.hasResizableColumns&&_34.grip){_1.forEach(_34.gripHandler,function(_38){_1.disconnect(_38);});_1.destroy(this.domNode.removeChild(_34.grip));_34.grip=null;}m.unregister(_34.node);_1.destroy(this.gridNode.removeChild(_34.node));this._grid.splice(_35,1);this.nbZones--;_36++;}var _39=this._grid[this.nbZones-1];if(_39.grip){_1.forEach(_39.gripHandler,_1.disconnect);_1.destroy(this.domNode.removeChild(_39.grip));_39.grip=null;}this._updateColumnsWidth(m);},_updateColumnsWidth:function(_3a){this.inherited(arguments);_3a._dropMode.updateAreas(_3a._areaList);},destroy:function(){_1.unsubscribe(this._dropHandler);this.inherited(arguments);}});});require(["dojox/layout/GridContainer"]);