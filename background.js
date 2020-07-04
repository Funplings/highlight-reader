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


chrome.contextMenus.onClicked.addListener(function(clickData) {
	if (clickData.menuItemId == "start-speaking") {
		read(clickData.selectionText);
	}
	else if (clickData.menuItemId == "stop-speaking") {
		chrome.tts.stop();
		chrome.tts.getVoices(
			function(voices) {
			  for (var i = 0; i < voices.length; i++) {
				console.log('Voice ' + i + ':');
				console.log('  name: ' + voices[i].voiceName);
				console.log('  lang: ' + voices[i].lang);
				console.log('  extension id: ' + voices[i].extensionId);
				console.log('  event types: ' + voices[i].eventTypes);
			  }
			});
	}
});