function setPlaybackSpeed(speed) {
	const video = document.querySelector("video");
	if (video) {
		video.playbackRate = speed;
		console.log(`Playback speed set to ${speed}x`);
	}
}

// Show banner on top center
function showBanner(text) {
	let banner = document.querySelector(".center-top");
	if (!banner) {
		banner = document.createElement("div");
		banner.className = "center-top";
		document.body.appendChild(banner);
	}
	banner.textContent = text;
	banner.style.display = "block";

	// Hide after 0.5 seconds
	clearTimeout(banner.hideTimeout);
	banner.hideTimeout = setTimeout(() => {
		banner.style.display = "none";
	}, 500);
}

function setupSpeedBoostKey() {
	const targetKey = "v";

	document.addEventListener("keydown", (e) => {
		const tag = document.activeElement.tagName.toLowerCase();
		if (tag === "input" || tag === "textarea") return;
		if (e.key.toLowerCase() === targetKey) {
			setPlaybackSpeed(2);
			showBanner("2x");
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.key.toLowerCase() === targetKey) {
			setPlaybackSpeed(1);
			showBanner("Normal Speed");
		}
	});
}

const waitForVideo = setInterval(() => {
	if (document.querySelector("video")) {
		setupSpeedBoostKey();
		clearInterval(waitForVideo);
	}
}, 500);
