export interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  recommendedContainer: string;
}

export const STORES: Store[] = [
  // 건강식
  {
    id: "h_1",
    name: "폴인포케 온양온천점",
    category: "건강식",
    address: "충남 아산시 온궁로 26 2층",
    recommendedContainer: "약 1.0L"
  },
  {
    id: "h_2",
    name: "샐로우",
    category: "건강식",
    address: "충남 아산시 온천대로 1514 1층",
    recommendedContainer: "약 1.5L"
  },
  {
    id: "h_3",
    name: "본죽 온양온천점",
    category: "건강식",
    address: "충남 아산시 온천대로 1490",
    recommendedContainer: "약 1.0L"
  },
  {
    id: "h_4",
    name: "본죽 아산터미널점",
    category: "건강식",
    address: "충남 아산시 번영로 228",
    recommendedContainer: "약 1.0L"
  },
  {
    id: "h_5",
    name: "본죽 아산모종점",
    category: "건강식",
    address: "충남 아산시 모종남로12번길 11 103호",
    recommendedContainer: "약 1.0L"
  },
  {
    id: "h_6",
    name: "서브웨이 아산온양점",
    category: "건강식",
    address: "충남 아산시 온궁로 24-2 1층 써브웨이",
    recommendedContainer: "약 1.6L"
  },
  {
    id: "h_7",
    name: "서브웨이 아산터미널점",
    category: "건강식",
    address: "충남 아산시 번영로224번길 4",
    recommendedContainer: "약 1.6L"
  },
  {
    id: "h_8",
    name: "서브웨이 아산배방점",
    category: "건강식",
    address: "충남 아산시 배방읍 모산로 123",
    recommendedContainer: "약 1.6L"
  },
  {
    id: "h_9",
    name: "서브웨이 아산둔포점",
    category: "건강식",
    address: "충남 아산시 아산밸리중앙로 80-24 1층 103호~105호",
    recommendedContainer: "약 1.6L"
  },
  {
    id: "h_10",
    name: "서브웨이 천안충무로점",
    category: "건강식",
    address: "충남 천안시 서북구 충무로 201 월정빌딩 1층",
    recommendedContainer: "약 1.6L"
  },
  // 분식 및 패스트푸드
  {
    id: "b_1",
    name: "롯데리아 온양온천점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 번영로 230",
    recommendedContainer: "• 세트: 800ml ~ 1.0L\n• 단품 버거: 600ml ~ 750ml\n• 감자튀김: 450ml\n• 콜라 컵(R/L): 500ml / 650ml"
  },
  {
    id: "b_2",
    name: "맘스터치 온양온천점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 온궁로 27",
    recommendedContainer: "• 세트: 1.1L ~ 1.3L\n• 단품 버거: 600ml ~ 750ml\n• 감자튀김: 400ml ~ 500ml\n• 콜라 컵(R/L): 500ml / 650ml"
  },
  {
    id: "b_3",
    name: "엽기떡볶이 이건 충무점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 충무로20번길 8 2층",
    recommendedContainer: "• 2인 엽떡: 2.7L\n• 토핑 추가 시: 3.0L 이상"
  },
  {
    id: "b_4",
    name: "베스킨라빈스 온양점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 온궁로 26",
    recommendedContainer: "• 싱글레귤러: 약 300ml\n• 싱글킹/더블주니어: 350ml ~ 400ml\n• 더블레귤러: 약 500ml\n• 파인트: 700ml ~ 800ml\n• 쿼터: 1.2L ~ 1.3L\n• 패밀리: 1.5L ~ 1.6L\n• 하프갤런: 1.8L ~ 2.0L"
  },
  {
    id: "b_5",
    name: "떡볶이참잘하는집 떡참 아산온양점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 번영로169번길 15 1층(권곡동)",
    recommendedContainer: "• 세트 메뉴: 1.5L ~ 1.8L\n• 떡참 떡볶이: 1.5L\n• 쫄볶이: 1.8L"
  },
  {
    id: "b_6",
    name: "명랑핫도그 아산터미널점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 번영로 223 105호",
    recommendedContainer: "• 핫도그 2개: 1.2L\n• 떡볶이 메뉴: 1.7L"
  },
  {
    id: "b_7",
    name: "교촌치킨 용화점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 온중로 5",
    recommendedContainer: "• 반반치킨: 2.2L ~ 2.6L"
  },
  {
    id: "b_8",
    name: "멕시카나 아산탕정점",
    category: "분식 및 패스트푸드",
    address: "충남 아산시 탕정면 탕정면로 12 1층 102호",
    recommendedContainer: "• 치토스치킨: 3.2L"
  },
  // 식사류
  {
    id: "m_1",
    name: "행컵 탕정점",
    category: "식사류",
    address: "충남 아산시 탕정면 한들물빛5로 36 G동 109호",
    recommendedContainer: "800ml ~ 1.0L"
  },
  {
    id: "m_2",
    name: "가득찬 김밥",
    category: "식사류",
    address: "충남 아산시 배방읍 희망로46번길 8 1층 116호",
    recommendedContainer: "900ml ~ 1.0L"
  },
  {
    id: "m_3",
    name: "동백카츠 아산점",
    category: "식사류",
    address: "충남 아산시 번영로234번길 16 3동 1층 2호",
    recommendedContainer: "• 돈카츠 메뉴: 1.0L ~ 1.5L\n• 파스타 메뉴: 1.0L ~ 1.2L"
  },
  {
    id: "m_4",
    name: "파파1215",
    category: "식사류",
    address: "충남 아산시 청운로 157 1층",
    recommendedContainer: "• 파스타 메뉴: 1.0L ~ 1.2L\n• 필라프 메뉴: 800ml ~ 1.0L"
  },
  {
    id: "m_5",
    name: "이모네",
    category: "식사류",
    address: "충남 아산시 번영로169번길 23 한올고 후문 신문구나라 옆",
    recommendedContainer: "주먹밥: 700ml ~ 800ml"
  },
  {
    id: "m_6",
    name: "또또와",
    category: "식사류",
    address: "충남 아산시 번영로169번길 22",
    recommendedContainer: "700ml ~ 800ml"
  },
  {
    id: "m_7",
    name: "신짬뽕",
    category: "식사류",
    address: "충남 아산시 번영로 190",
    recommendedContainer: "1.5L ~ 2.0L"
  },
  {
    id: "m_8",
    name: "불꽃짬뽕 아산본점",
    category: "식사류",
    address: "충남 아산시 번영로 199 1층",
    recommendedContainer: "1.5L ~ 2.0L"
  },
  // 디저트
  {
    id: "d_1",
    name: "설빙 온양온양점",
    category: "디저트",
    address: "충남 아산시 온궁로 22 2층",
    recommendedContainer: "• 빙수 메뉴: 1.5L ~ 1.8L"
  },
  {
    id: "d_2",
    name: "투썸플레이스 아산터미널점",
    category: "디저트",
    address: "충남 아산시 번영로 212",
    recommendedContainer: "• 조각 케이크 1개: 500ml ~ 600ml\n• 떠먹는 케이크: 약 700ml"
  },
  {
    id: "d_3",
    name: "투썸플레이스 아산신용화점",
    category: "디저트",
    address: "충남 아산시 어의정로 93 1층",
    recommendedContainer: "• 조각 케이크 1개: 500ml ~ 600ml\n• 떠먹는 케이크: 약 700ml"
  },
  {
    id: "d_4",
    name: "소로로",
    category: "디저트",
    address: "충남 아산시 번영로 179번길 39-1",
    recommendedContainer: "• 조각 케이크 1개: 500ml ~ 600ml\n• 빵류: 600ml ~ 700ml"
  },
  {
    id: "d_5",
    name: "나슬",
    category: "디저트",
    address: "충남 아산시 충무로 94번길 16",
    recommendedContainer: "• 조각 케이크 1개: 500ml ~ 600ml\n• 빵류: 600ml ~ 700ml"
  },
  {
    id: "d_6",
    name: "메가MGC커피 아산터미널점",
    category: "디저트",
    address: "충남 아산시 모종동 번영로 220 1",
    recommendedContainer: "• 크로플/빵류: 500ml ~ 600ml\n• 기본 음료(24oz): 텀블러 750ml ~ 850ml"
  },
  {
    id: "d_7",
    name: "메가MGC커피 아산권곡초점",
    category: "디저트",
    address: "충남 아산시 문화로 257-10 1층 114호",
    recommendedContainer: "• 크로플/빵류: 500ml ~ 600ml\n• 기본 음료(24oz): 텀블러 750ml ~ 850ml"
  },
  {
    id: "d_8",
    name: "메가MGC커피 온양온천역점",
    category: "디저트",
    address: "충남 아산시 온궁로 27-1 1층 103호",
    recommendedContainer: "• 크로플/빵류: 500ml ~ 600ml\n• 기본 음료(24oz): 텀블러 750ml ~ 850ml"
  }
];

export interface StampCertification {
  id: string;
  date: string;
  imageUrl: string;
  storeName: string;
  earned: boolean;
}

export const STORE_TRANSLATIONS: Record<string, {
  name: { en: string; de: string };
  address: { en: string; de: string };
}> = {
  h_1: {
    name: { en: "Fall In Poke (Onyang Oncheon Branch)", de: "Fall In Poke (Onyang-Oncheon-Filiale)" },
    address: { en: "2nd Floor, 26 Ongung-ro, Asan-si, Chungnam", de: "2. Stock, 26 Ongung-ro, Asan-si, Chungnam" }
  },
  h_2: {
    name: { en: "Sallow", de: "Sallow" },
    address: { en: "1st Floor, 1514 Oncheon-daero, Asan-si, Chungnam", de: "1. Stock, 1514 Oncheon-daero, Asan-si, Chungnam" }
  },
  h_3: {
    name: { en: "Bonjuk (Onyang Oncheon Branch)", de: "Bonjuk (Onyang-Oncheon-Filiale)" },
    address: { en: "1490 Oncheon-daero, Asan-si, Chungnam", de: "1490 Oncheon-daero, Asan-si, Chungnam" }
  },
  h_4: {
    name: { en: "Bonjuk (Asan Terminal Branch)", de: "Bonjuk (Asan-Terminal-Filiale)" },
    address: { en: "228 Beonyeong-ro, Asan-si, Chungnam", de: "228 Beonyeong-ro, Asan-si, Chungnam" }
  },
  h_5: {
    name: { en: "Bonjuk (Asan Mojong Branch)", de: "Bonjuk (Asan-Mojong-Filiale)" },
    address: { en: "Room 103, 11 Mojongnam-ro 12beon-gil, Asan-si, Chungnam", de: "Zimmer 103, 11 Mojongnam-ro 12beon-gil, Asan-si, Chungnam" }
  },
  h_6: {
    name: { en: "Subway (Asan Onyang Branch)", de: "Subway (Asan-Onyang-Filiale)" },
    address: { en: "1st Floor Subway, 24-2 Ongung-ro, Asan-si, Chungnam", de: "1. Stock Subway, 24-2 Ongung-ro, Asan-si, Chungnam" }
  },
  h_7: {
    name: { en: "Subway (Asan Terminal Branch)", de: "Subway (Asan-Terminal-Filiale)" },
    address: { en: "4 Beonyeong-ro 224beon-gil, Asan-si, Chungnam", de: "4 Beonyeong-ro 224beon-gil, Asan-si, Chungnam" }
  },
  h_8: {
    name: { en: "Subway (Asan Baebang Branch)", de: "Subway (Asan-Baebang-Filiale)" },
    address: { en: "123 Mosan-ro, Baebang-eup, Asan-si, Chungnam", de: "123 Mosan-ro, Baebang-eup, Asan-si, Chungnam" }
  },
  h_9: {
    name: { en: "Subway (Asan Dunpo Branch)", de: "Subway (Asan-Dunpo-Filiale)" },
    address: { en: "Rooms 103-105, 1F, 80-24 Asanvalleyjungang-ro, Asan-si, Chungnam", de: "Zimmer 103-105, 1. Stock, 80-24 Asanvalleyjungang-ro, Asan-si, Chungnam" }
  },
  h_10: {
    name: { en: "Subway (Cheonan Chungmu-ro Branch)", de: "Subway (Cheonan-Chungmu-ro-Filiale)" },
    address: { en: "1F Woljeong Building, 201 Chungmu-ro, Seobuk-gu, Cheonan-si, Chungnam", de: "1. Stock Woljeong Geb., 201 Chungmu-ro, Seobuk-gu, Cheonan-si, Chungnam" }
  },
  b_1: {
    name: { en: "Lotteria (Onyang Oncheon Branch)", de: "Lotteria (Onyang-Oncheon-Filiale)" },
    address: { en: "230 Beonyeong-ro, Asan-si, Chungnam", de: "230 Beonyeong-ro, Asan-si, Chungnam" }
  },
  b_2: {
    name: { en: "Mom's Touch (Onyang Oncheon Branch)", de: "Mom's Touch (Onyang-Oncheon-Filiale)" },
    address: { en: "27 Ongung-ro, Asan-si, Chungnam", de: "27 Ongung-ro, Asan-si, Chungnam" }
  },
  b_3: {
    name: { en: "Yupdduk (Asan Chungmu Branch)", de: "Yupdduk (Asan-Chungmu-Filiale)" },
    address: { en: "2nd Floor, 8 Chungmu-ro 20beon-gil, Asan-si, Chungnam", de: "2. Stock, 8 Chungmu-ro 20beon-gil, Asan-si, Chungnam" }
  },
  b_4: {
    name: { en: "Baskin Robbins (Onyang Branch)", de: "Baskin Robbins (Onyang-Filiale)" },
    address: { en: "26 Ongung-ro, Asan-si, Chungnam", de: "26 Ongung-ro, Asan-si, Chungnam" }
  },
  b_5: {
    name: { en: "Tteokcham (Asan Onyang Branch)", de: "Tteokcham (Asan-Onyang-Filiale)" },
    address: { en: "1st Floor, 15 Beonyeong-ro 169beon-gil, Asan-si, Chungnam", de: "1. Stock, 15 Beonyeong-ro 169beon-gil, Asan-si, Chungnam" }
  },
  b_6: {
    name: { en: "Myungrang Hot Dog (Asan Terminal Branch)", de: "Myungrang Hot Dog (Asan-Terminal-Filiale)" },
    address: { en: "Room 105, 223 Beonyeong-ro, Asan-si, Chungnam", de: "Zimmer 105, 223 Beonyeong-ro, Asan-si, Chungnam" }
  },
  b_7: {
    name: { en: "Kyochon Chicken (Yonghwa Branch)", de: "Kyochon Chicken (Yonghwa-Filiale)" },
    address: { en: "5 Onjung-ro, Asan-si, Chungnam", de: "5 Onjung-ro, Asan-si, Chungnam" }
  },
  b_8: {
    name: { en: "Mexicana (Asan Tangjeong Branch)", de: "Mexicana (Asan-Tangjeong-Filiale)" },
    address: { en: "Room 102, 1F, 12 Tangjeongmyeon-ro, Tangjeong-myeon, Asan-si, Chungnam", de: "Zimmer 102, 1. Stock, 12 Tangjeongmyeon-ro, Tangjeong-myeon, Asan-si, Chungnam" }
  },
  m_1: {
    name: { en: "Haengcup (Tangjeong Branch)", de: "Haengcup (Tangjeong-Filiale)" },
    address: { en: "Room 109, Building G, 36 Handeulmulbit 5-ro, Tangjeong-myeon, Asan-si, Chungnam", de: "Zimmer 109, Geb. G, 36 Handeulmulbit 5-ro, Tangjeong-myeon, Asan-si, Chungnam" }
  },
  m_2: {
    name: { en: "Gadeukchan Gimbap", de: "Gadeukchan Gimbap" },
    address: { en: "Room 116, 1F, 8 Himang-ro 46beon-gil, Baebang-eup, Asan-si, Chungnam", de: "Zimmer 116, 1. Stock, 8 Himang-ro 46beon-gil, Baebang-eup, Asan-si, Chungnam" }
  },
  m_3: {
    name: { en: "Dongbaek Katsu (Asan Branch)", de: "Dongbaek Katsu (Asan-Filiale)" },
    address: { en: "No. 2, 1F, Building 3, 16 Beonyeong-ro 234beon-gil, Asan-si, Chungnam", de: "Nr. 2, 1. Stock, Geb. 3, 16 Beonyeong-ro 234beon-gil, Asan-si, Chungnam" }
  },
  m_4: {
    name: { en: "Papa 1215", de: "Papa 1215" },
    address: { en: "1st Floor, 157 Cheongun-ro, Asan-si, Chungnam", de: "1. Stock, 157 Cheongun-ro, Asan-si, Chungnam" }
  },
  m_5: {
    name: { en: "Imone", de: "Imone" },
    address: { en: "23 Beonyeong-ro 169beon-gil, Asan-si, Chungnam (Next to Sinmungunara, Hanol High School Back Gate)", de: "23 Beonyeong-ro 169beon-gil, Asan-si, Chungnam (Neben Sinmungunara, Hintertor der Hanol-Highschool)" }
  },
  m_6: {
    name: { en: "Ttottowa", de: "Ttottowa" },
    address: { en: "22 Beonyeong-ro 169beon-gil, Asan-si, Chungnam", de: "22 Beonyeong-ro 169beon-gil, Asan-si, Chungnam" }
  },
  m_7: {
    name: { en: "Shin Jjamppong", de: "Shin Jjamppong" },
    address: { en: "190 Beonyeong-ro, Asan-si, Chungnam", de: "190 Beonyeong-ro, Asan-si, Chungnam" }
  },
  m_8: {
    name: { en: "Bulkkot Jjamppong (Asan Main Store)", de: "Bulkkot Jjamppong (Asan-Hauptfiliale)" },
    address: { en: "1F, 199 Beonyeong-ro, Asan-si, Chungnam", de: "1. Stock, 199 Beonyeong-ro, Asan-si, Chungnam" }
  },
  d_1: {
    name: { en: "Sulbing (Onyang Onyang Branch)", de: "Sulbing (Onyang-Onyang-Filiale)" },
    address: { en: "2nd Floor, 22 Ongung-ro, Asan-si, Chungnam", de: "2. Stock, 22 Ongung-ro, Asan-si, Chungnam" }
  },
  d_2: {
    name: { en: "A Twosome Place (Asan Terminal Branch)", de: "A Twosome Place (Asan-Terminal-Filiale)" },
    address: { en: "212 Beonyeong-ro, Asan-si, Chungnam", de: "212 Beonyeong-ro, Asan-si, Chungnam" }
  },
  d_3: {
    name: { en: "A Twosome Place (Asan Sinyonghwa Branch)", de: "A Twosome Place (Asan-Sinyonghwa-Filiale)" },
    address: { en: "1st Floor, 93 Eouijeong-ro, Asan-si, Chungnam", de: "1. Stock, 93 Eouijeong-ro, Asan-si, Chungnam" }
  },
  d_4: {
    name: { en: "Sororo", de: "Sororo" },
    address: { en: "39-1 Beonyeong-ro 179beon-gil, Asan-si, Chungnam", de: "39-1 Beonyeong-ro 179beon-gil, Asan-si, Chungnam" }
  },
  d_5: {
    name: { en: "Naseul", de: "Naseul" },
    address: { en: "16 Chungmu-ro 94beon-gil, Asan-si, Chungnam", de: "16 Chungmu-ro 94beon-gil, Asan-si, Chungnam" }
  },
  d_6: {
    name: { en: "Mega MGC Coffee (Asan Terminal Branch)", de: "Mega MGC Coffee (Asan-Terminal-Filiale)" },
    address: { en: "1, 220 Beonyeong-ro, Mojong-dong, Asan-si, Chungnam", de: "1, 220 Beonyeong-ro, Mojong-dong, Asan-si, Chungnam" }
  },
  d_7: {
    name: { en: "Mega MGC Coffee (Asan Gwongok Elementary School)", de: "Mega MGC Coffee (Asan-Gwongok-Grundschule)" },
    address: { en: "Room 114, 1F, 257-10 Munhwa-ro, Asan-si, Chungnam", de: "Zimmer 114, 1. Stock, 257-10 Munhwa-ro, Asan-si, Chungnam" }
  },
  d_8: {
    name: { en: "Mega MGC Coffee (Onyang Oncheon Station Branch)", de: "Mega MGC Coffee (Onyang-Oncheon-Bahnhof-Filiale)" },
    address: { en: "Room 103, 1F, 27-1 Ongung-ro, Asan-si, Chungnam", de: "Zimmer 103, 1. Stock, 27-1 Ongung-ro, Asan-si, Chungnam" }
  }
};

