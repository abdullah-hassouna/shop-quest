"use server"

export async function fetchUsers() {
  console.log("Fetching users...")
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Users fetched!")
  return { success: true, message: "Users fetched successfully!" }
}

export async function submitAnnouncement(formData: { title: string; body: string; publishDate?: Date }) {
  console.log("Submitting announcement:", formData)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, message: "Announcement submitted!" }
}

export async function sendChatMessage(message: string) {
  console.log("Sending chat message:", message)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const aiResponse = `This is a simulated AI response to: "${message}". In a real application, this would come from an AI model.`
  return { success: true, response: aiResponse }
}
