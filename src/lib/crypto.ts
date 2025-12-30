// SHA-256 hash utility for anonymous identity generation
export async function generateHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate a random credential name
export function generateGhostName(): string {
  const adjectives = ["Verified", "Secure", "Protected", "Certified", "Trusted", "Authenticated", "Validated", "Confirmed", "Registered", "Authorized"];
  const nouns = ["Scholar", "Participant", "Member", "Associate", "Delegate", "Representative", "Advocate", "Contributor", "Observer", "Analyst"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// Generate a random avatar emoji
export function generateAvatar(): string {
  const avatars = ["🎓", "📋", "🔒", "✓", "📊", "🏛️", "⚖️", "📁", "🔐", "📝", "✅", "🛡️"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Format relative time
export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "Never";
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}

// Generate a unique report ID
export function generateReportId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RPT-${timestamp.slice(-3)}${random}`;
}

// Generate certificate hash for cryptographic proof
export async function generateCertificateHash(input: string): Promise<string> {
  const hash = await generateHash(input + Date.now().toString());
  return hash.slice(0, 64);
}
