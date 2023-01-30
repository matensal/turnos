sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'muellesv4/muellesv4/test/integration/FirstJourney',
		'muellesv4/muellesv4/test/integration/pages/ZSRAP_C_MUELLESList',
		'muellesv4/muellesv4/test/integration/pages/ZSRAP_C_MUELLESObjectPage',
		'muellesv4/muellesv4/test/integration/pages/ZSRAP_C_TURNOSObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZSRAP_C_MUELLESList, ZSRAP_C_MUELLESObjectPage, ZSRAP_C_TURNOSObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('muellesv4/muellesv4') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZSRAP_C_MUELLESList: ZSRAP_C_MUELLESList,
					onTheZSRAP_C_MUELLESObjectPage: ZSRAP_C_MUELLESObjectPage,
					onTheZSRAP_C_TURNOSObjectPage: ZSRAP_C_TURNOSObjectPage
                }
            },
            opaJourney.run
        );
    }
);