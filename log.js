fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => {
    const ip = data.ip;
    const city = data.city;
    const region = data.region;
    const country = data.country_name;
    const userAgent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const accessTime = new Date().toLocaleString();

    function detectBrowser(ua) {
      if (ua.includes("Edg")) return "Microsoft Edge";
      if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
      if (ua.includes("Chrome")) return "Google Chrome";
      if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
      if (ua.includes("Firefox")) return "Mozilla Firefox";
      if (ua.includes("MSIE") || ua.includes("Trident")) return "Internet Explorer";
      return "Navegador desconhecido";
    }

    function detectOS(ua) {
      if (ua.includes("Windows NT 10.0")) return "Windows 10";
      if (ua.includes("Windows NT 11.0")) return "Windows 11";
      if (ua.includes("Windows NT 6.3")) return "Windows 8.1";
      if (ua.includes("Windows NT 6.2")) return "Windows 8";
      if (ua.includes("Windows NT 6.1")) return "Windows 7";
      if (ua.includes("Windows NT 6.0")) return "Windows Vista";
      if (ua.includes("Windows NT 5.1")) return "Windows XP";
      if (ua.includes("Mac OS X")) {
        const match = ua.match(/Mac OS X (\d+[_\.\d]+)/);
        if (match) {
          return "Mac OS X " + match[1].replace(/_/g, '.');
        }
        return "Mac OS X";
      }
      if (ua.includes("Android")) {
        const match = ua.match(/Android\s+([\d.]+)/);
        if (match) {
          return "Android " + match[1];
        }
        return "Android";
      }
      if (ua.includes("iPhone")) {
        const match = ua.match(/iPhone OS (\d+[_\d]+)/);
        if (match) {
          return "iOS " + match[1].replace(/_/g, '.');
        }
        return "iOS (iPhone)";
      }
      if (ua.includes("iPad")) {
        const match = ua.match(/CPU OS (\d+[_\d]+)/);
        if (match) {
          return "iOS " + match[1].replace(/_/g, '.');
        }
        return "iOS (iPad)";
      }
      if (ua.includes("Linux")) return "Linux";
      return "Sistema desconhecido";
    }

    const navegador = detectBrowser(userAgent);
    const sistemaOperacional = detectOS(userAgent);

    const payload = {
      embeds: [
        {
          title: "🔍 Novo acesso ao site!",
          color: 0x00ff00,
          fields: [
            {
              name: "🌐 IP",
              value: ip,
              inline: false // linha separada
            },
            {
              name: "📍 Localização",
              value: `${city}, ${region} - ${country}`,
              inline: false // linha separada
            },
            {
              name: "🧠 Navegador",
              value: navegador,
              inline: false // linha separada
            },
            {
              name: "💻 Sistema Operacional",
              value: sistemaOperacional,
              inline: false // linha separada
            },
            {
              name: "🕰️ Horário",
              value: accessTime,
              inline: false // linha separada
            },
            {
              name: "🌎 Fuso horário",
              value: timezone,
              inline: false // linha separada
            }
          ],
          footer: {
            text: "📡 FusionMods - Acesso registrado"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    fetch("https://discord.com/api/webhooks/1363269686590177484/JU5JrP1DvDbMBk0-ND7ZUxTkC3UQ4oW1XLGV6rUN3hPhEBVJpj2fmQW89Jaby2UXrSt-", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  });
