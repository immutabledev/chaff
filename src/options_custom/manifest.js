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
            "text": "These are the websites that are searched to find the random links used for generating Chaff."
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
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Browsing"),
            "name": "timeBetweenClicksDesc",
            "type": "description",
            "text": "The next randomly chosen link will be visted at a random time in seconds, choosen within the range defined below."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Browsing"),
            "name": "minTimeBetweenClicks",
            "type": "text",
            "label": "Minimum Time Between Clicks (seconds)",
            "text": "6"
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Browsing"),
            "name": "maxTimeBetweenClicks",
            "type": "text",
            "label": "Maximum Time Between Clicks (seconds)",
            "text": "20"
        },
    	{
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Searching"),
            "name": "searchPhrasePercentDesc",
            "type": "description",
            "text": "The randomly generated search phrase is based upon existing phrases found from seed sources. Choose the minimum and maximum length of the random search phrase as a percentage of the original phrase length."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Searching"),
            "name": "searchPhraseMinPercent",
            "type": "text",
            "label": "Minimum Search Phrase Length Percentage",
            "text": "20"
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Searching"),
            "name": "searchPhraseMaxPercent",
            "type": "text",
            "label": "Maximum Search Phrase Length Percentage",
            "text": "70"
        },
    	{
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Timeout"),
            "name": "browsingTimeoutDesc",
            "type": "description",
            "text": "The amount of time the extension waits for a random page to load to avoid getting stuck. Setting this too low with slow Internet connections will cause constant restarting."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Timeout"),
            "name": "browsingTimeoutMin",
            "type": "text",
            "label": "Minimum Timeout (seconds)",
            "text": "30"
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Timeout"),
            "name": "browsingTimeoutMax",
            "type": "text",
            "label": "Maximum Timeout (seconds)",
            "text": "60"
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Site Depth"),
            "name": "siteDepthDesc",
            "type": "description",
            "text": "The number of pages to visit on a particular website. This is used to limit how long a single domain is browsed to minimize stale browsing."
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Site Depth"),
            "name": "minSiteDepth",
            "type": "text",
            "label": "Minimum Pages",
            "text": "5"
        },
        {
            "tab": i18n.get("Tuning"),
            "group": i18n.get("Site Depth"),
            "name": "maxSiteDepth",
            "type": "text",
            "label": "Maximum Pages",
            "text": "10"
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
            "type": "text",
            "label": "Maximum Depth",
            "text": "20"
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
