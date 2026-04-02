// Storage helpers — use chrome.storage when available, else localStorage
const store = {
	get(key, cb) {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.get([key], (data) => cb(data[key]));
		} else {
			cb(localStorage.getItem(key));
		}
	},
	set(key, value, cb) {
		if (typeof chrome !== "undefined" && chrome.storage) {
			chrome.storage.local.set({ [key]: value }, cb);
		} else {
			localStorage.setItem(key, value);
			if (cb) cb();
		}
	},
};

document.addEventListener("DOMContentLoaded", () => {
	const keyBadge = document.getElementById("keyBadge");
	const keyHint = document.getElementById("keyHint");
	const btnChange = document.getElementById("btnChange");

	let isListening = false;

	// Load saved key (default: "b")
	store.get("speedKey", (key) => {
		keyBadge.textContent = (key || "b").toUpperCase();
	});

	function startListening() {
		isListening = true;
		keyBadge.classList.add("listening");
		keyHint.textContent = "press any key…";
		keyHint.classList.add("listening-text");
		btnChange.textContent = "Cancel";
		btnChange.classList.add("cancel");
	}

	function stopListening() {
		isListening = false;
		keyBadge.classList.remove("listening");
		keyHint.textContent = "hold to speed up";
		keyHint.classList.remove("listening-text");
		btnChange.textContent = "Change";
		btnChange.classList.remove("cancel");
	}

	btnChange.addEventListener("click", () => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (!isListening) return;

		// Ignore modifier-only presses
		if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;

		e.preventDefault();

		const newKey = e.key.toLowerCase();
		keyBadge.textContent = newKey.toUpperCase();

		store.set("speedKey", newKey, () => {
			stopListening();
		});
	});
});
