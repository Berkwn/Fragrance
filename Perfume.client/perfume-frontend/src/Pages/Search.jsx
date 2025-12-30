import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdCompareArrows, MdStar, MdClose, MdSend, MdComment, MdThumbUp, MdThumbDown } from 'react-icons/md';
import { GiPerfumeBottle } from 'react-icons/gi';
import { SearchFragances, addReview, getFragranceReviews } from '../Services/fragranceService';

const SearchPage = () => {
  const navigate = useNavigate();
  const reviewsSectionRef = useRef(null); // Yorum bölümüne kaydırmak için referans
  
  // --- STATE'LER ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Yorum EKLEME (Küçük Modal - Sadece Yazmak İçin)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedFragranceId, setSelectedFragranceId] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Yorum GÖRÜNTÜLEME (Sayfa İçi Bölüm)
  const [showReviews, setShowReviews] = useState(false); // Yorum bölümü açık mı?
  const [fragranceReviews, setFragranceReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentReviewBrand, setCurrentReviewBrand] = useState(""); 
  const [activeReviewId, setActiveReviewId] = useState(null); // Hangi parfümün yorumları açık?

  // --- FONKSİYONLAR ---

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setShowReviews(false); // Yeni aramada yorumları kapat
    try {
      const data = await SearchFragances(query);
      setResults(data);
    } catch (error) {
      console.error("Arama hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Yorum Yapma Penceresini Aç
  const handleOpenWriteModal = (fragranceId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        if(window.confirm("Yorum yapmak için giriş yapmalısınız. Giriş sayfasına gidilsin mi?")) {
            navigate('/login');
        }
        return;
    }
    setSelectedFragranceId(fragranceId);
    setIsWriteModalOpen(true);
  };

  // Yorumu Gönder
  const handleSubmitReview = async () => {
    if(!comment.trim()) return alert("Lütfen bir yorum yazın.");
    try {
        await addReview({
            fragranceId: selectedFragranceId,
            comment: comment,
            rating: rating
        });
        alert("Yorumunuz başarıyla kaydedildi!");
        setIsWriteModalOpen(false);
        setComment("");
        setRating(5);
        
        // Eğer şu an o parfümün yorumları açıksa listeyi yenile
        if (activeReviewId === selectedFragranceId) {
            handleViewReviews(selectedFragranceId, currentReviewBrand);
        }

    } catch (error) {
        alert("Hata oluştu. Giriş yaptığınızdan emin olun.");
    }
  };

  // Yorumları Getir ve Aşağıya Kaydır
  const handleViewReviews = async (fragranceId, brandName) => {
    setShowReviews(true);
    setActiveReviewId(fragranceId);
    setCurrentReviewBrand(brandName);
    setSelectedFragranceId(fragranceId); // "Yorum Yaz" derse ID hazır olsun
    
    setReviewsLoading(true);
    setFragranceReviews([]); 

    // Sayfayı Yorumlara Kaydır
    setTimeout(() => {
        reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
        const data = await getFragranceReviews(fragranceId);
        setFragranceReviews(data);
    } catch (error) {
        console.error("Yorumlar çekilemedi:", error);
    } finally {
        setReviewsLoading(false);
    }
  };

  const totalReviews = fragranceReviews.length;

  // 2. Ortalama Puan (Tüm puanları topla / Yorum sayısına böl)
  const averageRating = totalReviews > 0 
    ? (fragranceReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  // 3. Yıldız Dağılımı (Hangi puandan kaç tane var?)
  // Başlangıç: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  fragranceReviews.forEach((review) => {
      // Eğer rating geçerli bir sayıysa (1-5 arası) sayacı artır
      if (starCounts[review.rating] !== undefined) {
          starCounts[review.rating]++;
      }
  });

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
        <div className="w-full grid gap-8 mb-16">
            {results.map((item) => (
                <div key={item.pairId} className={`relative bg-surface-dark border ${activeReviewId === item.dupe.id ? 'border-primary shadow-2xl shadow-primary/20' : 'border-surface-highlight'} rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                    <div className="flex flex-col md:flex-row items-stretch">
                        
                        {/* SOL: Orijinal */}
                        <div className="flex-1 p-6 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-surface-highlight bg-white/5">
                            <span className="mb-2 px-3 py-1 bg-black/40 rounded-full text-xs font-bold text-gray-300 uppercase tracking-widest">Orijinal</span>
                            <img src={item.originalFragrance?.imageUrl || "https://placehold.co/150"} alt={item.originalFragrance?.name} className="h-40 object-contain drop-shadow-xl mb-4 group-hover:scale-105 transition-transform" />
                            <h3 className="text-lg font-bold text-white">{item.originalFragrance?.brand}</h3>
                            <p className="text-text-muted">{item.originalFragrance?.name}</p>
                            <span className="mt-2 text-primary font-bold text-xl">{item.originalFragrance?.price}</span>
                        </div>

                        {/* ORTA: VS */}
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

                        {/* SAĞ: Muadil */}
                        <div className="flex-1 p-6 flex flex-col items-center text-center bg-gradient-to-br from-primary/10 to-transparent">
                            <span className="mb-2 px-3 py-1 bg-primary rounded-full text-xs font-bold text-white uppercase tracking-widest shadow-lg shadow-primary/40">Muadil Önerisi</span>
                            <img src={item.dupe?.imageUrl || "https://placehold.co/150"} alt={item.dupe?.name} className="h-40 object-contain drop-shadow-xl mb-4 group-hover:scale-105 transition-transform" />
                            <h3 className="text-lg font-bold text-white">{item.dupe?.brand}</h3>
                            <p className="text-text-muted">{item.dupe?.name}</p>
                            <span className="mt-2 text-green-400 font-bold text-xl">{item.dupe?.price}</span>

                            {/* BUTONLAR */}
                            <div className="mt-4 flex flex-col gap-2 w-full max-w-[200px]">
                                <button 
                                    onClick={() => handleOpenWriteModal(item.dupe.id)} 
                                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <MdStar className="text-yellow-400" />
                                    Değerlendir
                                </button>
                                
                                <button 
                                    onClick={() => handleViewReviews(item.dupe.id, item.dupe.brand)} 
                                    className={`w-full px-4 py-2 border rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${activeReviewId === item.dupe.id ? 'bg-white text-black border-white font-bold' : 'bg-transparent hover:bg-white/5 border-white/10 text-text-muted hover:text-white'}`}
                                >
                                    <MdComment />
                                    {activeReviewId === item.dupe.id ? 'Yorumlar Açık' : 'Yorumları Oku'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 text-center border-t border-surface-highlight">
                        <p className="text-sm text-gray-300 italic">
                            <span className="text-primary font-bold not-italic mr-2">Editör Notu:</span>
                            "{item.adminComment || 'Bu ürün koku profili, kalıcılık ve yayılım açısından orijinaline son derece yakındır.'}"
                        </p>
                    </div>
                </div>
            ))}
            
            {hasSearched && !loading && results.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-xl text-text-muted">Aradığınız kriterlere uygun eşleşme bulunamadı.</p>
                </div>
            )}
        </div>

        {/* --- SAYFA İÇİ YORUM BÖLÜMÜ (Scroll ile gidilecek yer) --- */}
        {showReviews && (
            <div ref={reviewsSectionRef} className="w-full animate-fade-in-up scroll-mt-24">
                <div className="bg-[#1e1824] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 bg-[#130d18] flex justify-between items-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <MdComment className="text-primary" />
                            {currentReviewBrand} <span className="text-gray-500 font-normal text-lg">Kullanıcı Değerlendirmeleri</span>
                        </h2>
                        <button onClick={() => setShowReviews(false)} className="text-text-muted hover:text-white p-2">
                            <MdClose size={24} />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                        
                       <div className="md:col-span-1">
    <div className="bg-[#130d18] rounded-2xl p-6 border border-white/5 sticky top-24">
        
        {/* Ortalama Puan Gösterimi */}
        <div className="flex items-end gap-3 mb-6">
            <span className="text-6xl font-bold text-white">{averageRating}</span>
            <div className="flex flex-col mb-2">
                <div className="flex text-yellow-400 text-sm">
                    {/* Dinamik Yıldızlar: Ortalamaya göre dolu/boş yıldız göstermek istersen */}
                    {[...Array(5)].map((_, i) => (
                        <MdStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-700"} />
                    ))}
                </div>
                <span className="text-gray-400 text-xs">{totalReviews} Yorum</span>
            </div>
        </div>

        {/* Barlar (Progress Bars) */}
        <div className="flex flex-col gap-3 mb-8">
            {[5, 4, 3, 2, 1].map((star) => {
                // Her bir yıldızın yüzdesini hesapla
                const count = starCounts[star];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="text-gray-400 w-2 font-bold">{star}</span>
                        <div className="flex-1 h-2 bg-[#2d2438] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" 
                                style={{ width: `${percentage}%` }} // Dinamik Genişlik
                            ></div>
                        </div>
                        {/* İstersen yanına sayısını da yazabilirsin */}
                        <span className="text-gray-500 text-[10px] w-6 text-right">%{Math.round(percentage)}</span>
                    </div>
                );
            })}
        </div>

        <button 
            onClick={() => handleOpenWriteModal(selectedFragranceId)}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors text-sm font-bold shadow-lg shadow-primary/20"
        >
            Sen de Değerlendir
        </button>
    </div>
</div>

                        {/* SAĞ: Liste */}
                        <div className="md:col-span-2 flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-white mb-2">Son Yorumlar</h3>
                            
                            {reviewsLoading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                </div>
                            ) : fragranceReviews.length === 0 ? (
                                <div className="bg-[#130d18] rounded-2xl p-10 border border-white/5 text-center text-gray-500 flex flex-col items-center">
                                    <MdComment size={48} className="mb-4 opacity-20" />
                                    <p>Henüz yorum yapılmamış.</p>
                                    <p className="text-sm mt-2">Bu parfümü ilk sen değerlendir!</p>
                                </div>
                            ) : (
                                fragranceReviews.map((review) => (
                                    <div key={review.id} className="bg-[#130d18] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                    {review.username ? review.username.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">{review.username || "Kullanıcı"}</h4>
                                                    <div className="flex text-yellow-400 text-xs mt-1">
                                                        {[...Array(5)].map((_,i) => (
                                                            <MdStar key={i} className={i < review.rating ? "" : "text-gray-700"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{review.date}</span>
                                        </div>
                                        
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex gap-4 text-xs text-gray-500 font-medium border-t border-white/5 pt-4">
                                            <button className="flex items-center gap-1 hover:text-white transition-colors"><MdThumbUp /> Faydalı (0)</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        )}

      </main>

      {/* --- MODAL (SADECE YAZMAK İÇİN) --- */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-surface-highlight w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-fade-in-up">
                <button onClick={() => setIsWriteModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white"><MdClose size={24} /></button>
                <h3 className="text-xl font-bold text-white mb-4">Deneyimini Paylaş</h3>
                <div className="flex gap-2 mb-4 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)}><MdStar size={32} className={star <= rating ? "text-yellow-400" : "text-gray-600"} /></button>
                    ))}
                </div>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Yorumunuzu buraya yazın..." className="w-full h-32 bg-background-dark border border-surface-highlight rounded-xl p-3 text-white focus:border-primary focus:outline-none resize-none mb-4"></textarea>
                <button onClick={handleSubmitReview} className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"><span>Yorumu Gönder</span><MdSend /></button>
            </div>
        </div>
      )}

    </div>
  );
};


export default SearchPage;