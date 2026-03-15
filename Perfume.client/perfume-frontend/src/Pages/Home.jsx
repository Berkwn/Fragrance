import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdAutoAwesome, 
  MdSearch, 
  MdPerson, 
  MdArrowForward, 
  MdPsychology, 
  MdStorage, 
  MdBookmark,
  MdShare,
  MdAlternateEmail
} from 'react-icons/md';
import { GiPerfumeBottle } from 'react-icons/gi'; // Logo için özel ikon

const Home = () => {
  const navigate = useNavigate();

  // Sayfa açıldığında Dark Mode'u zorla (Tasarım dark mode üzerine kurulu)
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Çıkış Yapma Fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('token'); // Token'ı sil
    navigate('/login'); // Login'e at
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark text-[#111418] dark:text-white overflow-x-hidden font-display selection:bg-primary selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#302839] px-6 py-4 md:px-10 lg:px-40 bg-white/5 dark:bg-[#141118]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#111418] dark:text-white cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-8 text-primary flex items-center justify-center">
             <GiPerfumeBottle size={32} />
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Kokum Lokum</h2>
        </div>
        
        {/* Profil / Çıkış Butonu */}
        <button 
            onClick={handleLogout}
            className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#f3f4f6] dark:bg-[#302839] text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-[#4a3e56] transition-colors"
            title="Çıkış Yap"
        >
          <MdPerson size={24} />
        </button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 md:px-10 py-12 lg:py-20">
        
        {/* Arkaplan Efektleri (Ambient Background) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-900/30 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
        </div>

        <div className="flex flex-col max-w-[960px] w-full z-10 gap-12">
          
          {/* Hero Text */}
          <div className="text-center flex flex-col gap-4 animate-fade-in-up">
            <h1 className="text-[#111418] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
              Kokunu Keşfet
            </h1>
            <h2 className="text-[#637588] dark:text-[#ab9db9] text-lg md:text-xl font-medium leading-normal max-w-2xl mx-auto">
              Seni yansıtan eşsiz notaları bulmak veya bildiğin bir kokuyu aramak için yolculuğa başla.
            </h2>
          </div>

          {/* KARTLAR (Action Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
            
            {/* 1. KART: Öneri (Recommendation) */}
            <div 
                onClick={() => navigate('/recommendation')} // Yönlendirme
                className="group relative flex flex-col items-center justify-center text-center gap-6 p-8 md:p-12 rounded-xl bg-white dark:bg-card-dark border border-[#e5e7eb] dark:border-[#302839] hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/10 cursor-pointer overflow-hidden"
            >
              {/* Hover Efekti */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MdAutoAwesome size={40} />
              </div>
              
              <div className="relative flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white group-hover:text-primary transition-colors">Yeni bir parfüm arıyorum</h3>
                <p className="text-[#637588] dark:text-[#ab9db9] text-base">Yapay zeka asistanı ile tarzına, sevdiğin notalara uygun yeni kokular keşfet.</p>
              </div>
              
              <div className="relative mt-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Başla <MdArrowForward />
                </span>
              </div>
            </div>

            {/* 2. KART: Arama (Search) */}
            <div 
                onClick={() => navigate('/search')} // Yönlendirme
                className="group relative flex flex-col items-center justify-center text-center gap-6 p-8 md:p-12 rounded-xl bg-white dark:bg-card-dark border border-[#e5e7eb] dark:border-[#302839] hover:border-[#ab9db9] dark:hover:border-[#ab9db9] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-white/5 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative w-20 h-20 rounded-full bg-[#f3f4f6] dark:bg-[#302839] flex items-center justify-center text-[#111418] dark:text-white group-hover:scale-110 group-hover:bg-[#111418] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-[#111418] transition-all duration-300">
                <MdSearch size={40} />
              </div>
              
              <div className="relative flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Parfüm ara</h3>
                <p className="text-[#637588] dark:text-[#ab9db9] text-base">Geniş veritabanımızda bildiğin bir parfümü, markayı veya içeriği bul.</p>
              </div>
              
              <div className="relative mt-2">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#111418] dark:text-white group-hover:translate-x-1 transition-transform">
                    Arama Yap <MdArrowForward />
                </span>
              </div>
            </div>

          </div>

          {/* Alt Bilgi Bölümü */}
          <div className="mt-12 md:mt-16 w-full">
            <div className="border-t border-[#e5e7eb] dark:border-[#302839] w-full mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              
              <div className="flex flex-col gap-3 items-center md:items-start">
                <MdPsychology className="text-primary text-4xl" />
                <h4 className="text-lg font-bold text-[#111418] dark:text-white">Akıllı Analiz</h4>
                <p className="text-sm text-[#637588] dark:text-[#ab9db9]">Zevklerinizi öğrenip size en uygun kokuları önerir.</p>
              </div>
              
              <div className="flex flex-col gap-3 items-center md:items-start">
                <MdStorage className="text-primary text-4xl" />
                <h4 className="text-lg font-bold text-[#111418] dark:text-white">Geniş Veritabanı</h4>
                <p className="text-sm text-[#637588] dark:text-[#ab9db9]">Binlerce marka ve parfüm arasından seçim yapın.</p>
              </div>
              
              <div className="flex flex-col gap-3 items-center md:items-start">
                <MdBookmark className="text-primary text-4xl" />
                <h4 className="text-lg font-bold text-[#111418] dark:text-white">Kişisel Koleksiyon</h4>
                <p className="text-sm text-[#637588] dark:text-[#ab9db9]">Favorilerinizi kaydedin ve dolabınızı oluşturun.</p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="flex flex-col gap-6 px-10 py-10 text-center border-t border-[#e5e7eb] dark:border-[#302839] bg-white/5 dark:bg-[#141118]">
        <div className="flex flex-wrap items-center justify-center gap-6 md:justify-center">
          <a className="text-[#637588] dark:text-[#ab9db9] text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">Hakkımızda</a>
          <a className="text-[#637588] dark:text-[#ab9db9] text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">Gizlilik Politikası</a>
          <a className="text-[#637588] dark:text-[#ab9db9] text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">İletişim</a>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-[#637588] dark:text-[#ab9db9] hover:text-primary transition-colors" href="#">
            <MdShare size={24} />
          </a>
          <a className="text-[#637588] dark:text-[#ab9db9] hover:text-primary transition-colors" href="#">
            <MdAlternateEmail size={24} />
          </a>
        </div>
        <p className="text-[#637588] dark:text-[#ab9db9] text-xs font-normal leading-normal">© 2024 Perfume Discovery. Tüm hakları saklıdır.</p>
      </footer>

    </div>
  );
};

export default Home;