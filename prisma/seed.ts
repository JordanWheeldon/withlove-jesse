import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const OCCASIONS = [
  { name: "Birthday", slug: "birthday" },
  { name: "Anniversary", slug: "anniversary" },
  { name: "Wedding", slug: "wedding" },
  { name: "Baby Shower", slug: "baby-shower" },
  { name: "New Baby", slug: "new-baby" },
  { name: "Christening", slug: "christening" },
  { name: "Valentine's Day", slug: "valentines-day" },
  { name: "Mother's Day", slug: "mothers-day" },
  { name: "Father's Day", slug: "fathers-day" },
  { name: "Christmas", slug: "christmas" },
  { name: "Easter", slug: "easter" },
  { name: "Thank You", slug: "thank-you" },
  { name: "Sympathy", slug: "sympathy" },
  { name: "Graduation", slug: "graduation" },
  { name: "Engagement", slug: "engagement" },
  { name: "Bridal Shower", slug: "bridal-shower" },
  { name: "Retirement", slug: "retirement" },
  { name: "Thinking of You", slug: "thinking-of-you" },
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=800&fit=crop";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@withlovejesse.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin user created:", adminEmail);

  for (let i = 0; i < OCCASIONS.length; i++) {
    const occ = OCCASIONS[i];
    await prisma.category.upsert({
      where: { slug: occ.slug },
      update: { name: occ.name, sortOrder: i },
      create: { name: occ.name, slug: occ.slug, isActive: true, sortOrder: i },
    });
  }
  console.log("Categories created");

  const birthday = await prisma.category.findUnique({ where: { slug: "birthday" } });
  const anniversary = await prisma.category.findUnique({ where: { slug: "anniversary" } });
  const wedding = await prisma.category.findUnique({ where: { slug: "wedding" } });
  const newBaby = await prisma.category.findUnique({ where: { slug: "new-baby" } });
  const valentines = await prisma.category.findUnique({ where: { slug: "valentines-day" } });
  const christmas = await prisma.category.findUnique({ where: { slug: "christmas" } });
  const thankYou = await prisma.category.findUnique({ where: { slug: "thank-you" } });
  const sympathy = await prisma.category.findUnique({ where: { slug: "sympathy" } });

  const products = [
    {
      title: "Minimal Birthday Wishes",
      slug: "minimal-birthday-wishes",
      shortDescription: "Clean, elegant birthday card with plenty of space for your message.",
      fullDescription: "<p>A beautifully minimal birthday card that lets your words take centre stage. Printed on premium cardstock with a soft matte finish.</p>",
      categoryId: birthday!.id,
      price: 4.5,
      salePrice: null,
      isFeatured: true,
      isNewArrival: true,
      tags: JSON.stringify(["birthday", "minimal", "elegant"]),
    },
    {
      title: "Elegant Anniversary",
      slug: "elegant-anniversary",
      shortDescription: "Timeless anniversary card for years of love.",
      fullDescription: "<p>Celebrate your love with this timeless anniversary card. Soft neutrals and elegant typography make it perfect for any milestone.</p>",
      categoryId: anniversary!.id,
      price: 5,
      salePrice: null,
      isFeatured: true,
      tags: JSON.stringify(["anniversary", "love", "elegant"]),
    },
    {
      title: "Neutral Wedding Congratulations",
      slug: "neutral-wedding-congratulations",
      shortDescription: "Sophisticated wedding card with a neutral, refined aesthetic.",
      fullDescription: "<p>A sophisticated wedding congratulations card that works for any style of celebration. Classic, warm, and heartfelt.</p>",
      categoryId: wedding!.id,
      price: 5.5,
      salePrice: null,
      isFeatured: true,
      tags: JSON.stringify(["wedding", "neutral", "sophisticated"]),
    },
    {
      title: "New Baby Keepsake",
      slug: "new-baby-keepsake",
      shortDescription: "Warm welcome card for the newest addition.",
      fullDescription: "<p>Welcome the new little one with this warm, keepsake-quality card. Gentle design that parents will treasure.</p>",
      categoryId: newBaby!.id,
      price: 4.5,
      salePrice: null,
      isBestSeller: true,
      tags: JSON.stringify(["baby", "new arrival", "keepsake"]),
    },
    {
      title: "Valentine's Personalised",
      slug: "valentines-personalised",
      shortDescription: "Romantic Valentine's card with your own message.",
      fullDescription: "<p>Tell someone special how you feel with this romantic personalised Valentine's card. Soft, warm, and entirely your own.</p>",
      categoryId: valentines!.id,
      price: 4.5,
      salePrice: 3.99,
      isFeatured: true,
      tags: JSON.stringify(["valentines", "romantic", "personalised"]),
    },
    {
      title: "Christmas Personalised",
      slug: "christmas-personalised",
      shortDescription: "Festive Christmas card to send your warmest wishes.",
      fullDescription: "<p>Send festive greetings with this elegant Christmas card. Personalise with your message for a card that feels truly yours.</p>",
      categoryId: christmas!.id,
      price: 5,
      salePrice: null,
      isBestSeller: true,
      tags: JSON.stringify(["christmas", "festive", "personalised"]),
    },
    {
      title: "Thank You",
      slug: "thank-you",
      shortDescription: "Simple, heartfelt thank you card.",
      fullDescription: "<p>Show your gratitude with this simple, heartfelt thank you card. Perfect for gifts, help, or kindness received.</p>",
      categoryId: thankYou!.id,
      price: 4,
      salePrice: null,
      tags: JSON.stringify(["thank you", "gratitude"]),
    },
    {
      title: "Thinking of You",
      slug: "sympathy-thinking-of-you",
      shortDescription: "Gentle sympathy card for difficult times.",
      fullDescription: "<p> A gentle, comforting card for when words are hard to find. Sent with love and care during difficult times.</p>",
      categoryId: sympathy!.id,
      price: 4.5,
      salePrice: null,
      tags: JSON.stringify(["sympathy", "thinking of you"]),
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, price: p.price, salePrice: p.salePrice },
      create: {
        ...p,
        price: p.price,
        salePrice: p.salePrice,
        isActive: true,
        madeToOrder: true,
        personalisationEnabled: true,
        personalisationInstructions:
          "Add the recipient's name and your message. We'll print it beautifully on your card.",
        recipientNameLimit: 30,
        messageLimit: 200,
        insideMessageLimit: 100,
        senderNameLimit: 30,
        examplePreviewText: "For Mum, With love always",
      },
    });
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });
    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: PLACEHOLDER_IMAGE,
          alt: p.title,
          isMain: true,
          sortOrder: 0,
        },
      });
    }
  }
  console.log("Products created");

  const contentBlocks = [
    { key: "announcement_banner", content: "Free UK delivery on orders over £25" },
    { key: "hero_image", content: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=80" },
    {
      key: "hero_slides",
      content: [
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1920&q=80",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80",
      ].join("\n"),
    },
    { key: "hero_title", content: "Personalised cards, sent with love" },
    { key: "hero_subtitle", content: "Beautiful greeting cards for every occasion" },
    { key: "hero_button", content: "Shop All Cards" },
    {
      key: "delivery_content",
      content:
        "<p>All our cards are made to order, so please allow 3–5 working days for production before dispatch.</p><p>UK orders are dispatched via Royal Mail. Standard delivery typically takes 2–3 working days after dispatch. We also offer express delivery for orders needed urgently.</p><p>International delivery is available. Please contact us for a quote before placing your order.</p><p>You'll receive an email confirmation when your order is placed and again when it has been dispatched, including tracking details where available.</p>",
    },
    {
      key: "returns_content",
      content:
        "<p>Because our cards are personalised to your specifications, we unfortunately cannot offer returns or exchanges unless the item is faulty or we have made an error.</p><p>If you receive a damaged or incorrect item, please contact us within 14 days of delivery. We'll arrange a replacement or full refund.</p><p>Please ensure your personalisation details are correct before confirming your order. We cannot be held responsible for spelling mistakes or incorrect text entered by the customer.</p>",
    },
    {
      key: "testimonials",
      content:
        "Beautiful quality and the personalisation made it so special. Will definitely order again. | — Sarah, London\nThe cards arrived quickly and looked even better than on screen. Perfect for my mum's birthday. | — Emma\nLovely designs and the paper feels really premium. Exactly what I was looking for. | — James",
    },
    {
      key: "why_choose_us",
      content:
        "Premium cardstock | Printed on quality paper that feels as good as it looks.\nMade to order | Each card is personalised and printed just for you.\nDesigned with love | Thoughtful designs for every occasion.\nUK dispatch | Carefully packed and sent within 5 working days.",
    },
  ];

  for (const block of contentBlocks) {
    await prisma.editableContentBlock.upsert({
      where: { key: block.key },
      update: { content: block.content },
      create: block,
    });
  }

  const defaultSettings = [
    { key: "site_title", value: "Withlove, Jesse" },
    { key: "announcement_bar", value: "Free UK delivery on orders over £25" },
    {
      key: "announcement_marquee",
      value:
        "Free UK delivery on orders over £25\nPersonalised cards for every occasion\nPrinted on premium cardstock\nDesigned with love, sent with care",
    },
    { key: "contact_email", value: "hello@withlovejesse.com" },
    { key: "contact_phone", value: "" },
    { key: "contact_intro", value: "We'd love to hear from you. Send us a message and we'll get back to you soon." },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  const headerNav = [
    { label: "Shop", href: "/shop", location: "header" as const, sortOrder: 0 },
    { label: "Birthday", href: "/shop?occasion=birthday", location: "header" as const, sortOrder: 1 },
    { label: "Wedding", href: "/shop?occasion=wedding", location: "header" as const, sortOrder: 2 },
    { label: "Christmas", href: "/shop?occasion=christmas", location: "header" as const, sortOrder: 3 },
    { label: "About", href: "/about", location: "header" as const, sortOrder: 4 },
    { label: "Contact", href: "/contact", location: "header" as const, sortOrder: 5 },
  ];

  for (let i = 0; i < headerNav.length; i++) {
    const n = headerNav[i];
    const existing = await prisma.navigationItem.findFirst({
      where: { location: "header", label: n.label },
    });
    if (!existing) {
      await prisma.navigationItem.create({
        data: { label: n.label, href: n.href, location: "header", sortOrder: i },
      });
    }
  }

  const footerNavShop = [
    { label: "All Cards", href: "/shop" },
    { label: "Birthday", href: "/shop?occasion=birthday" },
    { label: "Anniversary", href: "/shop?occasion=anniversary" },
    { label: "Wedding", href: "/shop?occasion=wedding" },
    { label: "Christmas", href: "/shop?occasion=christmas" },
  ];
  const footerNavInfo = [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Delivery", href: "/delivery" },
    { label: "Returns", href: "/returns" },
  ];

  for (let i = 0; i < footerNavShop.length; i++) {
    const n = footerNavShop[i];
    const existing = await prisma.navigationItem.findFirst({
      where: { location: "footer", label: n.label, href: n.href },
    });
    if (!existing) {
      await prisma.navigationItem.create({
        data: { label: n.label, href: n.href, location: "footer", sortOrder: i },
      });
    }
  }
  for (let i = 0; i < footerNavInfo.length; i++) {
    const n = footerNavInfo[i];
    const existing = await prisma.navigationItem.findFirst({
      where: { location: "footer", label: n.label, href: n.href },
    });
    if (!existing) {
      await prisma.navigationItem.create({
        data: { label: n.label, href: n.href, location: "footer", sortOrder: 100 + i },
      });
    }
  }

  const faqs = [
    { question: "How long does delivery take?", answer: "UK orders are typically delivered within 5-7 working days. Cards are made to order, so please allow 3-5 working days for production before dispatch." },
    { question: "Can I personalise my card?", answer: "Yes! Most of our cards support personalisation. Add the recipient's name, your message, and optional inside text when you add to cart." },
    { question: "Do you ship internationally?", answer: "We ship within the UK. For international orders, please contact us for a quote." },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const existing = await prisma.faq.count();
    if (existing === 0) {
      await prisma.faq.create({ data: { ...faqs[i], sortOrder: i } });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
