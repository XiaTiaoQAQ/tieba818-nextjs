export async function POST(request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', {status: 405});
    }

    // Parse the request body to get the `password` and `phone` parameters
    const {password, phone} = await request.json();

    try {
        // Forward the request
        const response = await fetch('http://localhost:8080/818/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password, phone}),
        });

        const responseBody = await response.text();

        // Send the response back to the client
        return new Response(responseBody, {
            status: response.status,
            headers: response.headers,
        });

    } catch (error) {
        return new Response('Server Error', {status: 500});
    }
}
