import { DirHelper } from 'figtree';
import puppeteer from 'puppeteer';
import { getStream } from 'puppeteer-stream';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
export class IPPageStreamer {
    _channels;
    _browser = null;
    _page = null;
    _stream = null;
    _currentChannel;
    constructor(channels) {
        this._channels = channels;
    }
    async start(channelId) {
        const channel = this._getChannel(channelId);
        try {
            if (!await DirHelper.directoryExist('/var/log/puppeteercast')) {
                await DirHelper.mkdir('/var/log/puppeteercast', true);
            }
        }
        catch (e) {
            console.warn('Can not create log directory:', e);
        }
        this._browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            headless: true,
            dumpio: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-zygote',
                '--disable-gpu',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-dev-tools',
                '--no-xshm',
                '--disable-background-networking',
                '--mute-audio',
                '--disable-default-apps',
                '--disable-popup-blocking',
                '--disable-translate',
                '--disable-sync',
                '--metrics-recording-only',
                '--disable-hang-monitor',
                '--disable-software-rasterizer',
                '--disable-notifications'
            ]
        });
        this._page = await this._browser.newPage();
        await this._page.goto(channel.url);
        this._stream = await getStream(this._page, { audio: true, video: true });
        this._currentChannel = channel;
    }
    _getChannel(channelId) {
        const channel = this._channels.find(c => c.id === channelId);
        if (!channel) {
            throw new Error(`Channel "${channelId}" not found.`);
        }
        return channel;
    }
    getCurrentStream() {
        return this._stream;
    }
    streamToTS() {
        if (this._stream === null) {
            throw new Error('Stream not ready!');
        }
        const output = new PassThrough();
        ffmpeg(this._stream)
            .inputFormat('webm')
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mpegts')
            .outputOptions('-preset ultrafast')
            .on('error', (err) => {
            console.error('FFmpeg Fehler:', err.message);
            output.end();
        })
            .pipe(output, { end: true });
        return output;
    }
    async stop() {
        if (this._browser) {
            await this._browser.close();
        }
    }
    async switchChannel(channelId) {
        if (this._page === null) {
            throw new Error('Page not ready.');
        }
        const channel = this._getChannel(channelId);
        await this._page.goto(channel.url, { waitUntil: 'networkidle2' });
        this._currentChannel = channel;
    }
    getM3U(baseUrl) {
        return [
            '#EXTM3U',
            ...this._channels.map(c => `#EXTINF:-1 tvg-id="${c.id}" group-title="Web",${c.name}\n${baseUrl}/channel/${c.id}.ts`)
        ].join('\n');
    }
}
//# sourceMappingURL=IPPageStreamer.js.map