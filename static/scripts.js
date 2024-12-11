document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');
    const downloadLink = document.getElementById('download-link');
    let inputUrl = '';

    // Handle drag and drop
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.textContent = "Drop the link here!";
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.textContent = "Drag and drop the m3u8 link here, or paste it anywhere on the page.";
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const droppedText = event.dataTransfer.getData('text/plain');
        if (isValidUrl(droppedText)) {
            inputUrl = droppedText;
            dropArea.textContent = `Link received: ${inputUrl}`;
        } else {
            status.textContent = "Invalid link. Please provide a valid m3u8 URL.";
        }
    });

    // Handle paste
    document.addEventListener('paste', (event) => {
        const pastedText = event.clipboardData.getData('text');
        if (isValidUrl(pastedText)) {
            inputUrl = pastedText;
            dropArea.textContent = `Link received: ${inputUrl}`;
        } else {
            status.textContent = "Invalid link. Please provide a valid m3u8 URL.";
        }
    });

    // Download button click
    downloadBtn.addEventListener('click', async () => {
        if (!inputUrl) {
            status.textContent = "Please provide a valid m3u8 URL by dragging, dropping, or pasting.";
            return;
        }

        status.textContent = "Processing...";

        try {
            const response = await fetch('/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputUrl })
            });

            const result = await response.json();
            if (result.success) {
                downloadLink.href = `/get_file/${result.filename}`;
                downloadLink.textContent = `Download ${result.filename}`;
                downloadLink.style.display = "block";
                downloadLink.download = result.filename;
                status.textContent = "Conversion successful!";
            } else {
                status.textContent = `Error: ${result.error}`;
            }
        } catch (error) {
            status.textContent = `Error: ${error.message}`;
        }
    });

    // URL validation
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
});
