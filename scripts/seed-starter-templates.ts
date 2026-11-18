import { PrismaClient, Occasion } from "@prisma/client";

const prisma = new PrismaClient();

type Starter = {
  slug: string; title: string; category: string; language: string;
  description: string; heading: string; tag: string;
  background: string; foreground: string; accent: string; motif: string;
};

const starters: Starter[] = [
  { slug:"royal-wedding-en", title:"Royal Wedding", category:"Wedding", language:"en", description:"An elegant royal wedding invitation in burgundy and gold.", heading:"Together Forever", tag:"THE WEDDING CELEBRATION", background:"#4b1728", foreground:"#fff1d1", accent:"#d9b66f", motif:"floral" },
  { slug:"ivory-floral-wedding-en", title:"Ivory Floral Wedding", category:"Wedding", language:"en", description:"Soft ivory florals with refined botanical borders.", heading:"You Are Invited", tag:"A BEAUTIFUL BEGINNING", background:"#f8f0df", foreground:"#655044", accent:"#a77d62", motif:"floral" },
  { slug:"modern-engagement-en", title:"Modern Engagement", category:"Engagement", language:"en", description:"A contemporary blush and rose-gold engagement announcement.", heading:"She Said Yes!", tag:"JOIN OUR ENGAGEMENT", background:"#f5dfe0", foreground:"#713f50", accent:"#bd8290", motif:"rings" },
  { slug:"birthday-confetti-en", title:"Birthday Confetti", category:"Birthday", language:"en", description:"A joyful colourful birthday invitation with confetti details.", heading:"Let's Celebrate!", tag:"IT'S PARTY TIME", background:"#fff0d5", foreground:"#5b4265", accent:"#e69b67", motif:"confetti" },
  { slug:"little-star-birthday-en", title:"Little Star Birthday", category:"Birthday", language:"en", description:"A dreamy starry birthday invitation for little ones.", heading:"A Little Star", tag:"IS TURNING ONE", background:"#dce8f2", foreground:"#354b67", accent:"#d4ad62", motif:"stars" },
  { slug:"baby-shower-blossom-en", title:"Blossom Baby Shower", category:"Baby shower", language:"en", description:"Gentle botanical baby shower invitation in sage and peach.", heading:"A Little One", tag:"IS ON THE WAY", background:"#e8eee2", foreground:"#52634e", accent:"#d99f87", motif:"leaves" },
  { slug:"housewarming-home-en", title:"New Home Celebration", category:"Housewarming", language:"en", description:"A warm minimalist invitation for a new home celebration.", heading:"A New Beginning", tag:"PLEASE JOIN OUR HOUSEWARMING", background:"#f1e4d1", foreground:"#66513e", accent:"#b78255", motif:"home" },
  { slug:"shubh-vivah-hi", title:"शुभ विवाह", category:"Wedding", language:"hi", description:"लाल और सुनहरे रंगों में पारंपरिक विवाह निमंत्रण।", heading:"शुभ विवाह", tag:"सादर आमंत्रित", background:"#641c2b", foreground:"#fff0ce", accent:"#e0bb70", motif:"mandala" },
  { slug:"sagai-utsav-hi", title:"सगाई उत्सव", category:"Engagement", language:"hi", description:"सगाई समारोह के लिए सुंदर गुलाबी निमंत्रण।", heading:"सगाई समारोह", tag:"आप सादर आमंत्रित हैं", background:"#f3dfe5", foreground:"#713c50", accent:"#bd8290", motif:"rings" },
  { slug:"janmadin-utsav-hi", title:"जन्मदिन उत्सव", category:"Birthday", language:"hi", description:"रंगीन और खुशियों से भरा जन्मदिन निमंत्रण।", heading:"जन्मदिन की खुशी", tag:"आइए जश्न मनाएं", background:"#fff0d2", foreground:"#60445a", accent:"#e59b62", motif:"confetti" },
  { slug:"god-bharai-hi", title:"गोद भराई", category:"Baby shower", language:"hi", description:"गोद भराई समारोह के लिए कोमल फूलों वाला निमंत्रण।", heading:"गोद भराई समारोह", tag:"स्नेह सहित आमंत्रण", background:"#f4e3e3", foreground:"#754b59", accent:"#c88e9b", motif:"floral" },
  { slug:"griha-pravesh-hi", title:"गृह प्रवेश", category:"Housewarming", language:"hi", description:"कलश और पारंपरिक रंगों से सजा गृह प्रवेश निमंत्रण।", heading:"शुभ गृह प्रवेश", tag:"आपका हार्दिक स्वागत है", background:"#f8edda", foreground:"#75452f", accent:"#c78c45", motif:"kalash" },
  { slug:"ganesh-puja-hi", title:"गणेश पूजा", category:"Puja", language:"hi", description:"गणेश पूजा और धार्मिक आयोजन के लिए शुभ निमंत्रण।", heading:"श्री गणेशाय नमः", tag:"पूजा में पधारें", background:"#f8e7c9", foreground:"#783c27", accent:"#d18a38", motif:"ganesh" },
  { slug:"haldi-ceremony-hi", title:"हल्दी समारोह", category:"Wedding", language:"hi", description:"हल्दी समारोह के लिए चमकीला पीला और फूलों वाला निमंत्रण।", heading:"हल्दी की रस्म", tag:"खुशियों में शामिल हों", background:"#f8e8a8", foreground:"#70451f", accent:"#d39b35", motif:"marigold" },
  { slug:"lagn-sohala-mr", title:"लग्न सोहळा", category:"Wedding", language:"mr", description:"मराठी विवाह सोहळ्यासाठी पारंपरिक लाल आणि सोनेरी आमंत्रण.", heading:"शुभविवाह", tag:"सस्नेह निमंत्रण", background:"#681d2c", foreground:"#fff0d0", accent:"#dfb76c", motif:"mandala" },
  { slug:"sakharpuda-mr", title:"साखरपुडा", category:"Engagement", language:"mr", description:"साखरपुडा समारंभासाठी नाजूक गुलाबी आमंत्रण.", heading:"साखरपुडा", tag:"आपली उपस्थिती प्रार्थनीय", background:"#f4dfe4", foreground:"#754355", accent:"#c58b9a", motif:"rings" },
  { slug:"vadhdivas-mr", title:"वाढदिवस", category:"Birthday", language:"mr", description:"आनंदी वाढदिवस सोहळ्यासाठी रंगीबेरंगी आमंत्रण.", heading:"वाढदिवस सोहळा", tag:"चला आनंद साजरा करूया", background:"#fff0d3", foreground:"#60445a", accent:"#e59a62", motif:"confetti" },
  { slug:"dohale-jevan-mr", title:"डोहाळे जेवण", category:"Baby shower", language:"mr", description:"डोहाळे जेवणासाठी फुलांच्या नक्षीचे सुंदर आमंत्रण.", heading:"डोहाळे जेवण", tag:"सस्नेह निमंत्रण", background:"#e9eee1", foreground:"#50624d", accent:"#cf967e", motif:"leaves" },
  { slug:"vastushanti-mr", title:"वास्तुशांती", category:"Puja", language:"mr", description:"वास्तुशांती पूजेसाठी पारंपरिक मंगलमय आमंत्रण.", heading:"श्री गणेशाय नमः", tag:"वास्तुशांती सोहळा", background:"#f7e9d0", foreground:"#75452f", accent:"#c78a3f", motif:"kalash" },
  { slug:"namkaran-mr", title:"नामकरण सोहळा", category:"Naming ceremony", language:"mr", description:"बाळाच्या नामकरण सोहळ्यासाठी कोमल आणि सुंदर आमंत्रण.", heading:"नामकरण सोहळा", tag:"आशीर्वाद देण्यासाठी या", background:"#e4edf3", foreground:"#40566c", accent:"#c99b72", motif:"stars" },

  // Additional original designs covering every remaining iLoveInvite category.
  { slug:"satyanarayan-puja-mr", title:"सत्यनारायण पूजा", category:"Puja", language:"mr", description:"A traditional Marathi Satyanarayan puja invitation with a warm saffron and ivory palette.", heading:"श्री सत्यनारायण पूजा", tag:"सस्नेह निमंत्रण", background:"#fff0d5", foreground:"#704326", accent:"#c88936", motif:"kalash" },
  { slug:"mata-ki-chowki-hi", title:"माता की चौकी", category:"Puja", language:"hi", description:"A devotional invitation for Mata ki Chowki in crimson and gold.", heading:"माता की चौकी", tag:"जय माता दी", background:"#681d32", foreground:"#fff0d2", accent:"#e5bd69", motif:"mandala" },
  { slug:"navratri-garba-mr", title:"नवरात्रि उत्सव", category:"Festival", language:"mr", description:"A festive Navratri invitation with vibrant celebratory colours.", heading:"नवरात्रोत्सव", tag:"गरबा आणि दांडिया रास", background:"#692746", foreground:"#fff0d5", accent:"#e7a84d", motif:"mandala" },
  { slug:"navchandi-yagna-hi", title:"नवचंडी यज्ञ", category:"Puja", language:"hi", description:"A sacred Navchandi Yagna invitation in auspicious saffron tones.", heading:"नवचंडी महायज्ञ", tag:"सादर आमंत्रण", background:"#f8e4bd", foreground:"#713a20", accent:"#c9782e", motif:"kalash" },
  { slug:"shyam-baba-kirtan-hi", title:"श्याम बाबा कीर्तन", category:"Puja", language:"hi", description:"A devotional Shyam Baba kirtan invitation in midnight blue and gold.", heading:"श्याम बाबा कीर्तन", tag:"हारे का सहारा", background:"#202d50", foreground:"#fff1cf", accent:"#d9b66f", motif:"stars" },
  { slug:"gauri-pujan-mr", title:"गौरी पूजन", category:"Puja", language:"mr", description:"A graceful Gauri Pujan invitation with a festive floral border.", heading:"गौरी पूजन", tag:"मंगलमय निमंत्रण", background:"#f7e7dc", foreground:"#704338", accent:"#c98a61", motif:"floral" },
  { slug:"sunderkand-path-hi", title:"सुंदरकांड पाठ", category:"Puja", language:"hi", description:"A devotional Sunderkand path invitation in temple-inspired colours.", heading:"सुंदरकांड पाठ", tag:"जय श्री राम", background:"#f7e6c7", foreground:"#743d24", accent:"#ce8738", motif:"mandala" },
  { slug:"jagran-gondhal-mr", title:"जागरण गोंधळ", category:"Puja", language:"mr", description:"A traditional Maharashtrian Jagran Gondhal invitation.", heading:"जागरण गोंधळ", tag:"आईचा गोंधळ", background:"#68263a", foreground:"#fff0d0", accent:"#e2b65e", motif:"marigold" },
  { slug:"rudrabhishek-hi", title:"रुद्राभिषेक", category:"Puja", language:"hi", description:"A serene Rudrabhishek invitation in sacred ivory and blue.", heading:"श्री रुद्राभिषेक", tag:"ॐ नमः शिवाय", background:"#e7edf0", foreground:"#344b61", accent:"#b68d55", motif:"mandala" },
  { slug:"kua-pujan-hi", title:"कुआँ पूजन", category:"Puja", language:"hi", description:"A colourful traditional Kua Pujan family ceremony invitation.", heading:"कुआँ पूजन", tag:"शुभ अवसर पर आमंत्रण", background:"#f7e8d2", foreground:"#76462d", accent:"#cb914b", motif:"kalash" },
  { slug:"sukhmani-sahib-path-pa", title:"Sukhmani Sahib Path", category:"Religious", language:"en", description:"A peaceful Sukhmani Sahib Path invitation with elegant ivory and deep blue styling.", heading:"Sukhmani Sahib Path", tag:"WITH WAHEGURU'S BLESSINGS", background:"#e9edf3", foreground:"#34465e", accent:"#c49b58", motif:"stars" },
  { slug:"akhand-path-sahib-pa", title:"Akhand Path Sahib", category:"Religious", language:"en", description:"A dignified Akhand Path Sahib invitation in navy and antique gold.", heading:"Akhand Path Sahib", tag:"PLEASE JOIN US", background:"#1f3150", foreground:"#fff0d2", accent:"#d5b36c", motif:"mandala" },
  { slug:"buddhist-wedding-en", title:"Buddhist Wedding", category:"Wedding", language:"en", description:"A calm Buddhist wedding invitation with lotus-inspired rose and ivory tones.", heading:"A New Journey", tag:"BUDDHIST WEDDING CEREMONY", background:"#f3e4e0", foreground:"#69434b", accent:"#bd8c78", motif:"floral" },
  { slug:"dhoti-ceremony-ta", title:"Dhoti Ceremony", category:"South Indian", language:"en", description:"A traditional South Indian dhoti ceremony invitation in cream and temple gold.", heading:"Dhoti Ceremony", tag:"BLESS THE OCCASION", background:"#f5ecd8", foreground:"#664b2e", accent:"#bd914d", motif:"mandala" },
  { slug:"puberty-function-ta", title:"Puberty Function", category:"South Indian", language:"en", description:"A graceful South Indian puberty ceremony invitation in rose and gold.", heading:"A Special Celebration", tag:"PUBERTY CEREMONY", background:"#f3dfe3", foreground:"#754252", accent:"#c28a8f", motif:"floral" },
  { slug:"seemantham-ta", title:"Seemantham", category:"Baby shower", language:"en", description:"A traditional Seemantham invitation with jasmine-inspired ivory and green details.", heading:"Seemantham", tag:"BLESSINGS FOR THE MOTHER-TO-BE", background:"#edf0df", foreground:"#4c6047", accent:"#b69b62", motif:"leaves" },
  { slug:"debut-celebration-en", title:"Debut Celebration", category:"Family celebration", language:"en", description:"A glamorous debut celebration invitation with a midnight plum and champagne palette.", heading:"The Debut", tag:"AN EVENING TO REMEMBER", background:"#39243f", foreground:"#fff0dc", accent:"#d5b27a", motif:"stars" },
  { slug:"kathani-vizha-ta", title:"Kathani Vizha", category:"Family celebration", language:"en", description:"A traditional South Indian ear-piercing ceremony invitation in turmeric and rose.", heading:"Kathani Vizha", tag:"JOIN OUR FAMILY CELEBRATION", background:"#f6e8c9", foreground:"#71472e", accent:"#c58a46", motif:"floral" },
  { slug:"kitty-party-en", title:"Kitty Party", category:"Party", language:"en", description:"A playful chic kitty party invitation in pink and plum.", heading:"Ladies' Day Out", tag:"KITTY PARTY", background:"#f5dce8", foreground:"#70445e", accent:"#c47fa0", motif:"confetti" },
  { slug:"half-saree-function-en", title:"Half Saree Function", category:"Family celebration", language:"en", description:"A festive half saree function invitation with jewel tones and gold.", heading:"Half Saree Ceremony", tag:"A BEAUTIFUL TRADITION", background:"#542a48", foreground:"#fff0d4", accent:"#d6ad65", motif:"floral" },
  { slug:"dhund-utsav-hi", title:"धुंड उत्सव", category:"Festival", language:"hi", description:"A bright traditional Dhund Utsav invitation for family and friends.", heading:"धुंड उत्सव", tag:"खुशियों का शुभ अवसर", background:"#f7e6c4", foreground:"#78432b", accent:"#d28d3c", motif:"marigold" },
  { slug:"retirement-celebration-hi", title:"सेवानिवृत्ति समारोह", category:"Retirement", language:"hi", description:"An elegant retirement celebration invitation in navy and champagne.", heading:"नई पारी की शुरुआत", tag:"सेवानिवृत्ति समारोह", background:"#e4eaf0", foreground:"#35485b", accent:"#b58b50", motif:"stars" },
  { slug:"christmas-pajama-party-en", title:"Christmas Pajama Party", category:"Party", language:"en", description:"A cosy Christmas pajama party invitation in evergreen and cranberry.", heading:"Cozy Christmas Night", tag:"PAJAMA PARTY", background:"#244637", foreground:"#fff0df", accent:"#d58b83", motif:"stars" },
  { slug:"pokemon-birthday-en", title:"Adventure Birthday", category:"Birthday", language:"en", description:"A playful creature-adventure birthday invitation with bright blue and sunny yellow styling.", heading:"Adventure Awaits!", tag:"BIRTHDAY PARTY", background:"#e3eff8", foreground:"#27466b", accent:"#e3b74e", motif:"stars" },
  { slug:"fish-fry-party-en", title:"Fish Fry Party", category:"Party", language:"en", description:"A relaxed summer fish fry invitation with coastal blue and sand tones.", heading:"Fish Fry Social", tag:"GOOD FOOD • GOOD COMPANY", background:"#e1edf0", foreground:"#34515c", accent:"#c18d54", motif:"leaves" },
  { slug:"horse-birthday-en", title:"Horse Birthday", category:"Birthday", language:"en", description:"A sweet equestrian birthday invitation in sage and warm cream.", heading:"Gallop Into Fun", tag:"BIRTHDAY CELEBRATION", background:"#e7eddf", foreground:"#46583e", accent:"#b38a59", motif:"floral" },
  { slug:"care-bear-party-en", title:"Rainbow Friends Birthday", category:"Birthday", language:"en", description:"A colourful rainbow-and-cloud birthday invitation for kids.", heading:"A Day Full of Smiles", tag:"YOU'RE INVITED", background:"#f5e5f0", foreground:"#684d70", accent:"#d89aaf", motif:"confetti" },
  { slug:"monster-truck-birthday-en", title:"Monster Truck Birthday", category:"Birthday", language:"en", description:"A bold motorsport-inspired birthday invitation in charcoal and orange.", heading:"Ready to Roll!", tag:"MONSTER TRUCK PARTY", background:"#30353b", foreground:"#fff0d7", accent:"#ed914b", motif:"confetti" },
  { slug:"quinceanera-en", title:"Quinceañera", category:"Milestone celebration", language:"en", description:"An elegant quinceañera invitation in dusty rose and champagne.", heading:"Mis Quince Años", tag:"A CELEBRATION OF A DREAM", background:"#f1dfe2", foreground:"#714957", accent:"#c99b78", motif:"floral" },
  { slug:"anniversary-celebration-en", title:"Anniversary Celebration", category:"Anniversary", language:"en", description:"A romantic anniversary invitation with deep wine and rose gold.", heading:"Years of Love", tag:"ANNIVERSARY CELEBRATION", background:"#542c3a", foreground:"#fff0df", accent:"#d6ad83", motif:"rings" },
  { slug:"corporate-gathering-en", title:"Corporate Gathering", category:"Corporate", language:"en", description:"A refined corporate event invitation in charcoal and cool silver.", heading:"Annual Gathering", tag:"YOU ARE CORDIALLY INVITED", background:"#e8ecef", foreground:"#293b4b", accent:"#8295a5", motif:"minimal" },
  { slug:"graduation-celebration-en", title:"Graduation Celebration", category:"Graduation", language:"en", description:"A celebratory graduation invitation in midnight blue and gold.", heading:"The Next Chapter", tag:"CLASS OF 2026", background:"#263a5a", foreground:"#fff1d3", accent:"#d9b66f", motif:"stars" },
  { slug:"baby-naming-en", title:"Baby Naming Celebration", category:"Naming ceremony", language:"en", description:"A soft cloud-and-star baby naming invitation in powder blue.", heading:"A Name to Cherish", tag:"NAMING CEREMONY", background:"#e6eff5", foreground:"#425a70", accent:"#c8a16b", motif:"stars" },
  { slug:"wedding-anniversary-hi", title:"विवाह वर्षगांठ", category:"Anniversary", language:"hi", description:"A warm traditional anniversary invitation in burgundy and antique gold.", heading:"विवाह वर्षगांठ", tag:"सस्नेह आमंत्रण", background:"#5a2435", foreground:"#fff0d4", accent:"#d9b66f", motif:"rings" },

];

const occasionMap: Record<string, Occasion> = {
  Wedding: Occasion.WEDDING, Birthday: Occasion.BIRTHDAY, Engagement: Occasion.ENGAGEMENT,
  "Baby shower": Occasion.BABY_SHOWER, Housewarming: Occasion.HOUSEWARMING,
  "Naming ceremony": Occasion.NAMING_CEREMONY, Puja: Occasion.OTHER, Religious: Occasion.OTHER, "South Indian": Occasion.OTHER, "Family celebration": Occasion.OTHER, Party: Occasion.OTHER, Retirement: Occasion.OTHER, "Milestone celebration": Occasion.OTHER,
  Anniversary: Occasion.OTHER, Graduation: Occasion.OTHER, Corporate: Occasion.OTHER, Festival: Occasion.OTHER,
};

function svgPreview(item: Starter) {
  const ornaments: Record<string, string> = {
    floral: '<path d="M0 80 Q80 0 160 80 T320 80 M0 520 Q80 440 160 520 T320 520" fill="none" stroke="ACCENT" stroke-width="2"/><circle cx="35" cy="75" r="13" fill="none" stroke="ACCENT"/><circle cx="285" cy="525" r="13" fill="none" stroke="ACCENT"/>',
    rings: '<circle cx="135" cy="92" r="25" fill="none" stroke="ACCENT" stroke-width="4"/><circle cx="165" cy="92" r="25" fill="none" stroke="ACCENT" stroke-width="4"/>',
    confetti: '<g fill="ACCENT"><circle cx="35" cy="70" r="7"/><circle cx="280" cy="110" r="5"/><circle cx="55" cy="490" r="6"/><circle cx="260" cy="510" r="8"/><path d="M75 125l12 18m190-70l-12 18M60 420l15-8m180-300l15 8"/></g>',
    stars: '<g fill="ACCENT"><path d="M65 75l7 18 18 7-18 7-7 18-7-18-18-7 18-7z"/><path d="M255 480l6 15 15 6-15 6-6 15-6-15-15-6 15-6z"/></g>',
    leaves: '<path d="M15 160 Q80 80 110 145 Q60 190 15 160 M305 430 Q240 350 210 415 Q260 460 305 430" fill="none" stroke="ACCENT" stroke-width="4"/><path d="M25 150l85-5m185 275l-85 5" stroke="ACCENT" stroke-width="2"/>',
    home: '<path d="M105 135l55-45 55 45v55h-35v-38h-40v38h-35z" fill="none" stroke="ACCENT" stroke-width="4"/>',
    mandala: '<g fill="none" stroke="ACCENT" stroke-width="2"><circle cx="160" cy="95" r="45"/><circle cx="160" cy="95" r="32"/><path d="M160 38v114M103 95h114M120 55l80 80m0-80l-80 80"/></g>',
    kalash: '<path d="M130 72h60l-8 18q45 55-22 75-67-20-22-75z" fill="none" stroke="ACCENT" stroke-width="4"/><path d="M160 35v35m-20-20q20-30 40 0" fill="none" stroke="ACCENT" stroke-width="4"/>',
    ganesh: '<circle cx="160" cy="95" r="42" fill="none" stroke="ACCENT" stroke-width="3"/><path d="M145 78q15-20 30 0v22q-15 22-30 0m15-22v42" fill="none" stroke="ACCENT" stroke-width="4"/>',
    marigold: '<g fill="none" stroke="ACCENT" stroke-width="3"><circle cx="60" cy="90" r="20"/><circle cx="60" cy="90" r="9"/><circle cx="260" cy="500" r="20"/><circle cx="260" cy="500" r="9"/></g>',
  };
  const safe = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const art = (ornaments[item.motif] || ornaments.floral).replaceAll("ACCENT", item.accent);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="960" viewBox="0 0 320 480"><rect width="320" height="480" fill="${item.background}"/><rect x="13" y="13" width="294" height="454" rx="3" fill="none" stroke="${item.accent}" stroke-width="2"/><rect x="21" y="21" width="278" height="438" rx="2" fill="none" stroke="${item.accent}" stroke-opacity=".45"/>${art}<text x="160" y="205" fill="${item.foreground}" font-family="Georgia,serif" font-size="13" letter-spacing="2" text-anchor="middle">${safe(item.tag)}</text><path d="M105 224h110" stroke="${item.accent}" stroke-width="1.5"/><text x="160" y="275" fill="${item.foreground}" font-family="Georgia,serif" font-size="${item.heading.length > 17 ? 21 : 27}" text-anchor="middle">${safe(item.heading)}</text><text x="160" y="310" fill="${item.foreground}" opacity=".82" font-family="Georgia,serif" font-size="11" text-anchor="middle">With joy and blessings</text><text x="160" y="350" fill="${item.foreground}" font-family="Arial,sans-serif" font-size="10" letter-spacing="2" text-anchor="middle">DATE  ·  TIME  ·  VENUE</text><path d="M125 385h70" stroke="${item.accent}" stroke-width="1"/><text x="160" y="412" fill="${item.foreground}" opacity=".8" font-family="Georgia,serif" font-size="10" text-anchor="middle">Your presence will mean so much</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

async function main() {
  let created = 0;
  let updated = 0;
  for (const item of starters) {
    const previewUrl = svgPreview(item);
    const data = {
      title: item.title, description: item.description, occasion: occasionMap[item.category],
      language: item.language, previewUrl,
      designJson: { category: item.category, heading: item.heading, tag: item.tag, background: item.background, foreground: item.foreground },
      isFree: true, status: "PUBLISHED" as const,
    };
    const existing = await prisma.template.findUnique({ where: { slug: item.slug }, select: { id: true } });
    await prisma.template.upsert({ where: { slug: item.slug }, create: { slug: item.slug, ...data }, update: data });
    if (existing) updated++; else created++;
  }
  console.log(`Starter collection complete: ${created} created, ${updated} updated. Existing user templates were left untouched.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
