function oneDecimalPlace(x) {
    return Number.parseFloat(x).toFixed(1);
}

function getVoiceLang(voice) {
    chrome.tts.getVoices(
        function(voices) {
            for (var i = 0; i < voices.length; i++) {
                if (voice == voices[i].name) {
                    return voices[i].lang;
                }
            }
        }
    );
}

$(document).ready(function(){
    // Get elements from document
    var rateSlider = document.getElementById("rateSlider");
    var rateValue = document.getElementById("rateValue");
    var pitchSlider = document.getElementById("pitchSlider");
    var pitchValue = document.getElementById("pitchValue");
    var $voiceDropdown = $("#voiceDropdown");

    // Populate voice dropdown
    chrome.tts.getVoices(
        function(voices) {
            for (var i = 0; i < voices.length; i++) {
                $("#voiceDropdown").append($('<option>', {
                    value: voices[i].name,
                    text: voices[i].voiceName
                }));
            }
            chrome.storage.sync.get('voiceName', function(result) {
                if (result.voiceName) {
                    $voiceDropdown.val(result.voiceName);
                }
            });
        }
    );

    // Set rate slider value and pitch slider value
    rateSlider.value = 10;
    rateValue.value = rateSlider.value / 10;
    chrome.storage.sync.get('rate', function(result) {
		if (result.rate) {
            rateSlider.value = result.rate * 10;
            rateValue.innerHTML = oneDecimalPlace(result.rate);
        }
    });
    
    pitchSlider.value = 10;
    pitchValue.value = pitchSlider.value / 10;
    chrome.storage.sync.get('pitch', function(result) {
		if (result.pitch) {
            pitchSlider.value = result.pitch * 10;
            pitchValue.innerHTML = oneDecimalPlace(result.pitch);
        }
	});

    // Store rate value from rate slider, apply to rate value text
    rateSlider.oninput = function() {
        var rate = 1/10 * this.value;
        rateValue.innerHTML = oneDecimalPlace(rate);
        chrome.storage.sync.set({"rate": rate});
    }

    pitchSlider.oninput = function() {
        var pitch = 1/10 * this.value;
        pitchValue.innerHTML = oneDecimalPlace(pitch);
        chrome.storage.sync.set({"pitch": pitch});
    }

    // Store select voice name
    $voiceDropdown.change(function() {
        chrome.storage.sync.set({'voiceName': this.value});
        chrome.storage.sync.set({'lang': getVoiceLang(this.value)});
    })
});

