// --- DİKKAT: API ANAHTARINI BURADAKİ TIRNAKLARIN İÇİNE YAZ ---
const apiKey = "BURAYA_API_KEY_YAPISTIR"; 
// Örnek görünüm: const apiKey = "a6c5d9f8e7b4c2a1d3e5f6g7";

const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const icon = document.querySelector(".icon");

// 1. Seçim Kutularını Doldur
for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // Varsayılan olarak USD -> TRY seçili gelsin
        let selected = i == 0 ? (currency_code == "USD" ? "selected" : "") : (currency_code == "TRY" ? "selected" : "");
        
        // Option oluşturma
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    
    // Seçim değişince bayrağı güncelle
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

// 2. Bayrak Yükleme Fonksiyonu
function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            // flagsapi.com üzerinden dinamik bayrak çekiyoruz
            imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
        }
    }
}

// 3. Swap (Yer Değiştirme) Butonu
icon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// 4. Butona Tıklanınca Çevir
getButton.addEventListener("click", e =>{
    e.preventDefault(); // Sayfa yenilenmesini engelle
    getExchangeRate();
});

// 5. Enter Tuşu Desteği (Miktar girip enter'a basınca çalışsın)
document.querySelector("form input").addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        getExchangeRate();
    }
});

// 6. Ana Çeviri Fonksiyonu (API İsteği)
function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("#exchangeRateTxt");
    let amountVal = amount.value;
    
    // Eğer kutu boşsa veya 0 ise 1 yap
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Hesaplanıyor...";
    
    // API URL Yapısı
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    
    fetch(url)
    .then(response => response.json())
    .then(result =>{
        // API'den gelen veriyi işle
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        
        // Sonucu HTML'e yazdır
        const exchangeRateDiv = document.querySelector(".exchange-rate");
        exchangeRateDiv.innerHTML = `${amountVal} ${fromCurrency.value} = <b>${totalExRate} ${toCurrency.value}</b>`;
    })
    .catch(() =>{
        // Hata olursa (İnternet yoksa veya API key yanlışsa)
        const exchangeRateDiv = document.querySelector(".exchange-rate");
        exchangeRateDiv.innerText = "Hata: API Key veya Bağlantı Sorunu!";
    });
}

// Sayfa ilk açıldığında bir kere çalıştır
window.addEventListener("load", () => {
    getExchangeRate();
});
