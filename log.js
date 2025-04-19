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

    const payload = {
      embeds: [
        {
          title: "🔍 Novo acesso ao site!",
          color: 0x00ff00,
          fields: [
            {
              name: "🌐 IP",
              value: ip,
              inline: false
            },
            {
              name: "📍 Localização",
              value: `${city}, ${region} - ${country}`,
              inline: false
            },
            {
              name: "🧠 Navegador",
              value: userAgent,
              inline: false
            },
            {
              name: "🕰️ Horário",
              value: accessTime,
              inline: true
            },
            {
              name: "🌎 Fuso horário",
              value: timezone,
              inline: true
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
