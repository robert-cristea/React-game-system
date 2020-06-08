/**
 * update the patch depending on where you place the node file
 */
import node from './BRWCAddon.node';

class NBRExtPipe {
	/**
	 * @type {node.NBRExtPipe}
	 */
	extPipeObj = null;

	/**
	 * internally allocates an NBRExtPipe class from the node Addon
	 */
	constructor() {
		this.extPipeObj = new node.NBRExtPipe();
	}

	/**
	 * Initializes the BitRaider runtime interface.
	 * This function must be called once prior to making any other calls to the
	 * BitRaider runtime interface.
	 *
	 * @param {logCallback} logCb
	 * @param {eventCallback} eventCb
	 */
	Initialize(logCb, eventCb) {
		if (this.extPipeObj != null) {
			this.extPipeObj.Initialize(logCb, eventCb);
		}
	}

	/**
	 * Shuts down the BitRaider runtime interface.
	 * This function is called when the runtime interface should be shutdown.
	 * No futher calls to the runtime interface are valid after this call.
	 */
	Shutdown() {
		if (this.extPipeObj != null) {
			this.extPipeObj.Shutdown();
		}
	}

	/**
	 * Returns the status flags associated with an asset id.
	 * The flags contain which engines have processed the asset id.
	 * When all engines have processed an asset id, the file is ready to be read.
	 * @param {number} assetId
	 * @return {number} statusFlag
	 */
	GetAssetIdStatusFlags(assetId) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetAssetIdStatusFlags(assetId);
		}
		return 0;
	}

	/**
	 * Returns a status code of EXT_BR_ALREADY_COMPLETED if the asset ID and
	 * its commons have been fully processed. If not, it will return EXT_SUCCESS code.
	 * If the ID does not exist, or error condition exists, it returns the error
	 *
	 * @param {number} assetId
	 * @return {number} statusCode
	 */
	GetAssetCommonStatus(assetId) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetAssetCommonStatus(assetId);
		}

		return 0;
	}

	/**
	 * Returns the AssetId containing the given file path and byte.
	 *
	 * @param {string} absoluteFilePath
	 * @param {number} fileOffset
	 * @return {number} The asset ID containing the path and byte or BITRAIDER_INVALID_ASSET_ID
	 * if the path is not associated with any asset ID.
	 */
	GetAssetId(absoluteFilePath, fileOffset) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetAssetId(absoluteFilePath, fileOffset);
		}

		return 0;
	}

	/**
	 * Adds an asset id to the end of queue for download and processing.
	 *
	 * @param {number} assetId
	 * @param {boolean} forceMove
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	PushBackAssetId(assetId, forceMove) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.PushBackAssetId(assetId, forceMove);
		}

		return 0;
	}

	/**
	 * Adds a priority asset id and its commons to the front of queue for download and processing.
	 *
	 * @param {number} assetId
	 * @param {boolean} forceMove
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	PushPriorityAssetId(assetId, forceMove) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.PushPriorityAssetId(assetId, forceMove);
		}

		return 0;
	}

	/**
	 * Adds a priority asset id and its commons to the front of queue for download and processing.
	 * This will preempt any work that any of the BitRaider core engines are performing in order to
	 * process this asset id. Note that preempted engines will resume their work once finished
	 * with preempting work.
	 *
	 * @param {number} assetId
	 * @param {boolean} forceMove
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	PushPriorityWithCommons(assetId, forceMove) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.PushPriorityWithCommons(assetId, forceMove);
		}

		return 0;
	}

	/**
	 * Adds a normal asset id and its commons to the front of queue for download and processing.
	 * This will preempt any work that any of the BitRaider core engines are performing in order
	 * to process this asset id. Note that preempted engines will resume their work once finished
	 * with preempting work.
	 *
	 * @param {number} assetId
	 * @param {boolean} forceMove
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	PushNormalWithCommons(assetId, forceMove) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.PushNormalWithCommons(assetId, forceMove);
		}

		return 0;
	}

	/**
	 * Adds a normal asset id as the second item of queue for download and processing.
	 * This item will be processed next after the current work completes.
	 *
	 * @param {number} assetId
	 * @param {boolean} forceMove
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	PushNormalAssetId(assetId, forceMove) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.PushNormalAssetId(assetId, forceMove);
		}

		return 0;
	}

	/**
	 * Removes an asset id from the BitRaider queue to download and processing.
	 *
	 * @param {number} assetId
	 * @return {number} BR_SUCCESS on success or an appropriate error code on failure.
	 */
	RemoveAssetId(assetId) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.RemoveAssetId(assetId);
		}
		return 0;
	}

	/**
	 * Returns the MachineID recorded for this computer in the BitRaider metrics.
	 *
	 * @return {string} returns the MachineID. Otherwise, an empty string is returned
	 */
	GetMachineId() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetMachineId();
		}
		return '';
	}

	/**
	 * Returns the localized string corresponding to the StringID provided
	 *
	 * @param {number} stringId
	 * @return {string} returns the localized string. Otherwise, an empty string is returned
	 */
	GetString(stringId) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetString(stringId);
		}
		return '';
	}

	/**
	 * Returns the launch status of the streaming app
	 * @return {boolean}
	 */
	GetAppLaunch() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetAppLaunch();
		}
		return false;
	}

	/**
	 * Returns the package complete status of the streaming app
	 *
	 * @return {boolean}
	 */
	GetPackageComplete() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetPackageComplete();
		}
		return false;
	}

	/**
	 * Returns the complete status of the initial required assets of the streaming app
	 *
	 * @return {boolean}
	 */
	GetInitialComplete() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetInitialComplete();
		}
		return false;
	}

	/**
	 * Toggles the pause state of the BRWC XFER engine; returns the pause state after the command
	 *
	 * @return {boolean}
	 */
	TogglePause() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.TogglePause();
		}
		return false;
	}

	/**
	 * GetPackageID follows the same convention as the above machine ID
	 *
	 * @return {string}  returns package id if not an empty string
	 */
	GetPackageId() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetPackageId();
		}
		return '';
	}

	/**
	 * GetBRWCVersion follows the same convention as the above machine ID
	 *
	 * @return {string} returns the BRWC Version
	 */
	GetBRWCVersion() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetBRWCVersion();
		}
		return '';
	}

	/**
	 * Sets the locale bank to be used.
	 *
	 * @param {number} localeBank
	 */
	SetLocaleBank(localeBank) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.SetLocaleBank(localeBank);
		}
		return 0;
	}

	/**
	 * Sets the rate of speed the client will download data at.
	 * @param {number} speed The speed in kilobytes, max = 16Meg/ 24 bit
	 * @param {ENGINE_FLAG} engineFlag The engine(s) that are to be altered. multiple flags can be set by ORing them
	 */
	SetSpeedLimiter(speed, engineFlag) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.SetSpeedLimiter(speed, engineFlag);
		}
		return 0;
	}

	/**
	 * Requests the core engine to exit the current title
	 * This will send a stop command into the engine to halt a title currently running
	 */
	Stop() {
		if (this.extPipeObj != null) {
			this.extPipeObj.Stop();
		}
	}

	/**
	 * Requests the core engine to quit
	 * This will send a quit command into the engine
	 */
	Quit() {
		if (this.extPipeObj != null) {
			this.extPipeObj.Quit();
		}
	}

	/**
	 * Sends heartbeat signal to core engine
	 * This will send a heartbeat signal into the engine
	 */
	UIHeartbeat() {
		if (this.extPipeObj != null) {
			this.extPipeObj.UIHeartbeat();
		}
	}

	/**
	 * Sends the UI OK signal to core engine
	 * It basically tells the core engine that UI has setup everything and is given a signal to proceed.
	 * It is not needed when running headless
	 */
	UIOK() {
		if (this.extPipeObj != null) {
			this.extPipeObj.UIOK();
		}
	}

	/**
	 * Sets EULA acceptance response
	 *
	 * @param {number} eulaResponse
	 */
	SetEULA(eulaResponse) {
		if (this.extPipeObj != null) {
			this.extPipeObj.SetEULA(eulaResponse);
		}
	}

	/**
	 * Sets Install Path response
	 *
	 * @param {boolean} eulaAccepted
	 * @param {string} installPath
	 */
	InstallPath(eulaAccepted, installPath) {
		if (this.extPipeObj != null) {
			this.extPipeObj.InstallPath(eulaAccepted, installPath);
		}
	}

	/**
	 * Requests the core engine to launch the current title
	 * This will send a play command into the engine to invoke the currently configured title running.
	 *
	 * @param {string} appArgs New set of arguments to use for launching the application.
	 * Use an empty string to use the currently set arguments.
	 */
	Play(appArgs) {
		if (this.extPipeObj != null) {
			this.extPipeObj.Play(appArgs);
		}
	}

	/**
	 * Requests the core engine to launch a specific package binary as specified in Package.ini
	 * This will send a play command into the engine to invoke the currently configured title running.
	 *
	 * @param {string} launchSection The section of Package.ini that BRWCshould use as
	 * launch parameter data. This will be prefixed with “LAUNCH_”
	 * @param {string} appArgs New set of arguments to use for launching the binary
	 */
	CustomLaunch(launchSection, appArgs) {
		if (this.extPipeObj != null) {
			this.extPipeObj.CustomLaunch(launchSection, appArgs);
		}
	}

	/**
	 * Sends the beta key response to the core engine
	 *
	 * @param {string} betaKey
	 * @param {number} betaKeyLen
	 */
	BetaKeyResponse(betaKey, betaKeyLen) {
		if (this.extPipeObj != null) {
			this.extPipeObj.BetaKeyResponse(betaKey, betaKeyLen);
		}
	}

	/**
	 * Sets Message Box response
	 *
	 * @param {number} msgboxReturn
	 */
	MessageBox(msgboxReturn) {
		if (this.extPipeObj != null) {
			this.extPipeObj.MessageBox(msgboxReturn);
		}
	}

	/**
	 * Reaudits the current package configured in the engine.
	 *
	 * @param {AUDIT_MODE} auditMode
	 */
	Reaudit(auditMode) {
		if (this.extPipeObj != null) {
			this.extPipeObj.Reaudit(auditMode);
		}
	}

	/**
	 * Gets the compressed package size of an asset or asset collection with its related commons,
	 * patches and/or locale objects
	 *
	 * @param {number} assetId The asset id to query.
	 * @param {number} getFlags The defined EXT_GETASSET flags to use for collecting
	 * @return {number} the asset size
	 */
	GetAssetSize(assetId, getFlags) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetAssetSize(assetId, getFlags);
		}
		return 0;
	}

	/**
	 * informs caller if the caller's DLL copy or Node Addon has the same version
	 * as the one BRWC is using. This should be done on the initial stage to catch mismatching version early on.
	 *
	 * @return {boolean} returns true or false depending if BRWC's Filemap version is the same as the
	 * caller's DLL copy or Node Addon
	 */
	CheckFilemapVersion() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.CheckFilemapVersion();
		}
		return false;
	}

	/**
	 * Gets the current stage
	 *
	 * @return {STAGE}
	 */
	GetStage() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetStage();
		}
		return 0;
	}

	/**
	 * Gets the current stage progress
	 *
	 * @return {number}
	 */
	GetProgress() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetProgress();
		}
		return 0;
	}

	/**
	 * Gets the current stage subprogress
	 *
	 * @return {number}
	 */
	GetSubProgress() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetSubProgress();
		}
		return 0;
	}

	/**
	 * Gets the current focused control
	 *
	 * @return {EXT_UI_CTRL}
	 */
	GetFocusControl() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetFocusControl();
		}
		return 0;
	}

	/**
	 * Gets the command data
	 *
	 * @return {UI_CMD}
	 */
	GetCmdData() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetCmdData();
		}
		return 0;
	}

	/**
	 * Gets the primary value of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number}
	 */
	GetEngineVal1(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineVal1(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the secondary value of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number}
	 */
	GetEngineVal2(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineVal2(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the primary alternative value of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number}
	 */
	GetEngineAlt1(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineAlt1(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the secondary alternative value of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number}
	 */
	GetEngineAlt2(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineAlt2(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the type of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number}
	 */
	GetEngineType(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineType(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the object id of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number} Gets the object id of the specified engine
	 */
	GetEngineObjectID(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineObjectID(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Gets the priority of the specified engine
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number} Generic priority of an engine.
	 */
	GetEnginePriority(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEnginePriority(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * returns if the specified engine is active
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {boolean} true if the specified engine is active, false if not
	 */
	GetEngineActive(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineActive(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Returns what stage we're moving to the next focused object
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number} The next stage we are moving to.
	 */
	GetEngineStage(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineStage(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Query the engine's error flag if set or not
	 *
	 * @param {ENGINE_ID} engineID The engine to query
	 * @param {boolean} bIsSpecificData Either Generic Engine Data or Specific Engine Data
	 *
	 * @return {number} The engine's error flag if set or not
	 */
	GetEngineErrorFlag(engineID, bIsSpecificData) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetEngineErrorFlag(engineID, bIsSpecificData);
		}
		return 0;
	}

	/**
	 * Set the command name
	 *
	 * @param {number} cmdName
	 */
	SetCommandName(cmdName) {
		if (this.extPipeObj != null) {
			this.extPipeObj.SetCommandName(cmdName);
		}
	}

	/**
	 * Returns the command name
	 *
	 * @return {number}
	 */
	GetCommandName() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.SetCommandName();
		}
		return 0;
	}

	/**
	 * Provides the percentage value(0.00-100.00) of downloaded and unpacked bytes against the
	 * total number of bytes from network
	 *
	 * @return {number} The percentage value of downloaded data.
	 */
	GetPctDone() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetPctDone();
		}
		return 0;
	}

	/**
	 * Provides the total number of bytes to be downloaded from the network to complete the package
	 *
	 * @return {number} The total number of bytes to be downloaded.
	 */
	GetTotalNetworkBytes() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetTotalNetworkBytes();
		}
		return 0;
	}

	/**
	 * Provides the number of bytes already downloaded(and processed) from the network
	 *
	 * @return {number} The total bytes already downloaded.
	 */
	GetDownloadedBytes() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetDownloadedBytes();
		}
		return 0;
	}

	/**
	 * Provides the currently recorded transfer speed in KB/s
	 *
	 * @return {number} The current transfer speed in KB/s
	 */
	GetKBytesPerSec() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetTransferSpeed();
		}
		return 0;
	}

	/**
	 * Provides the percentage value(0.00-100.00) of required(preinstall) data against
	 * the total number of bytes from the network
	 *
	 * @return {number} The percentage value of required data against the total number of bytes.
	 */
	GetPreinstallPct() {
		if (this.extPipeObj != null) {
			return this.extPipeObj.GetPreinstallPct();
		}
		return 0;
	}

	/**
	 * Launches an executable and a given parameter
	 *
	 * @param {string} executablePath
	 * @param {string} parameters
	 *
	 * @return {boolean} returns if launched or not
	 */
	LaunchProcess(executablePath, parameters) {
		if (this.extPipeObj != null) {
			return this.extPipeObj.LaunchProcess(executablePath, parameters);
		}
		return false;
	}
}

/**
 * @callback logCallback
 * @param {string} logMsg
 */

/**
 * @callback eventCallback
 * @param {UI_CMD} cmdName
 * @param {EXT_UI_CTRL} focusCtrl
 * @param {number/string} baCommandData
 */

export default NBRExtPipe;
