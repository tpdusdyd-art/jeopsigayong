import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API Route: Verify reusable container from base64 image using Gemini
  app.post("/api/verify-container", async (req, res) => {
    try {
      const { image, lang } = req.body;
      if (!image) {
        return res.status(400).json({ error: "이미지 데이터가 누락되었습니다." });
      }

      // Extract the clean base64 string
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `
        당신은 친환경 '접시가' 서비스의 AI 스마트 인증 엔진입니다.
        이 사진이 다회용기(일회용 플라스틱컵, 종이컵, 배달용 얇은 플라스틱 일회용 배달용기, 비닐봉지, 종이봉투 등이 아닌 다회용 락앤락, 반찬통, 텀블러, 개인 머그컵, 보온병, 스테인리스 용기, 집에서 챙겨온 다회용 식기 등)를 들고 있거나 음식을 포장하는 모습인지 분석해야 합니다.
        
        다회용기와 무관한 사진, 풍경, 사람 얼굴 중심의 일반 셀카, 컴퓨터 화면, 일회용 컵/용기, 또는 영수증 등의 사진이라면 반려해야 합니다.

        **CRITICAL REQUIREMENT:**
        You must write all text fields ("reason", "detectedContainer") in the requested language indicated by 'lang' parameter: "${lang || "ko"}".
        - If 'lang' is 'en', respond strictly in English.
        - If 'lang' is 'de', respond strictly in German.
        - If 'lang' is 'ko' or empty, respond strictly in Korean.
        
        반드시 다음 JSON 스키마를 충족하는 형태로만 반환하십시오. 다른 설명이나 텍스트를 JSON 바깥에 작성하지 마십시오:
        {
          "isValid": true 또는 false,
          "reason": "다회용기로 인정된 이유 또는 반려된 구체적인 이유",
          "detectedContainer": "감지된 다회용기의 구체적 종류 이름 (isValid가 false인 경우 빈 문자열)"
        }
      `;

      let response;
      const verifyConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { 
              type: Type.BOOLEAN,
              description: "다회용기를 사용한 사진인 경우 true, 일회용품이거나 무관한 사진인 경우 false"
            },
            reason: { 
              type: Type.STRING,
              description: "판정한 구체적인 언어 설명"
            },
            detectedContainer: { 
              type: Type.STRING,
              description: "감지된 다회용기 설명 (예: 텀블러, 유리 찬기, 스테인리스 도시락 등). 판정이 false인 경우 빈 문자열"
            }
          },
          required: ["isValid", "reason", "detectedContainer"]
        }
      };

      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              }
            },
            {
              text: prompt
            }
          ],
          config: verifyConfig
        });
      } catch (firstError) {
        console.warn("Primary model verification failed, falling back to gemini-flash-latest:", firstError);
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              }
            },
            {
              text: prompt
            }
          ],
          config: verifyConfig
        });
      }

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("AI 분석을 수행하지 못했습니다. 다시 시도해 주세요.");
      }

      const verificationResult = JSON.parse(textOutput.trim());
      res.json({ verificationResult });
    } catch (error: any) {
      console.error("Gemini certification error:", error);
      res.status(500).json({ error: error.message || "다회용기 스캔 중 기술적인 오류가 발생했습니다." });
    }
  });

  // API Route: AI Recommendation for reusable containers
  app.post("/api/recommend-container", async (req, res) => {
    try {
      const { foodName, lang } = req.body;
      if (!foodName) {
        return res.status(400).json({ error: "음식 이름을 입력해주세요." });
      }

      const cleanFood = foodName.trim().toLowerCase();
      const language = lang || "ko";

      // 1. Ultra-fast local dictionary lookup for instant container recommendations (Dramatic Speed Improvement!)
      let quickRec = null;

      // Classify drink keywords
      if (
        cleanFood.includes("커피") || cleanFood.includes("라떼") || cleanFood.includes("아메리카노") || cleanFood.includes("음료") || 
        cleanFood.includes("차") || cleanFood.includes("주스") || cleanFood.includes("에이드") || cleanFood.includes("에스프레소") ||
        cleanFood.includes("콜라") || cleanFood.includes("사이다") || cleanFood.includes("음료수") ||
        cleanFood.includes("tea") || cleanFood.includes("coffee") || cleanFood.includes("latte") || cleanFood.includes("juice") || 
        cleanFood.includes("beverage") || cleanFood.includes("drink") || cleanFood.includes("mug") || cleanFood.includes("cup") ||
        cleanFood.includes("wasser") || cleanFood.includes("kaffee") || cleanFood.includes("saft") || cleanFood.includes("tee")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "이중벽 진공 단열 밀폐 텀블러 또는 개인 스마트 머그컵",
            material: "위생적이고 반영구적인 식품 등급 304 스테인리스 스틸",
            sizeGuide: "기본 권장 용량 500ml 이상 (대용량 디저트 음료 및 얼음 포함 시 750ml~850ml 이상 권장)",
            tip: "뜨거운 음료 주문 시에는 내외부 온도 비대칭으로 인한 내부 증기 압력 팽창을 방지하기 위해 텀블러 씰 캡을 아주 살짝만 열어 온도를 순환한 채 안전 결합하는 노하우가 좋습니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Doppelwandiger Vakuum-Isolierbecher oder Thermobecher",
            material: "Lebensmittelechter 304 Edelstahl",
            sizeGuide: "Standardmäßig 500 ml oder mehr (für große Getränke mit Eis 750 ml empfohlen)",
            tip: "Bei heißen Getränken den Deckel kurz leicht geöffnet halten, um den Dampfdruck abzulassen, bevor er vollständig verschlossen wird."
          };
        } else {
          quickRec = {
            containerType: "Double-walled Vacuum Insulated Sealed Tumbler or Smart Mug",
            material: "Food-grade 304 Stainless Steel or High-Borosilicate Glass",
            sizeGuide: "At least 550ml (750ml - 850ml is recommended for large iced beverages containing ice cubes)",
            tip: "For hot beverages, leave the drinking cap slightly unsealed at first to neutralize expansion from steam pressure before packing safely."
          };
        }
      } 
      // Classify Korean rice cake, soups, stews, hotpots
      else if (
        cleanFood.includes("떡볶이") || cleanFood.includes("엽떡") || cleanFood.includes("마라탕") || cleanFood.includes("찌개") || 
        cleanFood.includes("국밥") || cleanFood.includes("탕") || cleanFood.includes("국") || cleanFood.includes("삼계탕") ||
        cleanFood.includes("soup") || cleanFood.includes("stew") || cleanFood.includes("hotpot") || cleanFood.includes("ramen") ||
        cleanFood.includes("라면") || cleanFood.includes("supp") || cleanFood.includes("brühe") || cleanFood.includes("eintopf")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "깊고 넓은 고밀폐 돔형 국탕 전용 용기 또는 실리콘 패킹 스텐 통",
            material: "고열과 붉은 국물 이염 방지에 탁월한 고붕소 내열유리 또는 스테인리스 스틸",
            sizeGuide: "1인 국물 기준 최소 1.5L 수준 / 다인분 포장이나 사리/토핑 다량 추가 시 2.5L~3.0L 대용량 안전 권장",
            tip: "새빨간 양념 국물이 넘치거나 세는 참사를 막기 위해 뚜껑 테두리에 고탄성 실리콘 안심 고무 패킹이 꼼꼼하게 삽입되어 단단히 잠기는 강력 잠금 밀폐 방식의 용기를 고르세요."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Tiefe, gut versiegelte auslaufsichere Thermoschüssel oder Edelstahldose",
            material: "Hitzebeständiges Borosilikatglas oder hochqualitativer Edelstahl 304",
            sizeGuide: "Mindestens 1,5 Liter für Suppen/Eintöpfe (für mehrere Portionen 2,5 bis 3 Liter empfohlen)",
            tip: "Verwenden Sie Behältnisse mit einer flexiblen Silikondichtung, um das Auslaufen heißer, fettiger Suppchen absolut sicher zu verhindern."
          };
        } else {
          quickRec = {
            containerType: "Deep and Wide Airtight Soup Pot or Silicon-sealed Stainless Steel Container",
            material: "Stain-resistant High-Borosilicate Glass or certified Grade 304 Stainless Steel",
            sizeGuide: "At least 1.5L for single portion (2.5L to 3.0L is recommended for supplementary toppings or family sizes)",
            tip: "Choose a lockable lid containing high-fidelity silicon ring insulation to guard completely against greasy or hot soup spills."
          };
        }
      }
      // Classify burger, fries, and dumpling
      else if (
        cleanFood.includes("버거") || cleanFood.includes("햄버거") || cleanFood.includes("감튀") || cleanFood.includes("감자튀김") || 
        cleanFood.includes("만두") || cleanFood.includes("너겟") || cleanFood.includes("튀김") || cleanFood.includes("fritten") ||
        cleanFood.includes("burger") || cleanFood.includes("fry") || cleanFood.includes("fries") || cleanFood.includes("nugget") ||
        cleanFood.includes("dumpling") || cleanFood.includes("pommes") || cleanFood.includes("krokette")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "납작하고 넓은 와이드 사각 친환경 밀폐 용기",
            material: "환경호르몬 우려가 없는 친환경 플래티넘 실리콘 또는 경량 알루미늄/스테인리스",
            sizeGuide: "단품 버거류 및 만두 600ml~800ml / 세트 메뉴나 사이드 여러 개 포장 시 1.2L~1.5L 수준의 용기 지참",
            tip: "바삭바삭한 식감 유지를 위해 튀긴 직후에는 뜨거운 온기를 한 김 날려 보낸 후 완전히 밀봉하십시오. 혹은 아주 살짝 뚜껑을 여유 있게 덮어 공기 순환을 도와주면 눅눅해지는 걸 줄여줍니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Flache, breite rechteckige Frischhaltedose oder Brotdose",
            material: "Geruchsneutrales Platin-Silikon oder robuster Edelstahl 304",
            sizeGuide: "Einzelne Burger 600-800 ml / Für Kombi-Sets und Pommes sind 1,2 bis 1,5 Liter am besten geeignet",
            tip: "Lassen Sie frische Pommes kurz auskühlen, bevor Sie die Dose ganz schließen, damit die Feuchtigkeit weicht und sie maximal knusprig bleiben."
          };
        } else {
          quickRec = {
            containerType: "Flat, Wide Rectangular Lunchbox or Reusable Airtight Food Container",
            material: "BPA-free Platinum Silicone, lightweight Aluminium, or Premium Stainless Steel",
            sizeGuide: "600ml - 800ml for individual burger, or 1.2L - 1.5L wide tray for complete combo sets including fries",
            tip: "To prevent grease condensation makes fried foods soggy, allow hot air to escape for a minute before locking the lid securely as air exchange helps retain crispiness."
          };
        }
      }
      // Classify cake, bakery, croffle, bread
      else if (
        cleanFood.includes("케이크") || cleanFood.includes("디저트") || cleanFood.includes("빵") || cleanFood.includes("와플") || 
        cleanFood.includes("크로플") || cleanFood.includes("도넛") || cleanFood.includes("쿠키") || cleanFood.includes("베이커리") ||
        cleanFood.includes("cake") || cleanFood.includes("dessert") || cleanFood.includes("bread") || cleanFood.includes("waffle") ||
        cleanFood.includes("croffle") || cleanFood.includes("donut") || cleanFood.includes("cookie") || cleanFood.includes("bakery") ||
        cleanFood.includes("kuchen") || cleanFood.includes("gebäck") || cleanFood.includes("brotscheibe") || cleanFood.includes("torte")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "높이가 어느 정도 여유 있는 원형/사각 와이드 돔 수납함 또는 타파웨어",
            material: "내부가 투명하게 확인되는 고강도 가벼운 트라이탄(Tritan) 또는 가벼운 유리",
            sizeGuide: "조각 조각 케이크류 개당 약 600ml 이상 / 타르트 및 홈 파티 홀케이크는 2.0L 대형 사이즈 안전 권장",
            tip: "★신기한 케이크 포장 비법: 뚜껑(Lid)을 바닥에 뒤집어 눕혀 놓고 그 위에 케이크를 살며시 안착시킨 다음, 용기 본체 통을 마치 돔 형태의 지붕 커버처럼 거꾸로 씌워 닫으시면 훼손 없이 안전하고 완벽하게 포장됩니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Höhere quadratische oder runde Frischhaltedose mit viel Kopffreiheit",
            material: "Hochtransparentes Tritan-Material oder stabiles Borosilikat-Glas",
            sizeGuide: "Etwa 600 ml für ein einzelnes Stück Kuchen / Ab 2 Liter für ganze Gebäckstücke oder Torten",
            tip: "Tipp: Legen Sie das Kuchenstück auf die Innenseite des Deckels und stülpen Sie den Behälter wie eine Kuppel verkehrt herum darüber. So zerdrückt die Creme nicht!"
          };
        } else {
          quickRec = {
            containerType: "Spacious High-ceilinged Square Domed Box or Clear Storage Container",
            material: "Unbreakable transparent Tritan polymers or Lightweight Food-grade Glasses",
            sizeGuide: "At least 600ml for single cake slice / 2.0L or higher for large pastries or whole celebration cakes",
            tip: "Awesome Packaging Trick: Lay the lid flat upside down on the counter first, place your cake carefully on it, and then cover it with the deep container dome. This protects delicate frosting perfectly!"
          };
        }
      }
      // Classify ice cream, shaved ice
      else if (
        cleanFood.includes("아이스크림") || cleanFood.includes("빙수") || cleanFood.includes("설빙") || cleanFood.includes("베스킨") || 
        cleanFood.includes("젤라또") || cleanFood.includes("eis") || cleanFood.includes("bingsu") || cleanFood.includes("icecream") ||
        cleanFood.includes("ice cream") || cleanFood.includes("shaved ice") || cleanFood.includes("gelato") || cleanFood.includes("sorbet")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "완전 밀폐형 진공 보온통 또는 이중 외벽 아이스 보냉 보틀",
            material: "차가운 온도를 오래 붙잡아두는 우수한 이중벽 진공 구조 스테인리스(SUS304)",
            sizeGuide: "설빙 및 눈꽃 빙수 종류 1.5L~1.8L 수준 넉넉한 대접형 보온통 / 아이스크림 포장은 700ml 이상 보냉 병",
            tip: "매장에 가져가기 전 냉장고 냉동칸에 용기를 약 10~15분 동안 미리 넣어 냉각시켜 두면, 빙수가 용기 표면 닿자마자 급격히 녹는 것을 방지하여 원형을 훨씬 더 오랫동안 꽁꽁 안전 보존하게 됩니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Vaqkuum-isolierter Thermo-Speisebehälter oder eiskalte Box",
            material: "Doppelwandiger thermo-isolierter Edelstahl (Innen-SUS304)",
            sizeGuide: "Ca. 700 ml für Gelato / 1,5 bis 2,0 Liter für traditionelle geraspelte Eisdesserts (Bingsu)",
            tip: "Stellen Sie Ihre leere Thermosdose vor dem Gang zur Eisdiele für 10-15 Min in das Gefrierfach. Das verhindert das schnelle Schmelzen beim Kontakt."
          };
        } else {
          quickRec = {
            containerType: "Sealed Double-walled Vacuum Food Jar or Insulated Lunch Jar",
            material: "Premium double-walled thermal Stainless Steel (SUS304 grade is best to sustain thermal defense)",
            sizeGuide: "Around 700ml for gelato packs / 1.5L to 1.8L wide vacuum-insulated pots are required for shaved ice bowls (Bingsu)",
            tip: "Pre-chill the eco container in your freezer for 10 to 15 minutes before headed to the shop. This prevents immediate ice crystals from thawing upon contact."
          };
        }
      }
      // Classify sushi, gimbap, sandwich, salad, bento
      else if (
        cleanFood.includes("김밥") || cleanFood.includes("샐러드") || cleanFood.includes("샌드위치") || cleanFood.includes("초밥") || 
        cleanFood.includes("스시") || cleanFood.includes("도시락") || cleanFood.includes("포케") || cleanFood.includes("반찬") ||
        cleanFood.includes("gimbap") || cleanFood.includes("salad") || cleanFood.includes("sandwich") || cleanFood.includes("sushi") ||
        cleanFood.includes("bento") || cleanFood.includes("poke") || cleanFood.includes("side-dish") || cleanFood.includes("lunchbox") ||
        cleanFood.includes("salat") || cleanFood.includes("brötchen") || cleanFood.includes("sushi-box") || cleanFood.includes("proviantdose")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "다용도 분리 칸막이가 있는 평평한 와이드 밀폐용기",
            material: "친환경 트라이탄, 플래티넘 실리콘 식기류, 또는 가벼운 친환경 스테인리스",
            sizeGuide: "김밥 1줄 600ml~750ml / 일반 포케 및 헬시 샐러드 도시락 포장은 1.0L ~ 1.2L 이상 직사각형 용기",
            tip: "드레싱 소스가 들어가는 음식의 경우 소스를 미리 샐러드에 다 부어 포장하면 가면서 수분에 절여져 질퍽해지므로, 내부 장착용 미니 소스용기 1개를 사전에 따로 곁들여 지참하는 꿀팁을 권합니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Flache, unterteilte Bento-Box oder Lunchbox mit Trennwänden",
            material: "BPA-freies Tritan, langlebiger Edelstahl oder Bambusfaser-Verbindung",
            sizeGuide: "Gimbap/Sushi 700 ml / Frische große Salate und Bowls brauchen 1,0 bis 1,2 Liter Volumen",
            tip: "Nehmen Sie ein kleines Extradöschen für Soßen oder Dressings mit, damit der Salat während des Heimwegs knackig bleibt und nicht matschig wird."
          };
        } else {
          quickRec = {
            containerType: "Multi-compartment Flat Bento Box or Flat Airtight Airtight-Seal Box",
            material: "BPA-free Tritan resins, High-durability Platinum Silicone, or certified Stainless Steel 304",
            sizeGuide: "700ml for individual rolls or sandwiches / 1.0L to 1.2L rectangular container is best for large vegetables or poke",
            tip: "To avoid getting dressing over the clean ingredients which makes lunch soggy, prepare a separate miniature container pill to hold sauces alone."
          };
        }
      }
      // Classify chicken, pizza, pork feet, ribs
      else if (
        cleanFood.includes("치킨") || cleanFood.includes("피자") || cleanFood.includes("족발") || cleanFood.includes("보쌈") || 
        cleanFood.includes("삼겹살") || cleanFood.includes("구이") || cleanFood.includes("고기") || cleanFood.includes("화로") ||
        cleanFood.includes("chicken") || cleanFood.includes("pizza") || cleanFood.includes("ribs") || cleanFood.includes("meat") ||
        cleanFood.includes("pork") || cleanFood.includes("hähnchen") || cleanFood.includes("schweineschnitzel") || cleanFood.includes("rind")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "어마어마한 부피를 감당하는 초대형 광폭 에코 사각 바스켓 / 캐리 백",
            material: "가열 열기도 가뿐히 버티는 두꺼운 복합 내열 트라이탄 수지 또는 스테인리스 스틸",
            sizeGuide: "치킨 한 마리 통째 기준 최소 2.5L~3.0L 필요 / 피자 미디엄 사이즈는 최소 가로 25cm 내외의 사각 광폭 납작 통 필요",
            tip: "기름진 육류 조리는 포장 뒤에 용기에 오일 누적 흔적이 강하게 달라붙게 됩니다. 집에 오셔서 드신 뒤에 기름기가 아직 미지근한 상태에서 전용 타월로 가볍게 잔여 기름을 쓱 훑어 닦은 후 주방세제로 거품 목욕을 시켜주면 정말 상쾌하고 쉽게 세척됩니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Extra-große flache rechteckige Transportdose oder XL-Bento",
            material: "Hygienischer Edelstahl 304 oder robuster hitzebeständiger Kunststoff (BPA-frei)",
            sizeGuide: "Ein ganzes Brathähnchen benötigt 2,5 bis 3 Liter / Pizza M-Größe erfordert mindestens eine 3,5-Liter-Flachdose",
            tip: "Reinigen Sie fettige Essensrückstände kurz mit einem Papiertuch vor, solange sie noch warm sind. Die anschließende Reinigung mit Seifenwasser wird dadurch kinderleicht."
          };
        } else {
          quickRec = {
            containerType: "Ultra-large Wide Square Multi-use Container or BBQ Platter Lid",
            material: "High-temperature resistant durable Tritan polymers or eco Stainless Steel 304",
            sizeGuide: "At least 2.5L - 3.0L capacity for a whole chicken fried bucket / Large wide flat layouts of 3.5L or up for pizzas",
            tip: "Greasy meats can leave sticky oil stains. Wipe the container empty using a paper towel while the residual oil is slightly warm. Wash with dishsoap after to clean instantly!"
          };
        }
      }
      // Classify general noodles and pasta
      else if (
        cleanFood.includes("파스타") || cleanFood.includes("짜장") || cleanFood.includes("짬뽕") || cleanFood.includes("면") || 
        cleanFood.includes("국수") || cleanFood.includes("스파게티") || cleanFood.includes("우동") || cleanFood.includes("마라반") ||
        cleanFood.includes("pasta") || cleanFood.includes("noodle") || cleanFood.includes("noodles") || cleanFood.includes("spaghetti") ||
        cleanFood.includes("bratnudeln") || cleanFood.includes("nudelsuppe") || cleanFood.includes("pastateller")
      ) {
        if (language === "ko") {
          quickRec = {
            containerType: "면발 불기와 국물 일체형 포장에 최적인 이중 주방 전용 면기 대접",
            material: "진공 수단 내벽 단열 기술을 장착한 고품격 올인원 스테인리스 대장 용기",
            sizeGuide: "1인분 기준 국물이 들어간 제품은 흘림 방지를 위해 1.2L~1.5L 가량 넉넉한 구도 권장",
            tip: "집으로 가져가는 사이 면발이 국물 수분을 다 흡수해버리는 안타까운 사고를 줄이기 위해, 주문 접수 당시에 '면과 스프/소스를 용기 단면 내에 별도 칸으로 따로따로 포장해 주실 수 있나요'하고 한마디 남겨보시기를 강력 권유드립니다."
          };
        } else if (language === "de") {
          quickRec = {
            containerType: "Doppelwandige, breite Nudelschale mit abgedichtetem Verschluss",
            material: "Thermogeschützter Edelstahl zur Verhinderung von Verbrennungen",
            sizeGuide: "Mindestens 1,2 bis 1,5 Liter Fassungsvermögen, um Ausrollen oder Brühespritzen zu meiden",
            tip: "Um zu verhindern, dass die Nudeln die gesamte Sauce aufsaugen, bitten Sie das Restaurant einfach, Nudeln und Sauce/Brühe getrennt einzupacken."
          };
        } else {
          quickRec = {
            containerType: "Double-walled Deep Thermal Pasta Bowl or Sealable Noodle Pot",
            material: "Heat-retaining vacuum insulated Premium Stainless Steel or Tempered Glass",
            sizeGuide: "1.2L to 1.5L is ideal to allow generous buffer space and prevent hot broth overflow ripples",
            tip: "To prevent delicious pasta or noodles from absorbing the entire fluid sauce layer on way home, kindly ask the kitchen to pack noodles separately from broth."
          };
        }
      }

      // If matched locally, respond instantly! (0ms to 1ms search speed!)
      if (quickRec) {
        return res.json({ recommendation: quickRec });
      }

      // 2. Real-time Gemini fallback for all other unique foods
      const prompt = `
        당신은 친환경 '접시가' 서비스의 다회용 용기 및 제로웨이스트 포장 전문 인공지능 추천 엔진입니다.
        사용자가 포장하려는 음식: "${foodName}"
        이 음식의 물리적 특성(수분 함량, 기름기, 뜨거운 정도, 부피 변화, 국물 유무 등)을 종합적으로 고려하여 가장 적합한 이상적인 다회용 용기 추천 정보와 유용한 전문 포장 팁을 추출해줘.

        **CRITICAL REQUIREMENT:**
        You must write all output fields ("containerType", "material", "sizeGuide", "tip") in the requested language indicated by 'lang' parameter: "${lang || "ko"}".
        - If 'lang' is 'en', respond strictly in English.
        - If 'lang' is 'de', respond strictly in German.
        - If 'lang' is 'ko' or empty, respond strictly in Korean.
      `;

      let response;
      const recommendConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            containerType: {
              type: Type.STRING,
              description: "ideal reusable container type description tailored to the specific food features (e.g. deep round thermal bowl, wide double-sealed box, flat shallow airtight plate, etc.)",
            },
            material: {
              type: Type.STRING,
              description: "recommended materials considering heat retention, grease resistance, stain prevention, and durability (e.g. food-grade stainless steel 304, high-borosilicate glass, thick platinum silicone)",
            },
            sizeGuide: {
              type: Type.STRING,
              description: "precise capacity sizing guide and practical volume metrics (e.g. 1.2L or larger for standard 1 person portion, 700ml wide mug, etc.)",
            },
            tip: {
              type: Type.STRING,
              description: "highly useful, pro packaging tip for user convenience, preventing spills and maximizing food safety",
            }
          },
          required: ["containerType", "material", "sizeGuide", "tip"]
        }
      };

      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: recommendConfig
        });
      } catch (firstError) {
        console.warn("Primary model recommendation failed, falling back to gemini-flash-latest:", firstError);
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: recommendConfig
        });
      }

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("AI가 응답을 생성하지 못했습니다. (세이프티 필터 또는 오류)");
      }

      const recommendation = JSON.parse(textOutput.trim());
      res.json({ recommendation });
    } catch (error: any) {
      console.error("Gemini Error Detail:", error);
      res.status(500).json({ error: error.message || "AI 추천을 가져오는 중 오류가 발생했습니다." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
