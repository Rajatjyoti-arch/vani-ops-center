// BIP-39 inspired word list for mnemonic generation (256 words subset for 12-word phrases)
const WORD_LIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
  "academy", "access", "account", "accuse", "achieve", "acid", "acquire", "across",
  "action", "actor", "actual", "adapt", "address", "adjust", "admit", "adult",
  "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "agent",
  "agree", "ahead", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer",
  "antenna", "antique", "anxiety", "apart", "apology", "appear", "apple", "approve",
  "april", "arch", "arctic", "arena", "argue", "armed", "armor", "army",
  "around", "arrange", "arrest", "arrive", "arrow", "artist", "artwork", "aspect",
  "assault", "asset", "assist", "assume", "asthma", "athlete", "atom", "attack",
  "attend", "attract", "auction", "audit", "august", "aunt", "author", "auto",
  "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome",
  "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "balance",
  "balcony", "ball", "bamboo", "banana", "banner", "barely", "bargain", "barrel",
  "basic", "basket", "battle", "beach", "beauty", "because", "become", "before",
  "begin", "behave", "behind", "believe", "below", "bench", "benefit", "best",
  "betray", "better", "between", "beyond", "bicycle", "biology", "bird", "birth",
  "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
  "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board",
  "boat", "body", "boil", "bomb", "bone", "bonus", "book", "boost",
  "border", "boring", "borrow", "boss", "bottom", "bounce", "brain", "brand",
  "brass", "brave", "bread", "breeze", "brick", "bridge", "brief", "bright",
  "bring", "broken", "brother", "brown", "brush", "bubble", "buddy", "budget",
  "buffalo", "build", "bullet", "bundle", "burden", "burger", "burst", "business",
  "busy", "butter", "buyer", "cabin", "cable", "cactus", "cage", "cake",
  "call", "calm", "camera", "camp", "canal", "cancel", "candy", "cannon",
  "canvas", "canyon", "capable", "capital", "captain", "carbon", "card", "cargo",
  "carpet", "carry", "cart", "case", "castle", "casual", "catalog", "catch",
  "category", "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery",
  "cement", "census", "century", "cereal", "certain", "chair", "chalk", "champion"
];

// SHA-256 hash utility for anonymous identity generation
export async function generateHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate a 12-word mnemonic phrase using cryptographically secure randomness
export function generateMnemonicPhrase(): string[] {
  const words: string[] = [];
  const randomValues = new Uint32Array(12);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < 12; i++) {
    const index = randomValues[i] % WORD_LIST.length;
    words.push(WORD_LIST[index]);
  }
  
  return words;
}

// Validate that a phrase contains valid words
export function validateMnemonicPhrase(phrase: string): boolean {
  const words = phrase.trim().toLowerCase().split(/\s+/);
  if (words.length !== 12) return false;
  return words.every(word => WORD_LIST.includes(word));
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
