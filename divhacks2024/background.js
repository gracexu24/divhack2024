// List of social media websites for chrome extension to track
const socialMediaSites = new Set([
  'facebook.com',
  'twitter.com',
  'tiktok.com',
  'instagram.com',
  'reddit.com',
  'snapchat.com',
  'youtube.com',
  'linkedin.com',
  'discord.com',
  'pinterest.com'
]);

function isSocialMedia(url) {
  // Extract the hostname from the URL (e.g., "www.facebook.com" -> "facebook.com")
  const domain = new URL(url).hostname;

  // Check if the domain matches one of the social media sites
  return socialMediaSites.has(domain);
}
