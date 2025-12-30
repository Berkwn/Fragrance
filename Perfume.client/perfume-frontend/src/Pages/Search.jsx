import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdCompareArrows, MdStar, MdClose, MdSend } from 'react-icons/md';
import { GiPerfumeBottle } from 'react-icons/gi';
import { SearchFragances, addReview } from '../Services/fragranceService'; // addReview import edildi

const SearchPage = () => {
  const navigate = useNavigate();
  
  // STATE'LER
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFragranceId, setSelectedFragranceId] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // YORUM GÖNDERME
  const handleSubmitReview = async () => {
    if(!comment.trim()) return alert("Lütfen bir yorum yazın.");

    try {
        await addReview({
            fragranceId: selectedFragranceId,
            comment: comment,
            rating: rating
        });
        alert("Yorumunuz kaydedildi! Teşekkürler.");
        setIsModalOpen(false);
        setComment("");
    } catch (error) {
        console.error("Yorum hatası:", error);
        alert("Yorum gönderilirken bir hata oluştu.");
    }
  };

  // MODAL AÇMA
  const handleOpenReviewModal = (fragranceId) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        if(window.confirm("Yorum yapmak için giriş yapmalısınız. Giriş sayfasına gidilsin mi?")) {
            navigate('/login');
        }
        return;
    }

    setSelectedFragranceId(fragranceId);
    setIsModalOpen(true);
  };

  // ARAMA YAPMA
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await SearchFragances(query);
      setResults(data);
      console.log("Arama sonuçları:", data);
    } catch (error) {
      console.error("Arama hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-surface-highlight bg-background-dark/95 backdrop-blur-sm px-6 py-3 lg:px-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 text-white hover:opacity-80">
           <GiPerfumeBottle size={24} className="text-primary" />
           <h2 className="text-xl font-bold">ScentFinder</h2>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-10 max-w-5xl mx-auto w-full">
        
        {/* ARAMA KUTUSU */}
        <div className="w-full max-w-2xl text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black mb-4">
                Muadilini <span className="text-primary">Bul</span>
            </h1>
            <p className="text-text-muted mb-8">Pahalı parfümlerin en iyi alternatiflerini keşfet.</p>
            
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center bg-surface-dark border border-surface-highlight rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <MdSearch className="text-3xl text-text-muted ml-4" />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Parfüm veya marka adı girin... (Örn: Armani, Dior)" 
                        className="w-full h-14 bg-transparent px-4 text-white text-lg placeholder:text-gray-500 focus:outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="h-14 px-8 bg-primary hover:bg-primary-dark text-white font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Aranıyor...' : 'Ara'}
                    </button>
                </div>
            </form>
        </div>

        {/* SONUÇLAR */}
        <div className="w-full grid gap-8">
            {results.map((item) => (
                <div key={item.pairId} className="relative bg-surface-dark border border-surface-highlight rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
                    
                    {/* Arka Plan Efekti */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    <div className="flex flex-col md:flex-row items-stretch">
                        
                        {/* SOL: ORİJİNAL PARFÜM */}
                        <div className="flex-1 p-6 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-surface-highlight bg-white/5">
                            <span className="mb-2 px-3 py-1 bg-black/40 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest">Orijinal</span>
                            <img 
                                src={item.originalFragrance?.imageUrl || "https://via.placeholder.com/150"} 
                                alt={item.originalFragrance?.name} 
                                className="h-40 object-contain drop-shadow-xl mb-4 group-hover:scale-105 transition-transform" 
                            />
                            <h3 className="text-lg font-bold text-white">{item.originalFragrance?.brand}</h3>
                            <p className="text-text-muted">{item.originalFragrance?.name}</p>
                            <span className="mt-2 text-primary font-bold text-xl">{item.originalFragrance?.price}</span>
                        </div>

                        {/* ORTA: VS & PUAN */}
                        <div className="relative flex flex-col items-center justify-center p-4 bg-surface-dark md:w-48 shrink-0 z-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 bg-surface-highlight p-3 rounded-full border border-gray-700 shadow-xl">
                                <MdCompareArrows className="text-3xl text-white" />
                            </div>
                            <div className="mt-4 md:mt-6 flex flex-col items-center">
                                <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Benzerlik</span>
                                <div className="flex items-center gap-1 text-green-400 font-black text-3xl">
                                    <MdStar className="text-2xl" />
                                    <span>{item.similarityScore}%</span>
                                </div>
                            </div>
                        </div>

                        {/* SAĞ: MUADİL PARFÜM */}
                        <div className="flex-1 p-6 flex flex-col items-center text-center bg-gradient-to-br from-primary/10 to-transparent">
                            <span className="mb-2 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white uppercase tracking-widest shadow-lg shadow-primary/40">Muadil Önerisi</span>
                            <img 
                                src={item.dupe?.imageUrl || "https://via.placeholder.com/150"} 
                                alt={item.dupe?.name} 
                                className="h-40 object-contain drop-shadow-xl mb-4 group-hover:scale-105 transition-transform" 
                            />
                            <h3 className="text-lg font-bold text-white">{item.dupe?.brand}</h3>
                            <p className="text-text-muted">{item.dupe?.name}</p>
                            <span className="mt-2 text-green-400 font-bold text-xl">{item.dupe?.price}</span>

                            {/* --- BUTON BURAYA TAŞINDI (DÖNGÜNÜN İÇİNE) --- */}
                            <button 
                                onClick={() => handleOpenReviewModal(item.dupe.id)} 
                                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all flex items-center gap-2"
                            >
                                <MdStar className="text-yellow-400" />
                                Bu Muadili Değerlendir
                            </button>
                            {/* ------------------------------------------- */}
                        </div>
                    </div>

                    {/* ALT: EDİTÖR YORUMU */}
                    <div className="bg-black/20 p-4 text-center border-t border-surface-highlight">
                        <p className="text-sm text-gray-300 italic">
                            <span className="text-primary font-bold not-italic mr-2">Editör Notu:</span>
                            "{item.adminComment || 'Bu ürün koku profili, kalıcılık ve yayılım açısından orijinaline son derece yakındır.'}"
                        </p>
                    </div>

                </div>
            ))}

            {/* SONUÇ BULUNAMADI */}
            {hasSearched && !loading && results.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-xl text-text-muted">Aradığınız kriterlere uygun eşleşme bulunamadı.</p>
                </div>
            )}
        </div>
      </main>

      {/* --- MODAL (LOOP DIŞINDA) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-surface-highlight w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-fade-in-up">
                
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-text-muted hover:text-white"
                >
                    <MdClose size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">Deneyimini Paylaş</h3>
                
                <div className="flex gap-2 mb-4 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)}>
                            <MdStar 
                                size={32} 
                                className={star <= rating ? "text-yellow-400" : "text-gray-600"} 
                            />
                        </button>
                    ))}
                </div>

                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bu muadil parfüm hakkında ne düşünüyorsun? Kalıcılığı nasıl?"
                    className="w-full h-32 bg-background-dark border border-surface-highlight rounded-xl p-3 text-white focus:border-primary focus:outline-none resize-none mb-4"
                ></textarea>

                <button 
                    onClick={handleSubmitReview}
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    <span>Yorumu Gönder</span>
                    <MdSend />
                </button>

            </div>
        </div>
      )}

    </div>
  );
};

export default SearchPage;