import { db, tajweedRulesTable, coursesTable, lessonsTable, commentTemplatesTable, dailyWirdTable, audioLibraryTable } from "@workspace/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Tajweed Rules - Level 1
  const rulesLevel1 = [
    { nameAr: "النون الساكنة والتنوين - الإظهار", nameEn: "Noon Sakinah - Izhar", description: "إظهار النون الساكنة أو التنوين عند حروف الحلق الستة", example: "مَن آمَنَ", level: 1, orderIndex: 1 },
    { nameAr: "النون الساكنة والتنوين - الإدغام", nameEn: "Noon Sakinah - Idgham", description: "إدغام النون الساكنة أو التنوين في ستة أحرف", example: "مَن يَقُول", level: 1, orderIndex: 2 },
    { nameAr: "النون الساكنة والتنوين - الإقلاب", nameEn: "Noon Sakinah - Iqlab", description: "قلب النون الساكنة أو التنوين ميماً عند الباء", example: "أَنبِئهُم", level: 1, orderIndex: 3 },
    { nameAr: "النون الساكنة والتنوين - الإخفاء", nameEn: "Noon Sakinah - Ikhfa", description: "إخفاء النون الساكنة أو التنوين عند خمسة عشر حرفاً", example: "مَن كَانَ", level: 1, orderIndex: 4 },
    { nameAr: "الميم الساكنة - الإخفاء الشفوي", nameEn: "Meem Sakinah - Ikhfa Shafawi", description: "إخفاء الميم الساكنة عند الباء", example: "تَرمِيهِم بِحِجَارَة", level: 1, orderIndex: 5 },
    { nameAr: "الميم الساكنة - الإدغام الشفوي", nameEn: "Meem Sakinah - Idgham Shafawi", description: "إدغام الميم الساكنة في مثلها", example: "وَهُم مِن", level: 1, orderIndex: 6 },
    { nameAr: "الميم الساكنة - الإظهار الشفوي", nameEn: "Meem Sakinah - Izhar Shafawi", description: "إظهار الميم الساكنة عند جميع الحروف ما عدا الباء والميم", example: "لَهُم فِيهَا", level: 1, orderIndex: 7 },
    { nameAr: "المد الطبيعي", nameEn: "Natural Madd", description: "المد الأصلي الذي لا تقوم ذات الحرف إلا به - مقداره حركتان", example: "قَالَ", level: 1, orderIndex: 8 },
    { nameAr: "المد المتصل", nameEn: "Madd Muttasil", description: "اجتماع حرف المد والهمزة في كلمة واحدة", example: "جَاءَ", level: 1, orderIndex: 9 },
    { nameAr: "المد المنفصل", nameEn: "Madd Munfasil", description: "انفصال حرف المد عن الهمزة في كلمتين", example: "إِنَّا أَعطَينَاكَ", level: 1, orderIndex: 10 },
  ];

  // Tajweed Rules - Level 2
  const rulesLevel2 = [
    { nameAr: "المد العارض للسكون", nameEn: "Madd Aridh Lissukun", description: "حرف المد يقع قبل حرف في آخر الكلمة وقفاً", example: "نَستَعِين", level: 2, orderIndex: 1 },
    { nameAr: "المد اللازم", nameEn: "Madd Lazim", description: "المد الذي يلزم بعده سكون أصلي ثابت وصلاً ووقفاً", example: "الضَّالِّين", level: 2, orderIndex: 2 },
    { nameAr: "التفخيم والترقيق", nameEn: "Tafkhim and Tarqiq", description: "التفخيم هو تسمين الحرف وامتلاء الفم بصداه، والترقيق هو تنحيف الحرف", example: "الله - صِرَاط", level: 2, orderIndex: 3 },
    { nameAr: "الوقف والابتداء", nameEn: "Stopping and Starting", description: "أحكام الوقف على رأس الآية وعلامات الوقف المختلفة", example: "مَ ، لا ، ج", level: 2, orderIndex: 4 },
    { nameAr: "الإدغام الكبير", nameEn: "Major Idgham", description: "إدغام المتماثلين والمتقاربين والمتجانسين", example: "يُدرِككُم", level: 2, orderIndex: 5 },
    { nameAr: "القلقلة", nameEn: "Qalqalah", description: "اضطراب المخرج عند النطق بالحرف الساكن من حروف قطب جد", example: "يَقطَعُون", level: 2, orderIndex: 6 },
    { nameAr: "الراء - أحكام التفخيم والترقيق", nameEn: "Ra Rules", description: "أحكام تفخيم الراء وترقيقها بحسب الحركات والسياق", example: "رَبَّنَا - فِرعَون", level: 2, orderIndex: 7 },
    { nameAr: "اللام الشمسية والقمرية", nameEn: "Solar and Lunar Lam", description: "اللام الشمسية تُدغم في الحرف الذي بعدها، واللام القمرية تُظهر", example: "الشَّمس - القَمَر", level: 2, orderIndex: 8 },
  ];

  const allRules = [...rulesLevel1, ...rulesLevel2];

  // Clear existing and insert fresh
  await db.delete(tajweedRulesTable);
  const insertedRules = await db.insert(tajweedRulesTable).values(allRules).returning();
  console.log(`✅ Inserted ${insertedRules.length} Tajweed rules`);

  // Courses
  await db.delete(coursesTable);
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  const endDate = new Date(today.getTime() + 14 * 86400000).toISOString().split("T")[0];

  const insertedCourses = await db.insert(coursesTable).values([
    {
      title: "دورة التجويد - المستوى الأول",
      description: "دورة مكثفة في أحكام التجويد الأساسية تشمل أحكام النون الساكنة والتنوين والميم الساكنة والمدود الأساسية. مدة الدورة أسبوعان.",
      level: 1, durationDays: 14, price: "299", capacity: 20,
      startDate, endDate, isActive: true,
    },
    {
      title: "دورة التجويد - المستوى الثاني",
      description: "دورة متقدمة في أحكام التجويد تشمل المدود المتفرعة والوقف والابتداء وأحكام الراء والإدغام الكبير. تتطلب اجتياز المستوى الأول.",
      level: 2, durationDays: 14, price: "349", capacity: 15,
      startDate: null, endDate: null, isActive: false,
    },
  ]).returning();
  console.log(`✅ Inserted ${insertedCourses.length} courses`);

  // Lessons for Level 1
  const level1CourseId = insertedCourses[0]!.id;
  const rule1Id = insertedRules.find((r) => r.nameEn.includes("Izhar"))!.id;
  const rule2Id = insertedRules.find((r) => r.nameEn.includes("Idgham") && r.level === 1)!.id;
  const rule3Id = insertedRules.find((r) => r.nameEn.includes("Natural"))!.id;
  const rule4Id = insertedRules.find((r) => r.nameEn.includes("Muttasil"))!.id;

  await db.delete(lessonsTable);
  const insertedLessons = await db.insert(lessonsTable).values([
    {
      title: "مقدمة في علم التجويد",
      content: `## مقدمة في علم التجويد\n\nالتجويد لغةً: التحسين\nالتجويد اصطلاحاً: إعطاء كل حرف حقه ومستحقه من الصفات الذاتية والعرضية.\n\n### فائدة التجويد\nصون اللسان من اللحن في كتاب الله تعالى. قال الله تعالى: ﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلاً﴾\n\n### تعريف اللحن\n- **اللحن الجلي**: خطأ يخل بالمعنى\n- **اللحن الخفي**: خطأ يخل بالأداء دون المعنى`,
      level: 1, orderIndex: 1, ruleId: null, videoUrl: null,
    },
    {
      title: "أحكام النون الساكنة والتنوين - الإظهار الحلقي",
      content: `## الإظهار الحلقي\n\n**التعريف**: إخراج كل حرف من مخرجه من غير غنة في الحرف المُظهر.\n\n**حروفه**: ء - هـ - ع - ح - غ - خ (حروف الحلق الستة)\n\n**سبب التسمية**: لأن حروفه تخرج من الحلق.\n\n### أمثلة:\n- مَن آمَنَ → (النون ساكنة + همزة)\n- عَلِيمٌ حَكِيم → (تنوين + حاء)\n- مِنهُم مَن هَادَ → (نون + هاء)\n\n### تدريب:\nاقرأي واستمعي إلى التلاوة مع ملاحظة إظهار النون الساكنة والتنوين.`,
      level: 1, orderIndex: 2, ruleId: rule1Id, videoUrl: null,
    },
    {
      title: "أحكام النون الساكنة والتنوين - الإدغام",
      content: `## الإدغام\n\n**التعريف**: إدخال حرف ساكن في حرف متحرك بحيث يصيران حرفاً واحداً مشدداً.\n\n**حروفه**: ي - ر - م - ل - و - ن (يرملون)\n\n**نوعاه**:\n1. **إدغام بغنة**: في (ي ن م و)\n2. **إدغام بغير غنة**: في (ل ر)\n\n### أمثلة:\n- مَن يَقُول → إدغام بغنة\n- مِن رَّبِّهِم → إدغام بغير غنة\n- مِن مَّاءٍ → إدغام بغنة`,
      level: 1, orderIndex: 3, ruleId: rule2Id, videoUrl: null,
    },
    {
      title: "المد الطبيعي والمدود الفرعية",
      content: `## المد الطبيعي\n\n**التعريف**: هو الذي لا تقوم ذات الحرف إلا به ولا يتوقف على سبب.\n\n**مقداره**: حركتان\n\n**حروفه الثلاثة**:\n- الألف: وما قبلها مفتوح\n- الواو: وما قبلها مضموم  \n- الياء: وما قبلها مكسور\n\n## المد المتصل\n**التعريف**: اجتماع حرف المد والهمزة في كلمة واحدة.\n**مقداره**: 4-5 حركات وجوباً.`,
      level: 1, orderIndex: 4, ruleId: rule3Id, videoUrl: null,
    },
  ]).returning();
  console.log(`✅ Inserted ${insertedLessons.length} lessons`);

  // Comment templates
  await db.delete(commentTemplatesTable);
  await db.insert(commentTemplatesTable).values([
    { text: "ما شاء الله، أداء ممتاز في هذا الحكم! أكملي بهذا المستوى.", category: "تشجيع" },
    { text: "تحتاجين إلى مزيد من التمرين في هذا الحكم. استمعي إلى التلاوة النموذجية مرة أخرى.", category: "ملاحظة" },
    { text: "الغنة واضحة وجميلة، بارك الله فيك.", category: "تشجيع" },
    { text: "انتبهي إلى مقدار المد، يجب أن يكون بمقدار حركتين فقط.", category: "تصحيح" },
    { text: "ممتازة! المخارج صحيحة والأحكام تُطبَّق بشكل دقيق.", category: "تشجيع" },
    { text: "راجعي درس النون الساكنة مرة أخرى قبل إعادة التسجيل.", category: "تصحيح" },
    { text: "تحسن واضح من الأسبوع الماضي، استمري!", category: "تشجيع" },
    { text: "الصوت واضح والنطق مميز. أحسنتِ!", category: "تشجيع" },
  ]);
  console.log(`✅ Inserted comment templates`);

  // Daily Wird
  await db.delete(dailyWirdTable);
  const todayDate = new Date().toISOString().split("T")[0];
  await db.insert(dailyWirdTable).values([
    {
      date: todayDate,
      ruleId: insertedRules[0]?.id ?? null,
      title: "ورد اليوم - أحكام الإظهار",
      content: "اقرئي سورة البقرة من الآية 1 إلى 10 مع تطبيق أحكام النون الساكنة والتنوين. ركزي على الإظهار الحلقي عند حروف الحلق.",
    },
  ]);
  console.log(`✅ Inserted daily wird`);

  // Audio library
  await db.delete(audioLibraryTable);
  const izhareRule = insertedRules.find((r) => r.nameEn.includes("Izhar"));
  const maddRule = insertedRules.find((r) => r.nameEn.includes("Natural"));
  await db.insert(audioLibraryTable).values([
    {
      ruleId: izhareRule?.id ?? null,
      reciterName: "الشيخ محمود خليل الحصري",
      audioUrl: "https://server8.mp3quran.net/husary/001.mp3",
      description: "تلاوة سورة الفاتحة بصوت الشيخ الحصري - نموذج على الإظهار",
    },
    {
      ruleId: maddRule?.id ?? null,
      reciterName: "الشيخ عبد الباسط عبد الصمد",
      audioUrl: "https://server7.mp3quran.net/basit/001.mp3",
      description: "تلاوة سورة الفاتحة بصوت الشيخ عبد الباسط - نموذج على المد الطبيعي",
    },
    {
      ruleId: null,
      reciterName: "الشيخ مشاري راشد العفاسي",
      audioUrl: "https://server10.mp3quran.net/mishari/001.mp3",
      description: "تلاوة الفاتحة بصوت الشيخ المنشاوي - للاستماع العام",
    },
  ]);
  console.log(`✅ Inserted audio library items`);

  console.log("✅ Seeding complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
