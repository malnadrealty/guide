import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@malnadrealty.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "malnad-admin-2024";

  const existing = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await db.user.create({
      data: {
        email: adminEmail,
        password: await hash(adminPassword, 12),
        name: "Malnad Realty",
        role: "admin",
      },
    });
    console.log(`✓ Admin user created: ${adminEmail}`);
  } else {
    console.log(`✓ Admin user already exists: ${adminEmail}`);
  }

  // Categories
  const categoryData = [
    { name: "Property", slug: "property", order: 1, description: "Buying, selling and renting property" },
    { name: "Land", slug: "land", order: 2, description: "Agricultural land, farmland and sites" },
    { name: "Construction", slug: "construction", order: 3, description: "Construction costs and building guides" },
    { name: "Legal", slug: "legal", order: 4, description: "Documents, registration and legal processes" },
    { name: "Finance", slug: "finance", order: 5, description: "Home loans, EMI and buying costs" },
    { name: "Living", slug: "living", order: 6, description: "Lifestyle, amenities and local insights" },
  ];

  for (const cat of categoryData) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categories seeded");

  // Demo locations
  const locationData = [
    { name: "Sagara", slug: "sagara", district: "Shivamogga", taluk: "Sagara Taluk", shortDescription: "A scenic town in Shivamogga district, known for its proximity to Jog Falls and growing real estate market.", status: "published", order: 1 },
    { name: "Sirsi", slug: "sirsi", district: "Uttara Kannada", taluk: "Sirsi Taluk", shortDescription: "The commercial hub of Uttara Kannada, with active property and agricultural land markets.", status: "published", order: 2 },
    { name: "Honnavar", slug: "honnavar", district: "Uttara Kannada", taluk: "Honnavar Taluk", shortDescription: "A coastal town with growing residential and commercial property interest.", status: "published", order: 3 },
    { name: "Kumta", slug: "kumta", district: "Uttara Kannada", taluk: "Kumta Taluk", shortDescription: "A taluk known for agriculture, plantations and coastal property.", status: "published", order: 4 },
    { name: "Yellapura", slug: "yellapura", district: "Uttara Kannada", taluk: "Yellapura Taluk", shortDescription: "An interior taluk with agricultural land and forest-adjacent property.", status: "published", order: 5 },
    { name: "Ankola", slug: "ankola", district: "Uttara Kannada", taluk: "Ankola Taluk", shortDescription: "A coastal taluk with agricultural and residential real estate opportunities.", status: "draft", order: 6 },
    { name: "Soraba", slug: "soraba", district: "Shivamogga", taluk: "Soraba Taluk", shortDescription: "A taluk in Shivamogga with agricultural land and growing interest.", status: "draft", order: 7 },
  ];

  for (const loc of locationData) {
    await db.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });
  }
  console.log("✓ Demo locations seeded");

  // Demo articles
  const admin = await db.user.findFirst();
  const landCat = await db.category.findUnique({ where: { slug: "land" } });
  const legalCat = await db.category.findUnique({ where: { slug: "legal" } });
  const propertyCat = await db.category.findUnique({ where: { slug: "property" } });
  const consCat = await db.category.findUnique({ where: { slug: "construction" } });
  const sagaraLoc = await db.location.findUnique({ where: { slug: "sagara" } });
  const sirsiLoc = await db.location.findUnique({ where: { slug: "sirsi" } });

  const articles = [
    {
      title: "How to Buy Agricultural Land in Karnataka",
      slug: "how-to-buy-agricultural-land-in-karnataka",
      categoryId: landCat?.id,
      locationId: null,
      excerpt: "A step-by-step guide to the legal process, documents required and key considerations when buying agricultural land in Karnataka.",
      content: `<h2>Quick Answer</h2><p>To buy agricultural land in Karnataka, you need to verify the land title through RTC and EC documents, confirm the seller's ownership, execute a sale deed, pay stamp duty and register at the sub-registrar office. Non-agriculturists face restrictions under the Karnataka Land Reforms Act.</p><h2>Who Can Buy Agricultural Land in Karnataka?</h2><p>Under the <strong>Karnataka Land Reforms Act, 1961</strong>, agricultural land can generally only be purchased by agriculturists — people whose primary income is from agriculture. Non-agriculturists face restrictions, though there are exemptions for:</p><ul><li>Educational institutions</li><li>Industrial purposes (with government approval)</li><li>Plantation development</li></ul><h2>Key Documents to Check</h2><h3>RTC (Record of Rights, Tenancy and Crops)</h3><p>The RTC (also called Pahani) is the primary land record in Karnataka. It shows the owner's name, extent of land, survey number, land use, water source and crop details. Always verify the latest RTC before buying.</p><h3>EC (Encumbrance Certificate)</h3><p>The EC shows if the land has any mortgage, legal dispute or other encumbrances. Get at least a 15-year EC search to check for liabilities.</p><h3>Sale Deed and Registration</h3><p>A registered sale deed is proof of ownership. Without registration, the transaction is not legally valid.</p><h2>Step-by-Step Process</h2><ol><li>Identify land and verify survey number</li><li>Check RTC (at Bhoomi portal or taluk office)</li><li>Get EC for last 15 years</li><li>Verify seller identity and title</li><li>Execute agreement to sell</li><li>Pay stamp duty and registration charges</li><li>Register sale deed at sub-registrar office</li><li>Apply for mutation (Khata transfer)</li></ol>`,
      status: "published",
      publishedAt: new Date("2024-01-15"),
      seoTitle: "How to Buy Agricultural Land in Karnataka — Step by Step Guide",
      metaDescription: "Complete guide to buying agricultural land in Karnataka — who can buy, documents needed, legal process, stamp duty and registration steps.",
    },
    {
      title: "Stamp Duty and Registration Charges in Karnataka",
      slug: "stamp-duty-and-registration-charges-in-karnataka",
      categoryId: legalCat?.id,
      locationId: null,
      excerpt: "Current stamp duty rates and registration charges for property and land purchases in Karnataka.",
      content: `<h2>Quick Answer</h2><p>In Karnataka, stamp duty on property is generally 5% of the market value (guidance value), with a 1% surcharge and 1% registration charge, making the effective cost approximately 7% of the property value for most transactions.</p><h2>Current Rates (2024)</h2><table><thead><tr><th>Transaction Value</th><th>Stamp Duty</th><th>Surcharge</th><th>Registration</th></tr></thead><tbody><tr><td>Up to ₹20 lakh</td><td>2%</td><td>0.5%</td><td>1%</td></tr><tr><td>₹20L to ₹35L</td><td>3%</td><td>0.5%</td><td>1%</td></tr><tr><td>Above ₹35L</td><td>5%</td><td>1%</td><td>1%</td></tr></tbody></table><h2>What is Guidance Value?</h2><p>Guidance value (also called circle rate) is the minimum value set by the government for each locality. Stamp duty is calculated on whichever is higher — the actual sale price or the guidance value.</p><h2>Agricultural Land</h2><p>For agricultural land, stamp duty is typically 3–5% depending on the district. Check with the sub-registrar office for the specific rate applicable to the survey number.</p>`,
      status: "published",
      publishedAt: new Date("2024-02-01"),
      seoTitle: "Stamp Duty and Registration Charges in Karnataka 2024",
      metaDescription: "Current stamp duty rates and registration charges for buying property or agricultural land in Karnataka. Updated 2024 rates.",
    },
    {
      title: "Is Sagara a Good Place to Invest in Property?",
      slug: "is-sagara-good-place-to-invest-in-property",
      categoryId: propertyCat?.id,
      locationId: sagaraLoc?.id,
      excerpt: "An honest look at Sagara's real estate market — land prices, connectivity, growth drivers and investment considerations.",
      content: `<h2>Quick Answer</h2><p>Sagara offers genuine long-term investment potential driven by tourism (Jog Falls proximity), improving connectivity and relatively affordable land prices compared to tier-1 cities. It is best suited to patient investors with a 5–10 year horizon rather than quick flips.</p><h2>Why Sagara Attracts Property Interest</h2><p>Sagara (also spelled Sagar) is located in the Shivamogga district and is one of the main towns in the Malnad belt. Its proximity to <strong>Jog Falls</strong> (roughly 30 km away) brings steady tourist traffic and creates demand for hospitality and homestay properties.</p><h3>Connectivity</h3><ul><li>National Highway 169 passes through Sagara</li><li>Sagara has a railway station on the Talaguppa line</li><li>Approximately 3.5 hours from Bengaluru by road</li></ul><h2>What Kind of Property is Available?</h2><p>Sagara's market includes residential plots, agricultural land, plantation land (arecanut, spice gardens) and some commercial property. The market is relatively smaller and less liquid than larger cities.</p><h2>Honest Considerations</h2><ul><li>Market is thin — fewer buyers means longer time to sell</li><li>Agricultural land has legal restrictions for non-agriculturists</li><li>Plantation land values depend heavily on crop performance</li><li>Development infrastructure is improving but still limited versus tier-1 cities</li></ul>`,
      status: "published",
      publishedAt: new Date("2024-03-10"),
      seoTitle: "Is Sagara a Good Place to Invest in Property? (Honest Guide)",
      metaDescription: "Honest guide to investing in property in Sagara, Shivamogga — land prices, connectivity, growth drivers and risks.",
    },
    {
      title: "House Construction Cost in Sagara (2024 Guide)",
      slug: "house-construction-cost-in-sagara",
      categoryId: consCat?.id,
      locationId: sagaraLoc?.id,
      excerpt: "Approximate per-square-foot construction costs for houses in Sagara, Shivamogga, and the key factors that affect your budget.",
      content: `<h2>Quick Answer</h2><p>In 2024, basic house construction in Sagara costs approximately ₹1,400–1,800 per square foot for standard construction, and ₹1,800–2,400+ per square foot for better quality finishes. These are estimates — actual costs depend on design, materials and contractor.</p><h2>Cost Breakdown</h2><table><thead><tr><th>Quality</th><th>Per Sq Ft (Approx)</th></tr></thead><tbody><tr><td>Economy</td><td>₹1,200–1,400</td></tr><tr><td>Standard</td><td>₹1,400–1,800</td></tr><tr><td>Good quality</td><td>₹1,800–2,400</td></tr><tr><td>Premium</td><td>₹2,400+</td></tr></tbody></table><h2>What Affects Construction Cost?</h2><ul><li><strong>Steel and cement prices</strong> — fluctuate with market conditions</li><li><strong>Labour availability</strong> — Sagara has local contractors but skilled labour can sometimes be limited</li><li><strong>Design complexity</strong> — simple rectangular plans cost less</li><li><strong>Foundation type</strong> — the hilly terrain of Malnad can require deeper or special foundations</li><li><strong>Material transport</strong> — some materials cost more due to location</li></ul>`,
      status: "published",
      publishedAt: new Date("2024-04-05"),
      seoTitle: "House Construction Cost in Sagara 2024 — Per Sq Ft Rates",
      metaDescription: "Approximate house construction costs in Sagara, Shivamogga — per sq ft rates for economy, standard and premium quality construction in 2024.",
    },
    {
      title: "Documents Required to Buy Property in Karnataka",
      slug: "documents-required-to-buy-property-in-karnataka",
      categoryId: legalCat?.id,
      locationId: null,
      excerpt: "Complete checklist of documents to verify and collect when buying property or land in Karnataka.",
      content: `<h2>Quick Answer</h2><p>When buying property in Karnataka, you need to check the sale deed, RTC (for agricultural land), Encumbrance Certificate, Khata certificate, tax-paid receipts and approved building plan. You will also need identity proof for registration.</p><h2>Documents to Verify from the Seller</h2><ul><li><strong>Original title deed / sale deed</strong> — proof of how the seller acquired the property</li><li><strong>RTC / Pahani</strong> (for agricultural/rural land)</li><li><strong>Encumbrance Certificate</strong> (EC) for last 15–30 years</li><li><strong>Khata certificate and extract</strong> (for urban/peri-urban property)</li><li><strong>Property tax receipts</strong> (last 3 years at minimum)</li><li><strong>No Objection Certificates</strong> (if applicable — bank loans, layout approvals)</li><li><strong>Approved layout / building plan</strong> (for constructed property)</li></ul><h2>Documents You Need (as Buyer)</h2><ul><li>Aadhar card</li><li>PAN card</li><li>Passport-size photographs</li></ul><h2>At Registration</h2><p>At the sub-registrar office, both buyer and seller must be present with original documents, two witnesses with ID proof, and the stamp duty payment receipt.</p>`,
      status: "published",
      publishedAt: new Date("2024-04-20"),
      seoTitle: "Documents Required to Buy Property in Karnataka — Complete Checklist",
      metaDescription: "Full checklist of documents to verify when buying property or land in Karnataka — what to ask for from the seller and what you need at registration.",
    },
  ];

  for (const article of articles) {
    await db.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        authorId: admin!.id,
      },
    });
  }
  console.log("✓ Demo articles seeded");

  console.log("\n✅ Seed complete!");
  console.log(`\nAdmin login: ${adminEmail}`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD || adminPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
