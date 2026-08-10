import twilio from "twilio";

// Twilio's WhatsApp Sandbox is used here instead of plain SMS because
// sending transactional SMS to Indian numbers legally requires DLT
// (Distributed Ledger Technology) template registration with an Indian
// telecom operator - a slow, business-registration-heavy process that
// isn't practical for a student/portfolio project. WhatsApp works
// instantly via the Twilio Sandbox for testing and demos.
//
// To receive messages, the recipient's number must first join the
// sandbox by sending the given join code to the Twilio sandbox number
// on WhatsApp (one-time step, shown in Twilio Console -> Messaging ->
// Try WhatsApp).

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

export const sendBookingConfirmation = async ({
  phone,
  carName,
  pickupDate,
  returnDate,
  totalPrice,
}) => {
  if (!client) {
    console.log(
      "[whatsapp] Twilio not configured, skipping message send.",
    );
    return;
  }

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const pickup = new Date(pickupDate).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    const ret = new Date(returnDate).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedPhone}`,
      body:
        `🚗 *Your car is booked!*\n\n` +
        `Car: ${carName}\n` +
        `Pickup: ${pickup}\n` +
        `Return: ${ret}\n` +
        `Total: ₹${totalPrice}\n\n` +
        `We'll notify you once it's confirmed by our team.`,
    });
  } catch (error) {
    // Never let a notification failure break the booking flow
    console.log("[whatsapp] Failed to send message:", error.message);
  }
};

export const sendBookingConfirmed = async ({
  phone,
  carName,
  pickupDate,
}) => {
  if (!client) return;

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const pickup = new Date(pickupDate).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedPhone}`,
      body:
        `✅ *Booking Confirmed!*\n\n` +
        `Your ${carName} booking is confirmed for pickup on ${pickup}. ` +
        `Please complete the payment from your dashboard to finalize it.`,
    });
  } catch (error) {
    console.log("[whatsapp] Failed to send message:", error.message);
  }
};