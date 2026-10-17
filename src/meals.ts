export type Meal = {
  id: number; name: string; restaurant: string; cuisine: string; tags: string[]; dietary: string[];
  allergens: string[]; price: number; distance: number; eta: string; fee: number; image: string; color: string;
};

const images = {
  bowl: "https://images.unsplash.com/photo-1597958792579-bd3517df6399?auto=format&fit=crop&w=900&q=85",
  bento: "https://images.unsplash.com/photo-1594955332421-2033cfd867b4?auto=format&fit=crop&w=900&q=85",
  noodles: "https://images.unsplash.com/photo-1713047203705-44dd7d762d0c?auto=format&fit=crop&w=900&q=85",
  padthai: "https://images.unsplash.com/photo-1746973645769-c11eb0a81025?auto=format&fit=crop&w=900&q=85",
  veggie: "https://images.unsplash.com/photo-1556040220-4096d522378d?auto=format&fit=crop&w=900&q=85",
};

// Fits every diet option in the app (vegan, halal, no pork/beef, pescatarian).
const allDiets = ["Halal", "Vegetarian", "Vegan", "No pork", "No beef", "Pescatarian"];

export const meals: Meal[] = [
  { id: 1, name: "Grilled Chicken Rice Bowl", restaurant: "Green Bowl Kitchen", cuisine: "Healthy Asian", tags: ["Rice", "Healthy", "High protein"], dietary: ["Halal", "No pork"], allergens: ["Soy", "Sesame"], price: 12.9, distance: 1.8, eta: "20–30 min", fee: 4.5, image: images.bowl, color: "#E7F8ED" },
  { id: 2, name: "Heritage Nasi Lemak", restaurant: "Nasi Corner", cuisine: "Local favourites", tags: ["Rice", "Local favourites"], dietary: ["Halal", "No pork", "No beef"], allergens: ["Eggs", "Peanuts", "Fish"], price: 10.8, distance: 2.4, eta: "25–35 min", fee: 3.6, image: images.bento, color: "#FFF2DE" },
  { id: 3, name: "Plant-based Bibimbap", restaurant: "Seoul Bento", cuisine: "Korean", tags: ["Rice", "Korean", "Healthy"], dietary: ["Vegetarian", "Vegan", "No pork", "No beef"], allergens: ["Soy", "Sesame"], price: 14.5, distance: 2.9, eta: "25–35 min", fee: 4.2, image: images.bento, color: "#FBEDE9" },
  { id: 4, name: "Garden Protein Bowl", restaurant: "Plant Plate", cuisine: "Modern vegetarian", tags: ["Healthy", "High protein", "Western"], dietary: allDiets, allergens: [], price: 13.9, distance: 1.5, eta: "15–25 min", fee: 3.2, image: images.veggie, color: "#EAF8E7" },
  { id: 5, name: "Chicken Aglio Olio", restaurant: "Pasta Works", cuisine: "Western", tags: ["Noodles", "Western", "High protein"], dietary: ["No pork", "No beef"], allergens: ["Wheat / gluten", "Milk / dairy"], price: 16.9, distance: 3.6, eta: "30–40 min", fee: 4.8, image: images.noodles, color: "#F9EEE4" },
  { id: 6, name: "Teriyaki Tofu Don", restaurant: "Japanese Bento Co.", cuisine: "Japanese", tags: ["Rice", "Japanese", "Vegetarian"], dietary: ["Vegetarian", "No pork", "No beef"], allergens: ["Soy"], price: 11.9, distance: 2.1, eta: "20–30 min", fee: 3.9, image: images.bowl, color: "#F1EFE7" },
  { id: 7, name: "Lime Chicken Rice Noodles", restaurant: "Green Bowl Kitchen", cuisine: "Southeast Asian", tags: ["Noodles", "Healthy", "High protein"], dietary: ["Halal", "No pork", "No beef"], allergens: [], price: 13.5, distance: 1.8, eta: "20–30 min", fee: 4.5, image: images.padthai, color: "#EAF7E8" },
  { id: 8, name: "Vegetable Brown Rice Bento", restaurant: "Plant Plate", cuisine: "Healthy", tags: ["Rice", "Healthy"], dietary: allDiets, allergens: ["Soy"], price: 9.9, distance: 1.5, eta: "15–25 min", fee: 3.2, image: images.veggie, color: "#EAF8E7" },
  { id: 9, name: "Hainanese Chicken Rice", restaurant: "Uncle Lim's Chicken Rice", cuisine: "Local favourites", tags: ["Rice", "Local favourites", "Chinese"], dietary: ["No pork", "No beef"], allergens: ["Soy", "Sesame"], price: 6.5, distance: 1.2, eta: "15–25 min", fee: 2.9, image: images.bowl, color: "#FFF2DE" },

  // Safety-net meals: free of every listed allergen, fit every diet, under S$10 and within 1 km,
  // with at least one per cuisine so no combination of restrictions comes back empty.
  { id: 10, name: "Vegetable Economy Rice", restaurant: "Hawker Stall #12", cuisine: "Local favourites", tags: ["Rice", "Local favourites"], dietary: allDiets, allergens: [], price: 4.8, distance: 0.6, eta: "10–20 min", fee: 2.5, image: images.bento, color: "#FFF2DE" },
  { id: 11, name: "Garlic Greens Rice Vermicelli", restaurant: "Golden Wok", cuisine: "Chinese", tags: ["Noodles", "Chinese"], dietary: allDiets, allergens: [], price: 6.5, distance: 0.9, eta: "15–20 min", fee: 2.8, image: images.noodles, color: "#F9EEE4" },
  { id: 12, name: "Roast Vegetable & Potato Plate", restaurant: "The Daily Plate", cuisine: "Western", tags: ["Western", "Healthy"], dietary: allDiets, allergens: [], price: 8.9, distance: 0.8, eta: "15–20 min", fee: 2.8, image: images.veggie, color: "#EAF8E7" },
  { id: 13, name: "Pumpkin Japanese Curry Rice", restaurant: "Kare Kare", cuisine: "Japanese", tags: ["Japanese", "Rice"], dietary: allDiets, allergens: [], price: 8.5, distance: 0.9, eta: "15–20 min", fee: 2.8, image: images.bowl, color: "#F1EFE7" },
  { id: 14, name: "Namul Veggie Rice Bowl", restaurant: "Seoul Bento", cuisine: "Korean", tags: ["Korean", "Rice", "Healthy"], dietary: allDiets, allergens: [], price: 8.8, distance: 1.0, eta: "15–25 min", fee: 2.9, image: images.bento, color: "#FBEDE9" },
  { id: 15, name: "Garlic Kailan with Rice", restaurant: "Golden Wok", cuisine: "Chinese", tags: ["Chinese", "Rice", "Healthy"], dietary: allDiets, allergens: [], price: 5.8, distance: 0.7, eta: "10–20 min", fee: 2.5, image: images.veggie, color: "#E7F8ED" },
  { id: 16, name: "Chana Masala with Basmati Rice", restaurant: "Spice Route", cuisine: "Indian", tags: ["Indian", "Rice", "High protein"], dietary: allDiets, allergens: [], price: 7.9, distance: 0.8, eta: "15–20 min", fee: 2.8, image: images.bowl, color: "#FFF0DE" },
  { id: 17, name: "Lentil & Chickpea Power Bowl", restaurant: "Plant Plate", cuisine: "Healthy", tags: ["Healthy", "High protein", "Western"], dietary: allDiets, allergens: [], price: 9.5, distance: 0.9, eta: "15–20 min", fee: 2.8, image: images.veggie, color: "#EAF8E7" },

  // More variety for people with fewer restrictions.
  { id: 18, name: "Sliced Fish Bee Hoon Soup", restaurant: "Ah Hock Fish Soup", cuisine: "Local favourites", tags: ["Noodles", "Local favourites", "Healthy", "High protein"], dietary: ["Halal", "No pork", "No beef", "Pescatarian"], allergens: ["Fish"], price: 7.5, distance: 1.4, eta: "15–25 min", fee: 3.0, image: images.noodles, color: "#EAF7E8" },
  { id: 19, name: "Beef Rendang Rice", restaurant: "Nasi Corner", cuisine: "Local favourites", tags: ["Rice", "Local favourites", "High protein"], dietary: ["Halal", "No pork"], allergens: [], price: 11.9, distance: 2.4, eta: "25–35 min", fee: 3.6, image: images.bento, color: "#FFF2DE" },
  { id: 20, name: "Salmon Teriyaki Don", restaurant: "Japanese Bento Co.", cuisine: "Japanese", tags: ["Japanese", "Rice", "High protein"], dietary: ["No pork", "No beef", "Pescatarian"], allergens: ["Fish", "Soy", "Wheat / gluten", "Sesame"], price: 15.9, distance: 2.1, eta: "20–30 min", fee: 3.9, image: images.bowl, color: "#F1EFE7" },
  { id: 21, name: "Prawn Aglio Olio", restaurant: "Pasta Works", cuisine: "Western", tags: ["Western", "Noodles"], dietary: ["No pork", "No beef", "Pescatarian"], allergens: ["Shellfish", "Crustaceans", "Wheat / gluten"], price: 17.5, distance: 2.8, eta: "25–35 min", fee: 4.5, image: images.noodles, color: "#F9EEE4" },
  { id: 22, name: "Kimchi Fried Rice with Egg", restaurant: "Seoul Bento", cuisine: "Korean", tags: ["Korean", "Rice"], dietary: ["No pork", "No beef", "Pescatarian"], allergens: ["Eggs", "Soy", "Sesame", "Fish", "Crustaceans"], price: 10.9, distance: 2.0, eta: "20–30 min", fee: 3.8, image: images.bento, color: "#FBEDE9" },
  { id: 23, name: "Butter Chicken with Naan", restaurant: "Spice Route", cuisine: "Indian", tags: ["Indian", "High protein"], dietary: ["Halal", "No pork", "No beef"], allergens: ["Milk / dairy", "Wheat / gluten", "Tree nuts"], price: 13.5, distance: 2.3, eta: "20–30 min", fee: 3.8, image: images.bowl, color: "#FFF0DE" },
  { id: 24, name: "Char Kway Teow", restaurant: "Hawker Stall #12", cuisine: "Local favourites", tags: ["Local favourites", "Noodles", "Chinese"], dietary: [], allergens: ["Eggs", "Soy", "Wheat / gluten", "Shellfish", "Crustaceans"], price: 7.0, distance: 1.6, eta: "15–25 min", fee: 3.0, image: images.padthai, color: "#FFF2DE" },
  { id: 25, name: "Chicken Katsu Curry", restaurant: "Kare Kare", cuisine: "Japanese", tags: ["Japanese", "Rice"], dietary: ["No pork", "No beef"], allergens: ["Eggs", "Wheat / gluten", "Milk / dairy"], price: 13.9, distance: 2.7, eta: "25–35 min", fee: 4.2, image: images.bowl, color: "#F1EFE7" },
  { id: 26, name: "Beef Bulgogi Rice Bowl", restaurant: "Seoul Bento", cuisine: "Korean", tags: ["Korean", "Rice", "High protein"], dietary: ["No pork"], allergens: ["Soy", "Sesame", "Wheat / gluten"], price: 15.5, distance: 3.4, eta: "30–40 min", fee: 4.8, image: images.bento, color: "#FBEDE9" },
  { id: 27, name: "Wonton Noodles", restaurant: "Golden Wok", cuisine: "Chinese", tags: ["Chinese", "Noodles", "Local favourites"], dietary: [], allergens: ["Eggs", "Wheat / gluten", "Soy", "Crustaceans", "Shellfish"], price: 6.8, distance: 1.1, eta: "15–25 min", fee: 2.9, image: images.noodles, color: "#F9EEE4" },
  { id: 28, name: "Grilled Chicken Caesar Salad", restaurant: "The Daily Plate", cuisine: "Western", tags: ["Western", "Healthy", "High protein"], dietary: ["No pork", "No beef"], allergens: ["Eggs", "Milk / dairy", "Fish", "Wheat / gluten"], price: 14.9, distance: 1.9, eta: "20–30 min", fee: 3.6, image: images.veggie, color: "#EAF8E7" },
  { id: 29, name: "Paneer Tikka Wrap", restaurant: "Spice Route", cuisine: "Indian", tags: ["Indian", "Healthy"], dietary: ["Halal", "Vegetarian", "No pork", "No beef"], allergens: ["Milk / dairy", "Wheat / gluten"], price: 9.8, distance: 1.7, eta: "20–25 min", fee: 3.2, image: images.veggie, color: "#FFF0DE" },
];
