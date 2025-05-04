"use client";
import "./exchange-ticker.scss";

export default function ExchangeTicker() {
  const text = `
    USD/PLN: 4.23 • EUR/PLN: 4.56 • GBP/PLN: 5.18 • BTC/USD: $63,400 • ETH/USD: $3,050 •
    GOLD/USD: $2,320 • SILVER/USD: $27.40 • DXY: 104.3 • USD/JPY: 153.6 • EUR/USD: 1.095 •
    GBP/USD: 1.268 • CHF/PLN: 4.78 • BTC/PLN: 260,000 zł • ETH/PLN: 12,300 zł • BIST100: 9,800 • NASDAQ: 16,920 • S&P 500: 5,150
  `;

  return (
    <div className="exchange-ticker-wrapper">
      <div className="exchange-ticker-track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
