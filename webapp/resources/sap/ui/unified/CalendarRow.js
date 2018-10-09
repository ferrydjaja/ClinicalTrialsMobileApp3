/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/Device','sap/ui/core/LocaleData','sap/ui/unified/calendar/CalendarUtils','sap/ui/core/date/UniversalDate','./library','sap/ui/core/InvisibleText','sap/ui/core/format/DateFormat','sap/ui/core/ResizeHandler','sap/ui/core/Locale',"./CalendarRowRenderer"],function(q,C,D,L,a,U,l,I,b,R,c,d){"use strict";var e=l.CalendarDayType;var f=l.CalendarAppointmentVisualization;var G=l.GroupAppointmentsMode;var g=l.CalendarIntervalType;var h=C.extend("sap.ui.unified.CalendarRow",{metadata:{library:"sap.ui.unified",properties:{startDate:{type:"object",group:"Data"},intervals:{type:"int",group:"Appearance",defaultValue:12},intervalType:{type:"sap.ui.unified.CalendarIntervalType",group:"Appearance",defaultValue:g.Hour},showSubIntervals:{type:"boolean",group:"Appearance",defaultValue:false},showIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},showEmptyIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},nonWorkingDays:{type:"int[]",group:"Misc",defaultValue:null},nonWorkingHours:{type:"int[]",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},checkResize:{type:"boolean",group:"Behavior",defaultValue:true},updateCurrentTime:{type:"boolean",group:"Behavior",defaultValue:true},groupAppointmentsMode:{type:"sap.ui.unified.GroupAppointmentsMode",group:"Appearance",defaultValue:G.Collapsed},appointmentsReducedHeight:{type:"boolean",group:"Appearance",defaultValue:false},appointmentsVisualization:{type:"sap.ui.unified.CalendarAppointmentVisualization",group:"Appearance",defaultValue:f.Standard}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment"},intervalHeaders:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"intervalHeader"},groupAppointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"groupAppointment",visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"},multiSelect:{type:"boolean"},domRefId:{type:"string"}}},startDateChange:{},leaveRow:{parameters:{type:{type:"string"}}},intervalSelect:{parameters:{startDate:{type:"object"},endDate:{type:"object"},subInterval:{type:"boolean"}}}}}});h.prototype.init=function(){this._bRTL=sap.ui.getCore().getConfiguration().getRTL();this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");this._oFormatAria=b.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY 'at' HH:mm:ss a"});this._iHoursMinDelta=1;this._iDaysMinDelta=30;this._iMonthsMinDelta=720;this._aVisibleAppointments=[];this._aVisibleIntervalHeaders=[];this.setStartDate(new Date());this._resizeProxy=q.proxy(this.handleResize,this);this.aSelectedAppointments=[];this._fnCustomSortedAppointments=undefined;};h.prototype.exit=function(){if(this._sResizeListener){R.deregister(this._sResizeListener);this._sResizeListener=undefined;}if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}this._fnCustomSortedAppointments=undefined;};h.prototype.onBeforeRendering=function(){n.call(this);r.call(this);v.call(this);if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}};h.prototype.onAfterRendering=function(){w.call(this);this.updateCurrentTimeVisualization();if(this.getCheckResize()&&!this._sResizeListener){this._sResizeListener=R.register(this,this._resizeProxy);}};h.prototype.onThemeChanged=function(j){if(this.getDomRef()){for(var i=0;i<this._aVisibleAppointments.length;i++){var k=this._aVisibleAppointments[i];k.level=-1;}this.handleResize(j);}};h.prototype.invalidate=function(O){if(O&&O instanceof sap.ui.unified.CalendarAppointment){var j=false;for(var i=0;i<this._aVisibleAppointments.length;i++){if(this._aVisibleAppointments[i].appointment==O){j=true;break;}}if(j){this._aVisibleAppointments=[];}}C.prototype.invalidate.apply(this,arguments);};h.prototype.setStartDate=function(S){if(!S){S=new Date();}a._checkJSDateObject(S);var Y=S.getFullYear();a._checkYearInValidRange(Y);this.setProperty("startDate",S);return this;};h.prototype._getStartDate=function(){if(!this._oUTCStartDate){this._oUTCStartDate=a._createUniversalUTCDate(this.getStartDate(),undefined,true);}return this._oUTCStartDate;};h.prototype.setIntervalType=function(i){this.setProperty("intervalType",i);this._aVisibleAppointments=[];return this;};h.prototype.setGroupAppointmentsMode=function(i){this.setProperty("groupAppointmentsMode",i);this._aVisibleAppointments=[];return this;};h.prototype.setAppointmentsReducedHeight=function(i){this.setProperty("appointmentsReducedHeight",i);this._aVisibleAppointments=[];return this;};h.prototype._getAppointmentReducedHeight=function(i){var j=false;if(!D.system.phone&&this.getAppointmentsReducedHeight()&&!i.getText()){j=true;}return j;};h.prototype.onfocusin=function(j){if(q(j.target).hasClass("sapUiCalendarApp")){E.call(this,j.target.id);}else{var V=this._getVisibleAppointments();var k=false;var M;for(var i=0;i<V.length;i++){M=V[i].appointment;if(q.sap.containsOrEquals(M.getDomRef(),j.target)){k=true;M.focus();break;}}if(!k){M=this.getFocusedAppointment();if(M){M.focus();}}}};h.prototype.applyFocusInfo=function(i){if(this._sFocusedAppointmentId){this.getFocusedAppointment().focus();}return this;};h.prototype.onsapleft=function(i){if(q(i.target).hasClass("sapUiCalendarApp")){F.call(this,this._bRTL,1);}i.preventDefault();i.stopPropagation();};h.prototype.onsapright=function(i){if(q(i.target).hasClass("sapUiCalendarApp")){F.call(this,!this._bRTL,1);}i.preventDefault();i.stopPropagation();};h.prototype.onsapup=function(i){this.fireLeaveRow({type:i.type});};h.prototype.onsapdown=function(i){this.fireLeaveRow({type:i.type});};h.prototype.onsaphome=function(i){H.call(this,i);i.preventDefault();i.stopPropagation();};h.prototype.onsapend=function(i){H.call(this,i);i.preventDefault();i.stopPropagation();};h.prototype.onsapselect=function(j){var V=this._getVisibleAppointments();for(var i=0;i<V.length;i++){var k=V[i].appointment;if(q.sap.containsOrEquals(k.getDomRef(),j.target)){x.call(this,k,!j.ctrlKey);break;}}j.stopPropagation();j.preventDefault();};h.prototype.ontap=function(i){var j=this.$("Apps").children(".sapUiCalendarRowAppsInt");var k=0;var M=false;for(k=0;k<j.length;k++){var N=j[k];if(!this._isOneMonthIntervalOnSmallSizes()&&q.sap.containsOrEquals(N,i.target)){M=true;break;}}if(M){J.call(this,k,i.target);}else{this.onsapselect(i);}};h.prototype.onsapselectmodifiers=function(i){this.onsapselect(i);};h.prototype.handleResize=function(i){if(i&&i.size&&i.size.width<=0){return this;}var $=this.$("DummyApp");$.css("display","");w.call(this);return this;};h.prototype.updateCurrentTimeVisualization=function(){var N=this.$("Now");var i=a._createUniversalUTCDate(new Date(),undefined,true);var j=this.getIntervals();var k=this.getIntervalType();var S=this._getStartDate();var M=S.getTime();var O=this._oUTCEndDate;var P=O.getTime();this._sUpdateCurrentTime=undefined;if(i.getTime()<=P&&i.getTime()>=M){var Q=t.call(this,k,j,S,O,M,i);var T=0;if(this._bRTL){N.css("right",Q+"%");}else{N.css("left",Q+"%");}N.css("display","");if(this.getUpdateCurrentTime()){switch(k){case g.Hour:T=60000;break;case g.Day:case g.Week:case g.OneMonth:T=1800000;break;default:T=-1;break;}if(T>0){this._sUpdateCurrentTime=q.sap.delayedCall(T,this,this.updateCurrentTimeVisualization);}}}else{N.css("display","none");}return this;};h.prototype.getFocusedAppointment=function(){var j=this._getAppointmentsSorted();var k=this.getAggregation("groupAppointments",[]);var M;var i=0;for(i=0;i<k.length;i++){if(k[i].getId()==this._sFocusedAppointmentId){M=k[i];break;}}if(!M){for(i=0;i<j.length;i++){if(j[i].getId()==this._sFocusedAppointmentId){M=j[i];break;}}}return M;};h.prototype.focusAppointment=function(i){if(!i||!(i instanceof sap.ui.unified.CalendarAppointment)){throw new Error("Appointment must be a CalendarAppointment; "+this);}var j=i.getId();if(this._sFocusedAppointmentId!=j){E.call(this,j);}else{i.focus();}return this;};h.prototype.focusNearestAppointment=function(j){a._checkJSDateObject(j);var k=this._getAppointmentsSorted();var N;var P;var M;for(var i=0;i<k.length;i++){N=k[i];if(N.getStartDate()>j){if(i>0){P=k[i-1];}else{P=N;}break;}}if(N){if(P&&Math.abs(N.getStartDate()-j)>=Math.abs(P.getStartDate()-j)){M=P;}else{M=N;}this.focusAppointment(M);}return this;};h.prototype._getVisibleAppointments=function(){return this._aVisibleAppointments;};h.prototype._getVisibleIntervalHeaders=function(){return this._aVisibleIntervalHeaders;};h.prototype._getNonWorkingDays=function(){var N=this.getNonWorkingDays();if(!N){var j=m.call(this);var W=j.getWeekendStart();var k=j.getWeekendEnd();N=[];for(var i=0;i<=6;i++){if((W<=k&&i>=W&&i<=k)||(W>k&&(i>=W||i<=k))){N.push(i);}}}else if(!q.isArray(N)){N=[];}return N;};h.prototype._isOneMonthIntervalOnSmallSizes=function(){return this.getIntervalType()===g.OneMonth&&this.getIntervals()===1;};h.prototype._getAppointmentsSorted=function(){var i=this.getAppointments(),j=K;i.sort(this._fnCustomSortedAppointments?this._fnCustomSortedAppointments:j);return i;};h.prototype._setCustomAppointmentsSorterCallback=function(S){this._fnCustomSortedAppointments=S;this.invalidate();};function _(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;}function m(){if(!this._oLocaleData){var i=_.call(this);var j=new c(i);this._oLocaleData=L.getInstance(j);}return this._oLocaleData;}function n(){var S=this.getStartDate();var i;var j=this.getIntervals();var k=this.getIntervalType();this._oUTCStartDate=o.call(this,S);switch(k){case g.Hour:i=new U(this._oUTCStartDate.getTime());i.setUTCHours(i.getUTCHours()+j);this._iMinDelta=this._iHoursMinDelta;break;case g.Day:case g.Week:case g.OneMonth:i=new U(this._oUTCStartDate.getTime());i.setUTCDate(i.getUTCDate()+j);this._iMinDelta=this._iDaysMinDelta;break;case g.Month:i=new U(this._oUTCStartDate.getTime());i.setUTCMonth(i.getUTCMonth()+j);this._iMinDelta=this._iMonthsMinDelta;break;default:throw new Error("Unknown IntervalType: "+k+"; "+this);}i.setUTCMilliseconds(-1);this._iRowSize=i.getTime()-this._oUTCStartDate.getTime();this._iIntervalSize=Math.floor(this._iRowSize/j);this._oUTCEndDate=i;}function o(i){var j=this.getIntervalType();var k=a._createUniversalUTCDate(i,undefined,true);switch(j){case g.Hour:k.setUTCMinutes(0);k.setUTCSeconds(0);k.setUTCMilliseconds(0);break;case g.Day:case g.Week:case g.OneMonth:k.setUTCHours(0);k.setUTCMinutes(0);k.setUTCSeconds(0);k.setUTCMilliseconds(0);break;case g.Month:k.setUTCDate(1);k.setUTCHours(0);k.setUTCMinutes(0);k.setUTCSeconds(0);k.setUTCMilliseconds(0);break;default:throw new Error("Unknown IntervalType: "+j+"; "+this);}return k;}function p(){return D.system.phone||(this.getGroupAppointmentsMode()===G.Collapsed);}function r(){var M=this._getAppointmentsSorted();var N;var O;var P;var Q=this.getIntervals();var S=this.getIntervalType();var T=this._getStartDate();var V=T.getTime();var W=this._oUTCEndDate;var X=W.getTime();var Y=[];var Z=false;var i=0;var j=0;var $=p.call(this);this.destroyAggregation("groupAppointments",true);for(i=0;i<M.length;i++){N=M[i];var a1=a._createUniversalUTCDate(N.getStartDate(),undefined,true);a1.setUTCSeconds(0);a1.setUTCMilliseconds(0);var b1=N.getEndDate()?a._createUniversalUTCDate(N.getEndDate(),undefined,true):a._createUniversalUTCDate(new Date(864000000000000),undefined,true);b1.setUTCSeconds(0);b1.setUTCMilliseconds(0);var c1=false;if(a1.getTime()<V&&b1.getTime()>=V){a1=new U(V);c1=true;}if(b1.getTime()>X&&a1.getTime()<=X){b1=new U(X);c1=true;}var d1=a1.getUTCHours()*60+a1.getUTCMinutes();a1.setUTCMinutes(a1.getUTCMinutes()-(d1%this._iMinDelta));var e1=(b1.getTime()-a1.getTime())/60000;if(c1&&e1==0){continue;}var f1=0;var g1=0;var h1=-1;O=undefined;P=undefined;if(a1&&a1.getTime()<=X&&b1&&b1.getTime()>=V){if($&&(S==g.Month)&&((b1.getTime()-a1.getTime())<604800000)){O=s.call(this,a1,N,S,Q,T,W,V,Y);var i1=a._createUniversalUTCDate(O.getEndDate(),undefined,true);if(b1.getTime()>i1.getTime()){P=s.call(this,b1,N,S,Q,T,W,V,Y);}}f1=t.call(this,S,Q,T,W,V,a1);g1=u.call(this,S,Q,T,W,V,b1);if(O){O._iBegin=f1;O._iEnd=g1;O._iLevel=h1;if(P){P._iBegin=f1;P._iEnd=g1;P._iLevel=h1;}continue;}Y.push({appointment:N,begin:f1,end:g1,calculatedEnd:g1,level:h1});if(this._sFocusedAppointmentId&&this._sFocusedAppointmentId==N.getId()){Z=true;}}}var j1=this.getAggregation("groupAppointments",[]);if(j1.length>0){for(i=0;i<Y.length;i++){N=Y[i];if(N.appointment._aAppointments&&N.appointment._aAppointments.length<=1){O=N.appointment;var k1=false;if(O._aAppointments.length==0){k1=true;}else{for(j=0;j<Y.length;j++){if(Y[j].appointment==O._aAppointments[0]){k1=true;break;}}}if(!k1){for(j=0;j<j1.length;j++){P=j1[j];if(O!=P){for(var k=0;k<P._aAppointments.length;k++){if(O._aAppointments[0]==P._aAppointments[k]){P._aAppointments.splice(k,1);if(P._aAppointments.length==1){this.removeAggregation("groupAppointments",P);P.destroy();j1=this.getAggregation("groupAppointments",[]);}else{P.setProperty("title",P._aAppointments.length,true);}break;}}}}N.begin=O._iBegin;N.end=O._iEnd;N.calculatedEnd=O._iEnd;N.level=O._iLevel;N.appointment=O._aAppointments[0];}else{Y.splice(i,1);i--;}this.removeAggregation("groupAppointments",O);O.destroy();j1=this.getAggregation("groupAppointments",[]);}}}if(!Z){if(Y.length>0){this._sFocusedAppointmentId=Y[0].appointment.getId();}else{this._sFocusedAppointmentId=undefined;}}this._aVisibleAppointments=Y;return this._aVisibleAppointments;}function s(i,k,M,N,S,O,P,V){var Q=this.getAggregation("groupAppointments",[]);var T;var W=m.call(this);var X=W.getFirstDayOfWeek();var Y=i.getUTCDay();var Z=new U(i.getTime());Z.setUTCHours(0);Z.setUTCMinutes(0);Z.setUTCSeconds(0);Z.setUTCMilliseconds(0);if(X<=Y){Z.setDate(Z.getDate()-(Y-X));}else{Z.setDate(Z.getDate()-(7-Y-X));}for(var j=0;j<Q.length;j++){T=Q[j];var $=a._createUniversalUTCDate(T.getStartDate(),undefined,true);if($.getTime()==Z.getTime()){break;}T=undefined;}if(!T){var a1=new U(Z.getTime());a1.setDate(a1.getDate()+7);a1.setMilliseconds(-1);T=new sap.ui.unified.CalendarAppointment(this.getId()+"-Group"+Q.length,{type:k.getType(),startDate:a._createLocalDate(new Date(Z.getTime()),true),endDate:a._createLocalDate(new Date(a1.getTime()),true)});T._aAppointments=[];this.addAggregation("groupAppointments",T,true);var b1=t.call(this,M,N,S,O,P,Z);var c1=u.call(this,M,N,S,O,P,a1);V.push({appointment:T,begin:b1,end:c1,calculatedEnd:c1,level:-1});}T._aAppointments.push(k);if(T.getType()!=e.None&&T.getType()!=k.getType()){T.setType(e.None);}T.setProperty("title",T._aAppointments.length,true);return T;}function t(i,j,S,k,M,N){var O=0;if(i!=g.Month){O=100*(N.getTime()-M)/this._iRowSize;}else{var P=new U(N.getTime());P.setUTCDate(1);P.setUTCHours(0);P.setUTCMinutes(0);P.setUTCSeconds(0);P.setUTCMilliseconds(0);var Q=new U(P.getTime());Q.setUTCMonth(Q.getUTCMonth()+1);Q.setMilliseconds(-1);var T=Q.getTime()-P.getTime();var V=(P.getUTCFullYear()-S.getUTCFullYear())*12+P.getUTCMonth()-S.getUTCMonth();O=(100*V/j)+(100*(N.getTime()-P.getTime())/T)/j;}if(O<0){O=0;}O=Math.round(O*100000)/100000;return O;}function u(i,j,S,k,M,N){var O=0;if(i!=g.Month){O=100-(100*(N.getTime()-M)/this._iRowSize);}else{var P=new U(N.getTime());P.setUTCDate(1);P.setUTCHours(0);P.setUTCMinutes(0);P.setUTCSeconds(0);P.setUTCMilliseconds(0);var Q=new U(P.getTime());Q.setUTCMonth(Q.getUTCMonth()+1);Q.setMilliseconds(-1);var T=Q.getTime()-P.getTime();var V=(P.getUTCFullYear()-S.getUTCFullYear())*12+P.getUTCMonth()-S.getUTCMonth();O=100-((100*V/j)+(100*(N.getTime()-P.getTime())/T)/j);}if(O<0){O=0;}O=Math.round(O*100000)/100000;return O;}function v(){var V=[];if(this.getShowIntervalHeaders()){var k=this.getIntervalHeaders();var M;var N=this.getIntervals();var O=this.getIntervalType();var S=this._getStartDate();var P=S.getTime();var Q=this._oUTCEndDate;var T=Q.getTime();var i=0;var j=0;for(i=0;i<k.length;i++){M=k[i];var W=a._createUniversalUTCDate(M.getStartDate(),undefined,true);W.setUTCSeconds(0);W.setUTCMilliseconds(0);var X=M.getEndDate()?a._createUniversalUTCDate(M.getEndDate(),undefined,true):a._createUniversalUTCDate(new Date(864000000000000),undefined,true);X.setUTCSeconds(0);X.setUTCMilliseconds(0);if(W&&W.getTime()<=T&&X&&X.getTime()>=P){var Y=new U(S.getTime());var Z=new U(S.getTime());Z.setUTCMinutes(Z.getUTCMinutes()-1);var $=-1;var a1=-1;for(j=0;j<N;j++){switch(O){case g.Hour:Z.setUTCHours(Z.getUTCHours()+1);if(j>0){Y.setUTCHours(Y.getUTCHours()+1);}break;case g.Day:case g.Week:case g.OneMonth:Z.setUTCDate(Z.getUTCDate()+1);if(j>0){Y.setUTCDate(Y.getUTCDate()+1);}break;case g.Month:Z.setUTCDate(1);Z.setUTCMonth(Z.getUTCMonth()+2);Z.setUTCDate(0);if(j>0){Y.setUTCMonth(Y.getUTCMonth()+1);}break;default:throw new Error("Unknown IntervalType: "+O+"; "+this);}if(W&&W.getTime()<=Y.getTime()&&X&&X.getTime()>=Z.getTime()){if($<0){$=j;}a1=j;}}if($>=0){V.push({interval:$,appointment:M,last:a1});}}}}this._aVisibleIntervalHeaders=V;return this._aVisibleIntervalHeaders;}function w(){if(this._isOneMonthIntervalOnSmallSizes()){return;}var $=this.$("Apps");var k=$.innerWidth();if(k<=0){return;}var M=this.$("DummyApp");var N=M.outerHeight(true);if(N<=0){return;}var O=M.outerWidth();var P=O/k*100;var Q=Math.ceil(1000*P)/1000;var S;var T;var V=0;var W=0;var i=0;var X=!D.system.phone&&this.getAppointmentsReducedHeight();if(this.getShowIntervalHeaders()&&(this.getShowEmptyIntervalHeaders()||this._getVisibleIntervalHeaders().length>0)){V=q(this.$("AppsInt0").children(".sapUiCalendarRowAppsIntHead")[0]).outerHeight(true);}for(i=0;i<this._aVisibleAppointments.length;i++){S=this._aVisibleAppointments[i];T=S.appointment.$();var Y=Math.floor(1000*(100-S.calculatedEnd-S.begin))/1000;var Z=false;if(Y<Q){S.end=100-S.begin-P;if(S.end<0){S.end=0;}S.level=-1;Z=true;T.addClass("sapUiCalendarAppSmall");}else if(T.hasClass("sapUiCalendarAppSmall")){S.end=S.calculatedEnd;Z=true;T.removeClass("sapUiCalendarAppSmall");}if(Z){if(this._bRTL){T.css("left",S.end+"%");}else{T.css("right",S.end+"%");}}}for(i=0;i<this._aVisibleAppointments.length;i++){S=this._aVisibleAppointments[i];T=S.appointment.$();var a1={};var b1=X&&!this._getAppointmentReducedHeight(S.appointment);if(S.level<0){for(var j=0;j<this._aVisibleAppointments.length;j++){var c1=this._aVisibleAppointments[j];if(S!=c1&&S.begin<(Math.floor(1000*(100-c1.end))/1000)&&(Math.floor(1000*(100-S.end))/1000)>c1.begin&&c1.level>=0){if(a1[c1.level]){a1[c1.level]++;}else{a1[c1.level]=1;}if(X&&!this._getAppointmentReducedHeight(c1.appointment)){if(a1[c1.level+1]){a1[c1.level+1]++;}else{a1[c1.level+1]=1;}}}}S.level=0;while(a1[S.level]||(b1&&a1[S.level+1])){S.level++;}T.attr("data-sap-level",S.level);}T.css("top",(N*S.level+V)+"px");var d1=S.level;if(b1){d1++;}if(W<d1){W=d1;}}W++;N=N*W+V;if(!this.getHeight()){$.outerHeight(N);}else{var e1=this.$("Apps").children(".sapUiCalendarRowAppsInt");for(i=0;i<e1.length;i++){var f1=q(e1[i]);f1.outerHeight(N);}}M.css("display","none");}function x(j,k){var i=0;var O;var M;var N;var P;var S=I.getStaticId("sap.ui.unified","APPOINTMENT_SELECTED");if(k){var Q=this.getAppointments();var T=this.getAggregation("groupAppointments",[]);q.merge(Q,T);for(i=0;i<Q.length;i++){O=Q[i];if(O.getId()!==j.getId()&&O.getSelected()){O.setProperty("selected",false,true);O.$().removeClass("sapUiCalendarAppSel");for(var i=0;i<this.aSelectedAppointments.length;i++){if(this.aSelectedAppointments[i]!==O.getId()){this.aSelectedAppointments.splice(i);}}M=O.$().attr("aria-labelledby");N=M?M.replace(S,""):"";O.$().attr("aria-labelledby",N);}}}if(j.getSelected()){j.setProperty("selected",false,true);j.$().removeClass("sapUiCalendarAppSel");this.aSelectedAppointments=this.aSelectedAppointments.filter(function(V){return V!==j.getId();});A(this,k);}else{j.setProperty("selected",true,true);j.$().addClass("sapUiCalendarAppSel");A(this,k);this.aSelectedAppointments.push(j.getId());}P=j.$().attr("aria-labelledby")+" "+S;j.$().attr("aria-labelledby",P);if(j._aAppointments){for(i=0;i<j._aAppointments.length;i++){O=j._aAppointments[i];O.setProperty("selected",true,true);P=O.$().attr("aria-labelledby")+" "+S;O.$().attr("aria-labelledby",P);}this.fireSelect({appointments:j._aAppointments,multiSelect:!k,domRefId:j.getId()});}else{this.fireSelect({appointment:j,multiSelect:!k,domRefId:j.getId()});}}function y(i){var P=z.call(this);if(P){P["_onRow"+i]();}}function z(){var P=this;while(P.getParent()!==null){if(P.getMetadata().getName()==="sap.m.PlanningCalendar"){return P;}P=P.getParent();}}function A(i,j){if(j){y.call(i,"DeselectAppointment");}}function B(k){var M=this.getAggregation("groupAppointments",[]);var N;var O=false;for(var i=0;i<M.length;i++){var P=M[i]._aAppointments;for(var j=0;j<P.length;j++){if(P[j].getId()==k){N=M[i];O=true;break;}}if(O){break;}}return N;}function E(j){if(this._sFocusedAppointmentId!=j){var k=this._getAppointmentsSorted();var V=this._aVisibleAppointments;var M;var i=0;M=B.call(this,j);if(M){j=M.getId();M=undefined;}for(i=0;i<V.length;i++){if(V[i].appointment.getId()==j){M=V[i].appointment;break;}}if(M){var O=this.getFocusedAppointment().$();var $=M.$();this._sFocusedAppointmentId=M.getId();O.attr("tabindex","-1");$.attr("tabindex","0");$.focus();}else{for(i=0;i<k.length;i++){if(k[i].getId()==j){M=k[i];break;}}if(M){this._sFocusedAppointmentId=M.getId();var N=o.call(this,M.getStartDate());this.setStartDate(a._createLocalDate(N,true));if(!q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){q.sap.delayedCall(0,this,function(){this.getFocusedAppointment().focus();});}this.fireStartDateChange();}}}}function F(j,S){var k=this._sFocusedAppointmentId;var M=this._getAppointmentsSorted();var N=this.getAggregation("groupAppointments",[]);var O;var P=0;var i=0;for(i=0;i<N.length;i++){if(N[i].getId()==k){var Q=N[i]._aAppointments;if(j){k=Q[Q.length-1].getId();}else{k=Q[0].getId();}break;}}for(i=0;i<M.length;i++){if(M[i].getId()==k){P=i;break;}}if(j){P=P+S;}else{P=P-S;}if(P<0){P=0;}else if(P>=M.length){P=M.length-1;}O=M[P];E.call(this,O.getId());}function H(j){var k=this._getAppointmentsSorted();var M;var S=new U(this._getStartDate());var N=new U(this._oUTCEndDate);var O=this.getIntervalType();var P;var Q;S.setUTCHours(0);N.setUTCHours(0);N.setUTCMinutes(0);N.setUTCSeconds(0);switch(O){case g.Hour:N.setUTCDate(N.getUTCDate()+1);N.setUTCMilliseconds(-1);break;case g.Day:case g.Week:case g.OneMonth:S.setUTCDate(1);N.setUTCMonth(N.getUTCMonth()+1);N.setUTCDate(1);N.setUTCMilliseconds(-1);break;case g.Month:S.setUTCMonth(0);S.setUTCDate(1);N.setUTCFullYear(N.getUTCFullYear()+1);N.setUTCMonth(1);N.setUTCDate(1);N.setUTCMilliseconds(-1);break;default:throw new Error("Unknown IntervalType: "+O+"; "+this);}var T=a._createLocalDate(S,true);var V=a._createLocalDate(N,true);for(var i=0;i<k.length;i++){if(k[i].getStartDate()>=T&&k[i].getStartDate()<=V){M=k[i];P=M.getId();if(j.type=="saphome"){break;}}else if(k[i].getStartDate()>V){break;}}Q=B.call(this,P);if(Q){M=Q;P=M.getId();}if(P&&P!=this._sFocusedAppointmentId){E.call(this,P);}else if(j._bPlanningCalendar&&M){M.focus();}else{this.fireLeaveRow({type:j.type});}}function J(i,j){var k=this.getIntervalType();var S=this._getStartDate();var M=new U(S.getTime());var N;var O=false;var P=0;var Q=0;if(q(j).hasClass("sapUiCalendarRowAppsSubInt")){O=true;var T=q(q(j).parent()).children(".sapUiCalendarRowAppsSubInt");Q=T.length;for(P=0;P<Q;P++){var V=T[P];if(V==j){break;}}}switch(k){case g.Hour:M.setUTCHours(M.getUTCHours()+i);if(O){M.setUTCMinutes(M.getUTCMinutes()+P*60/Q);N=new U(M.getTime());N.setUTCMinutes(N.getUTCMinutes()+60/Q);}else{N=new U(M.getTime());N.setUTCHours(N.getUTCHours()+1);}break;case g.Day:case g.Week:case g.OneMonth:M.setUTCDate(M.getUTCDate()+i);if(O){M.setUTCHours(M.getUTCHours()+P*24/Q);N=new U(M.getTime());N.setUTCHours(N.getUTCHours()+24/Q);}else{N=new U(M.getTime());N.setUTCDate(N.getUTCDate()+1);}break;case g.Month:M.setUTCMonth(M.getUTCMonth()+i);if(O){M.setUTCDate(M.getUTCDate()+P);N=new U(M.getTime());N.setUTCDate(N.getUTCDate()+1);}else{N=new U(M.getTime());N.setUTCMonth(N.getUTCMonth()+1);}break;default:throw new Error("Unknown IntervalType: "+k+"; "+this);}N.setUTCMilliseconds(N.getUTCMilliseconds()-1);M=a._createLocalDate(M,true);N=a._createLocalDate(N,true);this.fireIntervalSelect({startDate:M,endDate:N,subInterval:O});}function K(i,j){var k=i.getStartDate()-j.getStartDate();if(k==0){k=j.getEndDate()-i.getEndDate();}return k;}return h;});
