// Generate button logic
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

    // show password in output div
    document.getElementById("output").textContent = password;
});

// Copy button logic
document.getElementById("copyBtn").addEventListener("click", function () {
    const password = document.getElementById("output").textContent.trim();

    // if nothing generated yet, do nothing
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