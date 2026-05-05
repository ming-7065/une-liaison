export type Lang = 'zh' | 'ja' | 'en';

export type Product = {
  slug: string;
  emoji: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  features: Record<Lang, string[]>;
};

export const companyInfo = {
  name: 'Une Liaison',
  tagline: '台灣水果，世界共享',
  slogan: '致力於將最新鮮、最優質的台灣水果，以友善環境的方式，帶給全球的消費者。',
  description: 'Une Liaison 堅信，新鮮的水果是連結人與自然的最佳橋樑。我們深耕台灣，與在地小農建立長期合作關係，從源頭把關，確保每一顆水果都飽含陽光的滋養與大地的芬芳。透過嚴謹的品質控管和先進的冷鏈物流技術，我們將這份來自寶島台灣的美味，迅速且安全地送達世界各個角落。我們不僅僅是水果貿易商，更是美好生活的傳遞者，期待透過每一口新鮮，連結起您與台灣土地的深厚情感。',
  philosophy: {
    title: '連結世界，品味台灣之心',
    items: [
      '嚴選在地小農，支持永續農業',
      '堅持高品質標準，確保新鮮美味',
      '推廣台灣特色水果，分享美好滋味',
      '實踐環境友善，共創永續未來',
    ],
  },
  values: '我們以誠信為基石，透明化每一個環節，與夥伴和客戶建立長久的信任關係。創新是我們的驅動力，不斷尋找更優質的品種和更高效的物流方案。責任感驅使我們關懷環境，回饋社會。',
  advantage: '憑藉深厚的台灣在地網絡和廣泛的國際貿易經驗，我們能迅速響應市場需求，提供多樣化且高品質的台灣水果。',
  passion: '我們熱愛台灣這片土地，熱愛水果帶來的喜悅，更熱愛將這份美好分享給世界的每一個角落。',
};

export const products: Product[] = [
  {
    slug: 'taiwan-pineapple',
    emoji: '🍍',
    name: { zh: '台灣鳳梨', ja: '台湾パイナップル', en: 'Taiwan Pineapple' },
    description: {
      zh: '金鑽鳳梨，甜度高，果肉細緻，香氣濃郁。',
      ja: '金鑽パイナップル、甘みが高く、果肉が細かく、香りが浓郁です。',
      en: 'Jinzuan pineapple with high sweetness, tender flesh, and rich aroma.',
    },
    features: {
      zh: ['香甜多汁', '纖維細緻', '產地直送'],
      ja: ['甘くてジューシー', '繊維が細い', '産地直送'],
      en: ['Sweet & Juicy', 'Fine Texture', 'Direct from Farm'],
    },
  },
  {
    slug: 'taiwan-mango',
    emoji: '🥭',
    name: { zh: '台灣芒果', ja: '台湾マンゴー', en: 'Taiwan Mango' },
    description: {
      zh: '愛文芒果，果肉橙黃，香氣馥郁，口感滑順。',
      ja: 'アوين芒果、果肉がオレンジ色で、香りが浓郁、舌触りが滑らかです。',
      en: 'Irwin mango with orange-yellow flesh, rich fragrance, and smooth texture.',
    },
    features: {
      zh: ['香甜軟糯', '熱帶風味', '季節限定'],
      ja: ['甘くて柔らかい', 'トロピカル风味', '季節限定'],
      en: ['Sweet & Tender', 'Tropical Flavor', 'Seasonal'],
    },
  },
  {
    slug: 'aomori-apple',
    emoji: '🍎',
    name: { zh: '青森蘋果', ja: '青森りんご', en: 'Aomori Apple' },
    description: {
      zh: '來自日本青森的頂級富士蘋果，清脆多汁，甜度與酸度的完美平衡。',
      ja: '日本青森からの最高級紅ロールりんご、しゃきっとジューシー、甘さと酸度の完璧なバランス。',
      en: 'Premium Fuji apple from Aomori, Japan. Crisp, juicy, perfect balance of sweetness and acidity.',
    },
    features: {
      zh: ['清脆多汁', '酸甜平衡', '產地直送'],
      ja: ['しゃきっとジューシー', '酸甜バランス', '産地直送'],
      en: ['Crisp & Juicy', 'Balanced Sweetness', 'Direct from Farm'],
    },
  },
  {
    slug: 'dragon-fruit',
    emoji: '🐉',
    name: { zh: '火龍果', ja: 'ドラゴンフルーツ', en: 'Dragon Fruit' },
    description: {
      zh: '紅肉火龍果，甜度適中，口感清爽，富含膳食纖維。',
      ja: '赤肉ドラゴンフルーツ、甘み适中、口触りがすがすがしく、食物繊維が豊富。',
      en: 'Red-fleshed dragon fruit with moderate sweetness, refreshing taste, and rich dietary fiber.',
    },
    features: {
      zh: ['清爽解渴', '營養豐富', '自然甜美'],
      ja: ['すがすがしい', '栄養豊富', '自然な甘み'],
      en: ['Refreshing', 'Nutritious', 'Naturally Sweet'],
    },
  },
];