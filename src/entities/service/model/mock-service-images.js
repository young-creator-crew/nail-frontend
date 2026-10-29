const mockServiceImages = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=85",
]

export function getMockServiceImage(serviceId) {
  const numericId = Number(serviceId)
  const index = Number.isInteger(numericId) && numericId > 0
    ? (numericId - 1) % mockServiceImages.length
    : 0

  return mockServiceImages[index]
}

export function getServiceImage(service) {
  return service?.photoUrl || getMockServiceImage(service?.idNailService)
}
