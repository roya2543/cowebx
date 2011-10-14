/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

define(["dojo/_base/lang","dojo/_base/declare","dojo/_base/connect","../Element","./common","dojox/lang/utils","dojox/gfx/fx"],function(_1,_2,_3,_4,dc,du,fx){return _1.declare("dojox.charting.plot2d.Grid",dojox.charting.Element,{defaultParams:{hAxis:"x",vAxis:"y",hMajorLines:true,hMinorLines:false,vMajorLines:true,vMinorLines:false,hStripes:"none",vStripes:"none",animate:null,enableCache:false},optionalParams:{},constructor:function(_5,_6){this.opt=_1.clone(this.defaultParams);du.updateWithObject(this.opt,_6);this.hAxis=this.opt.hAxis;this.vAxis=this.opt.vAxis;this.dirty=true;this.animate=this.opt.animate;this.zoom=null,this.zoomQueue=[];this.lastWindow={vscale:1,hscale:1,xoffset:0,yoffset:0};if(this.opt.enableCache){this._lineFreePool=[];this._lineUsePool=[];}},clear:function(){this._hAxis=null;this._vAxis=null;this.dirty=true;return this;},setAxis:function(_7){if(_7){this[_7.vertical?"_vAxis":"_hAxis"]=_7;}return this;},addSeries:function(_8){return this;},getSeriesStats:function(){return _1.delegate(dc.defaultStats);},initializeScalers:function(){return this;},isDirty:function(){return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;},performZoom:function(_9,_a){var vs=this._vAxis.scale||1,hs=this._hAxis.scale||1,_b=_9.height-_a.b,_c=this._hAxis.getScaler().bounds,_d=(_c.from-_c.lower)*_c.scale,_e=this._vAxis.getScaler().bounds,_f=(_e.from-_e.lower)*_e.scale,_10=vs/this.lastWindow.vscale,_11=hs/this.lastWindow.hscale,_12=(this.lastWindow.xoffset-_d)/((this.lastWindow.hscale==1)?hs:this.lastWindow.hscale),_13=(_f-this.lastWindow.yoffset)/((this.lastWindow.vscale==1)?vs:this.lastWindow.vscale),_14=this.group,_15=fx.animateTransform(_1.delegate({shape:_14,duration:1200,transform:[{name:"translate",start:[0,0],end:[_a.l*(1-_11),_b*(1-_10)]},{name:"scale",start:[1,1],end:[_11,_10]},{name:"original"},{name:"translate",start:[0,0],end:[_12,_13]}]},this.zoom));_1.mixin(this.lastWindow,{vscale:vs,hscale:hs,xoffset:_d,yoffset:_f});this.zoomQueue.push(_15);_1.connect(_15,"onEnd",this,function(){this.zoom=null;this.zoomQueue.shift();if(this.zoomQueue.length>0){this.zoomQueue[0].play();}});if(this.zoomQueue.length==1){this.zoomQueue[0].play();}return this;},getRequiredColors:function(){return 0;},cleanGroup:function(){this.inherited(arguments);if(this.opt.enableCache){this._lineFreePool=this._lineFreePool.concat(this._lineUsePool);this._lineUsePool=[];}},createLine:function(_16,_17){var _18;if(this.opt.enableCache&&this._lineFreePool.length>0){_18=this._lineFreePool.pop();_18.setShape(_17);_16.add(_18);}else{_18=_16.createLine(_17);}if(this.opt.enableCache){this._lineUsePool.push(_18);}return _18;},render:function(dim,_19){if(this.zoom){return this.performZoom(dim,_19);}this.dirty=this.isDirty();if(!this.dirty){return this;}this.cleanGroup();var s=this.group,ta=this.chart.theme.axis;try{var _1a=this._vAxis.getScaler(),vt=_1a.scaler.getTransformerFromModel(_1a),_1b=this._vAxis.getTicks();if(this.opt.hMinorLines){_1.forEach(_1b.minor,function(_1c){var y=dim.height-_19.b-vt(_1c.value);var _1d=this.createLine(s,{x1:_19.l,y1:y,x2:dim.width-_19.r,y2:y}).setStroke(ta.minorTick);if(this.animate){this._animateGrid(_1d,"h",_19.l,_19.r+_19.l-dim.width);}},this);}if(this.opt.hMajorLines){_1.forEach(_1b.major,function(_1e){var y=dim.height-_19.b-vt(_1e.value);var _1f=this.createLine(s,{x1:_19.l,y1:y,x2:dim.width-_19.r,y2:y}).setStroke(ta.majorTick);if(this.animate){this._animateGrid(_1f,"h",_19.l,_19.r+_19.l-dim.width);}},this);}}catch(e){}try{var _20=this._hAxis.getScaler(),ht=_20.scaler.getTransformerFromModel(_20),_1b=this._hAxis.getTicks();if(_1b&&this.opt.vMinorLines){_1.forEach(_1b.minor,function(_21){var x=_19.l+ht(_21.value);var _22=this.createLine(s,{x1:x,y1:_19.t,x2:x,y2:dim.height-_19.b}).setStroke(ta.minorTick);if(this.animate){this._animateGrid(_22,"v",dim.height-_19.b,dim.height-_19.b-_19.t);}},this);}if(_1b&&this.opt.vMajorLines){_1.forEach(_1b.major,function(_23){var x=_19.l+ht(_23.value);var _24=this.createLine(s,{x1:x,y1:_19.t,x2:x,y2:dim.height-_19.b}).setStroke(ta.majorTick);if(this.animate){this._animateGrid(_24,"v",dim.height-_19.b,dim.height-_19.b-_19.t);}},this);}}catch(e){}this.dirty=false;return this;},_animateGrid:function(_25,_26,_27,_28){var _29=_26=="h"?[_27,0]:[0,_27];var _2a=_26=="h"?[1/_28,1]:[1,1/_28];fx.animateTransform(_1.delegate({shape:_25,duration:1200,transform:[{name:"translate",start:_29,end:[0,0]},{name:"scale",start:_2a,end:[1,1]},{name:"original"}]},this.animate)).play();}});});