// Structural (Navigation + components)
import izNavClient from '../json/iz-web.json'  assert { type: "json" };
import izComponents from '../json/iz-components.json'  assert { type: "json" };

// Sites
import izSite_premiumFullService from '../json/sites/premiumFullService.json'  assert { type: "json" };

window.impactzone = {};
window.impactzone.sites = {};
window.impactzone.client = izNavClient;
window.impactzone.navSites = izNavClient.sites;
window.impactzone.components = izComponents;
window.impactzone.sites.premiumFullService = izSite_premiumFullService;
