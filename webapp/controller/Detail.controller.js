sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("ClinicalTrials.ClinicalTrials.controller.Detail", {

        onInit: function() {
            var oView = this.getView();
            
			this.getView().addEventDelegate({
				onBeforeShow: function(evt) {
					var oModel = sap.ui.getCore().getModel("DModel");
					console.log(oModel);
					oView.setModel(oModel);
					oView.bindElement("/modelData1/0");


					this.oVBI = oView.byId("vbi");

		            var conf = {
		                "MapProvider": [{
		                    "type": "",
		                    "name": "BING",
		                    "description": "Bing",
		                    "tileX": "256",
		                    "tileY": "256",
		                    "minLOD": "0",
		                    "maxLOD": "19",
		                    "copyright": "Microsoft Corp.",
		                    "Source": [{
		                        "id": "1",
		                        "url": "http://ecn.t0.tiles.virtualearth.net/tiles/r{QUAD}?g=685&&shading=hill"
		                    }]
		                }],
		                "MapLayerStacks": [{
		                    "name": "Default",
		                    "MapLayer": [{
		                        "name": "layer1",
		                        "refMapProvider": "BING",
		                        "opacity": "1.0",
		                        "colBkgnd": "RGB(255,255,255)"
		                    }]
		                }]
		            };

		            var oMapConfig = {
		                "MapProvider": [{
		                    "type": "",
		                    "name": "HEREMAPS",
		                    "description": "",
		                    "tileX": "256",
		                    "tileY": "256",
		                    "maxLOD": "20",
		                    "copyright": "Tiles Courtesy of HERE Maps",
		                    "Source": [{
		                        "id": "s1",
		                        "url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=iQA4VQrg3Pts1thv0MbD&app_code=MjsII_3Xaha17fKFj_kX4w"
		                    }, {
		                        "id": "s2",
		                        "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=iQA4VQrg3Pts1thv0MbD&app_code=MjsII_3Xaha17fKFj_kX4w"
		                    }]
		                }],
		                "MapLayerStacks": [{
		                    "name": "Default",
		                    "MapLayer": [{
		                        "name": "layer1",
		                        "refMapProvider": "HEREMAPS",
		                        "opacity": "1.0",
		                        "colBkgnd": "RGB(255,255,255)"
		                    }]
		                }]
		            };

		            this.oVBI.setMapConfiguration(oMapConfig);
		            var spots = oModel.getData().modelData1[0].Spots;
		            var pos = spots[0].pos.split(";");

		            this.oVBI.zoomToGeoPosition(pos[0], pos[1], 8);
				}
			});			
        },

        SearchLocation: function(oEvent) {
            var searchValue = oEvent.oSource.mProperties.value;
            console.log(searchValue);

            var filters = new Array();
            var filter1 = new sap.ui.model.Filter("facility/name", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter2 = new sap.ui.model.Filter("facility/address/country", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter3 = new sap.ui.model.Filter("facility/address/city", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter4 = new sap.ui.model.Filter("facility/address/state", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter5 = new sap.ui.model.Filter("facility/address/zip", sap.ui.model.FilterOperator.Contains, searchValue);
            var filter6 = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.Contains, searchValue);

            var oCombinedOr = new sap.ui.model.Filter([filter1, filter2, filter3, filter4, filter5, filter6]);
            filters.push(oCombinedOr);

            //get list created in view
            this.oList = this.getView().byId("polocation");
            this.oList.getBinding("items").filter(filters);
        },

        handleOnPress: function(oEvent) {
            var data = {};
            data.context = oEvent.getSource().getBindingContext();
            var selectedIndex = data.context.sPath.split("/")[4];

            var oView = this.getView();
            this.oVBI = oView.byId("vbi");

            var oModel = this.getView().getModel();
            var spots = oModel.getData().modelData1[0].Spots;
            var lons = [];
            var lats = [];
            var FD = [];
            var type = 'Success';
            
            for (var nJ = 0, len = spots.length; nJ < len; nJ++) {
                var pos = spots[nJ].pos.split(";");
                lons.push(pos[0]);
                lats.push(pos[1]);

                if (nJ == selectedIndex) {
                    FD.push({
                        key: spots[nJ].key,
                        pos: spots[nJ].pos,
                        select: true,
                        tooltip: spots[nJ].tooltip,
                        type: 'Success'
                    });
                } else {

                	if(spots[nJ].key == '') 
                		type = 'Error';   //This is for "You are here"
                	else	
                		type = 'Success';

                    FD.push({
                        key: spots[nJ].key,
                        pos: spots[nJ].pos,
                        select: false,
                        tooltip: spots[nJ].tooltip,
                        type: type
                    });
                }

            }

            let jsonO = {
                "Spots": {}
            }


            jsonO["Spots"] = FD;


            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                modelData1: [jsonO]
            });
            this.getView().byId("vbi").setModel(oModel);

            this.oVBI.zoomToGeoPosition(lons[selectedIndex], lats[selectedIndex], 8);
        },


        doNavBack: function() {
            var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({
                text: '{i18n>MSG0}',
                title: '{i18n>MSG1}'
            });

            function wasteTime() {
                busyDialog.open();
            }

            function runNext() {
                busyDialog.close();
            }

            wasteTime();

            var oModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel('pathmodel').oData.oData);
            oModel.setSizeLimit(999999);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("list", true);

            runNext();
        },

        doNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home", true);
        }
    });
});