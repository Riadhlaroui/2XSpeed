document.addEventListener("DOMContentLoaded", () => {
	const toggle = document.querySelector(".toggle");

	// Load saved state
	chrome.storage.local.get("speedEnabled", (data) => {
		toggle.checked = data.speedEnabled || false;
	});

	// Save state on change
	toggle.addEventListener("change", () => {
		chrome.storage.local.set({ speedEnabled: toggle.checked });
	});
});
