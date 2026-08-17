document.getElementById('pingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let rawCallerId = document.getElementById('caller_id').value.trim();
    const zipCodeInput = document.getElementById('zip_code').value.trim();
    const responseBox = document.getElementById('response-box');
    const submitBtn = document.getElementById('submitBtn');

    if (!rawCallerId || !zipCodeInput) {
        responseBox.style.display = 'block';
        responseBox.style.color = 'red';
        responseBox.textContent = 'Please fill out all fields.';
        return;
    }

    // Automatically format phone number to include +1 and strip extra characters
    let cleanedDigits = rawCallerId.replace(/\D/g, '');
    if (cleanedDigits.length === 11 && cleanedDigits.startsWith('1')) {
        cleanedDigits = cleanedDigits.substring(1);
    }
    const formattedCallerId = `+1${cleanedDigits}`;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Ping...';
    responseBox.style.display = 'none';

    // Target Ringba endpoint
    const ringbaEndpoint = 'https://rtb.ringba.com/v1/production/2f00edd2cd4845b8a33802a2dd9c08ec.json';
    
    // We route through a reliable CORS proxy wrapper to ensure the browser successfully reads the JSON response body back
    const targetUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(ringbaEndpoint)}`;

    const payload = {
        "CID": "14061571951",
        "callerId": formattedCallerId, // Accepted field variation for Ringba matching
        "caller_id": formattedCallerId, // Included to cover both mapping variations
        "zip_code": zipCodeInput,
        "exposeCallerId": "yes"
    };

    try {
        const res = await fetch(ringbaEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // If Ringba headers permit direct browser reading:
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        responseBox.style.display = 'block';
        responseBox.style.color = 'green';
        responseBox.textContent = `Response Received:\n${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`;
        document.getElementById('pingForm').reset();

    } catch (err) {
        // Fallback to proxy method if browser blocks direct CORS
        try {
            const proxyRes = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const proxyData = await proxyRes.text();

            responseBox.style.display = 'block';
            responseBox.style.color = 'green';
            responseBox.textContent = `Response Received:\n${proxyData}`;
            document.getElementById('pingForm').reset();
        } catch (proxyErr) {
            console.error('Ping Error:', proxyErr);
            responseBox.style.display = 'block';
            responseBox.style.color = 'red';
            responseBox.textContent = 'Error: Failed to fetch response from Ringba endpoint.';
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Ping';
    }
});
