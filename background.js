// Set up context menu items
var startSpeakingItem = {
	"id": "start-speaking",
	"title": "Start speaking",
	"contexts": ["selection"] 
}

var stopSpeakingItem = {
	"id": "stop-speaking",
	"title": "Stop speaking",
	"contexts": ["selection"] 
}

chrome.contextMenus.create(startSpeakingItem);
chrome.contextMenus.create(stopSpeakingItem);

// Read function
function read(selectionText) {
	// Rate
	chrome.storage.sync.get(['rate', 'voiceName', 'lang', 'pitch'], function(result) {
		var rate = 1;
		var voiceName = "";
		var lang = "";
		var pitch = 1;
		
		// Rate
		if (!result.rate) {
			chrome.storage.sync.set({'rate': rate});
		} 
		else {
			rate = result.rate;
		}
		
		// Voice
		if (result.voiceName) {
			voiceName = result.voiceName;
		}

		// Language
		if (result.lang) {
			lang = result.lang;
		} 

		// Pitch
		if (result.pitch) {
			pitch = result.pitch;
		}

		// Speak!
		chrome.tts.speak(selectionText, {'rate': rate, 'voiceName': voiceName, 'lang': lang, 'pitch': pitch});
	});
}

// Context menu speaking implementation
chrome.contextMenus.onClicked.addListener(function(clickData) {
	if (clickData.menuItemId == "start-speaking") {
		read(clickData.selectionText);
	}
	else if (clickData.menuItemId == "stop-speaking") {
		chrome.tts.stop();
	}
});

// Keyboard command speaking implementation
chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.executeScript( {
		code: "window.getSelection().toString();"
	}, function(selection) {
		chrome.tts.isSpeaking(function(speaking) {
			if (speaking) {
				chrome.tts.stop();
			} else {
				read(selection[0]);
			}
		});
	});
  });