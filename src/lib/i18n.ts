export const languages = [
  { code: "en", label: "English" }, { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" }, { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ta", label: "தமிழ்" }, { code: "te", label: "తెలుగు" },
] as const;
export type LanguageCode = typeof languages[number]["code"];
export const copy = {
  en: { eyebrow: "CELEBRATE BEAUTIFULLY", headline: "Every celebration starts with an invite.", intro: "Create thoughtful invitations for life's special moments. Choose a design, make it yours, and share the joy — completely free.", browse: "Explore designs", categories: "Invitations for every occasion", create: "Create your invitation" },
  hi: { eyebrow: "खूबसूरती से जश्न मनाएं", headline: "हर जश्न की शुरुआत एक निमंत्रण से होती है।", intro: "ज़िंदगी के खास पलों के लिए सुंदर निमंत्रण बनाएं।", browse: "डिज़ाइन देखें", categories: "हर अवसर के लिए निमंत्रण", create: "निमंत्रण बनाएं" },
  mr: { eyebrow: "सुंदर सोहळ्याचा आनंद घ्या", headline: "प्रत्येक सोहळ्याची सुरुवात निमंत्रणाने होते.", intro: "आयुष्यातील खास क्षणांसाठी सुंदर आमंत्रणे तयार करा.", browse: "डिझाइन्स पहा", categories: "प्रत्येक प्रसंगासाठी आमंत्रणे", create: "आमंत्रण तयार करा" },
  kn: { eyebrow: "ಸುಂದರವಾಗಿ ಸಂಭ್ರಮಿಸಿ", headline: "ಪ್ರತಿ ಸಂಭ್ರಮವೂ ಆಹ್ವಾನದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ.", intro: "ಜೀವನದ ವಿಶೇಷ ಕ್ಷಣಗಳಿಗಾಗಿ ಸುಂದರ ಆಹ್ವಾನಗಳನ್ನು ರಚಿಸಿ.", browse: "ವಿನ್ಯಾಸಗಳನ್ನು ನೋಡಿ", categories: "ಪ್ರತಿ ಸಂದರ್ಭಕ್ಕೂ ಆಹ್ವಾನಗಳು", create: "ಆಹ್ವಾನ ರಚಿಸಿ" },
  ta: { eyebrow: "அழகாகக் கொண்டாடுங்கள்", headline: "ஒவ்வொரு கொண்டாட்டமும் ஓர் அழைப்பில் தொடங்குகிறது.", intro: "வாழ்க்கையின் சிறப்பு தருணங்களுக்கு அழகான அழைப்பிதழ்களை உருவாக்குங்கள்.", browse: "வடிவங்களைப் பாருங்கள்", categories: "ஒவ்வொரு நிகழ்வுக்கும் அழைப்பிதழ்கள்", create: "அழைப்பிதழை உருவாக்குங்கள்" },
  te: { eyebrow: "అందంగా వేడుక చేసుకోండి", headline: "ప్రతి వేడుక ఆహ్వానంతో ప్రారంభమవుతుంది.", intro: "జీవితంలోని ప్రత్యేక సందర్భాల కోసం అందమైన ఆహ్వానాలను రూపొందించండి.", browse: "డిజైన్లను చూడండి", categories: "ప్రతి సందర్భానికి ఆహ్వానాలు", create: "ఆహ్వానం సృష్టించండి" },
} as const;
