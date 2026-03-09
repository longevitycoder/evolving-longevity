/**
 * SECURE INTAKE SUBMISSION
 * Sends intake data via Cloudflare Worker (server-side)
 * instead of mailto: URL (which exposes data in browser history)
 */

async function secureSubmitIntake(data) {
  try {
    const response = await fetch('https://el-chatbot-proxy.czemeresz.workers.dev/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'intake', data: data })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      // Fallback: open mailto (less secure but functional)
      return { success: false, fallback: true };
    }
  } catch (e) {
    return { success: false, fallback: true };
  }
}
