// Always-current hotkey — loaded once, then kept in sync via onChanged
let activeKey = "b";

function loadKey() {
	if (typeof chrome !== "undefined" && chrome.storage) {
		chrome.storage.local.get(["speedKey"], (data) => {
			if (data.speedKey) activeKey = data.speedKey;
		});
	} else {
		const saved = localStorage.getItem("speedKey");
		if (saved) activeKey = saved;
	}
}

// Update activeKey whenever the popup saves a new one
if (typeof chrome !== "undefined" && chrome.storage) {
	chrome.storage.onChanged.addListener((changes, area) => {
		if (area === "local" && changes.speedKey) {
			activeKey = changes.speedKey.newValue;
		}
	});
}

function setPlaybackSpeed(speed) {
	const video = document.querySelector("video");
	if (video) video.playbackRate = speed;
}

function showBanner(text) {
	let banner = document.querySelector(".speedboost-banner");
	if (!banner) {
		banner = document.createElement("div");
		banner.className = "speedboost-banner";
		Object.assign(banner.style, {
			position: "fixed",
			top: "20px",
			left: "50%",
			transform: "translateX(-50%)",
			background: "rgba(0, 0, 0, 0.69)",
			color: "white",
			padding: "10px 18px",
			borderRadius: "7px",
			fontSize: "16px",
			fontFamily: "sans-serif",
			zIndex: "999999",
			pointerEvents: "none",
			transition: "opacity 0.15s ease",
		});
		document.body.appendChild(banner);
	}
	banner.textContent = text;
	banner.style.opacity = "1";
	banner.style.display = "block";
	clearTimeout(banner._hideTimeout);
	banner._hideTimeout = setTimeout(() => {
		banner.style.opacity = "0";
		setTimeout(() => {
			banner.style.display = "none";
		}, 150);
	}, 600);
}

function setupSpeedBoostKey() {
	loadKey(); // prime activeKey from storage on page load

	document.addEventListener("keydown", (e) => {
		const tag = document.activeElement.tagName.toLowerCase();
		if (
			tag === "input" ||
			tag === "textarea" ||
			document.activeElement.isContentEditable
		)
			return;

		// Synchronous check against activeKey — no async, no race condition
		if (e.key.toLowerCase() === activeKey) {
			setPlaybackSpeed(2);
			showBanner("2X Speed");
		}
	});

	document.addEventListener("keyup", (e) => {
		if (e.key.toLowerCase() === activeKey) {
			setPlaybackSpeed(1);
			showBanner("Normal Speed");
		}
	});
}

const waitForVideo = setInterval(() => {
	if (document.querySelector("video")) {
		clearInterval(waitForVideo);
		setupSpeedBoostKey();
	}
}, 500);
