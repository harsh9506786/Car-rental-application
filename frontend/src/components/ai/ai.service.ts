const API = process.env.NEXT_PUBLIC_API_URL;

export const askAI = async (message: string) => {
  const response = await fetch(`${API}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  return data.reply;
};