import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdSearch, MdShoppingBag, MdPerson, MdSpa, MdWbSunny, MdForest, 
  MdDiamond, MdLocalFireDepartment, MdWaterDrop, MdCheck, MdClose, 
  MdAddShoppingCart, MdArrowForward, MdStar , MdCategory
} from 'react-icons/md'; 
import { GiPerfumeBottle } from 'react-icons/gi';
import { getAllNotes, getRecommendations,getFragranceFamilies } from '../Services/fragranceService';


const RecommendPage = () => {
  const navigate = useNavigate();
  
  // STATE'LER
  const [activeFamily, setActiveFamily] = useState('Baharatli'); 
  const [families,setFamilies] = useState([]);
  const [notes, setNotes] = useState([]); 
  const [selectedNotes, setSelectedNotes] = useState([]); 
  const [perfumes, setPerfumes] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false);
const familyIcons = {
    
    'Çiçeksi': MdSpa,
    'Meyveli': MdWbSunny,
    'Odunsu': MdForest,
    'Oryantal': MdDiamond,
    'Baharatlı': MdLocalFireDepartment,
    'Ferah': MdWaterDrop,
    'Tatlı': GiPerfumeBottle,
    'Diğer': MdCategory
  };
  // Sadece sayfa ilk açıldığında çalışır
  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchNotes(); 
    // DİKKAT: Burada fetchPerfumes YOK.
  }, []); // Köşeli parantez boş, yani sadece 1 kere çalışır.

  // API 1: Notaları Getir
  const fetchNotes = async () => {
    try {
       const [notesData,familiesData] = await Promise.all([getAllNotes(),getFragranceFamilies()]);
        setNotes(notesData);
        setFamilies(familiesData);
    } catch (error) {
        console.error("Notalar çekilemedi:", error);
    }
  };

  // API 2: Parfümleri Getir (Sadece Butona Basınca)
const fetchPerfumes = async () => {
     setLoading(true); // Yorumda kalabilir
     setHasSearched(true); // Yorumda kalabilir
    try {
        const data = await getRecommendations(selectedNotes);
        setPerfumes(data);
    } catch (error) {
        // --- BU KISMI GÜNCELLE ---
        console.error("HATA DETAYI:", error);
        if (error.response) {
            // Sunucu cevap verdi ama hata koduyla (404, 500, 400 vs.)
            console.log("Status Code:", error.response.status);
            console.log("Sunucu Mesajı:", error.response.data);
        } else if (error.request) {
            // İstek gitti ama sunucudan hiç cevap gelmedi (Backend kapalı olabilir)
            console.log("Sunucudan cevap yok. Backend çalışıyor mu?");
        } else {
            console.log("İstek oluşturulurken hata:", error.message);
        }
        // --------------------------
    } finally {
        setLoading(false);
    }
  };


  // State Güncelleme (API İsteği Yok)
  const toggleNote = (noteName) => {
    let newSelection;
    if (selectedNotes.includes(noteName)) {
        newSelection = selectedNotes.filter(n => n !== noteName);
    } else {
        newSelection = [...selectedNotes, noteName];
    }
    setSelectedNotes(newSelection);
    console.log("Seçilen Notalar:", newSelection);
  };

  const filteredNotes =  notes.filter(note => note.family === activeFamily);

 return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      
      {/* HEADER (Aynı kalıyor) */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-highlight bg-background-dark/95 backdrop-blur-sm px-6 py-3 lg:px-10">
        <div className="flex items-center gap-8">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-3 text-white transition-opacity hover:opacity-80">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
               <GiPerfumeBottle size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Kokum Lokum</h2>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 py-8 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-10 flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Kokunu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Keşfet</span>
            </h1>
            <p className="max-w-2xl text-lg text-text-muted">
              Sevdiğin içerikleri seç, yapay zeka sana en uygun parfümü bulsun.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-6 rounded-2xl bg-surface-dark p-6 shadow-xl ring-1 ring-white/5">
            
         
            <div className="overflow-x-auto hide-scrollbar pb-2">
              <div className="flex min-w-max gap-8 border-b border-surface-highlight px-2">
                {families.map((familyName) => {
                
                  const IconComponent = familyIcons[familyName] || MdCategory;
                  
                  return (
                    <button 
                      key={familyName}
                      type="button"
                      onClick={() => setActiveFamily(familyName)}
                      className={`group flex flex-col items-center gap-2 border-b-[3px] pb-3 pt-2 transition-all ${activeFamily === familyName ? 'border-primary' : 'border-transparent hover:border-surface-highlight'}`}
                    >
                      <IconComponent className={`text-2xl transition-transform group-hover:scale-110 ${activeFamily === familyName ? 'text-primary' : 'text-text-muted group-hover:text-white'}`} />
                      <span className={`text-sm font-bold transition-colors ${activeFamily === familyName ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                        {familyName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NOTA LİSTESİ */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{activeFamily} </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {filteredNotes.length === 0 && (
                    <p className="text-sm text-text-muted">Bu kategoride gösterilecek nota yok.</p>
                )}

                {filteredNotes.map(note => {
                  const isSelected = selectedNotes.includes(note.name);
                  return (
                    <button 
                        key={note.id} 
                        type="button"
                        onClick={() => toggleNote(note.name)}
                        className={`flex h-9 items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                            isSelected 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' 
                            : 'bg-surface-highlight text-text-muted hover:bg-surface-highlight/80 hover:text-white'
                        }`}
                    >
                        <span>{note.name}</span>
                        {isSelected && <MdCheck size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEÇİLENLER VE BUTON (Aynı kalıyor) */}
            <div className="border-t border-surface-highlight pt-6 mt-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium text-text-muted mr-2">Seçilenler ({selectedNotes.length}):</span>
                    {selectedNotes.map(note => (
                        <div key={note} className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 pl-3 pr-2 py-1">
                            <span className="text-xs font-bold text-white">{note}</span>
                            <button type="button" onClick={() => toggleNote(note)} className="flex size-4 items-center justify-center rounded-full text-white hover:bg-primary/20">
                            <MdClose size={14} />
                            </button>
                        </div>
                    ))}
                    {selectedNotes.length > 0 && (
                        <button type="button" onClick={() => setSelectedNotes([])} className="ml-2 text-xs font-bold text-text-muted hover:text-white underline">Temizle</button>
                    )}
                </div>

                <button 
                    type="button"
                    onClick={fetchPerfumes}
                    disabled={loading}
                    className="w-full md:w-auto flex items-center justify-center gap-3 rounded-xl bg-primary hover:bg-purple-600 text-white px-8 py-4 font-bold shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span>Analiz Ediliyor...</span>
                    ) : (
                        <>
                            <span>Parfümleri Göster</span>
                            <MdArrowForward size={20} />
                        </>
                    )}
                </button>
            </div>
          </div>

          {/* SONUÇLAR (Burası senin önceki kodunla aynı, sadece kopyala-yapıştır yapabilirsin) */}
          {hasSearched && (
            <div className="animate-fade-in-up">
                {/* ... Şişe kartları kodun burada devam edecek ... */}
                {/* Önceki mesajımda verdiğim güncel resimli kart yapısını buraya koy */}
                 <div className="flex items-end justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {loading ? 'Yükleniyor...' : `${perfumes.length} Parfüm Bulundu`}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {perfumes.map((perfume) => (
                    <div key={perfume.id} className="group flex flex-col overflow-hidden rounded-2xl bg-surface-dark transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 border border-white/5">
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white p-6 flex items-center justify-center">
                            <div className="absolute right-3 top-3 z-10 rounded-full bg-primary/90 px-2 py-1 backdrop-blur-md shadow-md">
                                <span className="text-xs font-bold text-white">
                                    {perfume.matchCount ? `${perfume.matchCount} Nota Eşleşti` : 'Öneri'}
                                </span>
                            </div>
                            <img 
                                src={perfume.imageUrl} 
                                alt={perfume.name} 
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://www.e-bargello.com/uploads/products/big/WqgiG0oXb0KFS2N5R0d6Ri6CB0Yr0G60jVjYXd45.jpg"; }}
                                className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                            />
                            <button className="absolute bottom-4 right-4 translate-y-4 opacity-0 shadow-lg shadow-black/40 transition-all group-hover:translate-y-0 group-hover:opacity-100 flex size-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark">
                                <MdAddShoppingCart size={20} />
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4 bg-[#1e1824]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{perfume.brand}</p>
                                    <h3 className="text-lg font-bold text-white line-clamp-1" title={perfume.name}>{perfume.name}</h3>
                                </div>
                                <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                                    {perfume.price} TL
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {perfume.notes && perfume.notes.slice(0, 3).map((note, index) => (
                                    <span key={index} className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                                        {note}
                                    </span>
                                ))}
                                {perfume.notes && perfume.notes.length > 3 && (
                                    <span className="text-[10px] text-gray-500 flex items-center">+{perfume.notes.length - 3}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default RecommendPage;