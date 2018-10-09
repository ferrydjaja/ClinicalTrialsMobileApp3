/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/m/Column','sap/m/ColumnListItem','sap/m/Text','sap/m/Token','./BaseValueListProvider','sap/ui/core/Item','sap/ui/model/Filter','sap/ui/model/Sorter','sap/ui/model/json/JSONModel','sap/ui/comp/util/FormatUtil','sap/ui/comp/smartfilterbar/FilterProvider'],function(q,l,C,a,T,b,B,I,F,S,J,c,d){"use strict";var D=l.smartfilterbar.DisplayBehaviour;var V=B.extend("sap.ui.comp.providers.ValueListProvider",{constructor:function(p){if(!d){d=sap.ui.require("sap/ui/comp/smartfilterbar/FilterProvider");}if(p){this.sAggregationName=p.aggregation;this.bTypeAheadEnabled=p.typeAheadEnabled;this.bEnableShowTableSuggestionValueHelp=p.enableShowTableSuggestionValueHelp===undefined?true:p.enableShowTableSuggestionValueHelp;this.dropdownItemKeyType=p.dropdownItemKeyType;}B.apply(this,arguments);this._onInitialise();}});V.prototype._onInitialise=function(){if(!this.bTypeAheadEnabled){this.oAfterRenderingEventDelegate={onAfterRendering:this._onMetadataInitialised};this.oControl.addEventDelegate(this.oAfterRenderingEventDelegate,this);}else if(this.oControl.attachSuggest){this._fSuggest=function(e){this.oControl=e.getSource();if(!this.bInitialised){return;}if(!this.oTemplate||!this.oControl.data("_hassuggestionTemplate")){this._createSuggestionTemplate();}var f=e.getParameter("suggestValue");this._fetchData(f);}.bind(this);this.oControl.attachSuggest(this._fSuggest);if(!this.oFilterModel){var t=this;var s=this.oControl.setParent;this.oControl.setParent=function(n,A,e){var o=this.getParent();var r=s.apply(this,arguments);n=this.getParent();var f=!(n&&(o===null));if((n!==o)&&f){t.unbindAggregation();}return r;};}this._handleSelect();}};V.prototype._onMetadataInitialised=function(){if(this.bInitialised){if(this.oAfterRenderingEventDelegate){this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate,this);}if(this.sAggregationName&&this.sAggregationName=="suggestionRows"){this._createSuggestionTemplate();}else{this._createDropDownTemplate();}this._fetchData();if(this.oAfterRenderingEventDelegate){delete this.oAfterRenderingEventDelegate;}}};V.prototype._isSortable=function(n){if(this.oPrimaryValueListAnnotation){for(var i=0;i<this.oPrimaryValueListAnnotation.valueListFields.length;i++){if(this.oPrimaryValueListAnnotation.valueListFields[i].name===n){return this.oPrimaryValueListAnnotation.valueListFields[i].sortable!==false;}}return false;}return false;};V.prototype._createDropDownTemplate=function(){this._oTemplate=new I({key:{path:this.sKey,type:this.dropdownItemKeyType},text:{parts:[{path:this.sKey,type:this.dropdownItemKeyType},{path:this.sDescription}],formatter:function(i,s){return c.getFormattedExpressionFromDisplayBehaviour(this.sDDLBDisplayBehaviour,i,s);}.bind(this)}});this._oSorter=null;if(this.sDDLBDisplayBehaviour===D.idOnly||this.sDDLBDisplayBehaviour===D.idAndDescription){if(this._isSortable(this.sKey)){this._oSorter=new S(this.sKey);}}else{if(this._isSortable(this.sDescription)){this._oSorter=new S(this.sDescription);}else if((this.sDescription!==this.sKey)&&this._isSortable(this.sKey)){this._oSorter=new S(this.sKey);}}};V.prototype._createSuggestionTemplate=function(){var i=0,L=0,t,s=0;this._oTemplate=new a();if(this._aCols){this.oControl.removeAllSuggestionColumns();L=this._aCols.length;for(i=0;i<L;i++){var e=false,m="1px",w=this._aCols[i].width;if(sap.ui.Device.system.phone){w=undefined;if(i>=2){e=true;m=(i+1)*10+"rem";}}this.oControl.addSuggestionColumn(new C({header:new T({wrapping:false,text:this._aCols[i].label,tooltip:this._aCols[i].tooltip||this._aCols[i].label}),demandPopin:e,popinDisplay:sap.m.PopinDisplay.Inline,minScreenWidth:m,width:w}));t=null;if(this._aCols[i].type==="string"){t={path:this._aCols[i].template};}this._oTemplate.addCell(new T({wrapping:false,text:{path:this._aCols[i].template,type:this._aCols[i].oType},tooltip:t}));if(w){s+=parseFloat(w.substring(0,w.length-2));}}if(s>0){this.oControl.setProperty('maxSuggestionWidth',s+L+"em",true);}}this.oControl.data("_hassuggestionTemplate",true);};V.prototype._handleSelect=function(){var h=function(o,f){var k,t,e;if(o){k=o[this.sKey];t=o[this.sDescription];}if(k||(k==="")){if(this.oControl.addToken){t=c.getFormattedExpressionFromDisplayBehaviour(this.sTokenDisplayBehaviour,k,t);e=new b({key:k,text:t,tooltip:t});e.data("row",o);if(f){f(e);}delete this.oControl.__sValidationText;}else{this.oControl.setValue(k);this.oControl.fireChange({value:k,validated:true});}}this._calculateAndSetFilterOutputData([o]);}.bind(this);var A=function(){if(this.oFilterProvider&&this.oFilterProvider._oSmartFilter&&this.oFilterProvider._oSmartFilter.bIsSearchPending&&this.oFilterProvider._oSmartFilter.search){if(this.oFilterProvider._oSmartFilter.getLiveMode&&this.oFilterProvider._oSmartFilter.getLiveMode()){return;}this.oFilterProvider._oSmartFilter.search();}}.bind(this);if(this.oControl.addValidator){var v=this.oControl._tokenizer?this.oControl._tokenizer._aTokenValidators.slice():[];this.oControl.removeAllValidators();this._fValidator=function(o){if(!this.bInitialised){return;}if(v){var t;v.some(function(g){t=g(o);return t;},this);if(t){return t;}}var r=o.suggestionObject,e,i=o.text,f=[],p;if(r){e=this.oODataModel.getData(r.getBindingContextPath());h(e,o.asyncCallback);}else if(i){if(this.sDisplayFormat==="UpperCase"){i=i.toUpperCase();}if(this.oControl.__sValidationText!==i){this.oControl.__sValidationText=i;this.oControl.__bValidatingToken=true;this._calculateFilterInputData();if(this.mFilterInputData&&this.aFilterField){f=d.generateFilters(this.aFilterField,this.mFilterInputData);}f.push(new F(this.sKey,sap.ui.model.FilterOperator.EQ,i));if(this.bSupportBasicSearch){p={"search-focus":this.sKey};}this.oODataModel.read("/"+this.sValueListEntitySetName,{filters:f,urlParameters:p,success:function(R,g){var j=R;delete this.oControl.__bValidatingToken;if(R){if(R.results&&R.results.length>=1){if(R.results.length===1){j=R.results[0];}if(this.oControl.data("__validationError")){this.oControl.data("__validationError",null);this.oControl.setValueState("None");}}else{this.oControl.setValueState("Error");this.oControl.data("__validationError",true);}if(j&&j[this.sKey]){h(j,o.asyncCallback);}}A();}.bind(this),error:function(){if(this.oControl.data("__validationError")){this.oControl.setValueState("None");}delete this.oControl.__bValidatingToken;A();}.bind(this)});}else{if(this.oControl.data("__validationError")){this.oControl.setValueState(sap.ui.core.ValueState.Error);}}}}.bind(this);this.oControl.addValidator(this._fValidator);}else if(this.oControl.attachSuggestionItemSelected){this._fSuggestionItemSelected=function(e){var r=e.getParameter("selectedRow"),o;if(r){o=r.getModel().getData(r.getBindingContextPath());h(o);}};this.oControl.attachSuggestionItemSelected(this._fSuggestionItemSelected);}this.oControl.setRowResultFunction(function(s){var o,r="";if(s){o=s.getBindingContext();}if(o&&this.sKey){r=o.getProperty(this.sKey);}return r;}.bind(this));};V.prototype._fetchData=function(s){var p={},f=[],e,E;if(this.bTypeAheadEnabled){if(s&&this.sDisplayFormat==="UpperCase"){s=s.toUpperCase();}if(this.bSupportBasicSearch){p["custom"]={"search-focus":this.sKey,"search":s};}this._calculateFilterInputData();if(this.mFilterInputData&&this.aFilterField){f=d.generateFilters(this.aFilterField,this.mFilterInputData,{dateSettings:this._oDateFormatSettings});}if(!this.bSupportBasicSearch){if(this._fieldViewMetadata&&this._fieldViewMetadata.filterType==="numc"){f.push(new F(this.sKey,sap.ui.model.FilterOperator.Contains,s));}else{f.push(new F(this.sKey,sap.ui.model.FilterOperator.StartsWith,s));}}e=10;if(this.bEnableShowTableSuggestionValueHelp){E={dataReceived:function(o){var g=o.getSource(),i;if(g){i=g.getLength();if(i&&i<=e){this.oControl.setShowTableSuggestionValueHelp(false);}else{this.oControl.setShowTableSuggestionValueHelp(true);}}}.bind(this)};}else{this.oControl.setShowTableSuggestionValueHelp(false);}}if(this.aSelect&&this.aSelect.length){p["select"]=this.aSelect.toString();}if(!this.sValueListEntitySetName){q.sap.log.error("ValueListProvider","Empty sValueListEntitySetName for "+this.sAggregationName+" binding! (missing primaryValueListAnnotation)");}this.oControl.bindAggregation(this.sAggregationName,{path:"/"+this.sValueListEntitySetName,length:e,parameters:p,filters:f,sorter:this._oSorter,events:E,template:this._oTemplate,templateShareable:false});};V.prototype.unbindAggregation=function(){if(this.oControl){this.oControl.unbindAggregation(this.sAggregationName);}return this;};V.prototype.destroy=function(){if(this.oControl){if(this.oControl.detachSuggest){this.oControl.detachSuggest(this._fSuggest);this._fSuggest=null;}if(this.oControl.removeValidator){this.oControl.removeValidator(this._fValidator);this._fValidator=null;}else if(this.oControl.detachSuggestionItemSelected){this.oControl.detachSuggestionItemSelected(this._fSuggestionItemSelected);this._fSuggestionItemSelected=null;}this.oControl.unbindAggregation(this.sAggregationName);this.oControl.data("_hassuggestionTemplate",false);delete this.oControl.__sValidationText;delete this.oControl.__bValidatingToken;}B.prototype.destroy.apply(this,arguments);if(this.oJsonModel){this.oJsonModel.destroy();this.oJsonModel=null;}if(this._oTemplate){this._oTemplate.destroy();}this._oTemplate=null;this.sAggregationName=null;this.bTypeAheadEnabled=null;this._oSorter=null;};return V;},true);