import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Car from "../models/Car.js";

dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askGemini = async (userMessage) => {
  // 1. User ke message se filters extract karo (Gemini se)
  const aiFilters = await getFiltersFromAI(userMessage);

  // 2. Strict MongoDB query banao
  const query = buildStrictQuery(aiFilters);

  let cars = await Car.find(query).limit(8); // sirf top 8 relevant cars bhejo
  let isFallback = false;

  // 3. Agar exact match nahi mila, to nearest/closest match dhundo
  if (cars.length === 0) {
    isFallback = true;
    const allCars = await Car.find({});
    cars = getNearestMatches(allCars, aiFilters);
  }

  // 4. Clean data banao (Gemini ko sirf zaroori fields bhejo, description hataya - tokens bachane ke liye)
  const carData = cars.map((car) => ({
    name: car.name,
    brand: car.brand,
    category: car.category,
    color: car.color,
    price: car.price,
    seats: car.seats,
    fuel: car.fuel,
    transmission: car.transmission,
    year: car.year,
    rating: car.rating,
    mileage: car.mileage,
    features: car.features,
    tags: car.tags,
  }));

  // 5. Prompt banao
  const prompt = `
You are KarZone AI. Keep responses concise (2-4 sentences per car, no long paragraphs).

Rules:

1. Recommend ONLY cars from the "Available Cars" list below.
2. Never invent a car that isn't listed.
3. Mention the price per day.
4. Briefly explain why each recommended car suits the user's request.
${
  isFallback
    ? `5. IMPORTANT: No exact match was found for the user's request. Politely mention that, then present these as the closest available alternatives, briefly noting which part(s) of the request they don't fully satisfy (e.g. different color, slightly higher price, fewer seats, etc).`
    : `5. If the "Available Cars" list is empty, politely say no cars are available right now.`
}

Available Cars:

${JSON.stringify(carData, null, 2)}

User:

${userMessage}
`;

  // 6. Ab Gemini ko call karo (final answer generate karne ke liye)
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      maxOutputTokens: 350,
    },
  });

  // 7. Reply return karo
  return response.text;
};

// Strict MongoDB query banata hai extracted filters se
const buildStrictQuery = (f) => {
  const query = {};

  if (f.brand) query.brand = { $regex: f.brand, $options: "i" };
  if (f.category) query.category = { $regex: f.category, $options: "i" };
  if (f.color) query.color = { $regex: f.color, $options: "i" };
  if (f.fuel) query.fuel = { $regex: f.fuel, $options: "i" };
  if (f.transmission)
    query.transmission = { $regex: f.transmission, $options: "i" };

  if (f.minPrice || f.maxPrice) {
    query.price = {};
    if (f.minPrice) query.price.$gte = f.minPrice;
    if (f.maxPrice) query.price.$lte = f.maxPrice;
  }

  if (f.minSeats) query.seats = { $gte: f.minSeats };

  if (f.minYear || f.maxYear) {
    query.year = {};
    if (f.minYear) query.year.$gte = f.minYear;
    if (f.maxYear) query.year.$lte = f.maxYear;
  }

  if (f.minRating) query.rating = { $gte: f.minRating };

  if (f.tag || f.keyword) {
    const searchTerm = f.tag || f.keyword;
    query.$or = [
      { tags: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { features: { $regex: searchTerm, $options: "i" } },
    ];
  }

  return query;
};

// Har car ko score karta hai (kitne filters match hue) aur top matches return karta hai
const getNearestMatches = (allCars, f) => {
  const scored = allCars.map((car) => {
    let score = 0;

    if (f.brand && car.brand?.toLowerCase().includes(f.brand.toLowerCase()))
      score += 2;
    if (
      f.category &&
      car.category?.toLowerCase().includes(f.category.toLowerCase())
    )
      score += 2;
    if (f.color && car.color?.toLowerCase().includes(f.color.toLowerCase()))
      score += 1;
    if (f.fuel && car.fuel?.toLowerCase() === f.fuel.toLowerCase())
      score += 1;
    if (
      f.transmission &&
      car.transmission?.toLowerCase() === f.transmission.toLowerCase()
    )
      score += 1;

    if (f.minSeats && car.seats >= f.minSeats) score += 2;
    if (f.minSeats && car.seats < f.minSeats)
      score -= (f.minSeats - car.seats) * 0.5; // kam seats wali cars ko penalty

    if (f.maxPrice) {
      if (car.price <= f.maxPrice) score += 2;
      else score -= (car.price - f.maxPrice) / 1000; // jitna zyada price se bahar, utni penalty
    }

    if (f.minPrice && car.price >= f.minPrice) score += 1;

    if (f.minYear && car.year >= f.minYear) score += 1;
    if (f.minRating && car.rating >= f.minRating) score += 1;

    const searchTerm = f.tag || f.keyword;
    if (searchTerm) {
      const haystack = `${car.name} ${car.category} ${car.description} ${car.tags?.join(
        " "
      )} ${car.features?.join(" ")}`.toLowerCase();
      if (haystack.includes(searchTerm.toLowerCase())) score += 1;
    }

    return { car, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.car);
};

// User ke message se filters extract karta hai (Gemini se)
const getFiltersFromAI = async (message) => {
  const prompt = `
Extract search filters from the user query about cars.

Return ONLY valid JSON, no markdown, no explanation.

Schema:

{
  "brand": "",
  "category": "",
  "color": "",
  "fuel": "",
  "transmission": "",
  "minPrice": null,
  "maxPrice": null,
  "minSeats": null,
  "minYear": null,
  "maxYear": null,
  "minRating": null,
  "tag": "",
  "keyword": ""
}

Field notes:
- "brand": car manufacturer (e.g. Audi, BMW, Toyota, Mahindra). Never put this in "category".
- "category": car type (e.g. SUV, Sedan, Hatchback, Luxury, Convertible).
- "color": exterior color mentioned by user.
- "fuel": e.g. Petrol, Diesel, Electric, Hybrid.
- "transmission": Automatic or Manual.
- "minPrice"/"maxPrice": price per day range, if user mentions budget.
- "minSeats": if user mentions seating capacity (e.g. "7 seater" -> minSeats: 7).
- "minYear"/"maxYear": if user mentions a model year or "latest"/"new" (recent years).
- "minRating": if user wants highly rated cars (e.g. "best rated" -> minRating: 4.5).
- "tag": any specific feature/vibe keyword (e.g. "sporty", "family", "off-road", "wedding").
- "keyword": any other specific search term (e.g. a car name) not covered above.
- Leave fields empty ("" or null) if not mentioned. Do not guess values that weren't stated.

User Query:
${message}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 200,
      },
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.log("AI Filter Error:", error.message);

    return {
      brand: "",
      category: "",
      color: "",
      fuel: "",
      transmission: "",
      minPrice: null,
      maxPrice: null,
      minSeats: null,
      minYear: null,
      maxYear: null,
      minRating: null,
      tag: "",
      keyword: "",
    };
  }
};