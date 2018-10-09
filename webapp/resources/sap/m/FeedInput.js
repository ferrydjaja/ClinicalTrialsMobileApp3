/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/m/TextArea","sap/m/Button","./FeedInputRenderer"],function(q,l,C,I,T,B,F){"use strict";var a=l.ButtonType;var b=C.extend("sap.m.FeedInput",{metadata:{library:"sap.m",designtime:"sap/m/designtime/FeedInput.designtime",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},maxLength:{type:"int",group:"Behavior",defaultValue:0},placeholder:{type:"string",group:"Appearance",defaultValue:"Post something here"},value:{type:"string",group:"Data",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},showIcon:{type:"boolean",group:"Behavior",defaultValue:true},iconDensityAware:{type:"boolean",group:"Appearance",defaultValue:true},buttonTooltip:{type:"sap.ui.core.TooltipBase",group:"Accessibility",defaultValue:"Submit"},ariaLabelForPicture:{type:"string",group:"Accessibility",defaultValue:null}},events:{post:{parameters:{value:{type:"string"}}}}}});b.prototype.init=function(){var o=sap.ui.getCore().getLibraryResourceBundle("sap.m");this.setProperty("placeholder",o.getText("FEEDINPUT_PLACEHOLDER"),true);this.setProperty("buttonTooltip",o.getText("FEEDINPUT_SUBMIT"),true);};b.prototype.exit=function(){if(this._oTextArea){this._oTextArea.destroy();}if(this._oButton){this._oButton.destroy();}if(this._oImageControl){this._oImageControl.destroy();}};b.prototype.setIconDensityAware=function(i){this.setProperty("iconDensityAware",i,true);var c=sap.ui.require("sap/m/Image");if(this._getImageControl()instanceof c){this._getImageControl().setDensityAware(i);}return this;};b.prototype.setMaxLength=function(m){this.setProperty("maxLength",m,true);this._getTextArea().setMaxLength(m);return this;};b.prototype.setValue=function(v){this.setProperty("value",v,true);this._getTextArea().setValue(v);this._enablePostButton();return this;};b.prototype.setPlaceholder=function(v){this.setProperty("placeholder",v,true);this._getTextArea().setPlaceholder(v);return this;};b.prototype.setEnabled=function(e){this.setProperty("enabled",e,true);this._getTextArea().setEnabled(e);this._enablePostButton();return this;};b.prototype.setButtonTooltip=function(v){this.setProperty("buttonTooltip",v,true);this._getPostButton().setTooltip(v);return this;};b.prototype._getTextArea=function(){if(!this._oTextArea){this._oTextArea=new T(this.getId()+"-textArea",{rows:3,value:null,maxLength:this.getMaxLength(),placeholder:this.getPlaceholder(),height:"100%",liveChange:q.proxy(function(e){var v=e.getParameter("value");this.setProperty("value",v,true);this._enablePostButton();},this)});this._oTextArea.setParent(this);}return this._oTextArea;};b.prototype._getPostButton=function(){if(!this._oButton){this._oButton=new B(this.getId()+"-button",{enabled:false,type:a.Default,icon:"sap-icon://feeder-arrow",tooltip:this.getButtonTooltip(),press:q.proxy(function(){this._oTextArea.focus();this.firePost({value:this.getValue()});this.setValue(null);},this)});this._oButton.setParent(this);}return this._oButton;};b.prototype._enablePostButton=function(){var p=this._isControlEnabled();var o=this._getPostButton();o.setEnabled(p);};b.prototype._isControlEnabled=function(){var v=this.getValue();return this.getEnabled()&&q.type(v)==="string"&&v.trim().length>0;};b.prototype._getImageControl=function(){var i=this.getIcon()||I.getIconURI("person-placeholder"),s=this.getId()+'-icon',p={src:i,alt:this.getAriaLabelForPicture(),densityAware:this.getIconDensityAware(),decorative:false,useIconTooltip:false},c=['sapMFeedInImage'];this._oImageControl=l.ImageHelper.getImageControl(s,this._oImageControl,this,p,c);return this._oImageControl;};return b;});