// ------------------------------
// PASSWORD GENERATOR
// ------------------------------

document.getElementById("generateBtn").addEventListener("click", function () {
    const length = parseInt(document.getElementById("length").value);
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("output").textContent = password;
});

// Copy button logic
document.getElementById("copyBtn").addEventListener("click", function () {
    const password = document.getElementById("output").textContent.trim();

    if (!password) {
        alert("Generate a password first.");
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => {
            alert("Password copied to clipboard!");
        })
        .catch(err => {
            console.error("Clipboard error:", err);
            alert("Could not copy. Browser blocked clipboard access.");
        });
});


// ------------------------------
// INTERNET SPEED TEST (NO BACKEND)
// ------------------------------

// Ping Test
async function testPing() {
    const start = performance.now();
    try {
        await fetch("https://www.cloudflare.com/cdn-cgi/trace", { cache: "no-store" });
        const end = performance.now();
        return Math.round(end - start);
    } catch {
        return "Error";
    }
}

// Download Speed Test
async function testDownload() {
    const fileUrl = "https://speed.cloudflare.com/__down?bytes=5000000"; // 5MB test file
    const start = performance.now();

    try {
        const response = await fetch(fileUrl, { cache: "no-store" });
        await response.blob();
        const end = performance.now();

        const duration = (end - start) / 1000; // seconds
        const fileSizeMB = 5; // MB
        const speedMbps = (fileSizeMB / duration) * 8; // convert MB/s to Mbps

        return speedMbps.toFixed(2);
    } catch {
        return "Error";
    }
}

// Connection Type
function getConnectionType() {
    const nav = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    return nav ? nav.effectiveType.toUpperCase() : "Unknown";
}


// ------------------------------
// FIXED: Run All Tests (wrapped so it ALWAYS works)
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("startSpeedTest");
    if (!btn) return; // safety check

    btn.addEventListener("click", async () => {
        document.getElementById("pingResult").textContent = "Testing...";
        document.getElementById("downloadResult").textContent = "Testing...";
        document.getElementById("connectionType").textContent = getConnectionType();

        const ping = await testPing();
        document.getElementById("pingResult").textContent = `${ping} ms`;

        const download = await testDownload();
        document.getElementById("downloadResult").textContent = `${download} Mbps`;
    });
});
