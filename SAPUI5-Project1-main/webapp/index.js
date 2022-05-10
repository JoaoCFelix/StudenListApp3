sap.ui.define([
	"sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
	"use strict";

	new ComponentContainer({
		name: "SAPUI5 WorkListApp",
		settings : {
			id : "SAPUI5_WorkListApp"
		},
		async: true
	}).placeAt("content");
});

