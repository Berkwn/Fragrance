import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdSearch, MdShoppingBag, MdPerson, MdSpa, MdWbSunny, MdForest, 
  MdDiamond, MdLocalFireDepartment, MdWaterDrop, MdCheck, MdClose, 
  MdAddShoppingCart, MdArrowForward, MdStar 
} from 'react-icons/md'; 
import { GiPerfumeBottle } from 'react-icons/gi';
import { getAllNotes, getRecommendations } from '../Services/fragranceService';

const RecommendPage = () => {
  const navigate = useNavigate();
  
  // STATE'LER
  const [activeFamily, setActiveFamily] = useState('Popular'); 
  const [notes, setNotes] = useState([]); 
  const [selectedNotes, setSelectedNotes] = useState([]); 
  const [perfumes, setPerfumes] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false);

  // Sadece sayfa ilk açıldığında çalışır
  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchNotes(); 
    // DİKKAT: Burada fetchPerfumes YOK.
  }, []); // Köşeli parantez boş, yani sadece 1 kere çalışır.

  // API 1: Notaları Getir
  const fetchNotes = async () => {
    try {
        const data = await getAllNotes();
        setNotes(data);
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

  const filteredNotes = notes.filter(n => n.family === activeFamily);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-highlight bg-background-dark/95 backdrop-blur-sm px-6 py-3 lg:px-10">
        <div className="flex items-center gap-8">
          <button type="button" onClick={() => navigate('/')} className="flex items-center gap-3 text-white transition-opacity hover:opacity-80">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
               <GiPerfumeBottle size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">ScentFinder</h2>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 py-8 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-10 flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Signature Scent</span>
            </h1>
            <p className="max-w-2xl text-lg text-text-muted">
              Sevdiğin içerikleri seç, ardından "Sonuçları Göster" butonuna basarak yapay zeka önerilerini gör.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-6 rounded-2xl bg-surface-dark p-6 shadow-xl ring-1 ring-white/5">
            
            {/* Sekmeler */}
            <div className="overflow-x-auto hide-scrollbar pb-2">
              <div className="flex min-w-max gap-8 border-b border-surface-highlight px-2">
                {[
                  { name: 'Popular', icon: MdStar },
                  { name: 'Floral', icon: MdSpa },
                  { name: 'Citrus', icon: MdWbSunny }, 
                  { name: 'Woody', icon: MdForest },
                  { name: 'Oriental', icon: MdDiamond },
                  { name: 'Spicy', icon: MdLocalFireDepartment },
                  { name: 'Fresh', icon: MdWaterDrop },
                ].map((family) => (
                  <button 
                    key={family.name}
                    type="button" // Type button eklendi
                    onClick={() => setActiveFamily(family.name)}
                    className={`group flex flex-col items-center gap-2 border-b-[3px] pb-3 pt-2 transition-all ${activeFamily === family.name ? 'border-primary' : 'border-transparent hover:border-surface-highlight'}`}
                  >
                    <family.icon className={`text-2xl transition-transform group-hover:scale-110 ${activeFamily === family.name ? 'text-primary' : 'text-text-muted group-hover:text-white'}`} />
                    <span className={`text-sm font-bold transition-colors ${activeFamily === family.name ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                      {family.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* NOTA LİSTESİ */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{activeFamily} Notes</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {filteredNotes.length === 0 && (
                    <p className="text-sm text-text-muted">Bu kategoride henüz nota bulunamadı.</p>
                )}

                {filteredNotes.map(note => {
                  const isSelected = selectedNotes.includes(note.name);
                  return (
                    <button 
                        key={note.id} 
                        type="button" // Type button eklendi
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

            {/* SEÇİLENLER VE BUTON */}
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

                {/* BÜYÜK BUTON - API isteğini BU atar */}
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

          {/* SONUÇLAR */}
          {hasSearched && (
            <div className="animate-fade-in-up">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {loading ? 'Yükleniyor...' : `${perfumes.length} Parfüm Bulundu`}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {perfumes.map((perfume) => (
                    <div key={perfume.id} className="group flex flex-col overflow-hidden rounded-2xl bg-surface-dark transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                        
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#25202b] p-6">
                        <div className="absolute right-3 top-3 z-10 rounded-full bg-surface-highlight/80 px-2 py-1 backdrop-blur-md">
                            <span className="text-xs font-bold text-white">{perfume.match} Eşleşme</span>
                        </div>
                        
                        <div className={`h-full w-full rounded-lg bg-gradient-to-br ${perfume.gradientFrom} ${perfume.gradientTo} flex items-center justify-center shadow-lg relative`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
                            
                            {perfume.bottleShape === 'rect' && (
                                <div className="w-1/2 h-2/3 bg-black/40 border border-white/10 rounded-t-full rounded-b-xl backdrop-blur-sm relative shadow-2xl">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-6 bg-yellow-600/80 rounded-sm"></div>
                                </div>
                            )}
                            {perfume.bottleShape === 'rounded' && (
                                <div className="w-2/3 h-2/3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm relative shadow-2xl flex flex-col items-center justify-end pb-4">
                                    <div className="w-full h-1/4 bg-pink-500/10 absolute top-0 rounded-t-lg"></div>
                                </div>
                            )}
                            {perfume.bottleShape === 'circle' && (
                                <div className="w-1/2 h-3/4 bg-white/5 border border-white/10 rounded-full backdrop-blur-md relative shadow-2xl">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-300/20 backdrop-blur-sm border border-white/20"></div>
                                </div>
                            )}
                            {perfume.bottleShape === 'rotated' && (
                                <div className="w-3/5 h-3/5 bg-amber-900/20 border border-amber-500/20 rounded-sm backdrop-blur-sm relative shadow-2xl rotate-2"></div>
                            )}
                        </div>

                        <button className="absolute bottom-4 right-4 translate-y-4 opacity-0 shadow-lg shadow-black/40 transition-all group-hover:translate-y-0 group-hover:opacity-100 flex size-10 items-center justify-center rounded-full bg-primary text-white">
                            <MdAddShoppingCart size={20} />
                        </button>
                        </div>

                        <div className="flex flex-1 flex-col gap-2 p-4">
                        <div className="flex justify-between items-start">
                            <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{perfume.brand}</p>
                            <h3 className="text-lg font-bold text-white">{perfume.name}</h3>
                            </div>
                            <span className="text-sm font-semibold text-white">{perfume.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {perfume.notes && perfume.notes.map((note, index) => (
                            <span key={index} className="rounded bg-surface-highlight px-1.5 py-0.5 text-[10px] font-medium text-text-muted">{note}</span>
                            ))}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                
                {perfumes.length === 0 && !loading && (
                    <div className="text-center py-20 bg-surface-dark rounded-2xl border border-dashed border-surface-highlight">
                        <span className="material-symbols-outlined text-4xl text-text-muted mb-3">search_off</span>
                        <h3 className="text-xl font-bold text-white">Eşleşen Parfüm Bulunamadı</h3>
                        <p className="text-text-muted mt-2">Lütfen farklı nota kombinasyonları ile tekrar deneyin.</p>
                    </div>
                )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default RecommendPage;