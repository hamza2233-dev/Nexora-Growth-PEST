document.getElementById('pingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const zipCodeInput = document.getElementById('zip_code').value.trim();
    const responseMessage = document.getElementById('response-message');
    const submitBtn = document.getElementById('submitBtn');

    if (!zipCodeInput) {
        responseMessage.style.color = 'red';
        responseMessage.textContent = 'Please enter a valid zip code.';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    responseMessage.textContent = '';

    const endpoint = 'https://rtb.ringba.com/v1/production/2f00edd2cd4845b8a33802a2dd9c08ec.json';
    
    const payload = {
        "CID": "14061571951",
        "zip_code": zipCodeInput,
        "exposeCallerId": "yes"
    };

    try {
        // Using 'no-cors' prevents browser CORS blocking. 
        // Note: In 'no-cors' mode, the response status is opaque (type: 'opaque'), 
        // meaning you won't be able to read JSON body responses directly in JS, 
        // but the data will successfully reach Ringba.
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
