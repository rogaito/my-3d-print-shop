// =====================================================
// מוצרים אמיתיים בלבד — מבוססי תמונות שסופקו בפועל.
// =====================================================
const PRODUCTS = [
  {
    id: "home-tray-set",
    name: "סט מגש בעיצוב לבית",
    category: "דקורציה",
    description: "סט דקורטיבי לבית הכולל מגש ופריטי עיצוב במראה מודרני.",
    priceValue: 110,
    colors: ["שחור", "לבן", "ורוד כהה", "שמנת", "זית"],
    image: "images/home-tray-set-black.jpg",
    images: {"שחור":"images/home-tray-set-black.jpg","לבן":"images/home-tray-set-white.jpg","ורוד כהה":"images/home-tray-set-pink-dark.jpg","שמנת":"images/home-tray-set-cream-hq.svg","זית":"images/home-tray-set-olive.jpg"}
  },
  {
    id: "ribbed-planter",
    name: "עציץ מעוצב",
    category: "דקורציה",
    description: "עציץ מודפס בתלת־ממד עם טקסטורה אנכית בעיצוב נקי לבית.",
    priceValue: 50,
    colors: ["שחור", "לבן", "ורוד כהה", "שמנת", "זית"],
    image: "images/ribbed-planter-black.jpg",
    images: {"שחור":"images/ribbed-planter-black.jpg","לבן":"images/ribbed-planter-white-hq.svg","ורוד כהה":"images/ribbed-planter-pink-dark.jpg","שמנת":"images/ribbed-planter-cream.jpg","זית":"images/ribbed-planter-olive.jpg"}
  },
  {
    id: "spiral-cone",
    name: "קונוס ספירלה",
    category: "דקורציה",
    description: "קונוס ספירלה מודפס בתלת־ממד בעיצוב דקורטיבי.",
    priceValue: 15,
    colors: ["לבן", "שחור", "צהוב", "קשת"],
    image: "images/spiral-cone-white.jpg",
    images: {
      "לבן":"images/spiral-cone-white.jpg",
      "שחור":"images/spiral-cone-black-hq.svg",
      "צהוב":"images/spiral-cone-yellow-hq.svg",
      "קשת":"images/spiral-cone-rainbow-hq.svg"
    }
  },
  {
    id: "cool-desk-animal",
    name: "חיית שולחן מגניבה",
    category: "דקורציה",
    description: "חיית שולחן דקורטיבית מודפסת בתלת־ממד.",
    priceValue: 45,
    colors: [],
    image: "images/cool-desk-animal.jpg",
    images: {}
  },
  {
    id: "boys-surprise-egg",
    name: "ביצת הפתעה עם משחק מגניב בתוכה",
    category: "ילדים",
    description: "ביצת הפתעה מודפסת בתלת־ממד עם משחק מגניב בתוכה, כיפית לפתיחה ולמשחק.",
    priceValue: 20,
    colors: [],
    image: "images/boys-surprise-egg.jpg",
    images: {}
  }
];
