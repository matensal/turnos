sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";

    var Journey = {
        run: function() {
            QUnit.module("First journey");

            opaTest("Start application", function (Given, When, Then) {
                Given.iStartMyApp();

                Then.onTheZSRAP_C_MUELLESList.iSeeThisPage();

            });


            opaTest("Navigate to ObjectPage", function (Given, When, Then) {
                // Note: this test will fail if the ListReport page doesn't show any data
                When.onTheZSRAP_C_MUELLESList.onFilterBar().iExecuteSearch();
                Then.onTheZSRAP_C_MUELLESList.onTable().iCheckRows();

                When.onTheZSRAP_C_MUELLESList.onTable().iPressRow(0);
                Then.onTheZSRAP_C_MUELLESObjectPage.iSeeThisPage();

            });

            opaTest("Teardown", function (Given, When, Then) { 
                // Cleanup
                Given.iTearDownMyApp();
            });
        }
    }

    return Journey;
});