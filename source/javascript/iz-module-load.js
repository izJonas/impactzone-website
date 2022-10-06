// Structural (Navigation + components)
import izNavClient from '../json/iz-web.json'  assert { type: "json" };
import izNavClient_tiko from '../json/tiko-web.json'  assert { type: "json" };


import izComponents from '../json/iz-components.json'  assert { type: "json" };

// Sites
import izSite_premiumFullService from '../json/sites/premiumFullService.json'  assert { type: "json" };
import izSite_tikoOffice from '../json/sites/tikoOffice.json'  assert { type: "json" };

window.impactzone = {};
window.impactzone.sites = {};
window.impactzone.client = izNavClient;
window.impactzone.navSites = izNavClient.sites;
window.impactzone.components = izComponents;
window.impactzone.sites.premiumFullService = izSite_premiumFullService;

if(window.location.href.endsWith("tiko")) {
    window.impactzone.client = izNavClient_tiko;
    window.impactzone.navSites = izNavClient_tiko.sites;
}