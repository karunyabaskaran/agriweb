/**
 * AGRIWEB — Main Single Page Application Controller
 * Simple, Clean, Role-Based Design with Full Multi-Language Localization
 */

// Toast notifications
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.innerHTML = `
    <span>${type === "error" ? "✖" : "✔"}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Comprehensive Multi-Language Dictionaries (5 Languages)
const translations = {
  en: {
    navMarketplace: "🛒 Marketplace",
    navMyProducts: "📦 My Listed Products",
    navMyOrders: "📋 Direct Orders",
    navPriceRadar: "📊 Price Radar",
    btnPostProduce: "➕ Post Product Lot",
    btnSignIn: "Sign In / Register",
    quickDemo: "⚡ Quick Test Accounts (Password: password123)",
    authTitle: "Sign In to AGRIWEB",
    authDesc: "Choose your role, enter your mobile and password to continue.",
    roleFarmer: "Farmer / Grower",
    roleConsumer: "Direct Buyer",
    roleAdmin: "Admin",
    lblName: "Your Full Name / Business Name",
    lblVillage: "Village / Location Hub",
    lblState: "State",
    lblPhone: "Phone Number (10 Digits)",
    lblPassword: "Password",
    authToggleText: "Don't have an account?",
    authToggleLink: "Register Now",
    marketTitle: "🛒 Agricultural Products Marketplace",
    marketSubtitle: "Buy fresh agricultural products directly from verified farmers with transparent prices.",
    searchPlaceholder: "Search products (e.g. Tomato, Potato)...",
    optAllCommodities: "All Products",
    optAllGrades: "All Grades",
    optGradeA: "Grade A (Premium)",
    optGradeB: "Grade B (Standard)",
    optGradeC: "Grade C (Processing)",
    optAllStates: "All States",
    optSortDefault: "Sort By: Featured",
    optPriceAsc: "Price: Low to High",
    optPriceDesc: "Price: High to Low",
    optRatingDesc: "Rating: High to Low",
    optQtyDesc: "Quantity: High to Low",
    myProductsTitle: "📦 My Listed Products",
    myProductsDesc: "Manage your farm products. Add new items or remove listings easily.",
    thCommodity: "Product Name",
    lblVariety: "Variety",
    lblGrade: "Grade",
    lblQuantity: "Available Quantity (kg)",
    lblAskingPrice: "Direct Price (₹/kg)",
    thRegion: "Location",
    thAction: "Action",
    ordersTitle: "📋 Direct Orders & Escrow Ledger",
    ordersSubtitle: "Track delivery milestones, verify quality, and view payment security status.",
    thOrderId: "Order ID",
    thOrderProduce: "Product Details",
    thOrderFarmer: "Farmer",
    thOrderBuyer: "Buyer",
    thOrderQty: "Quantity",
    thOrderTotal: "Total Price (₹)",
    thOrderEscrow: "Payment Status & Timeline",
    thOrderAction: "Action",
    pricesTitle: "📊 Price Radar",
    pricesSubtitle: "Real-time comparison: Mandi Wholesale vs AGRIWEB Direct Farmer vs Urban Retail Prices",
    thMandi: "Mandi Wholesale Rate",
    thDirect: "AGRIWEB Direct Ask",
    thRetail: "Urban Retail Rate",
    thSpread: "Market Spread",
    thUplift: "Farmer Benefit",
    orderModalTitle: "Direct Farm Purchase",
    lblDirectAsk: "Direct Asking Price:",
    lblAvailQty: "Available Quantity:",
    lblOrderQty: "Order Quantity (kg)",
    lblPaymentMode: "Payment & Escrow Protection",
    lblProduceCost: "Product Cost:",
    lblFreightCost: "Direct Freight Estimate (~6%):",
    lblGrandTotal: "Grand Total:",
    lblEscrowSecurity: "🔒 100% Escrow Protected: Funds are locked in safe escrow and only released to the farmer after you verify product arrival.",
    btnAuthorizeEscrow: "💳 Authorize Escrow & Place Direct Order",
    modalPostProduce: "Post Product to Marketplace",
    btnPublishProduce: "🌱 Publish Listing Directly",
    modalRateTitle: "Confirm Quality & Rate Farmer",
    lblConfirmedGrade: "Confirmed Delivery Quality Grade",
    lblTrustScore: "Farmer Trust Rating (1 to 5 Stars)",
    btnSubmitRating: "⭐ Submit Rating & Update Trust Score",
    outOfStockTitle: "Out of stock at the moment",
    outOfStockDesc: "This product is currently not available in the market. Please check back soon or clear filters.",
    btnBuyDirect: "⚡ Buy Directly (Escrow)",
    btnShareWhatsapp: "📱 Share",
    btnAllDetails: "🔍 All Details",
    modalDetailsTitle: "Product Specifications & Price Transparency",
    lblShelfLife: "Freshness / Shelf Life",
    lblStorageCondition: "Storage Condition",
    lblLotValue: "Total Lot Value",
    lblMandiBenchmark: "APMC Mandi Benchmark",
    lblRetailBenchmark: "Urban Retail Benchmark",
    lblFarmerUpliftGain: "Farmer Direct Uplift",
    lblSavingsVsMiddleman: "Middleman Margin Bypassed",
    dashActiveListings: "Active Products Listed",
    dashTotalStock: "Total Stock (kg)",
    dashTrustRating: "Trust Rating",
    dashOrdersPlaced: "Direct Orders",
    dashCompleted: "Delivered",
    dashSpent: "Total Volume (₹)",
    stepPlaced: "1. Placed",
    stepDispatched: "2. Dispatched",
    stepDelivered: "3. Delivered"
  },
  hi: {
    navMarketplace: "🛒 उत्पाद बाज़ार",
    navMyProducts: "📦 मेरे सूचीबद्ध उत्पाद",
    navMyOrders: "📋 प्रत्यक्ष ऑर्डर",
    navPriceRadar: "📊 मूल्य रडार",
    btnPostProduce: "➕ उत्पाद बेचने के लिए जोड़ें",
    btnSignIn: "लॉगिन / पंजीकरण",
    quickDemo: "⚡ त्वरित परीक्षण खाते (पासवर्ड: password123)",
    authTitle: "एग्रीवेब (AGRIWEB) लॉगिन",
    authDesc: "अपनी भूमिका चुनें, मोबाइल नंबर और पासवर्ड दर्ज करें।",
    roleFarmer: "किसान (उत्पादक)",
    roleConsumer: "प्रत्यक्ष खरीदार",
    roleAdmin: "व्यवस्थापक (Admin)",
    lblName: "आपका पूरा नाम / दुकान का नाम",
    lblVillage: "गाँव / शहर केंद्र",
    lblState: "राज्य",
    lblPhone: "मोबाइल नंबर (10 अंक)",
    lblPassword: "पासवर्ड",
    authToggleText: "नया खाता बनाना है?",
    authToggleLink: "यहाँ पंजीकरण करें",
    marketTitle: "🛒 कृषि उत्पाद बाज़ार (Marketplace)",
    marketSubtitle: "सत्यापित किसानों से सीधे ताजे कृषि उत्पाद पारदर्शी दामों पर खरीदें।",
    searchPlaceholder: "उत्पाद खोजें (जैसे टमाटर, प्याज, आलू)...",
    optAllCommodities: "सभी उत्पाद",
    optAllGrades: "सभी श्रेणियां (Grades)",
    optGradeA: "ग्रेड A (प्रीमियम)",
    optGradeB: "ग्रेड B (मानक)",
    optGradeC: "ग्रेड C (प्रसंस्करण)",
    optAllStates: "सभी राज्य",
    optSortDefault: "क्रमबद्ध करें: विशेष",
    optPriceAsc: "कीमत: कम से अधिक",
    optPriceDesc: "कीमत: अधिक से कम",
    optRatingDesc: "रेटिंग: उच्च से कम",
    optQtyDesc: "मात्रा: अधिक से कम",
    myProductsTitle: "📦 बेचने के लिए मेरे उत्पाद",
    myProductsDesc: "अपने कृषि उत्पादों का प्रबंधन करें। नए उत्पाद जोड़ें या बेचे गए उत्पादों को हटाएं।",
    thCommodity: "उत्पाद का नाम",
    lblVariety: "किस्म (वैरायटी)",
    lblGrade: "श्रेणी (Grade)",
    lblQuantity: "उपलब्ध मात्रा (किलो)",
    lblAskingPrice: "सीधी कीमत (₹/किलो)",
    thRegion: "स्थान",
    thAction: "कार्रवाई",
    ordersTitle: "📋 प्रत्यक्ष ऑर्डर और एस्क्रो विवरण",
    ordersSubtitle: "डिलीवरी की पुष्टि करें, गुणवत्ता जांचें और भुगतान सुरक्षा देखें।",
    thOrderId: "ऑर्डर नंबर",
    thOrderProduce: "उत्पाद विवरण",
    thOrderFarmer: "किसान का नाम",
    thOrderBuyer: "खरीदार का नाम",
    thOrderQty: "मात्रा",
    thOrderTotal: "कुल कीमत (₹)",
    thOrderEscrow: "भुगतान स्थिति और समयरेखा",
    thOrderAction: "कार्रवाई",
    pricesTitle: "📊 मूल्य रडार (तुलना)",
    pricesSubtitle: "पारंपरिक मंडी और किसान के सीधे दामों की तुलना करें।",
    thMandi: "पारंपरिक मंडी भाव",
    thDirect: "एग्रीवेब किसान भाव",
    thRetail: "शहरी खुदरा भाव",
    thSpread: "बाजार अंतर",
    thUplift: "किसान लाभ",
    orderModalTitle: "सीधे किसान से उत्पाद खरीदें",
    lblDirectAsk: "किसान का भाव:",
    lblAvailQty: "उपलब्ध मात्रा:",
    lblOrderQty: "मात्रा जो आप खरीदना चाहते हैं (किलो)",
    lblPaymentMode: "भुगतान और एस्क्रो सुरक्षा",
    lblProduceCost: "उत्पाद लागत:",
    lblFreightCost: "भाड़ा लागत (~6%):",
    lblGrandTotal: "कुल राशि:",
    lblEscrowSecurity: "🔒 100% एस्क्रो सुरक्षित: आपका पैसा सुरक्षित है और उत्पाद प्राप्त होने पर ही किसान को जारी किया जाएगा।",
    btnAuthorizeEscrow: "💳 ऑर्डर की पुष्टि करें",
    modalPostProduce: "बाज़ार में उत्पाद जोड़ें",
    btnPublishProduce: "🌱 उत्पाद प्रकाशित करें",
    modalRateTitle: "गुणवत्ता की पुष्टि और रेटिंग",
    lblConfirmedGrade: "प्राप्त गुणवत्ता ग्रेड",
    lblTrustScore: "किसान ट्रस्ट रेटिंग (1 से 5 सितारे)",
    btnSubmitRating: "⭐ रेटिंग जमा करें",
    outOfStockTitle: "फिलहाल आउट ऑफ स्टॉक (Out of Stock)",
    outOfStockDesc: "यह उत्पाद वर्तमान में बाजार में उपलब्ध नहीं है। कृपया जल्द पुनः जांचें या फ़िल्टर साफ़ करें।",
    btnBuyDirect: "⚡ सीधे खरीदें (एस्क्रो)",
    btnShareWhatsapp: "📱 शेयर करें",
    btnAllDetails: "🔍 संपूर्ण विवरण (All Details)",
    modalDetailsTitle: "उत्पाद विवरण एवं मूल्य पारदर्शिता",
    lblShelfLife: "ताज़गी / शेल्फ लाइफ",
    lblStorageCondition: "भंडारण स्थिति",
    lblLotValue: "कुल उत्पाद मूल्य",
    lblMandiBenchmark: "मंडी थोक दर",
    lblRetailBenchmark: "शहरी खुदरा दर",
    lblFarmerUpliftGain: "किसान प्रत्यक्ष लाभ",
    lblSavingsVsMiddleman: "बिचौलिया कमीशन बचत",
    dashActiveListings: "सक्रिय सूचीबद्ध उत्पाद",
    dashTotalStock: "कुल स्टॉक (किलो)",
    dashTrustRating: "ट्रस्ट रेटिंग",
    dashOrdersPlaced: "प्रत्यक्ष ऑर्डर",
    dashCompleted: "सफलतापूर्वक वितरित",
    dashSpent: "कुल राशि (₹)",
    stepPlaced: "1. ऑर्डर हुआ",
    stepDispatched: "2. रवाना हुआ",
    stepDelivered: "3. प्राप्त हुआ"
  },
  mr: {
    navMarketplace: "🛒 उत्पाद बाजारपेठ",
    navMyProducts: "📦 माझी सूचीबद्ध उत्पादने",
    navMyOrders: "📋 थेट ऑर्डर्स",
    navPriceRadar: "📊 बाजार भाव रडार",
    btnPostProduce: "➕ विक्रीसाठी उत्पादन जोडा",
    btnSignIn: "लॉगिन / नोंदणी",
    quickDemo: "⚡ त्वरित चाचणी खाती (पासवर्ड: password123)",
    authTitle: "अ‍ॅग्रीवेब (AGRIWEB) लॉगिन",
    authDesc: "तुमची भूमिका निवडा, मोबाईल नंबर आणि पासवर्ड टाका.",
    roleFarmer: "शेतकरी (उत्पादक)",
    roleConsumer: "थेट खरेदीदार",
    roleAdmin: "प्रशासक (Admin)",
    lblName: "पूर्ण नाव / दुकानाचे नाव",
    lblVillage: "गाव / पत्ता केंद्र",
    lblState: "राज्य",
    lblPhone: "मोबाईल नंबर (10 अंक)",
    lblPassword: "पासवर्ड",
    authToggleText: "नवीन खाते उघडायचे आहे का?",
    authToggleLink: "येथे नोंदणी करा",
    marketTitle: "🛒 कृषी उत्पादने बाजारपेठ",
    marketSubtitle: "शेतकऱ्यांकडून थेट ताजी कृषी उत्पादने वाजवी दरात खरेदी करा.",
    searchPlaceholder: "उत्पादने शोधा (उदा. टोमॅटो, कांदा, बटाटा)...",
    optAllCommodities: "सर्व उत्पादने",
    optAllGrades: "सर्व श्रेणी (Grades)",
    optGradeA: "ग्रेड A (प्रीमियम)",
    optGradeB: "ग्रेड B (मानक)",
    optGradeC: "ग्रेड C (प्रक्रिया)",
    optAllStates: "सर्व राज्ये",
    optSortDefault: "क्रमवारी: वैशिष्ट्यीकृत",
    optPriceAsc: "किंमत: कमी ते जास्त",
    optPriceDesc: "किंमत: जास्त ते कमी",
    optRatingDesc: "रेटिंग: जास्त ते कमी",
    optQtyDesc: "प्रमाण: जास्त ते कमी",
    myProductsTitle: "📦 विक्रीसाठी माझी उत्पादने",
    myProductsDesc: "आपल्या कृषी उत्पादनांचे व्यवस्थापन करा. नवीन उत्पादन जोडा किंवा विकलेले उत्पादन काढा.",
    thCommodity: "उत्पादनाचे नाव",
    lblVariety: "जात (वैरायटी)",
    lblGrade: "प्रत (Grade)",
    lblQuantity: "उपलब्ध प्रमाण (किलो)",
    lblAskingPrice: "थेट दर (₹/किलो)",
    thRegion: "स्थान",
    thAction: "क्रिया",
    ordersTitle: "📋 थेट ऑर्डर्स आणि एस्क्रो नोंदवही",
    ordersSubtitle: "मालाची डिलिव्हरी आणि सुरक्षित पेमेंटची स्थिती तपासा.",
    thOrderId: "ऑर्डर नंबर",
    thOrderProduce: "उत्पादन तपशील",
    thOrderFarmer: "शेतकरी",
    thOrderBuyer: "खरेदीदार",
    thOrderQty: "प्रमाण",
    thOrderTotal: "एकूण रक्कम (₹)",
    thOrderEscrow: "पेमेंट स्थिती आणि वेळ",
    thOrderAction: "क्रिया",
    pricesTitle: "📊 बाजार भाव रडार",
    pricesSubtitle: "पारंपरिक मंडी आणि थेट शेतकरी दरांची तुलना करा.",
    thMandi: "मंडी घाऊक दर",
    thDirect: "थेट शेतकरी दर",
    thRetail: "किरकोळ भाव",
    thSpread: "बाजार फरक",
    thUplift: "शेतकरी नफा",
    orderModalTitle: "थेट शेतातून खरेदी",
    lblDirectAsk: "थेट शेतकरी दर:",
    lblAvailQty: "उपलब्ध प्रमाण:",
    lblOrderQty: "खरेदी करायचे प्रमाण (किलो)",
    lblPaymentMode: "पेमेंट आणि एस्क्रो सुरक्षा",
    lblProduceCost: "उत्पादन खर्च:",
    lblFreightCost: "वाहतूक खर्च (~6%):",
    lblGrandTotal: "एकूण देय रक्कम:",
    lblEscrowSecurity: "🔒 100% एस्क्रो सुरक्षित: तुमचे पैसे सुरक्षित आहेत आणि माल मिळाल्यावरच शेतकऱ्याला दिले जातात.",
    btnAuthorizeEscrow: "💳 ऑर्डर द्या",
    modalPostProduce: "बाजारपेठेत उत्पादन जोडा",
    btnPublishProduce: "🌱 उत्पादन प्रकाशित करा",
    modalRateTitle: "गुणवत्ता आणि रेटिंग",
    lblConfirmedGrade: "मिळालेली प्रत",
    lblTrustScore: "शेतकरी ट्रस्ट रेटिंग (1 ते 5 स्टार)",
    btnSubmitRating: "⭐ रेटिंग सबमिट करा",
    outOfStockTitle: "सध्या आउट ऑफ स्टॉक (Out of Stock)",
    outOfStockDesc: "हे उत्पादन सध्या उपलब्ध नाही. कृपया लवकरच पुन्हा तपासा किंवा शोध बदला.",
    btnBuyDirect: "⚡ थेट खरेदी करा (एस्क्रो)",
    btnShareWhatsapp: "📱 शेअर करा",
    btnAllDetails: "🔍 सर्व तपशील (All Details)",
    modalDetailsTitle: "उत्पाद तपशील आणि बाजार भाव",
    lblShelfLife: "ताजेपणा / टिकवण क्षमता",
    lblStorageCondition: "साठवणूक पद्धत",
    lblLotValue: "एकूण किंमत",
    lblMandiBenchmark: "मंडी घाऊक दर",
    lblRetailBenchmark: "किरकोळ बाजार भाव",
    lblFarmerUpliftGain: "शेतकरी थेट नफा",
    lblSavingsVsMiddleman: "मध्यस्थ कमिशन बचत",
    dashActiveListings: "सक्रिय उत्पादने",
    dashTotalStock: "एकूण साठा (किलो)",
    dashTrustRating: "विश्वासार्हता रेटिंग",
    dashOrdersPlaced: "थेट ऑर्डर्स",
    dashCompleted: "यशस्वी डिलिव्हरी",
    dashSpent: "एकूण रक्कम (₹)",
    stepPlaced: "1. ऑर्डर झाली",
    stepDispatched: "2. पाठवले",
    stepDelivered: "3. प्राप्त झाले"
  },
  ta: {
    navMarketplace: "🛒 விளைபொருள் சந்தை",
    navMyProducts: "📦 எனது தயாரிப்புகள்",
    navMyOrders: "📋 நேரடி ஆர்டர்கள்",
    navPriceRadar: "📊 விலை நிலவரம்",
    btnPostProduce: "➕ புதிய தயாரிப்பு சேர்க்க",
    btnSignIn: "உள்நுழைவு / பதிவு",
    quickDemo: "⚡ விரைவான சோதனை கணக்குகள் (கடவுச்சொல்: password123)",
    authTitle: "அக்ரிவெப் (AGRIWEB) உள்நுழைவு",
    authDesc: "உங்கள் பங்கைத் தேர்ந்தெடுத்து, மொபைல் எண் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
    roleFarmer: "விவசாயி (உற்பத்தியாளர்)",
    roleConsumer: "நேரடி வாங்குபவர்",
    roleAdmin: "நிர்வாகி",
    lblName: "முழு பெயர் / நிறுவன பெயர்",
    lblVillage: "கிராமம் / இருப்பிடம்",
    lblState: "மாநிலம்",
    lblPhone: "கைபேசி எண் (10 இலக்கங்கள்)",
    lblPassword: "கடவுச்சொல்",
    authToggleText: "புதிய கணக்கு வேண்டுமா?",
    authToggleLink: "இங்கே பதிவு செய்யவும்",
    marketTitle: "🛒 விவசாய விளைபொருட்கள் சந்தை",
    marketSubtitle: "விவசாயிகளிடமிருந்து நேரடியாக நியாயமான விலையில் விளைபொருட்களை வாங்குங்கள்.",
    searchPlaceholder: "தயாரிப்புகளைத் தேடுக (தக்காளி, வெங்காயம்)...",
    optAllCommodities: "அனைத்து பொருட்கள்",
    optAllGrades: "அனைத்து தரங்கள்",
    optGradeA: "தரம் A (பிரீமியம்)",
    optGradeB: "தரம் B (வழக்கமான)",
    optGradeC: "தரம் C (செயலாக்கம்)",
    optAllStates: "அனைத்து மாநிலங்கள்",
    optSortDefault: "வரிசைப்படுத்து: இயல்புநிலை",
    optPriceAsc: "விலை: குறைவிலிருந்து அதிகம்",
    optPriceDesc: "விலை: அதிகத்திலிருந்து குறைவு",
    optRatingDesc: "மதிப்பீடு: அதிகம் முதல் குறைவு",
    optQtyDesc: "அளவு: அதிகம் முதல் குறைவு",
    myProductsTitle: "📦 எனது தயாரிப்புகள்",
    myProductsDesc: "உங்கள் விவசாய விளைபொருட்களை நிர்வகிக்கவும். புதியதைச் சேர்க்கவும் அல்லது நீக்கவும்.",
    thCommodity: "பொருள் பெயர்",
    lblVariety: "வகை",
    lblGrade: "தரம்",
    lblQuantity: "கிடைக்கும் அளவு (கிலோ)",
    lblAskingPrice: "நேரடி விலை (₹/கிலோ)",
    thRegion: "இருப்பிடம்",
    thAction: "செயல்",
    ordersTitle: "📋 நேரடி ஆர்டர்கள் மற்றும் எஸ்க்ரோ விவரம்",
    ordersSubtitle: "ஆர்டர் நிலையை சரிபார்த்து, விவசாயிக்கு மதிப்பீடு வழங்கவும்.",
    thOrderId: "ஆர்டர் எண்",
    thOrderProduce: "பொருள் விவரம்",
    thOrderFarmer: "விவசாயி",
    thOrderBuyer: "வாங்குபவர்",
    thOrderQty: "அளவு",
    thOrderTotal: "மொத்த விலை (₹)",
    thOrderEscrow: "பணம் செலுத்தல் நிலை",
    thOrderAction: "செயல்",
    pricesTitle: "📊 சந்தை விலை நிலவரம்",
    pricesSubtitle: "மண்டி விலையையும் விவசாயிகளின் நேரடி விலையையும் ஒப்பிடுக.",
    thMandi: "மண்டி மொத்த விலை",
    thDirect: "நேரடி விவசாய விலை",
    thRetail: "சில்லறை கடை விலை",
    thSpread: "சந்தை சேமிப்பு",
    thUplift: "விவசாயி லாபம்",
    orderModalTitle: "நேரடி விவசாய கொள்முதல்",
    lblDirectAsk: "நேரடி விலை:",
    lblAvailQty: "கிடைக்கும் இருப்பு:",
    lblOrderQty: "வாங்க வேண்டிய அளவு (கிலோ)",
    lblPaymentMode: "பணம் செலுத்தும் முறை & எஸ்க்ரோ",
    lblProduceCost: "தயாரிப்பு மதிப்பு:",
    lblFreightCost: "போக்குவரத்து செலவு (~6%):",
    lblGrandTotal: "மொத்த தொகை:",
    lblEscrowSecurity: "🔒 100% பாதுகாப்பானது: உங்கள் பணம் எஸ்க்ரோவில் பாதுகாப்பாக வைக்கப்பட்டு, பொருள் கிடைத்த பின்னரே விவசாயிக்கு வழங்கப்படும்.",
    btnAuthorizeEscrow: "💳 ஆர்டரை உறுதிசெய்",
    modalPostProduce: "சந்தையில் தயாரிப்பைச் சேர்",
    btnPublishProduce: "🌱 சந்தையில் பதிவேற்று",
    modalRateTitle: "தரம் மற்றும் மதிப்பீடு",
    lblConfirmedGrade: "பெறப்பட்ட தரம்",
    lblTrustScore: "மதிப்பீடு (1 முதல் 5 நட்சத்திரங்கள்)",
    btnSubmitRating: "⭐ மதிப்பீட்டை சமர்ப்பி",
    outOfStockTitle: "தற்போது கையிருப்பில் இல்லை (Out of Stock)",
    outOfStockDesc: "இந்த தயாரிப்பு தற்போது கிடைக்கவில்லை. விரைவில் மீண்டும் சரிபார்க்கவும்.",
    btnBuyDirect: "⚡ நேரடியாக வாங்க (எஸ்க்ரோ)",
    btnShareWhatsapp: "📱 பகிரவும்",
    btnAllDetails: "🔍 முழு விவரங்கள் (All Details)",
    modalDetailsTitle: "விளைபொருள் விவரங்கள் & விலை வெளிப்படைத்தன்மை",
    lblShelfLife: "ஆயுட்காலம் / தரம்",
    lblStorageCondition: "சேமிப்பு முறை",
    lblLotValue: "மொத்த மதிப்பு",
    lblMandiBenchmark: "மண்டி மொத்த விலை",
    lblRetailBenchmark: "சில்லறை கடை விலை",
    lblFarmerUpliftGain: "விவசாயி கூடுதல் லாபம்",
    lblSavingsVsMiddleman: "இடைத்தரகர் கமிஷன் சேமிப்பு",
    dashActiveListings: "செயலில் உள்ள பொருட்கள்",
    dashTotalStock: "மொத்த இருப்பு (கிலோ)",
    dashTrustRating: "நம்பகத்தன்மை மதிப்பீடு",
    dashOrdersPlaced: "நேரடி ஆர்டர்கள்",
    dashCompleted: "வெற்றிகரமாக முடிந்தது",
    dashSpent: "மொத்த தொகை (₹)",
    stepPlaced: "1. ஆர்டர் செய்யப்பட்டது",
    stepDispatched: "2. அனுப்பப்பட்டது",
    stepDelivered: "3. பெறப்பட்டது"
  },
  te: {
    navMarketplace: "🛒 ఉత్పత్తుల మార్కెట్",
    navMyProducts: "📦 నా ఉత్పత్తులు",
    navMyOrders: "📋 ప్రత్యక్ష ఆర్డర్లు",
    navPriceRadar: "📊 మార్కెట్ ధరల రడార్",
    btnPostProduce: "➕ ఉత్పత్తిని అమ్మకానికి పెట్టండి",
    btnSignIn: "లాగిన్ / రిజిస్ట్రేషన్",
    quickDemo: "⚡ డెమో పరీక్ష ఖాతాలు (పాస్‌వర్డ్: password123)",
    authTitle: "అగ్రివెబ్ (AGRIWEB) లాగిన్",
    authDesc: "మీ పాత్రను ఎంచుకుని, మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
    roleFarmer: "రైతు (ఉత్పత్తిదారు)",
    roleConsumer: "ప్రత్యక్ష కొనుగోలుదారు",
    roleAdmin: "అడ్మిన్",
    lblName: "పూర్తి పేరు / వ్యాపార పేరు",
    lblVillage: "గ్రామం / ప్రాంత కేంద్రం",
    lblState: "రాష్ట్రం",
    lblPhone: "మొబైల్ నంబర్ (10 అంకెలు)",
    lblPassword: "పాస్‌వర్డ్",
    authToggleText: "కొత్త ఖాతా కావాలా?",
    authToggleLink: "ఇక్కడ నమోదు చేసుకోండి",
    marketTitle: "🛒 వ్యవసాయ ఉత్పత్తుల మార్కెట్",
    marketSubtitle: "నేరుగా రైతుల నుండి మంచి ధరలకు నాణ్యమైన ఉత్పత్తులను కొనుగోలు చేయండి.",
    searchPlaceholder: "ఉత్పత్తులను వెతకండి (టమోటా, ఉల్లిపాయ)...",
    optAllCommodities: "అన్ని ఉత్పత్తులు",
    optAllGrades: "అన్ని గ్రేడులు",
    optGradeA: "గ్రేడ్ A (ప్రీమియం)",
    optGradeB: "గ్రేడ్ B (స్టాండర్డ్)",
    optGradeC: "గ్రేడ్ C (ప్రాసెసింగ్)",
    optAllStates: "అన్ని రాష్ట్రాలు",
    optSortDefault: "క్రమబద్ధీకరించండి: ప్రామాణికం",
    optPriceAsc: "ధర: తక్కువ నుండి ఎక్కువ",
    optPriceDesc: "ధర: ఎక్కువ నుండి తక్కువ",
    optRatingDesc: "రేటింగ్: ఎక్కువ నుండి తక్కువ",
    optQtyDesc: "పరిమాణం: ఎక్కువ నుండి తక్కువ",
    myProductsTitle: "📦 అమ్మకానికి ఉన్న నా ఉత్పత్తులు",
    myProductsDesc: "మీ ఉత్పత్తులను నిర్వహించండి. కొత్త ఉత్పత్తిని జోడించండి లేదా తొలగించండి.",
    thCommodity: "ఉత్పత్తి పేరు",
    lblVariety: "రకం",
    lblGrade: "గ్రేడ్",
    lblQuantity: "అందుబాటులో ఉన్న పరిమాణం (కేజీలు)",
    lblAskingPrice: "ప్రత్యక్ష ధర (₹/కేజీ)",
    thRegion: "ప్రాంతం",
    thAction: "చర్య",
    ordersTitle: "📋 ప్రత్యక్ష ఆర్డర్లు & ఎస్క్రో రికార్డు",
    ordersSubtitle: "డెలివరీ స్థితిని తనిఖీ చేయండి మరియు రైతుకు రేటింగ్ ఇవ్వండి.",
    thOrderId: "ఆర్డర్ నంబర్",
    thOrderProduce: "ఉత్పత్తి వివరాలు",
    thOrderFarmer: "రైతు",
    thOrderBuyer: "కొనుగోలుదారు",
    thOrderQty: "పరిమాణం",
    thOrderTotal: "మొత్తం ధర (₹)",
    thOrderEscrow: "చెల్లింపు భద్రత స్థితి",
    thOrderAction: "చర్య",
    pricesTitle: "📊 ధరల పోలిక రడార్",
    pricesSubtitle: "సాధారణ మార్కెట్ ధరలతో రైతుల ప్రత్యక్ష ధరలను పోల్చండి.",
    thMandi: "సాధారణ మార్కెట్ ధర",
    thDirect: "రైతు ప్రత్యక్ష ధర",
    thRetail: "రిటైల్ ధర",
    thSpread: "ఆదా శాతం",
    thUplift: "రైతు లాభం",
    orderModalTitle: "నేరుగా రైతు వద్ద కొనుగోలు",
    lblDirectAsk: "రైతు ప్రత్యక్ష ధర:",
    lblAvailQty: "నిల్వ పరిమాణం:",
    lblOrderQty: "మీరు కొనాలనుకుంటున్న పరిమాణం (కేజీలు)",
    lblPaymentMode: "చెల్లింపు & ఎస్క్రో భద్రత",
    lblProduceCost: "ఉత్పత్తి విలువ:",
    lblFreightCost: "రవాణా ఖర్చు (~6%):",
    lblGrandTotal: "మొత్తం చెల్లించవలసినది:",
    lblEscrowSecurity: "🔒 100% భద్రత: మీ డబ్బులు సురక్షితంగా ఉంటాయి, సరుకు అందిన తర్వాతే రైతుకు విడుదల చేయబడతాయి.",
    btnAuthorizeEscrow: "💳 ఆర్డర్ నిర్ధారించండి",
    modalPostProduce: "మార్కెట్‌లో ఉత్పత్తిని నమోదు చేయండి",
    btnPublishProduce: "🌱 మార్కెట్ లో పెట్టండి",
    modalRateTitle: "నాణ్యత నిర్ధారణ మరియు రేటింగ్",
    lblConfirmedGrade: "అందుకున్న నాణ్యత",
    lblTrustScore: "రైతు రేటింగ్ (1 నుండి 5 నక్షత్రాలు)",
    btnSubmitRating: "⭐ రేటింగ్ సమర్పించండి",
    outOfStockTitle: "ప్రస్తుతం అందుబాటులో లేదు (Out of Stock)",
    outOfStockDesc: "ఈ ఉత్పత్తి ప్రస్తుతం మార్కెట్లో అందుబాటులో లేదు. దయచేసి త్వరలో మళ్ళీ తనిఖీ చేయండి.",
    btnBuyDirect: "⚡ నేరుగా కొనండి (ఎస్క్రో)",
    btnShareWhatsapp: "📱 షేర్ చేయండి",
    btnAllDetails: "🔍 పూర్తి వివరాలు (All Details)",
    modalDetailsTitle: "ఉత్పత్తి సమగ్ర వివరాలు & ధరల పారదర్శకత",
    lblShelfLife: "తాజాదనం / నిల్వ కాలం",
    lblStorageCondition: "నిల్వ పద్ధతి",
    lblLotValue: "మొత్తం విలువ",
    lblMandiBenchmark: "మార్కెట్ హోల్‌సేల్ ధర",
    lblRetailBenchmark: "రిటైల్ మార్కెట్ ధర",
    lblFarmerUpliftGain: "రైతు ప్రత్యక్ష లాభం",
    lblSavingsVsMiddleman: "మధ్యవర్తుల కమీషన్ ఆదా",
    dashActiveListings: "నమోదైన ఉత్పత్తులు",
    dashTotalStock: "మొత్తం నిల్వ (కేజీలు)",
    dashTrustRating: "విశ్వసనీయత రేటింగ్",
    dashOrdersPlaced: "ప్రత్యక్ష ఆర్డర్లు",
    dashCompleted: "విజయవంతంగా పూర్తయినవి",
    dashSpent: "మొత్తం విలువ (₹)",
    stepPlaced: "1. ఆర్డర్ అయింది",
    stepDispatched: "2. బయలుదేరింది",
    stepDelivered: "3. చేరింది"
  }
};

// Global App State
const app = {
  currentView: "auth",
  currentLang: "en",
  authRole: "farmer",
  allProduce: [],
  allPrices: [],
  allOrders: [],
  selectedProduceForOrder: null,

  async init() {
    // 1. Initialize Auth
    auth.init();

    // 2. Setup Routing based on Auth status
    this.onAuthChanged();

    // 3. Setup window location listener
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "marketplace";
      this.navigate(hash);
    });

    // 4. Initial language apply
    this.applyLanguage();
  },

  onAuthChanged() {
    this.updateRoleUI();
    
    // Check for shared product deep link parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sharedProduceId = urlParams.get("produceId");

    if (sharedProduceId) {
      this.navigate("marketplace");
      setTimeout(() => {
        this.openProductDetailsModal(sharedProduceId);
      }, 600);
      return;
    }

    // Redirect logic: If not logged in, enforce Auth screen
    if (!auth.isLoggedIn()) {
      this.navigate("auth");
    } else {
      // Direct logged-in users to their optimal home view
      const role = auth.getRole();
      if (role === "farmer") {
        this.navigate("my-products");
      } else {
        this.navigate("marketplace");
      }
    }
  },

  updateRoleUI() {
    const isLoggedIn = auth.isLoggedIn();
    const role = auth.getRole();

    const navMyProducts = document.getElementById("navMyProducts");
    const navMyOrders = document.getElementById("navMyOrders");
    const loginBtn = document.getElementById("loginBtn");
    
    const postProduceMarketBtn = document.getElementById("postProduceMarketBtn");
    const navPostProduceBtn = document.getElementById("navPostProduceBtn");
    const dashboardSummary = document.getElementById("dashboardSummary");

    const navAdmin = document.getElementById("navAdmin");

    if (isLoggedIn) {
      if (loginBtn) loginBtn.style.display = "none";

      if (role === "farmer") {
        if (navMyProducts) navMyProducts.style.display = "block";
        if (navMyOrders) navMyOrders.style.display = "none";
        if (navAdmin) navAdmin.style.display = "none";
        if (postProduceMarketBtn) postProduceMarketBtn.style.display = "block";
        if (navPostProduceBtn) navPostProduceBtn.style.display = "block";
      } else if (role === "admin") {
        if (navMyProducts) navMyProducts.style.display = "none";
        if (navMyOrders) navMyOrders.style.display = "none";
        if (navAdmin) navAdmin.style.display = "block";
        if (postProduceMarketBtn) postProduceMarketBtn.style.display = "none";
        if (navPostProduceBtn) navPostProduceBtn.style.display = "none";
      } else {
        if (navMyProducts) navMyProducts.style.display = "none";
        if (navMyOrders) navMyOrders.style.display = "block";
        if (navAdmin) navAdmin.style.display = "none";
        if (postProduceMarketBtn) postProduceMarketBtn.style.display = "none";
        if (navPostProduceBtn) navPostProduceBtn.style.display = "none";
      }

      if (dashboardSummary) {
        dashboardSummary.style.display = "grid";
        this.renderDashboardSummary();
      }
    } else {
      if (loginBtn) loginBtn.style.display = "inline-flex";
      if (navMyProducts) navMyProducts.style.display = "none";
      if (navMyOrders) navMyOrders.style.display = "none";
      if (navAdmin) navAdmin.style.display = "none";
      if (postProduceMarketBtn) postProduceMarketBtn.style.display = "none";
      if (navPostProduceBtn) navPostProduceBtn.style.display = "none";
      if (dashboardSummary) dashboardSummary.style.display = "none";
    }
  },

  async renderDashboardSummary() {
    const container = document.getElementById("dashboardSummary");
    if (!container || !auth.isLoggedIn()) return;

    const role = auth.getRole();
    const t = (k, fb) => this.t(k, fb);

    if (role === "farmer") {
      try {
        const all = await api.getProduce();
        const myItems = (all || []).filter((p) => p.farmerPhone === auth.currentUser.phone);
        const totalStock = myItems.reduce((acc, i) => acc + (i.quantityKg || 0), 0);
        const totalVal = myItems.reduce((acc, i) => acc + ((i.quantityKg || 0) * (i.askingPricePerKg || 0)), 0);

        container.innerHTML = `
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashActiveListings", "Active Products Listed")}</div>
            <div class="dash-stat-value">${myItems.length}</div>
            <div class="dash-stat-sub">Available in Marketplace</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashTotalStock", "Total Stock (kg)")}</div>
            <div class="dash-stat-value">${totalStock.toLocaleString()} kg</div>
            <div class="dash-stat-sub">Estimated Worth: ₹${totalVal.toLocaleString()}</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashTrustRating", "Trust Rating")}</div>
            <div class="dash-stat-value">⭐ ${auth.currentUser.trustScore || 4.9}</div>
            <div class="dash-stat-sub">Verified Farmer Status</div>
          </div>
        `;
      } catch (e) {
        console.warn("Could not load farmer dashboard stats:", e);
      }
    } else {
      try {
        const myOrders = await api.getMyOrders();
        const orders = myOrders || [];
        const delivered = orders.filter((o) => o.status === "delivered").length;
        const totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

        container.innerHTML = `
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashOrdersPlaced", "Direct Orders")}</div>
            <div class="dash-stat-value">${orders.length}</div>
            <div class="dash-stat-sub">100% Escrow Protected</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashCompleted", "Delivered")}</div>
            <div class="dash-stat-value">${delivered}</div>
            <div class="dash-stat-sub">Verified Arrivals</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-label">${t("dashSpent", "Total Volume (₹)")}</div>
            <div class="dash-stat-value">₹${totalSpent.toLocaleString()}</div>
            <div class="dash-stat-sub">Middleman Margin Saved: ~24%</div>
          </div>
        `;
      } catch (e) {
        console.warn("Could not load buyer dashboard stats:", e);
      }
    }
  },

  toggleMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
      navLinks.classList.toggle("open");
    }
  },

  changeLanguage(lang) {
    this.currentLang = lang || "en";
    this.applyLanguage();
    showToast(`Language switched successfully!`, "info");
  },

  applyLanguage() {
    const dict = translations[this.currentLang] || translations.en;

    // Replace all text with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Replace placeholders with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // Re-render current view with dynamic localized strings
    this.refreshCurrentView();
    if (auth.isLoggedIn()) {
      this.renderDashboardSummary();
      auth.updateUI();
    }
  },

  t(key, fallback = "") {
    const dict = translations[this.currentLang] || translations.en;
    return dict[key] || fallback || key;
  },

  translateDynamic(text) {
    if (!text) return text;
    const dynamicDict = {
      hi: {
        "Tomato": "टमाटर",
        "Potato": "आलू",
        "Wheat": "गेहूं",
        "Rice": "चावल",
        "Banana": "केला",
        "Onion": "प्याज",
        "Brinjal": "बैंगन",
        "Green Chilli": "हरी मिर्च",
        "Soyabean": "सोयाबीन",
        "Ramesh Kumar": "रमेश कुमार",
        "Suresh Patel": "सुरेश पटेल",
        "Lakshmi Ammal": "लक्ष्मी अम्मल",
        "Dindori, Nashik": "डिंडोरी, नासिक",
        "Maharashtra": "महाराष्ट्र",
        "Fatehabad, Agra": "फतेहाबाद, आगरा",
        "Uttar Pradesh": "उत्तर प्रदेश",
        "Tiruvallur, Chennai": "तिरुवल्लूर, चेन्नई",
        "Tamil Nadu": "तमिलनाडु"
      },
      ta: {
        "Tomato": "தக்காளி",
        "Potato": "உருளைக்கிழங்கு",
        "Wheat": "கோதுமை",
        "Rice": "அரிசி",
        "Banana": "வாழைப்பழம்",
        "Onion": "வெங்காயம்",
        "Brinjal": "கத்தரிக்காய்",
        "Green Chilli": "பச்சை மிளகாய்",
        "Soyabean": "சோயாபீன்",
        "Ramesh Kumar": "ரமேஷ் குமார்",
        "Suresh Patel": "சுரேஷ் படேல்",
        "Lakshmi Ammal": "லட்சுமி அம்மாள்",
        "Dindori, Nashik": "திண்டோரி, நாசிக்",
        "Maharashtra": "மகாராஷ்டிரா",
        "Fatehabad, Agra": "பதேகாபாத், ஆக்ரா",
        "Uttar Pradesh": "உத்தரபிரதேசம்",
        "Tiruvallur, Chennai": "திருவள்ளூர், சென்னை",
        "Tamil Nadu": "தமிழ்நாடு"
      }
    };
    const langDict = dynamicDict[this.currentLang];
    if (langDict && langDict[text]) {
      return langDict[text];
    }
    // Simple naive translation for matching substrings
    if (langDict) {
      let translated = text;
      for (const [key, val] of Object.entries(langDict)) {
        if (translated.includes(key)) {
          translated = translated.replace(key, val);
        }
      }
      return translated;
    }
    return text;
  },

  navigate(viewId) {
    // If not logged in, force auth view
    if (!auth.isLoggedIn() && viewId !== "auth") {
      viewId = "auth";
    }

    // Close mobile menu on navigate
    const navLinks = document.getElementById("navLinks");
    if (navLinks) navLinks.classList.remove("open");

    this.currentView = viewId;
    window.location.hash = `#${viewId}`;

    // Update nav links activation state
    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.replace("#", "") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Toggle section visibility
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    const targetSec = document.getElementById(viewId);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    this.refreshCurrentView();
  },

  refreshCurrentView() {
    switch (this.currentView) {
      case "marketplace":
        this.loadMarketplace();
        break;
      case "my-products":
        this.loadMyProducts();
        break;
      case "orders":
        this.loadOrdersLedger();
        break;
      case "prices":
        this.loadPriceRadar();
        break;
    }
  },

  // ----------------------------------------------------
  // Marketplace & Products Browsing
  // ----------------------------------------------------
  async loadMarketplace() {
    const container = document.getElementById("produceGrid");
    if (!container) return;

    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-dim);">
        <span>Loading products from verified farmers...</span>
      </div>
    `;

    try {
      const commodity = document.getElementById("filterCommodity")?.value || "";
      const state = document.getElementById("filterState")?.value || "";
      const grade = document.getElementById("filterGrade")?.value || "";
      const search = document.getElementById("searchProduce")?.value || "";
      const sortBy = document.getElementById("sortProduce")?.value || "";

      const params = {};
      if (commodity) params.commodity = commodity;
      if (state) params.state = state;
      if (grade) params.grade = grade;
      if (search) params.search = search;

      let items = await api.getProduce(params);
      items = items || [];

      // Client-side Sorting
      if (sortBy === "price_asc") {
        items.sort((a, b) => a.askingPricePerKg - b.askingPricePerKg);
      } else if (sortBy === "price_desc") {
        items.sort((a, b) => b.askingPricePerKg - a.askingPricePerKg);
      } else if (sortBy === "rating_desc") {
        items.sort((a, b) => (b.farmerTrustScore || 4.5) - (a.farmerTrustScore || 4.5));
      } else if (sortBy === "quantity_desc") {
        items.sort((a, b) => b.quantityKg - a.quantityKg);
      }

      this.allProduce = items;
      this.renderProduceCards(this.allProduce);
    } catch (e) {
      container.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-dim);">Error loading marketplace: ${e.message}</div>`;
    }
  },

  renderProduceCards(items) {
    const container = document.getElementById("produceGrid");
    if (!container) return;

    const t = (k, fb) => this.t(k, fb);

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 2px solid var(--border-light); border-radius: var(--radius-lg);">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">📦</div>
          <h3 style="margin-bottom: 6px; font-size:1.4rem; font-weight:800; color:var(--text-main);">${t("outOfStockTitle", "Out of stock at the moment")}</h3>
          <p style="color: var(--text-dim); font-size: 0.95rem; max-width: 500px; margin: 0 auto;">${t("outOfStockDesc", "This product is currently not available in the market. Please check back soon or clear filters.")}</p>
        </div>
      `;
      return;
    }

    const commodityIcons = {
      Tomato: "🍅",
      Onion: "🧅",
      Potato: "🥔",
      Wheat: "🌾",
      Rice: "🍚",
      Banana: "🍌",
      Brinjal: "🍆",
      "Green Chilli": "🌶️",
      Soyabean: "🌱"
    };

    const isFarmer = auth.isLoggedIn() && auth.getRole() === "farmer";

    container.innerHTML = items
      .map((item) => {
        const icon = commodityIcons[item.commodity] || "🌾";
        const isOwner = auth.isLoggedIn() && auth.currentUser?.phone === item.farmerPhone;
        const mandi = item.mandiReference;
        const mandiRate = mandi ? mandi.mandiPricePerKg : Math.round(item.askingPricePerKg * 0.75);
        const retailRate = mandi ? mandi.retailPricePerKg : Math.round(item.askingPricePerKg * 1.6);
        const totalLotWorth = (item.quantityKg * item.askingPricePerKg).toLocaleString();
        const farmerUplift = mandi ? mandi.farmerUpliftVsMandi : "+33.3%";
        const buyerSavings = mandi ? mandi.buyerSavingsVsRetail : "~25.0%";

        const productUrl = `${window.location.origin}${window.location.pathname}?produceId=${item.id}`;
        const shareText = encodeURIComponent(`Check out fresh ${item.commodity} (Grade ${item.grade}) on AGRIWEB! Direct Rate: ₹${item.askingPricePerKg}/kg from ${item.farmerName}, ${item.village}, ${item.state}.\n\nView Produce:\n${productUrl}`);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

        return `
          <div class="produce-card">
            <div>
              <div class="card-top">
                <span class="commodity-badge">${icon} ${this.translateDynamic(item.commodity)} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">(${this.translateDynamic(item.variety || "Hybrid")})</span></span>
                <span class="grade-badge">${t("lblGrade", "Grade")} ${item.grade}</span>
              </div>

              <!-- Details Menu Card Specs -->
              <div class="card-meta">
                <div class="meta-row">
                  <span>👨‍🌾</span>
                  <strong>${this.translateDynamic(item.farmerName)}</strong>
                  <span style="font-size:0.75rem; background:#F7FAFC; padding:2px 6px; border-radius:4px; border:1px solid var(--border-light); font-weight:700;">⭐ ${item.farmerTrustScore || 4.8} Trust</span>
                </div>
              </div>

              <!-- Product Details Menu Grid -->
              <div class="card-specs-menu">
                <div class="card-spec-item">
                  <span class="card-spec-key">📍 ${t("thRegion", "LOCATION")}</span>
                  <span class="card-spec-val">${this.translateDynamic(item.village)}, ${this.translateDynamic(item.state)}</span>
                </div>
                <div class="card-spec-item">
                  <span class="card-spec-key">📦 AVAILABLE QUANTITY (KG)</span>
                  <span class="card-spec-val">${item.quantityKg.toLocaleString()}</span>
                </div>
                <div class="card-spec-item">
                  <span class="card-spec-key">💰 TOTAL LOT VALUE</span>
                  <span class="card-spec-val">₹${totalLotWorth}</span>
                </div>
                <div class="card-spec-item">
                  <span class="card-spec-key">🏆 FRESHNESS / SHELF LIFE</span>
                  <span class="card-spec-val">~${item.shelfLifeDays || 6} Days</span>
                </div>
              </div>

              <!-- Price Transparency Breakdown Box -->
              <div class="card-price-matrix">
                <div class="card-matrix-row">
                  <span>APMC Mandi Benchmark:</span>
                  <span style="font-weight:700;">₹${mandiRate}/kg</span>
                </div>
                <div class="card-matrix-row">
                  <span>Urban Retail Benchmark:</span>
                  <span style="font-weight:700;">₹${retailRate}/kg</span>
                </div>
                <div class="card-matrix-highlight" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Direct Price (₹/kg):</span>
                  <span style="font-size:1.15rem; font-weight:900; background:var(--success); color:white; padding:4px 12px; border-radius:20px;">₹${item.askingPricePerKg}</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px; text-align:right;">
                  Farmer Uplift: <strong>${farmerUplift}</strong> · Saves: <strong>${buyerSavings}</strong>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="app.openProductDetailsModal('${item.id}')">
                🔍 All Details
              </button>
              ${
                isOwner
                  ? `<button class="btn btn-danger btn-sm" style="flex:1;" onclick="app.deleteProduce('${item.id}')">✖ ${t("thAction", "Delete")}</button>`
                  : !isFarmer
                  ? `<button class="btn btn-primary btn-sm" style="flex:1;" onclick="app.openOrderModal('${item.id}')">${t("btnBuyDirect", "⚡ Buy Directly")}</button>`
                  : `<button class="btn btn-outline btn-sm" style="flex:1; pointer-events:none;">🌱 Farmer Listing</button>`
              }
              <button onclick="app.shareProduce('${item.id}')" class="btn btn-primary btn-sm" style="flex: 1; background-color: var(--success); border-color: var(--success);" title="${t("btnShareWhatsapp", "Share on WhatsApp")}">
                🛒 Share
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  },

  // ----------------------------------------------------
  // Product All Details Modal
  // ----------------------------------------------------
  async openProductDetailsModal(productId) {
    let item = this.allProduce.find((p) => p.id === productId);
    if (!item) {
      try {
        item = await api.getProduceDetails(productId);
      } catch (e) {
        showToast("Could not load product details", "error");
        return;
      }
    }
    if (!item) return;

    const t = (k, fb) => this.t(k, fb);
    const contentEl = document.getElementById("productDetailsContent");
    if (!contentEl) return;

    const commodityIcons = {
      Tomato: "🍅",
      Onion: "🧅",
      Potato: "🥔",
      Wheat: "🌾",
      Rice: "🍚",
      Banana: "🍌",
      Brinjal: "🍆",
      "Green Chilli": "🌶️",
      Soyabean: "🌱"
    };
    const icon = commodityIcons[item.commodity] || "🌾";
    const mandi = item.mandiReference;
    const mandiRate = mandi ? mandi.mandiPricePerKg : Math.round(item.askingPricePerKg * 0.75);
    const retailRate = mandi ? mandi.retailPricePerKg : Math.round(item.askingPricePerKg * 1.6);
    const totalLotWorth = (item.quantityKg * item.askingPricePerKg).toLocaleString();
    const farmerUplift = mandi ? mandi.farmerUpliftVsMandi : "+33.3%";
    const buyerSavings = mandi ? mandi.buyerSavingsVsRetail : "~25.0%";

    const isFarmer = auth.isLoggedIn() && auth.getRole() === "farmer";
    const isOwner = auth.isLoggedIn() && auth.currentUser?.phone === item.farmerPhone;

    const productUrl = `${window.location.origin}${window.location.pathname}?produceId=${item.id}`;
    const shareText = encodeURIComponent(`Check out fresh ${item.commodity} (Grade ${item.grade}) on AGRIWEB! Direct Rate: ₹${item.askingPricePerKg}/kg from ${item.farmerName}, ${item.village}, ${item.state}.\n\nView Produce:\n${productUrl}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

    contentEl.innerHTML = `
      <div style="border-bottom: 2px solid var(--border-light); padding-bottom: 14px; margin-bottom: 16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
          <div>
            <span style="font-size: 0.82rem; text-transform: uppercase; font-weight: 800; color: var(--text-dim);">
              AGRIWEB Verified Direct Farm Lot • <code>#${item.id}</code>
            </span>
            <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--primary); margin-top: 4px;">
              ${icon} ${item.commodity} <span style="font-size:1.1rem; color:var(--text-muted); font-weight:600;">(${item.variety || "Hybrid"})</span>
            </h2>
          </div>
          <span class="grade-badge" style="font-size:0.9rem; padding:6px 12px;">Grade ${item.grade} Quality</span>
        </div>
      </div>

      <!-- Specs Grid -->
      <div class="details-grid">
        <div class="details-item">
          <div class="details-item-label">👨‍🌾 ${t("thOrderFarmer", "Farmer / Grower")}</div>
          <div class="details-item-val">${item.farmerName} <span style="font-size:0.8rem; color:var(--success);">⭐ ${item.farmerTrustScore || 4.8} Trust</span></div>
        </div>
        <div class="details-item">
          <div class="details-item-label">📍 ${t("thRegion", "Location")}</div>
          <div class="details-item-val">${item.village}, ${item.state}</div>
        </div>
        <div class="details-item">
          <div class="details-item-label">📦 ${t("lblQuantity", "Available Stock")}</div>
          <div class="details-item-val">${item.quantityKg.toLocaleString()} kg</div>
        </div>
        <div class="details-item">
          <div class="details-item-label">💰 ${t("lblLotValue", "Total Lot Value")}</div>
          <div class="details-item-val">₹${totalLotWorth}</div>
        </div>
        <div class="details-item">
          <div class="details-item-label">⏳ ${t("lblShelfLife", "Freshness / Shelf Life")}</div>
          <div class="details-item-val">~${item.shelfLifeDays || 6} Days Remaining</div>
        </div>
        <div class="details-item">
          <div class="details-item-label">❄️ ${t("lblStorageCondition", "Storage Condition")}</div>
          <div class="details-item-val">Ventilated Crate / Clean Depot</div>
        </div>
      </div>

      <!-- Price Transparency Matrix -->
      <div class="price-comparison-matrix">
        <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-main); margin-bottom: 8px; text-transform: uppercase;">
          📊 ${t("pricesTitle", "Price Transparency Matrix")}
        </div>
        <div class="matrix-row">
          <span style="color:var(--text-muted);">${t("lblMandiBenchmark", "APMC Mandi Wholesale Benchmark")}:</span>
          <span style="font-weight:700;">₹${mandiRate} / kg</span>
        </div>
        <div class="matrix-row">
          <span style="color:var(--text-muted);">${t("lblRetailBenchmark", "Urban Consumer Retail Benchmark")}:</span>
          <span style="font-weight:700;">₹${retailRate} / kg</span>
        </div>
        <div class="matrix-row" style="background:#F0FFF4; padding:8px 10px; border-radius:4px; border-bottom:none; margin-top:4px;">
          <span style="color:var(--success); font-weight:800;">${t("lblAskingPrice", "Direct Farmer Asking Rate")}:</span>
          <span style="font-size:1.3rem; font-weight:900; color:var(--success);">₹${item.askingPricePerKg} / kg</span>
        </div>
        <div style="font-size:0.82rem; color:var(--text-dim); margin-top:8px; display:flex; justify-content:space-between;">
          <span>🌾 Farmer Earning Gain: <strong>${farmerUplift}</strong></span>
          <span>🛒 Consumer Savings: <strong>${buyerSavings}</strong></span>
        </div>
      </div>

      <!-- Modal Action Buttons -->
      <div style="display:flex; gap:10px; margin-top:20px; align-items:center; flex-wrap:wrap;">
        ${
          !isFarmer && !isOwner
            ? `<button class="btn btn-primary" style="flex:1;" onclick="app.closeModal('productDetailsModal'); app.openOrderModal('${item.id}')">
                ${t("btnBuyDirect", "⚡ Buy Directly (Escrow)")}
              </button>`
            : isOwner
            ? `<button class="btn btn-danger" style="flex:1;" onclick="app.closeModal('productDetailsModal'); app.deleteProduce('${item.id}')">
                ✖ ${t("thAction", "Delete Listing")}
              </button>`
            : `<span style="font-size:0.9rem; color:var(--text-dim); font-weight:700; flex:1;">🌱 Published in Marketplace</span>`
        }
        <button onclick="app.shareProduce('${item.id}')" class="btn-whatsapp" style="padding:10px 16px;">
          ${t("btnShareWhatsapp", "📱 Share on WhatsApp")}
        </button>
        <button onclick="app.copyProductLink('${item.id}')" class="btn btn-outline" style="padding:10px 14px;">
          🔗 Copy Link
        </button>
        <button class="btn btn-outline" onclick="app.closeModal('productDetailsModal')">
          Close
        </button>
      </div>
    `;

    this.openModal("productDetailsModal");
  },

  // ----------------------------------------------------
  // Farmer My Listed Products View
  // ----------------------------------------------------
  async loadMyProducts() {
    const tableBody = document.getElementById("myProductsTableBody");
    const cardsGrid = document.getElementById("myProductsCardsGrid");
    if (!tableBody) return;

    const t = (k, fb) => this.t(k, fb);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-dim);">Loading listed products...</td></tr>`;
    if (cardsGrid) cardsGrid.innerHTML = "";

    try {
      const all = await api.getProduce();
      const myItems = (all || []).filter((p) => p.farmerPhone === auth.currentUser?.phone);

      if (myItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color:var(--text-dim);">You have not listed any products yet. Click "Post Product Lot" above to start selling!</td></tr>`;
        if (cardsGrid) cardsGrid.innerHTML = "";
        return;
      }

      tableBody.innerHTML = myItems
        .map(
          (item) => `
          <tr>
            <td><strong>${item.commodity}</strong></td>
            <td>${item.variety || "Standard"}</td>
            <td><span class="grade-badge">Grade ${item.grade}</span></td>
            <td><strong>${item.quantityKg} kg</strong></td>
            <td style="font-weight:700; color:var(--primary);">₹${item.askingPricePerKg} / kg</td>
            <td>${item.village}, ${item.state}</td>
            <td>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-outline btn-sm" onclick="app.openProductDetailsModal('${item.id}')">🔍 Details</button>
                <button class="btn btn-danger btn-sm" onclick="app.deleteProduce('${item.id}')">✖ ${t("thAction", "Remove")}</button>
              </div>
            </td>
          </tr>
        `
        )
        .join("");

      // Render cards in myProductsCardsGrid
      if (cardsGrid) {
        const commodityIcons = {
          Tomato: "🍅",
          Onion: "🧅",
          Potato: "🥔",
          Wheat: "🌾",
          Rice: "🍚",
          Banana: "🍌",
          Brinjal: "🍆",
          "Green Chilli": "🌶️",
          Soyabean: "🌱"
        };

        cardsGrid.innerHTML = myItems
          .map((item) => {
            const icon = commodityIcons[item.commodity] || "🌾";
            const mandi = item.mandiReference;
            const mandiRate = mandi ? mandi.mandiPricePerKg : Math.round(item.askingPricePerKg * 0.75);
            const retailRate = mandi ? mandi.retailPricePerKg : Math.round(item.askingPricePerKg * 1.6);
            const totalLotWorth = (item.quantityKg * item.askingPricePerKg).toLocaleString();
            const farmerUplift = mandi ? mandi.farmerUpliftVsMandi : "+33.3%";
            const buyerSavings = mandi ? mandi.buyerSavingsVsRetail : "~25.0%";

            const productUrl = `${window.location.origin}${window.location.pathname}?produceId=${item.id}`;
            const shareText = encodeURIComponent(`Check out fresh ${item.commodity} (Grade ${item.grade}) on AGRIWEB! Direct Rate: ₹${item.askingPricePerKg}/kg from ${item.farmerName}, ${item.village}, ${item.state}.\n\nView Produce:\n${productUrl}`);
            const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

            return `
              <div class="produce-card">
                <div>
                  <div class="card-top">
                    <span class="commodity-badge">${icon} ${item.commodity} <span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">(${item.variety || "Hybrid"})</span></span>
                    <span class="grade-badge">Grade ${item.grade}</span>
                  </div>

                  <!-- Details Menu Card Specs -->
                  <div class="card-meta">
                    <div class="meta-row">
                      <span>👨‍🌾</span>
                      <strong>${item.farmerName}</strong>
                      <span style="font-size:0.75rem; background:#F7FAFC; padding:2px 6px; border-radius:4px; border:1px solid var(--border-light); font-weight:700;">⭐ ${item.farmerTrustScore || 4.8} Trust</span>
                    </div>
                  </div>

                  <!-- Product Details Menu Grid -->
                  <div class="card-specs-menu">
                    <div class="card-spec-item">
                      <span class="card-spec-key">📍 ${t("thRegion", "Location")}</span>
                      <span class="card-spec-val">${item.village}, ${item.state}</span>
                    </div>
                    <div class="card-spec-item">
                      <span class="card-spec-key">📦 ${t("lblQuantity", "Available Stock")}</span>
                      <span class="card-spec-val">${item.quantityKg.toLocaleString()} kg</span>
                    </div>
                    <div class="card-spec-item">
                      <span class="card-spec-key">💰 ${t("lblLotValue", "Lot Worth")}</span>
                      <span class="card-spec-val">₹${totalLotWorth}</span>
                    </div>
                    <div class="card-spec-item">
                      <span class="card-spec-key">⏳ ${t("lblShelfLife", "Shelf Life")}</span>
                      <span class="card-spec-val">~${item.shelfLifeDays || 6} Days</span>
                    </div>
                  </div>

                  <!-- Price Transparency Breakdown Box -->
                  <div class="card-price-matrix">
                    <div class="card-matrix-row">
                      <span>${t("lblMandiBenchmark", "Mandi Wholesale")}:</span>
                      <span style="font-weight:700;">₹${mandiRate} / kg</span>
                    </div>
                    <div class="card-matrix-row">
                      <span>${t("lblRetailBenchmark", "Urban Retail")}:</span>
                      <span style="font-weight:700;">₹${retailRate} / kg</span>
                    </div>
                    <div class="card-matrix-highlight">
                      <span>${t("lblAskingPrice", "Direct Asking Rate")}:</span>
                      <span style="font-size:1.15rem; font-weight:900;">₹${item.askingPricePerKg} / kg</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-dim); margin-top:4px; text-align:right;">
                      Farmer Uplift: <strong>${farmerUplift}</strong> • Saves: <strong>${buyerSavings}</strong>
                    </div>
                  </div>
                </div>

                <div class="card-actions">
                  <button class="btn btn-outline btn-sm" style="flex: 1; min-width: 105px;" onclick="app.openProductDetailsModal('${item.id}')">
                    ${t("btnAllDetails", "🔍 All Details")}
                  </button>
                  <button class="btn btn-danger btn-sm" style="flex:1;" onclick="app.deleteProduce('${item.id}')">
                    ✖ ${t("thAction", "Delete")}
                  </button>
                </div>
              </div>

            `;
          })
          .join("");
      }
    } catch (e) {
      tableBody.innerHTML = `<tr><td colspan="7" style="color:var(--text-dim);">Error: ${e.message}</td></tr>`;
    }
  },

  async deleteProduce(id) {
    if (!confirm("Are you sure you want to remove this product listing?")) return;

    try {
      await api.deleteProduce(id);
      showToast("Product listing removed successfully.");
      this.refreshCurrentView();
      if (auth.isLoggedIn()) this.renderDashboardSummary();
    } catch (e) {
      showToast(e.message, "error");
    }
  },

  // ----------------------------------------------------
  // Direct Buy Escrow Modal
  // ----------------------------------------------------
  openOrderModal(produceId) {
    const item = this.allProduce.find((p) => p.id === produceId);
    if (!item) return;

    this.selectedProduceForOrder = item;
    const modal = document.getElementById("orderModal");
    const title = document.getElementById("orderModalTitle");
    const maxQtyEl = document.getElementById("orderModalMaxQty");
    const priceEl = document.getElementById("orderModalPrice");
    const qtyInput = document.getElementById("orderQtyInput");

    if (title) title.textContent = `Buy ${item.commodity} from ${item.farmerName}`;
    if (maxQtyEl) maxQtyEl.textContent = `${item.quantityKg} kg`;
    if (priceEl) priceEl.textContent = `₹${item.askingPricePerKg} / kg`;
    if (qtyInput) {
      qtyInput.max = item.quantityKg;
      qtyInput.value = Math.min(100, item.quantityKg);
      this.updateOrderSummary();
    }

    if (modal) modal.classList.add("open");
  },

  updateOrderSummary() {
    if (!this.selectedProduceForOrder) return;
    const qty = parseFloat(document.getElementById("orderQtyInput")?.value || "0");
    const unitPrice = this.selectedProduceForOrder.askingPricePerKg;
    const totalProduce = qty * unitPrice;
    const freightEstimate = Math.round(totalProduce * 0.06);
    const grandTotal = totalProduce + freightEstimate;

    const totalEl = document.getElementById("orderModalTotal");
    const freightEl = document.getElementById("orderModalFreight");
    const grandEl = document.getElementById("orderModalGrandTotal");

    if (totalEl) totalEl.textContent = `₹${totalProduce.toFixed(2)}`;
    if (freightEl) freightEl.textContent = `₹${freightEstimate.toFixed(2)}`;
    if (grandEl) grandEl.textContent = `₹${grandTotal.toFixed(2)}`;
  },

  // HTML5 Hardware Geolocation Device GPS Detection
  fetchDeviceGPS(role = "farmer") {
    const statusEl = document.getElementById(role === "farmer" ? "farmerGpsStatus" : "buyerGpsStatus");
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your device browser.", "error");
      return;
    }

    if (statusEl) statusEl.innerHTML = "⏳ Accessing device hardware GPS...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));

        if (role === "farmer") {
          this.farmerCoordinates = { lat, lng, name: `Farmer Device GPS (${lat}, ${lng})` };
          const villageInput = document.getElementById("postVillage");
          if (villageInput && !villageInput.value) {
            villageInput.value = `GPS (${lat}, ${lng})`;
          }
          if (statusEl) statusEl.innerHTML = `✅ Device GPS Acquired: <code>${lat}, ${lng}</code>`;
        } else {
          this.buyerCoordinates = { lat, lng, name: `Buyer Device GPS (${lat}, ${lng})` };
          if (statusEl) statusEl.innerHTML = `✅ Device GPS Acquired: <code>${lat}, ${lng}</code>`;
        }

        showToast(`📍 Device Hardware GPS Acquired: ${lat}, ${lng}`, "success");
      },
      (error) => {
        let msg = "Could not retrieve GPS location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "GPS Permission denied. Please allow location access in browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "GPS Hardware position unavailable.";
        } else if (error.code === error.TIMEOUT) {
          msg = "GPS location request timed out.";
        }
        if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger)">⚠️ ${msg}</span>`;
        showToast(msg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    ),

  async confirmOrder() {
    if (!this.selectedProduceForOrder) return;

    const qty = parseFloat(document.getElementById("orderQtyInput")?.value || "0");
    if (qty <= 0 || qty > this.selectedProduceForOrder.quantityKg) {
      showToast("Please enter a valid weight quantity", "error");
      return;
    }

    try {
      const btn = document.getElementById("orderConfirmBtn");
      if (btn) btn.disabled = true;

      const res = await api.createOrder({
        produceId: this.selectedProduceForOrder.id,
        quantityKg: qty,
        paymentMethod: "UPI / Escrow Guaranteed",
        deliveryDestination: this.buyerCoordinates || null
      });

      this.closeModal("orderModal");
      showToast(`Order placed successfully! Funds secured in Escrow.`, "success");

      // Navigate to orders & update dashboard stats
      this.navigate("orders");
      if (auth.isLoggedIn()) this.renderDashboardSummary();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      const btn = document.getElementById("orderConfirmBtn");
      if (btn) btn.disabled = false;
    }
  },


  // ----------------------------------------------------
  // Orders & Payment Escrow Ledger
  // ----------------------------------------------------
  async loadOrdersLedger() {
    const ordersBody = document.getElementById("buyerOrdersBody");
    if (!ordersBody) return;

    const t = (k, fb) => this.t(k, fb);

    try {
      const myOrders = await api.getMyOrders();
      this.allOrders = myOrders || [];

      const isFarmer = auth.getRole() === "farmer";
      const pendingOrders = this.allOrders.filter((o) => o.status === "pending");

      // Render Farmer Notification Banner if pending orders exist
      const container = document.getElementById("ordersNotificationContainer");
      if (container) {
        if (isFarmer && pendingOrders.length > 0) {
          container.innerHTML = `
            <div class="farmer-notification-banner" style="background:#FEFCBF; border:1px solid #ECC94B; color:#744210; padding:14px 18px; border-radius:10px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.5rem;">🔔</span>
                <div>
                  <strong style="font-size:1.05rem;">New Order Notification!</strong>
                  <div style="font-size:0.9rem; opacity:0.9;">You have <strong>${pendingOrders.length} pending order(s)</strong> awaiting your acceptance/rejection below.</div>
                </div>
              </div>
              <span class="grade-badge" style="background:#D69E2E; color:white; font-weight:800; font-size:0.85rem; padding:4px 10px;">Action Required</span>
            </div>
          `;
        } else {
          container.innerHTML = "";
        }
      }

      if (this.allOrders.length === 0) {
        ordersBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-dim); padding:30px;">No direct orders found. Browse Marketplace to order fresh products!</td></tr>`;
        return;
      }

      ordersBody.innerHTML = this.allOrders
        .map((o) => {
          let statusText = "Safe Escrow Secured";
          let statusBg = "#4A5568";

          if (o.status === "pending") {
            statusText = "⏳ Pending Farmer Approval";
            statusBg = "#D69E2E";
          } else if (o.status === "rejected") {
            statusText = "❌ Rejected & Refunded";
            statusBg = "#E53E3E";
          } else if (o.status === "confirmed") {
            statusText = "✅ Accepted & Escrow Secured";
            statusBg = "#319795";
          } else if (o.status === "dispatched") {
            statusText = "🚚 In Transit / Dispatched";
            statusBg = "#3182CE";
          } else if (o.paymentStatus === "escrow_released" || o.status === "delivered") {
            statusText = "🎉 Delivered & Funds Released";
            statusBg = "var(--success)";
          }

          // Timeline steps
          const isStep1 = true; // Placed
          const isStep2 = o.status === "confirmed" || o.status === "dispatched" || o.status === "delivered";
          const isStep3 = o.status === "dispatched" || o.status === "delivered";
          const isStep4 = o.status === "delivered";

          let actionHtml = "";
          if (isFarmer) {
            if (o.status === "pending") {
              actionHtml = `
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-primary btn-sm" style="background:var(--success); border-color:var(--success);" onclick="app.updateOrderStatus('${o.id}', 'confirmed')">✔ Accept</button>
                  <button class="btn btn-danger btn-sm" onclick="app.updateOrderStatus('${o.id}', 'rejected')">✖ Reject</button>
                </div>
              `;
            } else if (o.status === "confirmed") {
              actionHtml = `<button class="btn btn-primary btn-sm" onclick="app.updateOrderStatus('${o.id}', 'dispatched')">🚚 Dispatch Order</button>`;
            } else if (o.status === "rejected") {
              actionHtml = `<span style="font-size:0.85rem; color:var(--danger); font-weight:700;">Order Rejected</span>`;
            } else if (o.status === "dispatched") {
              actionHtml = `<span style="font-size:0.85rem; color:#3182CE; font-weight:700;">🚚 In Transit</span>`;
            } else {
              actionHtml = `<span style="font-size:0.85rem; color:var(--success); font-weight:700;">Completed</span>`;
            }
          } else {
            // Buyer view
            if (o.status === "pending") {
              actionHtml = `<span style="font-size:0.85rem; color:#D69E2E; font-weight:700;">⏳ Awaiting Farmer</span>`;
            } else if (o.status === "rejected") {
              actionHtml = `<span style="font-size:0.85rem; color:var(--danger); font-weight:700;">💳 Refunded</span>`;
            } else if (o.status === "confirmed" || o.status === "dispatched") {
              actionHtml = `<button class="btn btn-primary btn-sm" onclick="app.updateOrderStatus('${o.id}', 'delivered')">✔ Confirm Received</button>`;
            } else if (o.status === "delivered") {
              actionHtml = o.rating
                ? `<span style="font-size:0.88rem; color:var(--text-dim); font-weight:700;">Completed (⭐ ${o.rating}/5)</span>`
                : `<button class="btn btn-outline btn-sm" onclick="app.openRatingModal('${o.id}')">⭐ Rate Quality</button>`;
            } else {
              actionHtml = `<span style="font-size:0.88rem; color:var(--text-dim); font-weight:700;">Completed</span>`;
            }
          }

          return `
            <tr>
              <td><code>#${o.id}</code></td>
              <td><strong>${o.commodity}</strong> (${o.variety || "Hybrid"})</td>
              <td>${o.farmerName}</td>
              <td>${o.buyerName || "Direct Buyer"}</td>
              <td>${o.quantityKg} kg</td>
              <td style="font-weight:700;">₹${o.totalPrice}</td>
              <td>
                <span class="user-role-badge" style="background:${statusBg}; color:white;">
                  ${statusText}
                </span>
                <div class="order-timeline">
                  <span class="timeline-step ${isStep1 ? "active" : ""}">${t("stepPlaced", "1. Placed")}</span>
                  <span class="timeline-arrow">➔</span>
                  <span class="timeline-step ${isStep2 ? (isStep3 ? "completed" : "active") : (o.status === "rejected" ? "rejected" : "")}">${o.status === "rejected" ? "2. Rejected" : "2. Accepted"}</span>
                  <span class="timeline-arrow">➔</span>
                  <span class="timeline-step ${isStep3 ? (isStep4 ? "completed" : "active") : ""}">${t("stepDispatched", "3. Dispatched")}</span>
                  <span class="timeline-arrow">➔</span>
                  <span class="timeline-step ${isStep4 ? "completed" : ""}">${t("stepDelivered", "4. Delivered")}</span>
                </div>
              </td>
              <td>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${actionHtml}
                  ${o.status !== "rejected" ? `<button class="btn btn-outline btn-sm" onclick="app.openOrderTrackingModal('${o.id}')">📍 Track Location</button>` : ""}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    } catch (e) {
      ordersBody.innerHTML = `<tr><td colspan="8" style="color:var(--text-dim);">Error: ${e.message}</td></tr>`;
    }
  },

  async openOrderTrackingModal(orderId) {
    const content = document.getElementById("trackingContent");
    if (!content) return;
    this.openModal("trackingModal");

    content.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--text-dim);">
        <div class="spinner" style="margin:0 auto 10px;"></div>
        Fetching live GPS location coordinates...
      </div>
    `;

    try {
      const info = await api.getOrderTracking(orderId);
      const isDelivered = info.status === "delivered";
      const isDispatched = info.status === "dispatched";

      content.innerHTML = `
        <div style="background:var(--bg-dark); padding:16px; border-radius:10px; border:1px solid var(--border-light); margin-bottom:16px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div>
              <span style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px;">🌾 Farmer Location</span>
              <div style="font-weight:700; font-size:1.05rem; margin-top:2px;">${info.farmerLocation.name}</div>
              <code style="font-size:0.8rem; opacity:0.8;">GPS: ${info.farmerLocation.lat}, ${info.farmerLocation.lng}</code>
            </div>
            <div>
              <span style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px;">🛒 Buyer Location</span>
              <div style="font-weight:700; font-size:1.05rem; margin-top:2px;">${info.buyerLocation.name}</div>
              <code style="font-size:0.8rem; opacity:0.8;">GPS: ${info.buyerLocation.lat}, ${info.buyerLocation.lng}</code>
            </div>
          </div>

          <div style="background:var(--bg-card); padding:14px; border-radius:8px; border:1px solid var(--border-light);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div>
                <strong style="font-size:0.95rem;">🚚 Live Transit Vehicle Position</strong>
                <span class="user-role-badge" style="margin-left:8px; background:${isDispatched ? '#3182CE' : (isDelivered ? 'var(--success)' : '#D69E2E')};">
                  ${info.vehicleLocation.status}
                </span>
              </div>
              <div style="font-weight:800; font-size:1.1rem; color:var(--primary);">
                ${isDelivered ? 'Arrived' : `ETA: ~${info.etaMinutes} mins`}
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="width:100%; background:var(--bg-dark); height:10px; border-radius:5px; overflow:hidden; margin:10px 0;">
              <div style="width:${info.progressPercent}%; background:linear-gradient(90deg, #3182CE, var(--success)); height:100%; transition:width 0.5s ease;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-dim);">
              <span>Transit Progress: <strong>${info.progressPercent}%</strong></span>
              <span>Distance Remaining: <strong>${info.distanceRemainingKm} km</strong> (Total ${info.totalDistanceKm} km)</span>
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <button class="btn btn-outline btn-sm" onclick="app.closeModal('trackingModal')">Close Tracker</button>
        </div>
      `;
    } catch (e) {
      content.innerHTML = `<div style="color:var(--danger); padding:20px;">Failed to load location tracking: ${e.message}</div>`;
    }
  },


  async updateOrderStatus(orderId, status) {
    try {
      await api.updateOrderStatus(orderId, status);
      if (status === "confirmed") {
        showToast("Order Accepted! Escrow funds secured.", "success");
      } else if (status === "rejected") {
        showToast("Order Rejected. Escrow funds refunded to buyer.", "info");
      } else if (status === "delivered") {
        showToast("Order completed! Escrow funds released to farmer.", "success");
      } else if (status === "dispatched") {
        showToast("Order status updated: Dispatched for Delivery.", "success");
      } else {
        showToast("Order status updated successfully.", "success");
      }
      this.loadOrdersLedger();
      if (auth.isLoggedIn()) this.renderDashboardSummary();
    } catch (e) {
      showToast(e.message, "error");
    }
  },


  openRatingModal(orderId) {
    const idInput = document.getElementById("rateOrderId");
    if (idInput) idInput.value = orderId;
    this.openModal("rateModal");
  },

  async submitOrderRating() {
    const orderId = document.getElementById("rateOrderId")?.value;
    const rating = document.getElementById("rateScore")?.value;
    const confirmedGrade = document.getElementById("rateGrade")?.value;

    if (!orderId || !rating) return;

    try {
      await api.rateOrder(orderId, { rating, confirmedGrade });
      this.closeModal("rateModal");
      showToast("Rating submitted successfully! Thank you.");
      this.loadOrdersLedger();
      if (auth.isLoggedIn()) this.renderDashboardSummary();
    } catch (e) {
      showToast(e.message, "error");
    }
  },

  // ----------------------------------------------------
  // Price Radar Comparison
  // ----------------------------------------------------
  async loadPriceRadar() {
    const tableBody = document.getElementById("radarTableBody");
    if (!tableBody) return;

    try {
      const prices = await api.getPrices();
      this.allPrices = prices || [];

      tableBody.innerHTML = this.allPrices
        .map(
          (p) => `
          <tr>
            <td>
              <strong>${p.commodity}</strong>
              <div style="font-size:0.78rem; color:var(--text-dim);">${p.mandi}, ${p.state}</div>
            </td>
            <td>₹${p.mandiPricePerKg} / kg</td>
            <td style="font-weight:800; color:var(--primary); font-size:1.1rem;">₹${p.avgFarmerAskingPricePerKg} / kg</td>
            <td>₹${p.retailPricePerKg} / kg</td>
            <td>
              <span class="role-indicator" style="background:#EDF2F7; border:none; color:var(--text-main);">
                ${p.mandiToRetailSpreadPercent}% Spread
              </span>
            </td>
            <td style="font-weight:700; color:var(--success);">
              +${p.farmerEarningUpliftPercent}% Uplift
            </td>
          </tr>
        `
        )
        .join("");

      if (window.charts && typeof charts.renderPriceRadarChart === "function") {
        setTimeout(() => {
          charts.renderPriceRadarChart(this.allPrices);
        }, 100);
      }
    } catch (e) {
      tableBody.innerHTML = `<tr><td colspan="6" style="color:var(--text-dim);">Error: ${e.message}</td></tr>`;
    }
  },

  // ----------------------------------------------------
  // Post Produce Product
  // ----------------------------------------------------
  async submitCreateProduce() {
    const commodity = document.getElementById("postCommodity")?.value;
    const variety = document.getElementById("postVariety")?.value || "Hybrid";
    const quantityKg = document.getElementById("postQuantity")?.value;
    const askingPrice = document.getElementById("postPrice")?.value;
    const grade = document.getElementById("postGrade")?.value || "A";
    const village = document.getElementById("postVillage")?.value || "Nashik Farms";
    const state = document.getElementById("postState")?.value || "Maharashtra";
    const imageInput = document.getElementById("postImage");

    if (!commodity || !quantityKg || !askingPrice) {
      showToast("Please fill in product name, available quantity, and asking price", "error");
      return;
    }

    let imageBase64 = null;
    if (imageInput && imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }

    try {
      await api.createProduce({
        commodity,
        variety,
        quantityKg: parseFloat(quantityKg),
        askingPricePerKg: parseFloat(askingPrice),
        grade,
        village,
        state,
        imagePath: imageBase64,
        coordinates: this.farmerCoordinates || null
      });


      this.closeModal("createProduceModal");
      showToast("Product listed in Marketplace successfully!");
      this.refreshCurrentView();
      if (auth.isLoggedIn()) this.renderDashboardSummary();
    } catch (e) {
      showToast(e.message, "error");
    }
  },

  // ----------------------------------------------------
  // Auth Form Controls
  // ----------------------------------------------------
  selectAuthRole(role) {
    this.authRole = role;
    
    document.querySelectorAll(".role-choice-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    if (role === "farmer") document.getElementById("roleChoiceFarmer")?.classList.add("selected");
    if (role === "buyer") document.getElementById("roleChoiceBuyer")?.classList.add("selected");
    if (role === "admin") document.getElementById("roleChoiceAdmin")?.classList.add("selected");
  },

  setAuthTab(mode) {
    const regFields = document.getElementById("authRegisterFields");
    const confirmGrp = document.getElementById("authConfirmPasswordGroup");
    const title = document.getElementById("authTitle");
    const desc = document.getElementById("authDesc");
    const submitBtn = document.getElementById("authSubmitBtn");
    const toggleLink = document.getElementById("authToggleLink");
    const toggleText = document.getElementById("authToggleText");
    const tabSignIn = document.getElementById("tabSignInBtn");
    const tabRegister = document.getElementById("tabRegisterBtn");

    if (mode === "register") {
      if (regFields) regFields.style.display = "block";
      if (confirmGrp) confirmGrp.style.display = "block";
      if (title) title.textContent = "Create an AGRIWEB Account";
      if (desc) desc.textContent = "Register your profile to access direct farm trading & escrow network.";
      if (submitBtn) submitBtn.textContent = "Create Account & Sign In";
      if (toggleText) toggleText.textContent = "Already registered?";
      if (toggleLink) toggleLink.textContent = "Sign In here";
      if (tabSignIn) tabSignIn.classList.remove("active");
      if (tabRegister) tabRegister.classList.add("active");
    } else {
      if (regFields) regFields.style.display = "none";
      if (confirmGrp) confirmGrp.style.display = "none";
      if (title) title.textContent = "Sign In to AGRIWEB";
      if (desc) desc.textContent = "Select your account role and enter your registered mobile number.";
      if (submitBtn) submitBtn.textContent = "Sign In to Account";
      if (toggleText) toggleText.textContent = "Don't have an account?";
      if (toggleLink) toggleLink.textContent = "Create one now";
      if (tabSignIn) tabSignIn.classList.add("active");
      if (tabRegister) tabRegister.classList.remove("active");
    }
  },

  toggleAuthMode() {
    const regFields = document.getElementById("authRegisterFields");
    const isLogin = !regFields || regFields.style.display === "none";
    this.setAuthTab(isLogin ? "register" : "login");
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const isRegister = document.getElementById("authRegisterFields")?.style.display !== "none";
    const phoneInput = document.getElementById("authPhone");
    const passwordInput = document.getElementById("authPassword");
    const submitBtn = document.getElementById("authSubmitBtn");

    const phone = phoneInput ? phoneInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      if (passwordInput) passwordInput.focus();
      return;
    }

    const origBtnText = submitBtn ? submitBtn.textContent : "Submit";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isRegister ? "Creating Account..." : "Signing In...";
    }

    try {
      if (isRegister) {
        const name = document.getElementById("authName")?.value.trim();
        const village = document.getElementById("authVillage")?.value.trim() || "Local Hub";
        const state = document.getElementById("authState")?.value.trim() || "India";
        const confirmPassword = document.getElementById("authConfirmPassword")?.value;

        if (!name) {
          showToast("Please enter your full name or enterprise name.", "error");
          document.getElementById("authName")?.focus();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origBtnText; }
          return;
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
          showToast("Passwords do not match. Please re-check.", "error");
          document.getElementById("authConfirmPassword")?.focus();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origBtnText; }
          return;
        }

        await api.register({
          name,
          phone,
          password,
          role: this.authRole || "farmer",
          village,
          state
        });

        showToast("🎉 Account created successfully! Please sign in with your mobile number & password.");
        
        // Switch to Sign In tab and pre-fill phone
        this.setAuthTab("login");
        if (phoneInput) phoneInput.value = phone;
        if (passwordInput) {
          passwordInput.value = "";
          passwordInput.focus();
        }
      } else {
        const user = await auth.login(phone, password);
        showToast(`Welcome back, ${user.name}!`);
      }
    } catch (err) {
      showToast(err.message || "Authentication failed. Please check your credentials.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
      }
    }
  },

  shareProduce(itemId) {
    const item = (this.allProduce || []).find((p) => p.id === itemId);
    const commodity = item ? item.commodity : "Produce";
    const askingPrice = item ? item.askingPricePerKg : "";
    const farmerName = item ? item.farmerName : "";
    const village = item ? item.village : "";
    const state = item ? item.state : "";
    const grade = item ? item.grade : "Standard";

    const liveOrigin = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
      ? "https://kisansetu-agriweb.onrender.com"
      : window.location.origin;

    const productUrl = `${liveOrigin}/?produceId=${itemId}`;
    const shareMessage = `Check out fresh ${commodity} (Grade ${grade}) on AGRIWEB!\nDirect Rate: ₹${askingPrice}/kg from ${farmerName}, ${village}, ${state}.\n\nView product link:\n${productUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
  },

  copyProductLink(itemId) {
    const liveOrigin = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
      ? "https://kisansetu-agriweb.onrender.com"
      : window.location.origin;

    const productUrl = `${liveOrigin}/?produceId=${itemId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(productUrl).then(() => {
        showToast("Product URL copied to clipboard!", "success");
      }).catch(() => {
        showToast(`Product URL: ${productUrl}`, "info");
      });
    } else {
      showToast(`Product URL: ${productUrl}`, "info");
    }
  },

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add("open");
  },

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove("open");
  },

  async setAdminPriceCap() {
    const commodity = document.getElementById("adminCapCommodity").value;
    const price = document.getElementById("adminCapPrice").value;
    if (!commodity || !price) {
      showToast("Please enter a valid price.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/price-caps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api.getToken()}`
        },
        body: JSON.stringify({ commodity, maxPricePerKg: price })
      });
      if (!res.ok) throw new Error("API Error");
      showToast(`Price cap enforced: ₹${price}/kg for ${commodity}`, "success");
    } catch (e) {
      showToast("Failed to set price cap.", "error");
    }
  }
};

window.app = app;

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
