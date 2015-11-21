// SAMPLE
this.manifest = {
    "name": "My Extension",
    "icon": "icon.png",
    "settings": [
    	{
            "tab": i18n.get("Settings"),
            "group": i18n.get("Auto Mode"),
            "name": "autoMode",
            "type": "checkbox",
            "label": "Automatically Run after the Idle Time has Transpired"
        },
        {
            "tab": i18n.get("Settings"),
            "group": i18n.get("Auto Mode"),
            "name": "idleTime",
            "type": "text",
            "label": "Idle Time",
            "text": "10"
        },
        {
            "tab": i18n.get("Settings"),
            "group": i18n.get("Auto Mode"),
            "name": "idleTimeDesc",
            "type": "description",
            "text": "The amount of idle time in minutes that has to transpire before Chaff begins."
        },
        {
            "tab": i18n.get("Settings"),
            "group": i18n.get("Tab Behavior"),
            "name": "removeTabWhenFinished",
            "type": "checkbox",
            "label": "Remove tab created by extension when turned off."
        },
    	{
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "sourcesWebsiteDesc",
            "type": "description",
            "text": "These websites are used as a starting point for a browsing session."
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website1",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website2",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website3",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website4",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website5",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website6",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website7",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website8",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website9",
            "type": "text"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Websites"),
            "name": "website10",
            "type": "text"
        },
    	{
            "tab": i18n.get("Sources"),
            "group": i18n.get("Search Engines"),
            "name": "searchEnginesDesc",
            "type": "description",
            "text": "Select one or more search engines to use when searching for random phrases."
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Search Engines"),
            "name": "useGoogle",
            "type": "checkbox",
            "label": "Google"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Search Engines"),
            "name": "useBing",
            "type": "checkbox",
            "label": "Bing"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Search Engines"),
            "name": "useYahoo",
            "type": "checkbox",
            "label": "Yahoo"
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Bookmarks"),
            "name": "bookmarksDesc",
            "type": "description",
            "text": "Bookmarks can also be used as a source."
        },
        {
            "tab": i18n.get("Sources"),
            "group": i18n.get("Bookmarks"),
            "name": "useBookmarks",
            "type": "checkbox",
            "label": "Use Bookmarks"
        },
    	{
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Browsing"),
            "name": "timeBetweenClicksDesc",
            "type": "description",
            "text": "The next page will be visted at a random time in seconds, with a maximum time defined below."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Browsing"),
            "name": "maxTimeBetweenClicks",
            "type": "slider",
            "label": "Maximum Time Between Clicks",
            "max": 60,
            "min": 1,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + " seconds";
            }
        },
    	{
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Searching"),
            "name": "searchPhrasePercentDesc",
            "type": "description",
            "text": "Randomly generated search phrases are based upon existing phrases found from seed sources. Choose the maximum length of the random search phrase as a percentage of the original phrase length."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Searching"),
            "name": "searchPhraseMaxPercent",
            "type": "slider",
            "label": "Maximum Search Phrase Length",
            "max": 100,
            "min": 1,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + "%";
            }
        },
    	{
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Timeout"),
            "name": "browsingTimeoutDesc",
            "type": "description",
            "text": "The maximum time Chaff waits for a page to load to avoid getting stuck. Setting this too low with slow Internet connections will cause constant restarting."
       },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Timeout"),
            "name": "browsingTimeoutMax",
            "type": "slider",
            "label": "Maximum Page Load Timeout",
            "max": 60,
            "min": 10,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + " seconds";
            }
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Site Depth"),
            "name": "siteDepthDesc",
            "type": "description",
            "text": "The maximum number of pages to visit on a particular domain in a session. This is used to limit how long a single domain is browsed to minimize stale browsing."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Site Depth"),
            "name": "maxSiteDepth",
            "type": "slider",
            "label": "Maximum Pages",
            "max": 20,
            "min": 1,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + " pages on single domain";
            }
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Total Depth"),
            "name": "totalDepthDesc",
            "type": "description",
            "text": "The maximum number of pages to visit for a particular seed. This value must be equal or greater than Maximum Pages. This directly influences how quickly browsing is restarted with a new seed."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Total Depth"),
            "name": "maxDepth",
            "type": "slider",
            "label": "Maximum Depth",
            "max": 50,
            "min": 10,
            "step": 1,
            "display": true,
            "displayModifier": function (value) {
                return value + " total pages in a session";
            }
        }
    ],
    "alignment": [
    	[
    		"website1",
    		"website2",
    		"website3",
    		"website4",
    		"website5",
    		"website6",
    		"website7",
    		"website8",
    		"website9",
    		"website10"
    	]
    ]
};
