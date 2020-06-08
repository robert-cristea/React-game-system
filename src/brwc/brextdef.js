export const ENGINE_FLAG = {
	ENGINE_FLAG_UNPACKER: 1,
	ENGINE_FLAG_DECOMPRESSOR: 2,
	ENGINE_FLAG_VALIDATOR: 4,
	ENGINE_FLAG_TRANSFER: 8,
};

export const AUDIT_MODE = {
	/**
	 * This is used when we want to do no audits at all
	 */
	MODE_AUDIT_NONE: 0,
	/**
	 * Check directory structure against audit files (fast)
	 */
	MODE_AUDIT_QUICK: 1,
	/**
	 * Check segment CRCs if dates or times don't match.  This is our standard
	 * audit now except when we first migrate/run a new patch from a previous installed release.
	 */
	MODE_AUDIT_DEMAND: 2,
	/**
	 * done at begin of first run of new patch release, right after running patchmov.
	 * This will set the master and net flags correctly based upon the file and flag migrate
	 */
	MODE_AUDIT_NEW_PATCH: 3,
	/**
	 * Check all segment CRC's on all file data during audit (slower).  This runs after a
	 * crash and should set all client and net flags properly.
	 */
	MODE_AUDIT_FULL: 4,
	/**
	 * works like demand audit but this will disregard the complete flag and will check for
	 * if dates or times don't match
	 */
	MODE_AUDIT_SPEED: 5,
};

export const UI_CMD = {
	UI_CMD_NONE: 1424,
	/**
	 * Show the UI itself
	 */
	UI_CMD_SHOW: 1425,
	/**
	 * Hide the UI itself
	 */
	UI_CMD_HIDE: 1426,
	/**
	 * Set text to a control on the UI
	 */
	UI_CMD_SETTTEXT: 1427,
	/**
	 * Tell the UI to exit
	 */
	UI_CMD_QUIT: 1428,
	/**
	 * Post data to a control on the UI
	 */
	UI_CMD_POSTUSERDATA: 1429,
	/**
	 * Move the UI around
	 */
	UI_CMD_MOVEUI: 1430,
	/**
	 * Tell the UI to load a new config
	 */
	UI_CMD_SETCONFIG: 1431,
	/**
	 * Tell the UI that we're holding for a kernel demand object from the network
	 */
	UI_CMD_KMHOLDON: 1432,
	/**
	 * Tell the UI that we're no longer holding for the kernel object
	 */
	UI_CMD_KMHOLDOFF: 1433,
	/**
	 * Tell the UI to move its zorder behind other windows
	 */
	UI_CMD_SENDTOBACK: 1434,
	/**
	 * Tell the UI to move its zorder to the top of other windows
	 */
	UI_CMD_SENDTOFRONT: 1435,
	/**
	 * Tell a control's window to be enabled
	 */
	UI_CMD_ENABLE: 1436,
	/**
	 * Tell a control's window to be disabled
	 */
	UI_CMD_DISABLE: 1437,
	/**
	 * Tell a control to enable itself
	 */
	UI_CMD_ENABLECTRL: 1438,
	/**
	 * Tell a control to disable itself
	 */
	UI_CMD_DISABLECTRL: 1439,
	/**
	 * Tell the ExtUI to start its main timer
	 */
	UI_CMD_START_TIMER: 1440,
	/**
	 * Tell the ExtUI to stop its main timer
	 */
	UI_CMD_STOP_TIMER: 1441,
	/**
	 * Tell the ExtUI to show the EULA
	 */
	UI_CMD_SHOWEULA: 1442,
	/**
	 * Tell the ExtUI to set the default install path
	 */
	UI_CMD_DEFPATH: 1443,
	/**
	 * Tell the ExtUI to set the current package title
	 */
	UI_CMD_PACKTITLE: 1444,
	/**
	 * Tell the ExtUI to set the extension path
	 */
	UI_CMD_APPENDPATH: 1445,
	/**
	 * Tell the ExtUI to set the package install size
	 */
	UI_CMD_INSTALLSIZE: 1446,
	/**
	 * Tell the ExtUI to show the install path selection
	 */
	UI_CMD_SHOWPATH: 1447,
	/**
	 * Tell the ExtUI to show the message box
	 */
	UI_CMD_SHOWMSGBOX: 1448,
	/**
	 * Tell the ExtUI to show mini-client prompt if needed
	 */
	UI_CMD_SHOWMINICLIENTPROMPT: 1449,
	/**
	 * Tell the ExtUI that BRWC is still alive
	 */
	UI_CMD_HEARTBEAT: 1450,
	/**
	 * Tell the UI that we need the first asset progress to represent first asset and patch, first asset (0-50)
	 */
	UI_CMD_FIRSTASSETMD: 1451,
	/**
	 * Tell the UI that we need the first asset progress to represent first asset and patch, first patch (50-100)
	 */
	UI_CMD_FIRSTPATCHMD: 1452,
	/**
	 * Tell the UI that we need the first asset progress to represent first asset, patch, and locale (33/33/33)
	 */
	UI_CMD_FIRSTLOCALE: 1453,
	/**
	 * Tell the UI that we need the first asset progress to represent first asset, patch, and locale & locale patch (25/25/25/25)
	 */
	UI_CMD_FIRSTPATLOCL: 1454,
	/**
	 * Tell the ExtUI that BRWC has encountered an error
	 */
	UI_CMD_ERROR: 1455,
	/**
	 * Tell the ExtUI to hold the heartbeat and wait for BRWC relaunch
	 */
	UI_CMD_HOLD: 1456,
	/**
	 * Tell the ExtUI to resume operations
	 */
	UI_CMD_UNHOLD: 1457,
	/**
	 * Tell the ExtUI quit; only difference from the normal QUIT command is for headless users to know that BRWC is quitting because of package launch
	 */
	UI_CMD_QUITONLAUNCH: 1458,
	/**
	 * Tell the ExtUI to hold the quit timer, as BRWC might display some prompts before quitting
	 */
	UI_CMD_QUITHOLD: 1459,
	/**
	 * Tell the ExtUI to unhold the quit timer
	 */
	UI_CMD_QUITUNHOLD: 1460,
	/**
	 * Tell the ExtUI to prompt for the closed beta key
	 */
	UI_CMD_PROMPTKEY: 1461,
	UI_CMD_QUITCANCEL: 1462,
};

export const EXT_UI_CTRL = {
	extern_STATUSTXT: 2000,
	extern_FIRSTPROGBAR: 2001,
	extern_SECONDPROGBAR: 2002,
	extern_FIRSTPROGLBL: 2003,
	extern_SECONDPROGLBL: 2004,
	extern_FIRSTPROGVALLBL: 2005,
	extern_SECONDPROGVALLBL: 2006,
	extern_THIRDPROGVALLBL: 2007,
	extern_OPTIONSBTN: 2008,
	extern_CLOSEBTN: 2009,
	extern_MINIMIZEBTN: 2010,
	extern_CAPTIONLBL: 2011,
	extern_RELAUNCHBTN: 2012,
	extern_REAUDITBTN: 2013,
	extern_CTLBROWSER: 2014,
	extern_WEBLINKBTN0: 2015,
	extern_WEBLINKBTN1: 2016,
	extern_WEBLINKBTN2: 2017,
	extern_WEBLINKBTN3: 2018,
	extern_WEBLINKBTN4: 2019,
	extern_WEBLINKBTN5: 2020,
	extern_WEBLINKBTN6: 2021,
	extern_WEBLINKBTN7: 2022,
	extern_VENDORTXT0: 2023,
	extern_VENDORTXT1: 2024,
	extern_VENDORTXT2: 2025,
	extern_VENDORTXT3: 2026,
	extern_VENDORTXT4: 2027,
	extern_VENDORTXT5: 2028,
	extern_VENDORTXT6: 2029,
	extern_VENDORTXT7: 2030,
	extern_OPTPKGBTN0: 2031,
	extern_OPTPKGBTN1: 2032,
	extern_OPTPKGBTN2: 2033,
	extern_OPTPKGBTN3: 2034,
	extern_OPTPKGBTN4: 2035,
	extern_OPTPKGBTN5: 2036,
	extern_OPTPKGBTN6: 2037,
	extern_OPTPKGBTN7: 2038,
	extern_EULATEXTTXT: 2039,
	extern_EULACHKBTN: 2040,
	extern_EULASTATUSTXT: 2041,
	extern_EULAURLBTN: 2042,
	extern_INSTALLPATHEDT: 2043,
	extern_INSTALLBRWSBTN: 2044,
	extern_INSTALLCNFRMBTN: 2045,
	extern_INSTALLDESCLBL: 2046,
	extern_MSGBOXTITLE: 2047,
	extern_MSGBOXTEXT: 2048,
	extern_MSGBOXTYPE: 2049,
	extern_PAUSEBTN: 2050,
	extern_PAUSESTATE: 2051,
	extern_REPAIRBTN: 2052,
	extern_SYSTRAY: 2053,
};

export const ENGINE_ID = {
	UI_DATA_LINKTREE: 0,
	UI_DATA_CONTROLLER: 1,
	UI_DATA_DECOMPUNPACKER: 2,
	UI_DATA_TRANSFER: 3,
	UI_DATA_OVERALL: 4,
	UI_DATA_AUDIT: 5,
	UI_DATA_COMPLETE: 6,
};

export const STAGE = {
	STAGE_ALLOCATINGSPACE: 1,
	STAGE_REQUIREDASSETS: 2,
	STAGE_REMAININGASSETS: 3,
	STAGE_INITIALIZING: 7,
	STAGE_UNINITIALIZING: 8,
	STAGE_AUDITING: 4,
	STAGE_MIGRATING: 5,
	STAGE_PATCHCLEANUP: 6,
};

export const CUSTOM_CMD = {
	UI_REFRESH: 0,
	UI_RESET: 1,
	UI_QUEUED: 2,
	UI_REPAIR: 3,
	UI_PENDING_QUIT: 4,
	UI_SET_DL_GAME: 5,
	UI_CTRL_RELAUNCH: 7,
	UI_DOWNLOADED_COMPLETED: 8,
	UI_STARTING: 9,
};
