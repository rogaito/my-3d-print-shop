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
    image: "images/home-tray-set-black.jpg?v=tray-photos-20261121",
    images: {"שחור":"images/home-tray-set-black.jpg?v=tray-photos-20261121","לבן":"images/home-tray-set-white.jpg?v=tray-photos-20261121","ורוד כהה":"images/home-tray-set-pink-dark.jpg?v=tray-photos-20261121","שמנת":"images/home-tray-set-cream.jpg?v=cream-photo-20261121","זית":"images/home-tray-set-olive.jpg?v=tray-photos-20261121"}
  },
  {
    id: "ribbed-planter",
    name: "עציץ מעוצב",
    category: "דקורציה",
    description: "עציץ מודפס בתלת־ממד עם טקסטורה אנכית בעיצוב נקי לבית.",
    priceValue: 50,
    colors: ["שחור", "לבן", "ורוד כהה", "שמנת", "זית"],
    image: "images/ribbed-planter-black.jpg",
    images: {"שחור":"images/ribbed-planter-black.jpg","לבן":"images/ribbed-planter-white.jpg?v=white-planter-photo-20261121","ורוד כהה":"images/ribbed-planter-pink-dark.jpg","שמנת":"images/ribbed-planter-cream.jpg","זית":"images/ribbed-planter-olive.jpg"}
  },
  {
    id: "spiral-cone",
    name: "קונוס ספירלה",
    category: "דקורציה",
    description: "קונוס ספירלה מודפס בתלת־ממד בעיצוב דקורטיבי.",
    priceValue: 15,
    colors: ["לבן", "שחור", "צהוב", "קשת"],
    image: "images/spiral-cone-white.jpg?v=cone-originals-20261121",
    images: {
      "לבן":"images/spiral-cone-white.jpg?v=cone-originals-20261121",
      "שחור":"images/spiral-cone-black.jpg?v=cone-originals-20261121",
      "צהוב":"images/spiral-cone-yellow.jpg?v=cone-originals-20261121",
      "קשת":"images/spiral-cone-rainbow.jpg?v=cone-originals-20261121"
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
    image: "images/boys-surprise-egg.jpg?v=egg-photo-20261121",
    images: {}
  }
];
