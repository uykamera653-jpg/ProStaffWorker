export interface Order {
  id: string;
  categoryId: string;
  categoryName: string;
  location: string;
  description: string;
  images: string[];
  clientName?: string;
  clientPhone?: string;
  status: 'pending' | 'accepted' | 'approved' | 'completed' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Qurilish ishlari',
    location: 'Chilonzor tumani, Toshkent',
    description: 'Uy ta\'miri - devor bo\'yash va pol yopish kerak',
    images: ['https://picsum.photos/400/300?random=1'],
    status: 'pending',
    createdAt: new Date(),
  },
  {
    id: '2',
    categoryId: '4',
    categoryName: 'Yuk ortish/tushirish',
    location: 'Yunusobod tumani, Toshkent',
    description: 'Mebel ko\'chirish - 3 qavatdan 5 qavatga',
    images: ['https://picsum.photos/400/300?random=2', 'https://picsum.photos/400/300?random=3'],
    status: 'pending',
    createdAt: new Date(),
  },
];

export const generateMockOrder = (categoryId: string, categoryName: string): Order => {
  const locations = [
    'Chilonzor tumani, Toshkent',
    'Yunusobod tumani, Toshkent',
    'Mirzo Ulug\'bek tumani, Toshkent',
    'Yakkasaroy tumani, Toshkent',
  ];
  
  const descriptions = [
    'Uy ta\'miri - devor bo\'yash va pol yopish kerak',
    'Mebel yig\'ish va o\'rnatish',
    'Eski binoni buzish',
    'Yuk ortish va tashish',
  ];

  return {
    id: Date.now().toString(),
    categoryId,
    categoryName,
    location: locations[Math.floor(Math.random() * locations.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    images: [
      `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
      `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
    ],
    status: 'pending',
    createdAt: new Date(),
  };
};
