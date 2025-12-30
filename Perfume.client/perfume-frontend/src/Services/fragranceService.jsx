import api from '../api/axios.config'


export const getAllNotes = async ()=>{

    const response = await api.get('Fragrance/GetAllFragrances');
    return response.data;
}


export const getRecommendations = async (selectedNotes)=>{
    
console.log("Servise gelen notalar:", selectedNotes);
    const response = await api.post('Fragrance/Recommend', {selectedNotes: selectedNotes});
    console.log("Servisten gelen öneriler:", response.data);
    return response.data;

}

export const SearchFragances = async (query) => {
    // EN TEMİZ YÖNTEM:
    const response = await api.get('Fragrance/Search', {
        params: {
            query: query
        }
    });
    return response.data;
}

// src/Services/fragranceService.js

export const getFragranceReviews = async (fragranceId) => {
    // DİKKAT: URL'in sonuna ID'yi ekliyoruz. Soru işareti (?) yok.
    const response = await api.get(`Fragrance/GetReviews/${fragranceId}`);
    return response.data;
}

export const addReview = async (reviewData) => {
    // Token'ı al
    const token = localStorage.getItem('accessToken');

    // KONSOLA YAZDIR: Bakalım elimizde ne var?
    console.log("AddReview çalıştı. Gönderilecek Token:", token);

    // Eğer token yoksa veya "undefined" metni olarak kaydedilmişse hata fırlat
    if (!token || token === "undefined" || token === "null") {
        console.error("HATA: Geçerli bir token bulunamadı. Lütfen tekrar giriş yapın.");
        throw new Error("Oturum açmanız gerekiyor.");
    }

    const response = await api.post('Fragrance/AddReview', reviewData, {
        headers: {
            // DİKKAT: 'Bearer ' ile token arasında BOŞLUK olmalı
            'Authorization': `Bearer ${token}` 
        }
    });
    return response.data;
}