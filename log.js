async function getVisitorInfo() {
  const res = await fetch('https://ipapi.co/json/');
  const data = await res.json();

  const userAgent = navigator.userAgent;

  return {
    ip: data.ip,
    city: data.city,
    region: data.region,
    country: data.country_name,
    isp: data.org || "Desconhecido",
    latitude: data.latitude,
    longitude: data.longitude,
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    accessTime: new Date().toLocaleString()
  };
}

function detectBrowser(ua) {
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) return "Google Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("MSIE") || ua.includes("Trident")) return "Internet Explorer";
  return "Navegador desconhecido";
}

function detectOS(ua) {
  // Detectando as versões do Windows de forma mais robusta
  if (ua.includes("Windows NT 10.0")) return "Windows 10"; // Windows 10
  if (ua.includes("Windows NT 6.3")) return "Windows 8.1"; // Windows 8.1
  if (ua.includes("Windows NT 6.2")) return "Windows 8"; // Windows 8
  if (ua.includes("Windows NT 6.1")) return "Windows 7"; // Windows 7
  if (ua.includes("Windows NT 6.0")) return "Windows Vista"; // Windows Vista
  if (ua.includes("Windows NT 5.1")) return "Windows XP"; // Windows XP
  if (ua.includes("Windows NT 5.2")) return "Windows Server 2003"; // Windows Server 2003
  if (ua.includes("Windows NT 4.0")) return "Windows NT 4.0"; // Windows NT 4.0
  if (ua.includes("Windows CE")) return "Windows CE"; // Windows CE

  // Detecção do Windows 11
  if (ua.includes("Windows NT 11.0")) return "Windows 11"; // Windows 11

  // Detectando macOS
  if (ua.includes("Mac OS X")) {
    const match = ua.match(/Mac OS X (\d+[_\.\d]+)/);
    return match ? "Mac OS X " + match[1].replace(/_/g, '.') : "Mac OS X";
  }

  // Detectando Android
  if (ua.includes("Android")) {
    const match = ua.match(/Android\s+([\d.]+)/);
    return match ? "Android " + match[1] : "Android";
  }

  // Detectando iOS
  if (ua.includes("iPhone")) {
    const match = ua.match(/iPhone OS (\d+[_\d]+)/);
    return match ? "iOS " + match[1].replace(/_/g, '.') : "iOS (iPhone)";
  }
  if (ua.includes("iPad")) {
    const match = ua.match(/CPU OS (\d+[_\d]+)/);
    return match ? "iOS " + match[1].replace(/_/g, '.') : "iOS (iPad)";
  }

  if (ua.includes("Linux")) return "Linux";
  return "Sistema desconhecido";
}

function detectDeviceType(ua) {
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/Tablet|iPad/i.test(ua)) return "Tablet";
    return "Celular";
  }
  return "Computador";
}

function buildGoogleMapsLink(lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

function incrementVisitCount() {
  let visits = parseInt(localStorage.getItem('visit_count')) || 0;
  visits += 1;
  localStorage.setItem('visit_count', visits);
  return visits;
}

function buildPayload(info, visits) {
  return {
    embeds: [
      {
        title: "🔍 Novo acesso ao site!",
        description: "Um novo visitante acessou seu site. Aqui estão os detalhes:",
        color: 0x00ff00,
        fields: [
          { name: "🌐 IP", value: info.ip, inline: false },
          { name: "🏢 Provedor", value: info.isp, inline: false },
          { name: "📍 Localização", value: `${info.city}, ${info.region} - ${info.country}`, inline: false },
          { name: "🗺️ Mapa", value: `[Ver no Google Maps](${buildGoogleMapsLink(info.latitude, info.longitude)})`, inline: false },
          { name: "📱 Tipo de Dispositivo", value: info.deviceType, inline: false },
          { name: "🧠 Navegador", value: info.browser, inline: true },
          { name: "💻 Sistema Operacional", value: info.os, inline: true },
          { name: "⏰ Horário", value: info.accessTime, inline: false },
          { name: "🌎 Fuso horário", value: info.timezone, inline: false },
          { name: "1️⃣ Número de Visitas", value: `${visits} visita(s) registrada(s)`, inline: false }
        ],
        footer: { text: "📡 FusionMods - Acesso registrado" },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

async function sendWebhook() {
  try {
    const info = await getVisitorInfo();
    const visits = incrementVisitCount();
    const payload = buildPayload(info, visits);

    await fetch("https://discord.com/api/webhooks/1363269686590177484/JU5JrP1DvDbMBk0-ND7ZUxTkC3UQ4oW1XLGV6rUN3hPhEBVJpj2fmQW89Jaby2UXrSt-", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Erro ao enviar o webhook:", error);
  }
}

sendWebhook();
