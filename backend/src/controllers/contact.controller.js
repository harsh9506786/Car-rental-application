export const sendContact = async (req, res) => {
  try {
    const { name, email, phone, carType, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Missing Fields",
        message: "Please fill all required fields.",
      });
    }

    const whatsappNumber = "7225037332"; 

    const whatsappMessage = `
*New Contact Request*

Name: ${name}

Email: ${email}

Phone: ${phone}

Car: ${carType}

Message: ${message}
`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return res.json({
      success: true,
      type: "success",
      title: "Message Ready",
      message: "Opening WhatsApp...",
      whatsappUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Something went wrong",
      message: error.message,
    });
  }
};