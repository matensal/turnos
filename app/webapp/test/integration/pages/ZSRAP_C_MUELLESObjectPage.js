sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'muellesv4.muellesv4',
            componentId: 'ZSRAP_C_MUELLESObjectPage',
            entitySet: 'ZSRAP_C_MUELLES'
        },
        CustomPageDefinitions
    );
});