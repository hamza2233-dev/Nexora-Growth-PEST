document.getElementById('pingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let rawCallerId = document.getElementById('caller_id').value.trim();
    const zipCodeInput = document.getElementById('zip_code').value.trim();
    const responseMessage = document.getElementById('response-message');
    const submitBtn = document.getElementById('submitBtn');

    if (!rawCallerId || !zipCodeInput) {
        responseMessage.style.color = 'red';
        responseMessage.textContent = 'Please fill out all fields.';
        return;
    }

    // Automatically ensure +1 format (removes any existing leading + or 1 if pasted strangely, then adds +1)
    let cleanedDigits = rawCallerId.replace(/\D/g, '');
    if (cleanedDigits.length === 11 && cleanedDigits.startsWith('1')) {
        cleanedDigits = cleanedDigits.substring(1);
    }
    const formattedCallerId = `+1${cleanedDigits}`;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    responseMessage.textContent = '';

    const endpoint = 'https://rtb.ringba.com/v1/production/2f00edd2cd4845b8a33802a2dd9c08ec.json';
    
    const payload = {
        "CID": "14061571951",
        "caller_id": formattedCallerId,
        "zip_code": zipCodeInput,
        "exposeCallerId": "yes"
    };

    try {
        // Uses 'no-cors' mode to ensure browser requests reach Ringba without blocking.
        await fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        responseMessage.style.color = 'green';
        responseMessage.textContent = 'Ping sent successfully!';
        document.getElementById('pingForm').reset();
    } catch (error) {
        console.error('Error sending ping:', error);
        responseMessage.style.color = 'red';
        responseMessage.textContent = 'Failed to send ping. Check console for details.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Ping';
    }
});
