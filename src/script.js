async function checkSite(url, timeout = 5000) {
    if (url.includes('youtube.com')) {
        const faviconUrl = 'https://www.youtube.com/favicon.ico?' + Date.now();
        return new Promise((resolve) => {
            const img = new Image();
            const timer = setTimeout(() => {
                img.src = '';
                resolve('not-working');
            }, timeout);
            img.onload = () => {
                clearTimeout(timer);
                resolve('working');
            };
            img.onerror = () => {
                clearTimeout(timer);
                resolve('not-working');
            };
            img.src = faviconUrl;
        });
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'User-Agent': 'CensorScan/1.0'
            }
        });
        clearTimeout(timeoutId);
        return 'working';
    } catch (error) {
        return 'not-working';
    }
}

document.getElementById('check-button').addEventListener('click', async () => {
    const sites = document.querySelectorAll('.site');
    for (const site of sites) {
        const siteId = site.id;
        const statusDiv = site.querySelector('.site-status');
        statusDiv.className = 'site-status checking';
        const result = await checkSite('https://' + siteId);
        if (result === 'working') {
            statusDiv.className = 'site-status working';

        } else {
            statusDiv.className = 'site-status not-working';
        }
    }
})