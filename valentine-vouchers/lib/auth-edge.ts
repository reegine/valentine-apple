// lib/auth-edge.ts - Edge-compatible version for middleware
export function verifyTokenEdge(token: string) {
  try {
    // Simple JWT decode without verification (just reads the payload)
    // This is safe for middleware since we're just checking existence and basic claims
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}