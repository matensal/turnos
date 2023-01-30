sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'muellesv4.muellesv4',
            componentId: 'ZSRAP_C_MUELLESList',
            entitySet: 'ZSRAP_C_MUELLES'
        },
        CustomPageDefinitions
    );
});