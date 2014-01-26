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
        ,
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
