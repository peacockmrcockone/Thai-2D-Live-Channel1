<template>
  <div class="app">
    <div class="container">
      <!-- Left Panel -->
      <div class="left">
        <ul>
          <li>🎓 EDUCATIONAL PURPOSE ONLY</li>
          <li>📊 Market Data & Probability Learning</li>
          <li>🚫 NOT Gambling Advice / Promotion</li>
        </ul>

        <div class="time-box" v-for="(value,index) in currencies">          
          <div class="date-row">
            <div class="date-box"> 
              <span class="text-main">ပတ်သီး</span>
              <div class="date-box-value">{{ value.pathee }}</div>
            </div>
          </div>

          <div class="date-row">
            <div class="date-box">
              <span class="text">ဗုဒ္ဓဟူး မကျော်နိုင်</span>
            </div>
          </div>

        </div>

        <div class="subscribe">
          <button :class="{green:isGreen,red:!isGreen}">
            🔔 LIKE & SUBSCRIBE
          </button>
        </div>
      </div>

      <!-- ✅ RIGHT Panel Now Full Phone UI -->
      <div class="right" v-if="twoDeeLive">
        <div class="phone">
          <h1 class="big-number">{{ twoDeeLive.live.twod }}</h1>
          <p class="updated">Updated: {{ updatedTime }}</p>

          <!-- ✅ Two red cards now inside the phone -->
          <div class="card">
            <h2>12:01 PM</h2>
            <div class="info">
              <div class="info-item">
                <h3>SET</h3>
                <p>{{ twoDeeLive.result[1].set }}</p>
              </div>
              <div class="info-item">
                <h3>Value</h3>
                <p>{{ twoDeeLive.result[1].value }}</p>
              </div>
              <div class="info-item">
                <h3>2D</h3>
                <p>{{ twoDeeLive.result[1].twod }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <h2>4:30 PM</h2>
            <div class="info">
              <div class="info-item">
                <h3>SET</h3>
                <p>{{ twoDeeLive.result[3].set }}</p>
              </div>
              <div class="info-item">
                <h3>Value</h3>
                <p>{{ twoDeeLive.result[3].value }}</p>
              </div>
              <div class="info-item">
                <h3>2D</h3>
                <p>{{ twoDeeLive.result[3].twod }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ CENTER Panel Now Right -->
      <div class="center">
        <div class="center-content">
          <!-- 🙏 ပုံထည့်ထားတဲ့အပိုင်း -->
         <img src="@/assets/photo.png" alt="Respect Image" class="respect-img" />
          <div class="twod">{{ myanmarDate }} <br><span class="day-session"> {{ dayInMyanmar }}နေ့ {{ session }}</span></div>
          <div v-for="(value,index) in currencies" :key="index"> 
            <h4> တနင်္လာမှ သောကြာ</h4>
            <ul>
              <li>{{ value.over }}</li>
              <li>{{ value.home }}</li>
              <li>{{ value.under }}</li>
              <li>{{ value.away }}</li>
              <li>{{ value.hotel }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    // 🌟 Reactive Data
    const today = ref("");
    const updatedTime = ref("");
    const countdown = ref("");
    const isGreen = ref(false);
    const twoDeeLive = ref(null);
    const error = ref("");
    const isAnimated = ref(false);
    const previousLiveData = ref(null);
    const mainTime = ref("");
    const dayInMyanmar = ref("");
    const session = ref(""); // မနက်ပိုင်း / ညနေပိုင်း
    const myanmarDate = ref("");

    //  for API data from backend api laravel
    const currencies = ref([]);
    const loading = ref(true);
    const apiUrl = process.env.VUE_APP_API_URRC;
    const accessToken = process.env.VUE_APP_API_KEY;

    // 🔹 Methods
    const convertToMyanmarNumber = (num) => {
      const myanmarNumbers = ["၀","၁","၂","၃","၄","၅","၆","၇","၈","၉"];
      return num?.toString().split("").map(d => myanmarNumbers[Number(d)]).join("") || "";
    };

    const updateDay = () => {
      const daysMm = ["တနင်္ဂနွေ","တနင်္လာ","အင်္ဂါ","ဗုဒ္ဓဟူး","ကြာသပတေး","သောကြာ","စနေ"];
      const todayIdx = new Date().getDay();
      dayInMyanmar.value = daysMm[todayIdx];
    };

    const updateDateTimeMyanmar = () => {
      const now = new Date();
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      myanmarDate.value = new Intl.DateTimeFormat("my-MM", options).format(now);
    };

    const updateSession = () => {
      const hour = new Date().getHours();
      if (hour >= 10 && hour < 14) session.value = "မနက်ပိုင်း";
      else if (hour >= 14) session.value = "ညနေပိုင်း";
      else session.value = "မနက်ပိုင်း";
    };

    const updateDateTime = () => {
      const now = new Date();
      today.value = now.toLocaleDateString("en-GB");
      updatedTime.value = now.toLocaleString();
    };

    const updateCountdown = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2,"0");
      const minutes = String(now.getMinutes()).padStart(2,"0");
      const seconds = String(now.getSeconds()).padStart(2,"0");
      countdown.value = `${hours}:${minutes}:${seconds}`;
    };

    const loadTwoDeeLive = async () => {
      try {
        const response = await fetch("https://api.thaistock2d.com/live");
        const datas = await response.json();

        if (JSON.stringify(datas.live) !== JSON.stringify(previousLiveData.value)) {
          isAnimated.value = true;
          setTimeout(() => { isAnimated.value = false; }, 10000);
        }

        previousLiveData.value = datas.live;
        twoDeeLive.value = datas;
      } catch (err) {
        error.value = err.message;
      }
    };

    // Fetch data from backend API
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            "Content-Type": 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        currencies.value = jsonData;
      } catch (err) {
        error.value = "Failed to load data: " + err.message;
      } finally {
        loading.value = false;
      }
    };

    const updateMainTime = () => {
      const hour = new Date().getHours();
      const time12 = "12:01 PM";
      const time430 = "04:30 PM";

      mainTime.value = (hour >= 7 && hour < 14) ? time12 : time430;
    };

    // 🌟 Mounted Equivalent
    onMounted(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(err => console.warn("Orientation lock failed:", err));
      }

      // Initial updates
      updateMainTime();
      updateDateTime();
      updateCountdown();
      loadTwoDeeLive();
      updateDay();
      updateDateTimeMyanmar();
      updateSession();

      // Fetch data from backend API
      fetchData();

      // Intervals
      setInterval(updateDateTime, 1000);
      setInterval(updateCountdown, 1000);
      setInterval(loadTwoDeeLive, 10000);
      setInterval(updateMainTime, 60000);
      setInterval(() => { isGreen.value = !isGreen.value; }, 2000);
      setInterval(() => {
        updateDateTimeMyanmar();
        updateSession();
      }, 60000);

      // Fetch data every 5 minutes
      setInterval(() => {fetchData();}, 1 * 60 * 1000); 
    });

    return {
      today,
      updatedTime,
      countdown,
      isGreen,
      twoDeeLive,
      error,
      isAnimated,
      previousLiveData,
      mainTime,
      dayInMyanmar,
      session,
      myanmarDate,
      convertToMyanmarNumber,
      updateMainTime,
      updateDateTime,
      updateCountdown,
      loadTwoDeeLive,
      updateDay,
      updateDateTimeMyanmar,
      updateSession,
      // API data from backend
      currencies,
      loading,
    };
  }
};
</script>



<style>
html, body, .app {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #f9f9f9;
  overflow: hidden;
  font-family: "Noto Sans Myanmar", sans-serif;
}

/* 🌕 Main Container */
.container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}

/* 🌕 Panels */
.left, .center, .right {
  flex: 0 0 33.3%;
  border-radius: 0;
  padding: 10px;
  box-sizing: border-box;
  background: #ffffff;
  font-weight: bold;
}

/* 🚫 Panel ကြားမျဉ်းများဖြုတ် */
.left, .center, .right {
  border: none !important;
}

/* ✅ LEFT PANEL */
.left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.left ul {
  list-style: none;
  padding: 0;
  margin: 0 0 px 0;
    /* Floating animation */
  animation: floatBounce 2s ease-in-out infinite;
  transform-origin: center;
  
}
.left li {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  color: #111;
  margin-bottom: 30px;
}

/* Time Box */
.time-box {
  border: 3px solid #000;
  border-radius: 15px;
  text-align: center;
  padding: 20px 12px;
  background: #0a0a0a;
}
.label {
  font-size: 2.4rem;
  font-weight: 900;
  color: #d10000;
  margin-bottom: 12px;
}

.date-row {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* ✅ Box section */
.date-box {
  text-align: center;
  background: #ff000000;
  color: #111;
}
.text-main {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #3bfc00;
  margin-bottom: 3px;
}

/* "မိန်း", "အရံ" စာသားအတွက် only text */
.text {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #3bfc00;
  margin-bottom: 3px;
}
/* Hot Htate*/
.text-hot {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 3px;
}
/* ✅ randomKey / randomPair များအတွက် လေးထောင့်ဘောင် */
.date-box div {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 10px 60px;
  font-size: 4rem;
  font-weight: 900;
  background: #fefefe;
  color: #d10000;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  min-width: 110px;
  display: inline-block;
}
.date-box .date-box-value  {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 10px 70px;
  font-size: 5.2rem;
  font-weight: 900;
  background: #fefefe;
  color: #d10000;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  min-width: 110px;
  display: inline-block;
  animation: floatBounce 2s ease-in-out infinite;
  transform-origin: center;
}

/* Subscribe Button */
.subscribe {
  text-align: center;
  margin-top: 30px;
}
/* Subscribe Button - Floating/Bounce Effect */
.subscribe button {
  padding: 15px 40px;
  border-radius: 12px;
  font-size: 2.2rem;
  font-weight: bold;
  border: none;
  color: white;
  cursor: pointer;

  /* Floating animation */
  animation: floatBounce 2s ease-in-out infinite;
  transform-origin: center;
}



@keyframes blink { 50% { opacity: 0.7; } }

/* ✅ RIGHT Panel = Full Mobile UI Design */
.right {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f3f3;
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
}

/* 📱 Phone Container - full height panel */
.phone {
  position: relative;
  width: 90%;
  height: 95%;
  background: #ffffff;
  border-radius: 40px;
  border: 6px solid #000;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  padding: 70px 20px 25px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
}

/* 📱 Top notch (camera/speaker bar) */
.phone::before {
  content: "";
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 25px;
  background: #000;
  border-radius: 12px;
}

/* Inside phone content */
.phone h1.big-number {
  font-size: 10rem;
  color: green;
  margin-top: 50px;
  margin-bottom: 30px;
  text-shadow: 3px 3px 8px rgba(0,0,0,0.4);
  animation: floatBounce 2s ease-in-out infinite;
  transform-origin: center;
}

.phone .updated {
  font-size: 1.3rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
}

/* ✅ Cards inside the phone */
.phone .card {
  background: #ff3030;
  color: #fff;
  border-radius: 18px;
  padding: 15px;
  width: 100%;
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.phone .card h2 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.phone .card .info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 8px;
}

.phone .card .info-item h3 {
  font-size: 1.1rem;
  color: #fff;
}

.phone .card .info-item p {
  font-size: 1.6rem;
  font-weight: bold;
  color: yellow;
}

/* ✅ Hide scrollbar for better mobile look */
.phone::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* ✅ CENTER Panel */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  text-align: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Main content alignment */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

/* 🔹 မြန်မာနေ့/အချိန် စာသား */
.center-content .twod {
  font-size: 4rem;
  font-weight: 700;
  color: #c00000;
  margin-bottom: 6px;
}
.center-content .day-session {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c00000;
  margin-bottom: 6px;
}
/* 🔹 “ထွက်မည့် အချိန်” စာသား */
.center-content .label {
  font-size: 3rem;
  font-weight: 700;
  color: #000000;
  margin-top: 5px;
}

/* 🔹 အချိန် */
.center-content .main-time {
  font-size: 3.8rem;
  font-weight: 900;
  color: #000;
  margin: 10px 0 5px 0;
}

/* 🔹 Countdown timer */
.center-content .countdown {
  font-size: 3.5rem;
  font-weight: 700;
  color: #d10000;
  margin-bottom: 10px;
}

/* 🔹 "ထွက်မည့် ဂဏန်း" label */
.center-content div {
  font-size: 3rem;
  color: #222;
  font-weight: 600;
  margin-top: 8px;
}

/* 🔹 ထွက်မည့် ဂဏန်း (ကြီးကြီးပြ) */
.center-content .text-output {
  font-size: 5.5rem;
  font-weight: 900;
  color: #ff0000;
  margin-top: 5px;
  letter-spacing: 2px;
}


/* 🙏 ပုံအတွက် style */
.center-content .respect-img {
  width: 180px;
  height: auto;
  margin-bottom: 80px;
  animation: growPulse 4s ease-in-out infinite;
  transform-origin: center;
}
.currency-label {
  margin-top: 15px;
  color: #c00000;
  font-size: 6rem;
  animation: floatBounce 2s ease-in-out infinite;
  transform-origin: center;
}
/* ✨ အစမှာ သေးပြီး နည်းနည်းကြီးလာပြီး pulse လှုပ် */
@keyframes growPulse {
  0% {
    transform: scale(0.5);
  }
  25% {
    transform: scale(1.5);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(2.1);
  }
  100% {
    transform: scale(2.5);
  }
}


/* ✅ Responsive */
@media (max-width: 1600px) {
  .main-time { font-size: 3.5rem; }
  .text-output { font-size: 4.2rem; }
  .big-number { font-size: 6.5rem; }
  .label { font-size: 2rem; }
  .date-box { font-size: 2rem; }
}

/* Floating / Bouncing Keyframes */
@keyframes floatBounce {
  0%   { transform: translateY(0) scale(1); }
  25%  { transform: translateY(-10px) scale(1.05); }
  50%  { transform: translateY(-5px) scale(1.1); }
  75%  { transform: translateY(-10px) scale(1.05); }
  100% { transform: translateY(0) scale(1); }
}

/* Color variants remain the same */
.subscribe button.red { background: red; }
.subscribe button.green { background: green; }

/* 🌟 CENTER Panel (Enhanced Styling) */
.center-content h4 {
  font-size: 2.8rem;
  font-weight: 900;
  color: #ffffff;
  background: linear-gradient(90deg, #ff0000, #c00000);
  padding: 12px 35px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 🌟 List container */
.center-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 3px solid #ff0000;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.center-content ul:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(255, 0, 0, 0.3);
}

/* 🌟 Each list item */
.center-content li {
  font-size: 3rem;
  font-weight: 800;
  color: #000000;
  background: linear-gradient(180deg, #fff5f5, #ffe0e0);
  padding: 20px 35px;
  border-bottom: 2px solid #ff9999;
  transition: all 0.4s ease;
  letter-spacing: 3.5px;
}

/* 🔸 Remove border on last item */
.center-content li:last-child {
  border-bottom: none;
}

/* 🌟 Hover / Animation Effect */
.center-content li:hover {
  background: linear-gradient(180deg, #ff4d4d, #ff1a1a);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.4);
}

/* 🌟 Small bounce animation for each item */
.center-content li {
  animation: gentleFloat 3s ease-in-out infinite;
}

/* Floating animation (gentle) */
@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

</style>
