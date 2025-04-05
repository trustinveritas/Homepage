export async function onRequest({ request, env }) {
  try {
    // Token aus dem JSON-Body auslesen
    const { turnstileToken } = await request.json();

    // Secret Key aus den Environment Variables (Cloudflare Dashboard)
    const secret = env.TURNSTILE_SECRET_KEY;

    // Token bei Cloudflare verifizieren
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', turnstileToken);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const outcome = await result.json();

    if (!outcome.success) {
      return new Response('Verification failed', { status: 403 });
    }
    return new Response('Verification successful!');
  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500 });
  }
}