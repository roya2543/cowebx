/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

define(["dojo/_base/kernel","dojo/_base/declare","./AnalogIndicatorBase"],function(dojo,ddeclare,AnalogIndicatorBase) { 
dojo.experimental("dojox.gauges.AnalogArrowIndicator");

return dojo.declare("dojox.gauges.AnalogArrowIndicator",[AnalogIndicatorBase],{
	_getShapes: function(group){
		// summary:
		//		Override of dojox.gauges.AnalogLineIndicator._getShapes
		if(!this._gauge){
			return null;
		}
		var color = this.color ? this.color : 'black';
		var strokeColor = this.strokeColor ? this.strokeColor : color;
		var stroke = { color: strokeColor, width: 1};
		if (this.color.type && !this.strokeColor){
			stroke.color = this.color.colors[0].color;
		}
			
		var x = Math.floor(this.width/2);
		var head = this.width * 5;
		var odd = (this.width & 1);
		var shapes = [];
		var points = [{x:-x,	 y:0},
					  {x:-x,	 y:-this.length+head},
					  {x:-2*x,	 y:-this.length+head},
					  {x:0,		 y:-this.length},
					  {x:2*x+odd,y:-this.length+head},
					  {x:x+odd,	 y:-this.length+head},
					  {x:x+odd,	 y:0},
					  {x:-x,	 y:0}];
		shapes[0] = group.createPolyline(points)
					.setStroke(stroke)
					.setFill(color);
		shapes[1] = group.createLine({ x1:-x, y1: 0, x2: -x, y2:-this.length+head })
					.setStroke({color: this.highlight});
		shapes[2] = group.createLine({ x1:-x-3, y1: -this.length+head, x2: 0, y2:-this.length })
					.setStroke({color: this.highlight});
		shapes[3] = group.createCircle({cx: 0, cy: 0, r: this.width})
					.setStroke(stroke)
					.setFill(color);
		return shapes;
	}
});
});