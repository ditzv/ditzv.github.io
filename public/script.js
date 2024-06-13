async function handleUpload() {
    const fileInput = document.getElementById('videoFileInput');
    const videoPlayer = document.getElementById('videoPlayer');
    
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    
    videoPlayer.src = url;
    videoPlayer.style.display = 'block';
}

async function handleTrim() {
    const trimStart = document.getElementById('trimStart').value;
    const trimEnd = document.getElementById('trimEnd').value;
    const removeSubtitles = document.getElementById('removeSubtitles').checked;
    const videoPlayer = document.getElementById('videoPlayer');
    
    const blob = await trimVideo(videoPlayer.src, trimStart, trimEnd, removeSubtitles);
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.style.display = 'inline';
}

async function trimVideo(videoUrl, start, end, removeSubtitles) {
    const formData = new FormData();
    formData.append('videoUrl', videoUrl);
    formData.append('start', start);
    formData.append('end', end);
    formData.append('removeSubtitles', removeSubtitles);

    const response = await fetch('/trim', {
        method: 'POST',
        body: formData
    });

    return await response.blob();
}
