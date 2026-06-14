/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Search, 
  Camera, 
  Award, 
  ChevronRight, 
  Leaf, 
  RotateCcw, 
  Utensils, 
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  User,
  Sprout,
  Trees,
  TreeDeciduous,
  AlertTriangle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { STORES, STORE_TRANSLATIONS, type Store, type StampCertification } from "./types";
import { cn } from "./lib/utils";
import { LanguageProvider, useLanguage, type Language } from "./i18n";


const jeopsiStamp = "/jeopsi_stamp.png";
const jeopsiLogo = "/jeopsi_logo.png";
const greenHill = "/green_hill.png";

// --- Components ---

const Onboarding = ({ onComplete }: { onComplete: (nickname: string) => void }) => {
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const { t } = useLanguage();

  const steps = [
    {
      title: t("onboardingWelcome"),
      desc: t("onboardingDesc1"),
      icon: Leaf,
    },
    {
      title: t("onboardingAskName"),
      desc: t("onboardingDesc2"),
      icon: Utensils,
    }
  ];

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (name.trim()) onComplete(name);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="max-w-xs w-full space-y-8"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            {step === 1 ? <Leaf className="w-10 h-10 text-emerald-600" /> : <Utensils className="w-10 h-10 text-emerald-600" />}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-stone-900 tracking-tighter whitespace-pre-line leading-tight">
              {steps[step-1].title}
            </h2>
            <p className="text-stone-500 whitespace-pre-line leading-relaxed">
              {steps[step-1].desc}
            </p>
          </div>

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input 
                type="text" 
                autoFocus
                placeholder={t("onboardingPlaceholder")}
                maxLength={8}
                className="w-full px-6 py-4 bg-stone-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all text-center text-lg font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
              />
            </motion.div>
          )}

          <button 
            onClick={handleNext}
            disabled={step === 2 && !name.trim()}
            className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 disabled:opacity-30 transition-all active:scale-95"
          >
            {step === 1 ? t("onboardingBtnStart") : t("onboardingBtnComplete")}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Header = ({ nickname, logoUrl, onShowSettings }: { nickname: string | null; logoUrl: string | null; onShowSettings: () => void }) => {
  const [imgError, setImgError] = useState(false);
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-md mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl && !imgError ? (
            <div className="w-12 h-12 bg-white flex items-center justify-center border border-stone-100 shadow-sm aspect-square overflow-hidden">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain aspect-square" 
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Utensils className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-lg font-black text-stone-900 tracking-tight leading-none">{t("appName")}</h1>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">{t("ecoLife")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nickname && (
            <button 
              onClick={onShowSettings}
              className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-200 transition-colors"
            >
              <span className="text-xs font-bold text-stone-700">{nickname}{currentLanguage === "ko" ? "님" : ""}</span>
            </button>
          )}
          <button 
            onClick={onShowSettings}
            className="text-stone-400 hover:text-emerald-600 transition-all p-2.5 rounded-2xl hover:bg-emerald-50 active:scale-90"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

const StoreList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const { t, currentLanguage } = useLanguage();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "전체": return t("categoryAll");
      case "건강식": return t("categoryHealthy");
      case "분식 및 패스트푸드": return t("categoryFastfood");
      case "식사류": return t("categoryMeal");
      case "디저트": return t("categoryDessert");
      default: return category;
    }
  };

  const getTranslatedStore = (store: Store): Store => {
    if (currentLanguage === "ko") return store;
    const trans = STORE_TRANSLATIONS[store.id];
    if (!trans) return store;
    return {
      ...store,
      name: trans.name[currentLanguage as "en" | "de"] || store.name,
      address: trans.address[currentLanguage as "en" | "de"] || store.address,
    };
  };

  const detailStore = selectedStore ? getTranslatedStore(selectedStore) : null;

  const filteredStores = STORES.map(getTranslatedStore).filter(s => {
    const original = STORES.find(o => o.id === s.id)!;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          original.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          original.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCategoryLabel(s.category).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["전체", "건강식", "분식 및 패스트푸드", "식사류", "디저트"];

  return (
    <div className="space-y-6">
      {/* Search Header Info */}
      <div className="space-y-1">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 animate-pulse" />
            {t("storeListTitle")}
          </h2>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            {t("storeListSub")}
          </span>
        </div>
        <p className="text-stone-500 text-xs px-1">{t("storeListDesc")}</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input 
          type="text" 
          placeholder={t("storeListSearchPlaceholder")}
          className="w-full pl-11 pr-4 py-3.5 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm text-stone-800 shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 border",
              selectedCategory === cat
                ? "bg-stone-900 text-white border-stone-900 shadow-md shadow-stone-200"
                : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
            )}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Store List */}
      <div className="space-y-4">
        {filteredStores.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <Info className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-stone-400 font-medium">{t("storeListNoResults")}</p>
          </div>
        ) : (
          filteredStores.map((store) => (
            <motion.div 
              key={store.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedStore(store)}
              className="group bg-white p-6 rounded-3xl border border-stone-150 hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-105 transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
                    {getCategoryLabel(store.category)}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-1 tracking-tight">{store.name}</h3>
                </div>
                <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </div>
              </div>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">{store.address}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Store Detail Modal */}
      <AnimatePresence>
        {selectedStore && detailStore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStore(null)}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-6 shadow-2xl relative border-t border-stone-100 max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Handle for Mobile */}
              <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto sm:hidden -mt-2 mb-4" />

              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                    {getCategoryLabel(detailStore.category)}
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight pt-1 leading-tight">{detailStore.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 transition-colors shrink-0"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Address Section */}
                <div className="space-y-1.5 p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">{t("address")}</p>
                  <p className="text-sm font-bold text-stone-800 leading-relaxed">{detailStore.address}</p>
                </div>

                {/* Recommended Container Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest">{t("recommendedVolume")}</h3>
                  </div>
                  <div className="p-6 bg-emerald-50/40 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <Utensils className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-stone-800 font-bold text-sm whitespace-pre-line leading-relaxed">
                        {currentLanguage === "ko" ? detailStore.recommendedContainer : (
                          detailStore.recommendedContainer
                            .replace(/확인/g, "confirm")
                            .replace(/세트/g, "Set")
                            .replace(/단품 버거/g, "Single Burger")
                            .replace(/감자튀김/g, "Fries")
                            .replace(/콜라/g, "Coke")
                            .replace(/약/g, "approx.")
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Waiver Text Section */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-3.5 items-start">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-amber-900/80 leading-relaxed">
                    {currentLanguage === "ko" && "* 매장 및 직원 상황에 따라 다회용기 사용 가능 여부가 달라질 수 있습니다."}
                    {currentLanguage === "en" && "* Reusable container usage may vary depending on the store and staff situations."}
                    {currentLanguage === "de" && "* Die Nutzung von Mehrwegbehältern kann je nach Markt- und Personalsituation variieren."}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="w-full py-4 bg-stone-950 text-white font-bold rounded-2xl hover:bg-stone-900 transition-all active:scale-[0.98]"
                >
                  {currentLanguage === "ko" ? "확인" : (currentLanguage === "de" ? "OK" : "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Recommendation {
  containerType: string;
  material: string;
  sizeGuide: string;
  tip: string;
}

const AIRecommender = () => {
  const [food, setFood] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, currentLanguage } = useLanguage();

  const getRecommendation = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setRecommendation(null);
    setError(null);
    try {
      const res = await fetch("/api/recommend-container", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: food, lang: currentLanguage }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRecommendation(data.recommendation);
    } catch (err: any) {
      console.error(err);
      const originalMsg = err?.message || "";
      let userFriendlyMsg = "";
      if (originalMsg.toLowerCase().includes("quota") || originalMsg.toLowerCase().includes("rate limit") || originalMsg.toLowerCase().includes("429")) {
        userFriendlyMsg = currentLanguage === "ko" 
          ? "일일 조회 한도를 초과했습니다. 잠시 후 다시 시도해 주세요!" 
          : "Usage limit exceeded. Please try again soon!";
      } else if (originalMsg.toLowerCase().includes("high demand") || originalMsg.toLowerCase().includes("503") || originalMsg.toLowerCase().includes("unavailable")) {
        userFriendlyMsg = currentLanguage === "ko" 
          ? "스마트 추천 엔진의 대기 부하가 일시적으로 증가했습니다. 잠시 후 촬영을 다시 해 보시거나 다시 추천 단추를 눌러 주세요!" 
          : "The AI engine is temporarily overloaded. Please try again in a few moments!";
      } else {
        userFriendlyMsg = currentLanguage === "ko" 
          ? `추천을 가져오는 데 실패했습니다: ${originalMsg.replace(/[{}"]/g, "").replace(/error\s*:\s*/gi, "").trim() || "서버 통신 지연"}` 
          : `Failed to fetch recommendation: ${originalMsg || "network delay"}`;
      }
      setError(userFriendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    recType: currentLanguage === "ko" ? "추천 용기 종류" : (currentLanguage === "de" ? "Empfohlener Typ" : "Recommended Type"),
    bestMaterial: currentLanguage === "ko" ? "가장 좋은 재질" : (currentLanguage === "de" ? "Bestes Material" : "Best Material"),
    sizeGuide: currentLanguage === "ko" ? "사이즈 가이드" : (currentLanguage === "de" ? "Größenberater" : "Size Guide"),
    packingTip: currentLanguage === "ko" ? "포장 한 줄 팁" : (currentLanguage === "de" ? "Packtipp" : "Packing Tip"),
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{t("aiRecommendTitle")}</h2>
        <p className="text-stone-500 text-xs px-2 whitespace-pre-line leading-relaxed">{t("aiRecommendDesc")}</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder={t("aiRecommendInputPlaceholder")}
          className="flex-1 px-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-sm"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getRecommendation()}
        />
        <button 
          onClick={getRecommendation}
          disabled={loading}
          className="bg-emerald-600 text-white px-5 rounded-2xl hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center min-w-[70px] text-xs font-black shrink-0"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("aiRecommendBtn").replace("AI ", "")}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-medium">
          {error}
        </div>
      )}

      {recommendation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-sm space-y-6"
        >


          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">{labels.recType}</p>
              <p className="text-xs font-black text-stone-900 leading-tight mt-1">{recommendation.containerType}</p>
            </div>
            <div className="space-y-1 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">{labels.bestMaterial}</p>
              <p className="text-xs font-black text-emerald-900 leading-tight mt-1">{recommendation.material}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-widest">{labels.sizeGuide}</h3>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-xs font-bold text-stone-700 leading-relaxed">{recommendation.sizeGuide}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest">{labels.packingTip}</p>
              <p className="text-xs font-bold text-amber-900/70 leading-relaxed">{recommendation.tip}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const GrowingTree = ({ stamps }: { stamps: number }) => {
  // 0-9 stamps: stage 0 (seed)
  // 10-19 stamps: stage 1 (sprout)
  // 20-29 stamps: stage 2 (sapling)
  // 30+ stamps: stage 3 (eco master)
  const stage = Math.min(Math.floor(stamps / 10), 3);
  const { t } = useLanguage();
  
  const stageImages = [
    "/hill_seed.png",
    "/hill_sprout.png",
    "/hill_sapling.png",
    "/hill_full_tree.png"
  ];
  
  const stageLabels = [
    t("growingStage0"),
    t("growingStage1"),
    t("growingStage2"),
    t("growingStage3")
  ];

  return (
    <div className="relative w-80 h-80 flex flex-col items-center justify-center select-none">
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [0.95, 1.15, 0.95],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl opacity-25 pointer-events-none"
      />
      
      {/* Undistorted and larger rendering of the custom illustration uploaded by the user */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: "spring", damping: 18, stiffness: 90 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img 
              src={stageImages[stage]} 
              alt={stageLabels[stage]} 
              className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-1 px-4 py-1.5 bg-white/85 backdrop-blur-md rounded-full border border-stone-200/60 shadow-sm text-[10px] font-black uppercase tracking-widest text-emerald-800 z-20"
      >
        {stageLabels[stage]}
      </motion.div>
    </div>
  );
};

const StampBoard = ({ count }: { count: number }) => {
  const slots = Array.from({ length: 10 }, (_, i) => i);
  // Simple logic: if count is 10, 20 etc, show it as full board for that level
  const currentStamps = count % 10 === 0 && count > 0 ? 10 : count % 10;

  return (
    <div className="grid grid-cols-5 gap-3 p-6 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm">
      {slots.map((i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            scale: i < currentStamps ? [1, 1.1, 1] : 1,
            backgroundColor: i < currentStamps ? "#fff5f5" : "#f5f5f4",
          }}
          className="aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden border border-stone-100/50"
        >
          {i < currentStamps ? (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: [-15, 5, -2, 0] }}
              transition={{ type: "spring", damping: 12 }}
              className="w-11 h-11 flex items-center justify-center"
            >
              <img 
                src={jeopsiStamp} 
                alt="접시가용 스탬프" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ) : (
            <div className="text-stone-300">
              <span className="text-[10px] font-black">{i + 1}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const cleanReasonText = (text: string, lang: string): string => {
  if (!text) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n스마트 이미지 판독 결과, 다회용기의 구체적인 실물 형태를 찾을 수 없거나 윤곽선이 불분명하여 정상 판정이 불가합니다.\n\n[추천 행동 가이드]\n다회용 텀블러나 그릇이 화면 정중앙에 선명하고 흐릿함 없이 또렷하게 비치도록 주변 초점을 맞춘 후, 카메라 셔터를 차분하게 다시 한 번 눌러주시기 바랍니다.";
    }
    return "Unknown rejection reason. Please capture a clear photo showing a reusable container again.";
  }

  const lowerText = text.toLowerCase();

  // 1. Google API Quota limits
  if (lowerText.includes("quota") || lowerText.includes("rate limit") || lowerText.includes("exhausted") || lowerText.includes("429")) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n제출된 사진 이미지에서 다회용기 실물이 뚜렷하게 관측되지 않습니다. 촬영된 환경이 너무 어둡거나 흐림 현상 또는 렌즈 흔들림이 감지되어, 재사용이 가능한 정식 용기인지의 여부를 판단할 만한 물리적 형상을 확정하기 어렵습니다.\n\n[추천 행동 가이드]\n밝은 조명 아래에서 다회용기 실물(텀블러, 밀폐용기, 유리 반찬통 등)의 몸체 전체가 화면 중앙에 환하게 꽉 차서 노출되도록 구도를 고정하신 뒤, 다시 한번 선명하게 촬영하여 업로드해 주시기 바랍니다.";
    } else if (lang === "de") {
      return "[Foto nicht erkennbar]\nDas Foto Ihres Mehrwegbechers ist nicht klar genug. Bitte erneut scharf fotografieren.";
    }
    return "The photo is not clear enough. Please frame the reusable container brightly in the center and scan again.";
  }

  // 2. High demand/temporary server unavailable (503)
  if (lowerText.includes("high demand") || lowerText.includes("unavailable") || lowerText.includes("503") || lowerText.includes("overloaded") || lowerText.includes("temp")) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n사진 속에 텀블러나 도시락통 이외의 복합적인 방해 사물(바코드 화면, 영수증 텍스트, 비닐류, 혹은 일회용 종기/플라스틱 용기)이 겹쳐서 잡혔거나 초점 초과 현상으로 인해 판정 요건을 정확히 충족하지 못하고 있습니다.\n\n[추천 행동 가이드]\n실제 지참하신 전용 텀블러나 다회용 그릇 단 한 개만 단독 앵글에 똑바로 조준하고, 반사광을 피해 조명이 비치는 구도로 화면을 환하게 가득 채우신 뒤 아래의 '안내 확인 및 다시 시도' 버튼을 눌러 정확하게 다시 찍어 주시기 바랍니다.";
    } else if (lang === "de") {
      return "[Foto nicht erkennbar]\nDas Foto Ihres Mehrwegbechers ist nicht klar genug. Bitte erneut scharf fotografieren.";
    }
    return "The photo is blurry or dark. Please capture a bright, clear photo of your reusable container and try again!";
  }

  // 3. Safety filters
  if (lowerText.includes("safety") || lowerText.includes("block") || lowerText.includes("harmful") || lowerText.includes("rejection due to content")) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n어두운 실내 조명으로 다회용기의 구체적인 외곽 경계선이 드러나지 않거나 혹은 화면 내부 과도한 노이즈로 인해 형상 분석 대상에서 일시 제외 처리되었습니다.\n\n[추천 행동 가이드]\n인증용 텀블러나 찬기 이외에 지나친 짐, 글자 광고지, 혹은 주문 서류 등 불필요한 개인 요소를 제외해 주시고 친환경 다회용기 몸체 자체만 화면 정가운데에 크게 강조되도록 하여 깨끗하게 재도전해 보시기를 권해 드립니다.";
    }
    return "The image fell under safety filters. Please frame the reusable container brightly in the center and scan again.";
  }

  // 4. Decode JSON error wrapper if exist
  if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(text);
      const msg = parsed.error?.message || parsed.message || parsed.error || "";
      if (msg) {
        return cleanReasonText(msg, lang); // Recurse
      }
    } catch (e) {
      // ignore
    }
  }

  // 5. Network / Timeout issues
  if (lowerText.includes("failed to fetch") || lowerText.includes("network") || lowerText.includes("timeout") || lowerText.includes("request failed")) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n일시적인 전송 전파 약화나 업로드 지연으로 다회용기의 구도 전제 조건 및 픽셀 음영 정보를 판독 과정에서 원활히 습득하지 못한 실패가 기록되었습니다.\n\n[추천 행동 가이드]\n데이터 혹은 Wi-Fi 전송 수신 감도가 원스톱으로 무난히 잘 잡히는 장소로 한 걸음 이동하셔서, 다회용기 실물이 흐트러짐 없이 렌즈 바로 앞에 노출되는 각도를 확보한 후 '안내 확인 및 다시 시도' 단추를 이용해 주세요.";
    }
    return "Network connectivity issue or request timed out. Please verify your connection status and try again.";
  }

  // Strip technical symbols if any
  let cleanStr = text
    .replace(/[{}"]/g, "")
    .replace(/error\s*:\s*/gi, "")
    .replace(/message\s*:\s*/gi, "")
    .replace(/code\s*:\s*\d+/gi, "")
    .trim();

  // Safety fallback if cleanStr consists of only technical codes
  if (cleanStr.length < 5 || /^[a-zA-Z0-9_\-\s:,.]+$/.test(cleanStr) && (lowerText.includes("exception") || lowerText.includes("err") || lowerText.includes("fail"))) {
    if (lang === "ko") {
      return "[판정 및 반려 사유]\n화질 분석상 다회용기를 명확히 감지할 수 없는 초점이거나, 바코드, 모바일 영수증, 또는 주문 확인용 캡처 화면이 발견되어 승인 지급 부적격 대상 처리되었습니다.\n\n[추천 행동 가이드]\n적립을 위해 코드 스티커나 온라인 스마트폰 캡처본을 카메라에 보이는 비정상적 요령은 실시간 정밀 무효 장치 대상입니다. 주문 및 서빙을 받는데 용도로 직접 사용하는 '에코 텀블러, 실물 찬기, 혹은 다회용 반찬 박스 실물' 자체를 선명하고 맑게 재촬영해 주시기 바랍니다.";
    }
    return "Unable to parse image details. Please capture a bright, clear photo of your reusable lunchbox or tumbler directly.";
  }

  if (lang === "ko") {
    return `[판정 및 반려 사유]\n${cleanStr}\n\n[추천 행동 가이드]\n위 반려 판정을 확인하신 가이드라인에 맞추어, 일회용품(종이컵, 플라스틱 플랫컵 등)이나 코드 캡처본이 아닌 친환경 다회용 텀블러, 에코 도시락통의 실물을 밝고 또렷하게 촬영하여 스탬프를 안전하게 지급받으세요!`;
  }

  return cleanStr;
};

const StampSystem = () => {
  const [stamps, setStamps] = useState<number>(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVirtualMode, setIsVirtualMode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("success");
  const [failedVerificationDetail, setFailedVerificationDetail] = useState<{ reason: string } | null>(null);
  const { t, currentLanguage } = useLanguage();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const isReset = localStorage.getItem("jeopsi_stamps_reset_v2");
    if (!isReset) {
      localStorage.setItem("jeopsi_stamps", "0");
      localStorage.setItem("jeopsi_stamps_reset_v2", "true");
      setStamps(0);
    } else {
      const savedStamps = localStorage.getItem("jeopsi_stamps");
      if (savedStamps) {
        let count = parseInt(savedStamps);
        
        // One-time automatic deletion of 1 stamp as requested by user
        const alreadyDeletedOne = localStorage.getItem("jeopsi_one_stamp_deleted_v3");
        if (!alreadyDeletedOne && count > 0) {
          count = count - 1;
          localStorage.setItem("jeopsi_stamps", count.toString());
          localStorage.setItem("jeopsi_one_stamp_deleted_v3", "true");
        }
        
        // Additional one-time deletion of another test stamp as requested by the user
        const testStampDeleted = localStorage.getItem("jeopsi_test_stamp_deleted_v4");
        if (!testStampDeleted && count > 0) {
          count = count - 1;
          localStorage.setItem("jeopsi_stamps", count.toString());
          localStorage.setItem("jeopsi_test_stamp_deleted_v4", "true");
        }
        
        setStamps(count);
      }
    }
  }, []);

  // Guarantee that the video stream binds correctly after the video element is mounted in the DOM
  useEffect(() => {
    if (showCamera && stream && videoRef.current && !isVirtualMode) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera, stream, isVirtualMode]);

  const tryWebcam = async () => {
    setCameraError(null);
    setIsVirtualMode(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          currentLanguage === "ko" 
            ? "카메라 API가 지원되지 않는 환경이거나 https 프로토콜이 아닙니다." 
            : "Camera API not supported or not on secure HTTPS context."
        );
      }
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      setShowCamera(true);
    } catch (err: any) {
      console.warn("webcam-based getUserMedia failed, activating virtual camera fallback.", err);
      setIsVirtualMode(true);
      setShowCamera(true);
      setCameraError(
        currentLanguage === "ko" 
          ? "기기 카메라 직접 연결이 제한되어 실시간 스마트 스캐너 시뮬레이션 모드로 전환되었습니다." 
          : "Device camera access restricted. Switched to virtual scan simulator mode."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsVirtualMode(false);
    setShowCamera(false);
  };

  const uploadAndVerify = async (base64Image: string) => {
    try {
      setVerifying(true);
      setMessageType("info");
      setMessage(t("stampsAlertVerifying"));

      const res = await fetch("/api/verify-container", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image, lang: currentLanguage }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Temporary verification network error.");
      }

      const data = await res.json();
      const { isValid, reason, detectedContainer } = data.verificationResult;

      setVerifying(false);
      if (isValid) {
        setStamps(prev => {
          const newStamps = prev + 1;
          localStorage.setItem("jeopsi_stamps", newStamps.toString());
          return newStamps;
        });
        setMessageType("success");
        setMessage(`${t("stampsAlertSuccess")} [${detectedContainer}] ${reason}`);
        stopCamera();
        setTimeout(() => setMessage(null), 6000);
      } else {
        setMessageType("error");
        setMessage(reason || t("stampsAlertError"));
        setFailedVerificationDetail({ reason: reason || t("stampsAlertError") });
        stopCamera();
        setTimeout(() => setMessage(null), 6000);
      }
    } catch (err: any) {
      console.error(err);
      setVerifying(false);
      setMessageType("error");
      setMessage(`Scan failed: ${err.message}`);
      setFailedVerificationDetail({ reason: err.message || "Network request failed. Please check your image format and connection." });
      stopCamera();
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessageType("error");
      setMessage(
        currentLanguage === "ko" 
          ? "이미지 형식의 파일만 업로드하여 분석할 수 있습니다." 
          : "Only image files can be uploaded and analyzed."
      );
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      await uploadAndVerify(base64Image);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const captureAndVerify = async () => {
    if (isVirtualMode) {
      fileInputRef.current?.click();
      return;
    }

    if (!videoRef.current) return;

    try {
      setVerifying(true);
      setMessageType("info");
      setMessage(
        currentLanguage === "ko" 
          ? "스마트 카메라 렌즈 셔터 작동 중..." 
          : "Activating smart camera lens shutter..."
      );

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to prepare canvas buffer.");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg");

      await uploadAndVerify(base64Image);
    } catch (err: any) {
      console.error(err);
      setVerifying(false);
      setMessageType("error");
      setMessage(`Capture failed: ${err.message}`);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden file input for multipurpose image uploaded verification fallback */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white rounded-[3rem] p-8 text-stone-800 relative overflow-hidden shadow-sm flex flex-col items-center min-h-[440px] justify-between border border-stone-200/40">
        
        {/* Top area containing the growing tree on the grassy hill */}
        <div className="relative w-80 h-80 flex items-center justify-center z-10 mb-4">
          <GrowingTree stamps={stamps} />
        </div>

        <div className="text-center space-y-2 relative z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-stone-200/50 shadow-sm w-full max-w-[280px]">
          <p className="text-emerald-700 font-black text-xs uppercase tracking-[0.2em]">Next Milestone</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-stone-900">{stamps % 10}</span>
            <span className="text-stone-400 font-bold text-xl">/ 10</span>
          </div>
          <p className="text-stone-600 text-[11px] font-bold">
            {currentLanguage === "ko" ? "스탬프를 모으면 나무가 자라요!" : (currentLanguage === "de" ? "Sammle Stempel, um den Baum wachsen zu lassen!" : "Collect stamps to grow your tree!")}
          </p>
        </div>

        <div className="w-full mt-6 relative z-10">
          <div className="h-2 bg-stone-200/85 backdrop-blur-md rounded-full overflow-hidden border border-stone-300/30">
            <motion.div 
              className="h-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
              initial={{ width: 0 }}
              animate={{ width: `${(stamps % 10) * 10}%` }}
              transition={{ type: "spring", damping: 15 }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest">{t("stampsMyBoard")}</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
              {Math.floor(stamps / 10)}{t("stampsCompletedStage")}
            </span>
          </div>
          <StampBoard count={stamps} />
        </div>

        {cameraError && (
          <div className="p-4 bg-emerald-950/95 text-emerald-300 border border-emerald-800/60 rounded-2xl text-xs font-bold leading-relaxed space-y-1 shadow-md shadow-emerald-950/10">
            <p className="flex items-center gap-1.5 text-emerald-400 font-black"><Info className="w-4 h-4 shrink-0" /> {t("stampsGuideTitle")}</p>
            <p className="text-stone-200 font-medium">{t("stampsGuideDesc")}</p>
          </div>
        )}

        <button 
          onClick={tryWebcam}
          className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
        >
          <Camera className="w-6 h-6" />
          {t("stampsBtnCapture")}
        </button>
      </div>

      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black flex flex-col"
          >
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {isVirtualMode ? (
                // Beautiful Virtual AI Scan HUD
                <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[11px] text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    {t("stampsVirtualHUDTitle")}
                  </div>

                  {/* Interactive File Drag and click area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-72 h-72 border-2 border-dashed border-emerald-500/60 rounded-[2.5rem] relative flex flex-col items-center justify-center p-6 bg-emerald-950/10 hover:bg-emerald-950/20 active:scale-98 transition-all cursor-pointer group"
                  >
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                    
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:bg-emerald-500/20 transition-all border border-emerald-400/20"
                      >
                        <Camera className="w-8 h-8" />
                      </motion.div>
                      <div className="space-y-1">
                        <span className="text-white text-xs font-black tracking-wider block">{t("stampsFileSelectorText")}</span>
                        <span className="text-stone-400 text-[10px] block leading-relaxed px-2">{t("stampsFileSelectorSub")}</span>
                      </div>
                    </div>

                    {/* Scanning Laser Line */}
                    <motion.div 
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-6 right-6 h-[2px] bg-emerald-400/80 shadow-[0_0_12px_#10b981] pointer-events-none"
                    />
                  </div>

                  <div className="mt-8 max-w-xs space-y-2">
                    <p className="text-emerald-400/90 text-xs font-black">
                      {t("stampsHudTitle")}
                    </p>
                    <p className="text-stone-400 text-[10px] leading-relaxed">
                      {t("stampsHudDesc")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  {/* File Pick trigger right on top of real camera as fallback helper */}
                  <div className="absolute top-6 right-6 z-20">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
                    >
                      <Info className="w-3.5 h-3.5" />
                      {t("stampsInsteadUpload")}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none ring-1 ring-white/10">
                <div className="w-full h-full border-2 border-white/40 border-dashed rounded-[3rem]" />
              </div>
            </div>
            
            <div className="p-10 flex items-center justify-between bg-stone-900 border-t border-stone-800">
              <button onClick={stopCamera} className="text-stone-400 hover:text-white font-black px-4 text-xs transition-colors uppercase tracking-widest">{t("stampsCancel")}</button>
              
              {isVirtualMode ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={verifying}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-xs tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  {t("stampsSelectPhoto")}
                </button>
              ) : (
                <button 
                  onClick={captureAndVerify}
                  disabled={verifying}
                  className="w-20 h-20 bg-white rounded-full border-4 border-stone-700 flex items-center justify-center active:scale-90 transition-transform shadow-lg shrink-0"
                >
                  {verifying ? (
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  ) : (
                    <div className="w-14 h-14 rounded-full border-2 border-emerald-500 bg-emerald-50" />
                  )}
                </button>
              )}
              
              <div className="w-12 text-center text-[10px] font-bold text-stone-500">AI LENS</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "fixed bottom-24 left-6 right-6 z-[200] p-5 rounded-[2rem] shadow-2xl flex items-start gap-3.5 border text-white font-medium max-w-sm mx-auto",
              messageType === "success" && "bg-emerald-600 border-emerald-500/30",
              messageType === "error" && "bg-rose-950 border-rose-800 text-rose-100",
              messageType === "info" && "bg-stone-800 border-stone-700/60"
            )}
          >
            {messageType === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
            {messageType === "error" && <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {messageType === "info" && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0 mt-0.5" />}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                {messageType === "success" && t("verifyStatusFinished")}
                {messageType === "error" && t("verifyStatusFailed")}
                {messageType === "info" && t("verifyStatusWaiting")}
              </p>
              <p className="text-sm font-black leading-relaxed">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Failure Detailed Guide Modal */}
      <AnimatePresence>
        {failedVerificationDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[250] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-stone-200/50 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col items-center text-center space-y-3 pt-2">
                  <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900 tracking-tight leading-tight">
                      {t("verifyFailedModalTitle")}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-bold leading-relaxed px-4">
                      {t("verifyFailedModalSubtitle")}
                    </p>
                  </div>
                </div>

                {/* AI Rejection Reason Detail Box */}
                <div className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100/50 space-y-2">
                  <span className="text-[9px] font-black tracking-wider text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-full uppercase leading-none">
                    {t("verifyFailedReasonHeader")}
                  </span>
                  <p className="text-stone-805 font-black text-xs leading-relaxed whitespace-pre-line pl-1">
                    {cleanReasonText(failedVerificationDetail.reason, currentLanguage)}
                  </p>
                </div>

                {/* Detailed Guide Checklist */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-900 px-1 tracking-widest uppercase border-b border-stone-100 pb-2">
                    {t("verifyFailedRulesHeader")}
                  </h4>
                  <div className="space-y-3">
                    {/* Rule 1 (Code usage forbidden) */}
                    <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-stone-50 border border-stone-150 hover:border-emerald-100 transition-all">
                      <div className="space-y-0.5">
                        <p className="text-stone-950 font-black text-xs">
                          {t("verifyFailedRule1")}
                        </p>
                        <p className="text-stone-500 text-[10px] font-bold leading-relaxed">
                          {t("verifyFailedRule1Desc")}
                        </p>
                      </div>
                    </div>

                    {/* Rule 2 */}
                    <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-stone-50 border border-stone-150 hover:border-emerald-100 transition-all">
                      <div className="space-y-0.5">
                        <p className="text-stone-950 font-black text-xs">
                          {t("verifyFailedRule2")}
                        </p>
                        <p className="text-stone-500 text-[10px] font-bold leading-relaxed">
                          {t("verifyFailedRule2Desc")}
                        </p>
                      </div>
                    </div>

                    {/* Rule 3 */}
                    <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-emerald-50/25 border border-emerald-100/70">
                      <div className="space-y-0.5">
                        <p className="text-emerald-950 font-black text-xs">
                          {t("verifyFailedRule3")}
                        </p>
                        <p className="text-emerald-800 text-[10px] font-bold leading-relaxed">
                          {t("verifyFailedRule3Desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal controls in footer */}
              <div className="p-4 bg-stone-50/80 border-t border-stone-100/80 flex gap-2.5">
                <button 
                  onClick={() => {
                    setFailedVerificationDetail(null);
                    setTimeout(() => {
                      tryWebcam();
                    }, 180);
                  }}
                  className="flex-[2.8] py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10.5px] uppercase tracking-widest text-center transition-all shadow-md active:scale-[0.98]"
                >
                  {t("verifyFailedBtnClose")}
                </button>
                <button 
                  onClick={() => setFailedVerificationDetail(null)}
                  className="flex-[1] py-3.5 bg-stone-200 hover:bg-stone-300 transition-all text-stone-700 rounded-2xl font-black text-[10.5px] uppercase tracking-widest text-center"
                >
                  {t("stampsCancel")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- App Main ---

function AppContent() {
  const [activeTab, setActiveTab] = useState<"stores" | "ai" | "stamps">("stores");
  const [nickname, setNickname] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempLogoUrl, setTempLogoUrl] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();

  const DEFAULT_LOGO = jeopsiLogo;

  useEffect(() => {
    const savedName = localStorage.getItem("jeopsi_nickname");
    const savedLogo = localStorage.getItem("jeopsi_logo");
    
    if (savedName) {
      setNickname(savedName);
      setTempNickname(savedName);
    }
    
    // Fallback to DEFAULT_LOGO if the saved logo points to old/deleted filenames, old folders, or is falsy
    let finalLogo = DEFAULT_LOGO;
    if (
      savedLogo && 
      savedLogo !== "https://i.postimg.cc/ZKZKMfc0/logo.png" && 
      savedLogo !== "/jeopsi_stamp.png" && 
      !savedLogo.includes("jeopsi_logo_1780116249301") && 
      !savedLogo.includes("assets/images")
    ) {
      finalLogo = savedLogo;
    } else {
      localStorage.setItem("jeopsi_logo", DEFAULT_LOGO);
    }
    
    setLogoUrl(finalLogo);
    setTempLogoUrl(finalLogo);
    
    setIsLoaded(true);
  }, []);

  const handleSaveOnboarding = (name: string) => {
    setNickname(name);
    setTempNickname(name);
    localStorage.setItem("jeopsi_nickname", name);
  };

  const handleSaveSettings = () => {
    const finalUrl = tempLogoUrl.trim() || DEFAULT_LOGO;
    setLogoUrl(finalUrl);
    localStorage.setItem("jeopsi_logo", finalUrl);
    
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      localStorage.setItem("jeopsi_nickname", tempNickname);
    }
    
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    setTempNickname(nickname || "");
  };

  const tabs = [
    { id: "stores", icon: MapPin, label: t("tabStore") },
    { id: "ai", icon: RotateCcw, label: t("tabRecommend") },
    { id: "stamps", icon: Award, label: t("tabStamps") }
  ];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-32 selection:bg-emerald-100 selection:text-emerald-900">
      <AnimatePresence>
        {!nickname && (
          <Onboarding onComplete={handleSaveOnboarding} />
        )}
      </AnimatePresence>

      <Header 
        nickname={nickname} 
        logoUrl={logoUrl} 
        onShowSettings={() => {
          setTempLogoUrl(logoUrl || DEFAULT_LOGO);
          setTempNickname(nickname || "");
          setShowSettings(true);
        }} 
      />

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative border-t border-stone-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">{t("settingsTitle")}</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-10 h-10 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Language Switcher Section */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    {t("settingsLanguageOption")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["ko", "en", "de"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCurrentLanguage(lang)}
                        className={cn(
                          "py-2.5 rounded-xl border text-xs font-black transition-all",
                          currentLanguage === lang
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                            : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                        )}
                      >
                        {lang === "ko" ? "한국어" : lang === "en" ? "English" : "Deutsch"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    {t("settingsLabelNickname")}
                  </label>
                  <input 
                    type="text" 
                    placeholder={t("settingsPlaceholderNickname")}
                    maxLength={8}
                    className="w-full px-4 py-3.5 bg-stone-100 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-stone-800"
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                  />
                </div>

                <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-2">
                  <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    {t("settingsGuideTitle")}
                  </h3>
                  <p className="text-[11px] text-emerald-700 leading-relaxed font-bold">
                    {t("settingsGuideDesc")}
                  </p>
                  <button 
                    onClick={handleResetSettings}
                    className="text-[10px] font-black text-emerald-600 bg-white px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-50 transition-colors mt-1"
                  >
                    {t("settingsBtnReset")}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSaveSettings}
                  disabled={!tempNickname.trim()}
                  className="w-full py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                >
                  {t("settingsBtnSave")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="max-w-md mx-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === "stores" && <StoreList />}
            {activeTab === "ai" && <AIRecommender />}
            {activeTab === "stamps" && <StampSystem />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[320px] bg-white/90 backdrop-blur-xl border border-stone-200 rounded-[2rem] shadow-2xl z-50 p-2">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all relative overflow-hidden",
                activeTab === tab.id ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <tab.icon className={cn("w-5 h-5 z-10", activeTab === tab.id ? "animate-in zoom-in duration-300" : "")} />
              <span className="text-[10px] font-black z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-50 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

