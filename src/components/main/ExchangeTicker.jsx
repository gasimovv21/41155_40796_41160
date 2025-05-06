"use client";

import { useEffect, useState } from "react";
import "./exchange-ticker.scss";
import { handleGetChartData } from "@/actions/main-action";

export default function ExchangeTicker() {
  const [exchangeRates, setExchangeRates] = useState({});

  const currencyList = [
    { code: "USD", label: "USD", flag: "/icons/flags/usd.svg" },
    { code: "EUR", label: "EUR", flag: "/icons/flags/eur.svg" },
    { code: "GBP", label: "GBP", flag: "/icons/flags/gbp.svg" },
    { code: "JPY", label: "JPY", flag: "/icons/flags/jpy.svg" },
    { code: "CAD", label: "CAD", flag: "/icons/flags/cad.svg" },
    { code: "AUD", label: "AUD", flag: "/icons/flags/aud.svg" },
    { code: "CHF", label: "CHF", flag: "/icons/flags/chf.svg" },
    { code: "SEK", label: "SEK", flag: "/icons/flags/sek.svg" },
  ];

  const fetchRates = async () => {
    const rates = {};

    for (let currency of currencyList) {
      const data = await handleGetChartData(currency.code.toLowerCase());
      if (data && data.rates) {
        const { ask, bid } = data.rates[0];
        rates[currency.code] = { ask, bid };
      }
    }

    setExchangeRates(rates);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);

    return () => clearInterval(interval);
  }, []);

  // Dynamically generate the ticker text
  const generateTickerText = () => {
    return currencyList
      .map((currency) => {
        const rate = exchangeRates[currency.code];
        if (rate) {
          return `                 ${
            currency.code
          }/PLN     SELL: ${rate.bid.toFixed(2)} BUY: ${rate.ask.toFixed(
            2
          )}                 `;
        }
        return `${currency.code}/PLN: --.-- • ${currency.code}/PLN: --.--`;
      })
      .join("                ");
  };

  return (
    <div className="exchange-ticker-wrapper">
      <div className="exchange-ticker-track">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="ticker-sequence">
            {currencyList.map((currency) => {
              const rate = exchangeRates[currency.code];
              return (
                <div key={currency.code} className="ticker-item">
                  <span className="pair">{currency.code}/PLN</span>
                  {rate ? (
                    <>
                      <span className="sell">SELL: {rate.bid.toFixed(2)}</span>
                      <span className="buy">BUY: {rate.ask.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="loading">--.-- / --.--</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
