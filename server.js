const express = require('express');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.post('/trim', (req, res) => {
    const videoUrl = req.body.videoUrl;
    const start = parseInt(req.body.start);
    const end = parseInt(req.body.end);
    const removeSubtitles = req.body.removeSubtitles === 'true'; // Check if user wants to remove subtitles

    const outputFileName = `trimmed_video_${Date.now()}.mp4`;
    const outputPath = `./public/${outputFileName}`;

    let ffmpegCommand = ffmpeg(videoUrl)
                        .setStartTime(start)
                        .setDuration(end - start);

    if (videoUrl.endsWith('.mkv') && removeSubtitles) {
        ffmpegCommand = ffmpegCommand
                        .outputOptions('-c', 'copy')
                        .outputOptions('-map', '0:v:0')
                        .outputOptions('-map', '0:a?')
                        .outputOptions('-map', '-0:s');
    }

    ffmpegCommand = ffmpegCommand.output(outputPath)
                        .on('end', () => {
                            res.download(outputPath, (err) => {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send('Error downloading file');
                                } else {
                                    fs.unlink(outputPath, (err) => {
                                        if (err) console.error(err);
                                    });
                                }
                            });
                        })
                        .on('error', (err) => {
                            console.error('Error trimming video:', err);
                            res.status(500).send('Error trimming video');
                        })
                        .run();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
