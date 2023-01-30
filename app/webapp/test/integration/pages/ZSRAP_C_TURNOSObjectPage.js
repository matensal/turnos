sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'muellesv4.muellesv4',
            componentId: 'ZSRAP_C_TURNOSObjectPage',
            entitySet: 'ZSRAP_C_TURNOS'
        },
        CustomPageDefinitions
    );
});