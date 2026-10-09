const MEDIA_URL = import.meta.env.VITE_MEDIA_URL

export function getProfilePictureUrl(filename) {
  const image = filename || 'default-profile.png'

  return `${MEDIA_URL}/uploads/profiles/${image}`
}