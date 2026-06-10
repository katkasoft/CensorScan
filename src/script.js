async function checkSite(url, timeout = 5000) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Range': 'bytes=0-1024',
                'User-Agent': 'CensorScan/1.0'
            }
        });
        clearTimeout(timeoutId);
        return 'working'
    } catch (error) {
        return 'not-working'
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