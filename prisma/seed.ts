import { PrismaClient, Occasion } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const samples = [
    {slug:"blush-romance",title:"Blush Romance",occasion:Occasion.WEDDING,language:"en",previewUrl:"/templates/blush-romance.png",designJson:{background:"#f2e4df",foreground:"#8a4b50",font:"Playfair Display"}},
    {slug:"garden-celebration",title:"Garden Celebration",occasion:Occasion.BIRTHDAY,language:"en",previewUrl:"/templates/garden-celebration.png",designJson:{background:"#e9eadc",foreground:"#52664e",font:"Georgia"}},
    {slug:"traditional-gold",title:"Traditional Gold",occasion:Occasion.WEDDING,language:"hi",previewUrl:"/templates/traditional-gold.png",designJson:{background:"#eee4cf",foreground:"#8a6a34",font:"Noto Serif Devanagari"}},
  ];
  for (const item of samples) await prisma.template.upsert({where:{slug:item.slug},update:item,create:{...item,status:"PUBLISHED",isFree:true}});
}
main().finally(()=>prisma.$disconnect());
