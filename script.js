document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    mobileMenuButton.addEventListener('click', () => {
        // 'active' ক্লাসটি যোগ বা বাতিল করে, যা CSS এ মেন্যু দেখানো বা লুকানোর কাজ করে
        navLinks.classList.toggle('active');
    });
});







// এই কোডটি শুধুমাত্র factcheck.html পেইজে কাজ করবে
if (document.getElementById('factCheckForm')) {
    
    // ধাপ ১ থেকে পাওয়া আপনার Web App URL টি এখানে পেস্ট করুন
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_ezcx-fptUPwXioisgJEqVijTdp_eBFe8fV5sGcBy03KBmh7y4Gdpff1Pdupmd57HVw/exec';

    const form = document.getElementById('factCheckForm');
    const userInput = document.getElementById('userInput');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('resultContainer');
    const verdictEl = document.getElementById('verdict');
    const explanationEl = document.getElementById('explanation');
    const referenceEl = document.getElementById('reference');
    const checkBtn = document.getElementById('checkBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট বন্ধ করে

        const query = userInput.value.trim();
        if (query === '') return;

        // লোডার দেখানো এবং আগের রেজাল্ট হাইড করা
        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        checkBtn.disabled = true;
        checkBtn.textContent = 'যাচাই হচ্ছে...';

        try {
            // Apps Script-এ POST অনুরোধ পাঠানো হচ্ছে
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ text: query }), // আপনার Apps Script এই ফরম্যাটে ডেটা আশা করে
            });

            if (!response.ok) {
                throw new Error(`Network response error!`);
            }

            const result = await response.json(); // ফলাফল JSON হিসেবে গ্রহণ করা
            displayResult(result);

        } catch (error) {
            console.error('Error:', error);
            displayError('একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
        } finally {
            // সবশেষে লোডার হাইড করা এবং বাটন সচল করা
            loader.classList.add('hidden');
            checkBtn.disabled = false;
            checkBtn.textContent = 'যাচাই করুন';
        }
    });

    function displayResult(data) {
        let verdictText = '';
        let verdictColor = '';
        let borderColor = '';

        if (data.verdict.includes('সত্য')) {
            verdictText = `✅ ${data.verdict}`;
            verdictColor = '#00796b'; // Green
            borderColor = '#66bb6a';
        } else if (data.verdict.includes('মিথ্যা')) {
            verdictText = `❌ ${data.verdict}`;
            verdictColor = '#d32f2f'; // Red
            borderColor = '#ef5350';
        } else {
            verdictText = `⚠️ ${data.verdict}`;
            verdictColor = '#ffa000'; // Orange
            borderColor = '#ffa726';
        }

        verdictEl.textContent = verdictText;
        verdictEl.style.color = verdictColor;
        resultContainer.style.borderLeftColor = borderColor;
        explanationEl.textContent = data.explanation;
        referenceEl.textContent = `সূত্র: ${data.reference}`;

        resultContainer.classList.remove('hidden');
    }

    function displayError(message) {
        verdictEl.textContent = '❌ ত্রুটি';
        verdictEl.style.color = '#d32f2f';
        resultContainer.style.borderLeftColor = '#ef5350';
        explanationEl.textContent = message;
        referenceEl.textContent = '';
        resultContainer.classList.remove('hidden');
    }
}











// এই কোডটি শুধুমাত্র quran.html পেইজে কাজ করবে
if (document.getElementById('quranSearchForm')) {

    // ধাপ ১ থেকে পাওয়া আপনার *নতুন* কুরআন Web App URL টি এখানে পেস্ট করুন
    const QURAN_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJKNELQ4YJddjEDj0MwcEQmJmfmRJaegDIZcq3Hm0ofTVf-45C5GK2qcXoN0WSVABm/exec';

    const form = document.getElementById('quranSearchForm');
    const surahInput = document.getElementById('surahInput');
    const ayahInput = document.getElementById('ayahInput');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('quranResult');
    const searchBtn = document.getElementById('searchBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const surahQuery = surahInput.value.trim();
        const ayahQuery = ayahInput.value.trim();
        if (!surahQuery || !ayahQuery) return;

        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        searchBtn.disabled = true;
        searchBtn.textContent = 'অনুসন্ধান হচ্ছে...';

        try {
            const response = await fetch(QURAN_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ surah: surahQuery, ayah: ayahQuery }),
            });

            if (!response.ok) throw new Error('Network response error!');
            
            const result = await response.json();

            // Apps Script থেকে error আসলে সেটা দেখানো
            if (result.error) {
                displayError(result.error);
            } else {
                displayResult(result);
            }

        } catch (error) {
            console.error('Error:', error);
            displayError('❌ একটি অপ্রত্যাশিত সমস্যা হয়েছে।');
        } finally {
            loader.classList.add('hidden');
            searchBtn.disabled = false;
            searchBtn.textContent = 'অনুসন্ধান করুন';
        }
    });

    function displayResult(data) {
        document.getElementById('surahName').textContent = data.surahName;
        document.getElementById('ayahInfo').textContent = `সূরা নং: ${data.surahNumber}, আয়াত নং: ${data.ayahNumber}`;
        document.getElementById('translation').textContent = `অনুবাদ: ${data.translation}`;
        document.getElementById('explanation').textContent = `ব্যাখ্যা: ${data.explanation}`;
        resultContainer.classList.remove('hidden');
    }

    function displayError(message) {
        document.getElementById('surahName').textContent = 'ত্রুটি';
        document.getElementById('ayahInfo').textContent = '';
        document.getElementById('translation').textContent = message;
        document.getElementById('explanation').textContent = '';
        resultContainer.classList.remove('hidden');
    }
}