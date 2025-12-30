import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { register, login } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // STATE'LER
  const [activeTab, setActiveTab] = useState('login'); // 'login' veya 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Buton kilidi için
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Dark Mode Tetikleyici
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Input Değişikliği
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: '', text: '' }); // Yazmaya başlayınca hatayı temizle
  }

  // Form Gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Yükleniyor...
    setMessage({ type: '', text: '' });

    if (activeTab === "login") {
      // --- GİRİŞ İŞLEMİ ---
      try {
        const data = await login(formData.email, formData.password);
        console.log("Login başarılı, gelen veri:", data);
        // Servis dosyasında kaydetmiş olabiliriz ama garanti olsun diye burada da bakıyoruz
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
        }

        setMessage({ type: 'success', text: 'Giriş başarılı! Yönlendiriliyorsunuz...' });
        
        setTimeout(() => {
          navigate('/');
        }, 1500); 

      } catch (error) {
        console.error("Login Hatası:", error);
        setMessage({ type: 'error', text: 'Giriş başarısız. E-posta veya şifre hatalı.' });
      } finally {
        setLoading(false);
      }
    } else {
      // --- KAYIT İŞLEMİ ---
      try {
        await register(formData.username, formData.email, formData.password);
        
        setMessage({ type: 'success', text: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' });
        
        // Formu temizle ve Giriş sekmesine geç
        setTimeout(() => {
            setActiveTab('login');
            setFormData({ username: "", email: "", password: "" }); // Formu sıfırla
            setMessage({ type: '', text: '' });
        }, 2000);

      } catch (error) {
        console.error("Register Hatası:", error);
        setMessage({ type: 'error', text: 'Kayıt başarısız. Bilgileri kontrol edin.' });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden selection:bg-primary selection:text-white">
      
      {/* --- SOL TARA (Görsel Bölümü) --- */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden bg-black">
        {/* Arkaplan Resmi */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Elegant dark perfume" 
            className="h-full w-full object-cover opacity-60" 
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1974&auto=format&fit=crop" 
          />
          {/* Gradyan Katmanlar */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
        </div>
        
        {/* Alıntı Yazısı */}
        <div className="relative z-10 max-w-lg text-center p-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            "Koku, anıların konuşmasını sağlayan sanattır."
          </h2>
          <p className="text-text-muted text-lg">— Francis Kurkdjian</p>
        </div>
      </div>

      {/* --- SAĞ TARAF (Form Bölümü) --- */}
      <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-background-light dark:bg-background-dark p-6 sm:p-12 lg:px-24">
        <div className="w-full max-w-[480px] mx-auto flex flex-col gap-6">
          
          {/* Logo ve Marka İsmi */}
          <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-8 text-primary">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">ScentFinder</h2>
          </div>

          {/* Sekmeler (Tabs) */}
          <div className="flex border-b border-gray-200 dark:border-border-dark gap-8 mb-2">
            <button 
                onClick={() => setActiveTab('login')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors ${activeTab === 'login' ? 'border-b-primary' : 'border-b-transparent hover:border-b-gray-300 dark:hover:border-b-border-dark'}`}
            >
              <p className={`${activeTab === 'login' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-text-muted'} text-sm font-bold leading-normal tracking-[0.015em]`}>Giriş Yap</p>
            </button>
            <button 
                onClick={() => setActiveTab('register')}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors ${activeTab === 'register' ? 'border-b-primary' : 'border-b-transparent hover:border-b-gray-300 dark:hover:border-b-border-dark'}`}
            >
              <p className={`${activeTab === 'register' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-text-muted'} text-sm font-bold leading-normal tracking-[0.015em]`}>Üye Ol</p>
            </button>
          </div>

          {/* Dinamik Başlık */}
          <div>
            <h1 className="text-slate-900 dark:text-white tracking-tight text-4xl font-bold leading-tight mb-2">
                {activeTab === 'login' ? 'Hoşgeldin' : 'Hesap Oluştur'}
            </h1>
            <p className="text-slate-500 dark:text-text-muted text-base font-normal leading-normal">
                {activeTab === 'login' ? 'Kişisel parfüm koleksiyonunuza erişmek için giriş yapın.' : 'Kendinize özgü kokuyu keşfetmek için bize katılın.'}
            </p>
          </div>

          {/* MESAJ KUTUSU (HATA/BAŞARI) */}
          {message.text && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
                {message.text}
            </div>
          )}

          {/* FORM */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {/* Sadece Register ise İsim Sor */}
            {activeTab === 'register' && (
                <label className="flex flex-col w-full">
                    <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Kullanıcı Adı</p>
                    <input 
                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 placeholder:text-slate-400 dark:placeholder:text-text-muted px-4 text-base font-normal transition-all"  
                    type="text" 
                    value={formData.username}
                    name='username'
                    onChange={handleChange}
                    required
                    />
                </label>
            )}

            {/* Email */}
            <label className="flex flex-col w-full">
              <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2">Mail Adresi</p>
              <input 
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="form-input flex w-full resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 placeholder:text-slate-400 dark:placeholder:text-text-muted px-4 text-base font-normal transition-all"  
              type="email" 
              required
              />
            </label>

            {/* Password */}
            <label className="flex flex-col w-full relative">
              <div className="flex justify-between items-center pb-2">
                <p className="text-slate-900 dark:text-white text-sm font-medium leading-normal">Şifre</p>
                {activeTab === 'login' && <a className="text-primary text-xs font-semibold hover:text-purple-400 transition-colors" href="#">Şifreni mi unuttun?</a>}
              </div>
              <div className="relative">
                <input 
                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 placeholder:text-slate-400 dark:placeholder:text-text-muted px-4 text-base font-normal transition-all pr-12" 
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      id='password'
                      autoComplete='current-password'
                      required
                    type={showPassword ? "text" : "password"} 
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </label>

            {/* Ana Buton */}
            <button 
                type='submit' 
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-purple-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/25 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      İşleniyor...
                  </span>
              ) : (
                  <span className="truncate">{activeTab === 'login' ? 'Giriş Yap' : 'Üye Ol'}</span>
              )}
            </button>
          </form>

          {/* Footer Yazısı */}
          <p className="text-center text-xs text-slate-500 dark:text-text-muted mt-4">
            Giriş yaparak şartlarımızı kabul etmiş oluyorsunuz. <a className="text-slate-900 dark:text-white font-medium underline decoration-primary/50 hover:decoration-primary" href="#">Terms of Service</a> and <a className="text-slate-900 dark:text-white font-medium underline decoration-primary/50 hover:decoration-primary" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;