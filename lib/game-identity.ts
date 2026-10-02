/**
 * The deployment boundary must remove any client-supplied value and inject a
 * verified, opaque account subject. Provider-specific adapters stay outside the
 * public game repository.
 */
export async function authenticatedSaveKey(request: Request): Promise<string | null> {
  const subject = request.headers.get('x-gear-works-player')?.trim();
  if (!subject) return null;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(subject));
  return 'account:' + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
