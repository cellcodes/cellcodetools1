/* ----------------------------------------- */
/* PASSWORD GENERATOR                        */
/* ----------------------------------------- */

document.getElementById("generateBtn")?.addEventListener("click", () => {
    const length = document.getElementById("length").value;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("output").innerText = password;
});

document.getElementById("copyBtn")?.addEventListener("click", () => {
    const password = document.getElementById("output").innerText;
    navigator.clipboard.writeText(password);
});


/* ----------------------------------------- */
/* INTERNET SPEED TEST                        */
/* ----------------------------------------- */

document.getElementById("startSpeedTest")?.addEventListener("click", async () => {
    const pingStart = performance.now();
    await fetch("https://www.google.com", { mode: "no-cors" });
    const pingEnd = performance.now();

    const ping = Math.round(pingEnd - pingStart);
    document.getElementById("pingResult").innerText = ping + " ms";

    const downloadStart = performance.now();
    await fetch("https://speed.hetzner.de/100MB.bin");
    const downloadEnd = performance.now();

    const seconds = (downloadEnd - downloadStart) / 1000;
    const mbps = Math.round((100 / seconds) * 8);

    document.getElementById("downloadResult").innerText = mbps + " Mbps";

    document.getElementById("connectionType").innerText =
        mbps > 100 ? "Fast" : mbps > 20 ? "Average" : "Slow";
});


/* ----------------------------------------- */
/* FILE COMPRESSOR (JSZip)                    */
/* ----------------------------------------- */

document.getElementById("compressBtn")?.addEventListener("click", async () => {
    const files = document.getElementById("compressFiles")?.files;
    const output = document.getElementById("compressOutput");

    if (!files || files.length === 0) {
        output.innerText = "Please select at least one file.";
        return;
    }

    output.innerText = "Compressing...";

    const zip = new JSZip();

    for (let file of files) {
        const data = await file.arrayBuffer();
        zip.file(file.name, data);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "compressed_files.zip";
    link.click();

    output.innerText = "ZIP file created and downloaded!";
});


/* ----------------------------------------- */
/* FILE CONVERTER                            */
/* ----------------------------------------- */

document.getElementById("convertBtn")?.addEventListener("click", async () => {
    const type = document.getElementById("convertType")?.value;
    const fileInput = document.getElementById("convertFile");
    const output = document.getElementById("convertOutput");

    if (!type) {
        output.innerText = "Please select a conversion type.";
        return;
    }

    if (!fileInput.files.length) {
        output.innerText = "Please select a file.";
        return;
    }

    const file = fileInput.files[0];

    /* -----------------------------
       IMAGE → BASE64 (with preview)
    ------------------------------*/
    if (type === "imgToBase64") {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;

            output.innerHTML = `
                <p><strong>Preview:</strong></p>
                <img src="${base64}" style="max-width:100%; border-radius:6px; margin-bottom:10px;">

                <p><strong>Base64 Output:</strong></p>
                <textarea id="base64Text" style="width:100%; height:120px;">${base64}</textarea>

                <button id="copyBase64">Copy Base64</button>
                <button id="downloadBase64">Download as .txt</button>
            `;

            document.getElementById("copyBase64").onclick = () => {
                navigator.clipboard.writeText(base64);
            };

            document.getElementById("downloadBase64").onclick = () => {
                const blob = new Blob([base64], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "image_base64.txt";
                link.click();
            };
        };
        reader.readAsDataURL(file);
    }

    /* -----------------------------
       BASE64 → IMAGE
    ------------------------------*/
    if (type === "base64ToImg") {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.trim();
            const img = document.createElement("img");
            img.src = base64;
            img.style.maxWidth = "100%";
            output.innerHTML = "";
            output.appendChild(img);
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       JSON → CSV
    ------------------------------*/
    if (type === "jsonToCsv") {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result);
                const keys = Object.keys(json[0]);
                const csv = [
                    keys.join(","),
                    ...json.map(row => keys.map(k => row[k]).join(","))
                ].join("\n");

                output.innerHTML = `
                    <textarea style="width:100%; height:150px;">${csv}</textarea>
                `;
            } catch {
                output.innerText = "Invalid JSON file.";
            }
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       CSV → JSON
    ------------------------------*/
    if (type === "csvToJson") {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const lines = reader.result.split("\n");
                const headers = lines[0].split(",");

                const json = lines.slice(1).map(line => {
                    const values = line.split(",");
                    let obj = {};
                    headers.forEach((h, i) => obj[h] = values[i]);
                    return obj;
                });

                output.innerHTML = `
                    <textarea style="width:100%; height:150px;">${JSON.stringify(json, null, 2)}</textarea>
                `;
            } catch {
                output.innerText = "Invalid CSV file.";
            }
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       IMAGE → WEBP
    ------------------------------*/
    if (type === "imgToWebp") {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                const webp = canvas.toDataURL("image/webp", 0.9);

                output.innerHTML = `
                    <p><strong>WebP Preview:</strong></p>
                    <img src="${webp}" style="max-width:100%; margin-bottom:10px;">
                    <button id="downloadWebp">Download WebP</button>
                `;

                document.getElementById("downloadWebp").onclick = () => {
                    const link = document.createElement("a");
                    link.href = webp;
                    link.download = "converted.webp";
                    link.click();
                };
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }

    /* -----------------------------
       TEXT → PDF
    ------------------------------*/
    if (type === "textToPdf") {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.text(text, 10, 10);

            const blob = pdf.output("blob");

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "converted.pdf";
            link.click();

            output.innerText = "PDF created and downloaded!";
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       PDF → TEXT
    ------------------------------*/
    if (type === "pdfToText") {
        const reader = new FileReader();
        reader.onload = async () => {
            const typedArray = new Uint8Array(reader.result);

            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(i => i.str).join(" ") + "\n";
            }

            output.innerHTML = `
                <textarea style="width:100%; height:150px;">${text}</textarea>
            `;
        };
        reader.readAsArrayBuffer(file);
    }

    /* -----------------------------
       TEXT → UPPERCASE
    ------------------------------*/
    if (type === "textUpper") {
        const reader = new FileReader();
        reader.onload = () => {
            output.innerHTML = `
                <textarea style="width:100%; height:150px;">${reader.result.toUpperCase()}</textarea>
            `;
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       TEXT → lowercase
    ------------------------------*/
    if (type === "textLower") {
        const reader = new FileReader();
        reader.onload = () => {
            output.innerHTML = `
                <textarea style="width:100%; height:150px;">${reader.result.toLowerCase()}</textarea>
            `;
        };
        reader.readAsText(file);
    }

    /* -----------------------------
       HTML → TEXT
    ------------------------------*/
    if (type === "htmlToText") {
        const reader = new FileReader();
        reader.onload = () => {
            const html = reader.result;
            const div = document.createElement("div");
            div.innerHTML = html;
            const text = div.innerText;

            output.innerHTML = `
                <textarea style="width:100%; height:150px;">${text}</textarea>
            `;
        };
        reader.readAsText(file);
    }
});
