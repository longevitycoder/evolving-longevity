/**
 * SECURE INTAKE SUBMISSION — Formspree Integration
 * Sends intake data via Formspree (reliable server-side delivery)
 * Endpoint: https://formspree.io/f/xdawajgq
 */

async function secureSubmitIntake(data) {
  try {
    const response = await fetch('https://formspree.io/f/xdawajgq', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const result = await response.json();
      return { success: false, error: result.error || 'Submission failed' };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}
