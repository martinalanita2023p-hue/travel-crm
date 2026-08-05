import "./SummaryCards.css";
import {
  Phone,
  Ticket,
  ShieldCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function SummaryCards({
  stats,
  onCardClick,
}) {
  const cards = [
  {
    key: "freshCalls",
    title: "Fresh Calls",
    value: stats.freshCalls,
    icon: Phone,
    color: "blue",
  },
  {
    key: "tickets",
    title: "Fresh Tickets",
    value: stats.freshTickets,
    icon: Ticket,
    color: "purple",
  },
  {
    key: "insurance",
    title: "Insurance",
    value: stats.insurance,
    icon: ShieldCheck,
    color: "green",
  },
  {
    key: "toa",
    title: "TOA",
    value: `$${Number(stats.toa).toFixed(2)}`,
    icon: DollarSign,
    color: "orange",
  },
  {
    key: "submitted",
    title: "Submitted",
    value: stats.submittedAgents,
    icon: Phone,
    color: "teal",
  },
  {
    key: "pending",
    title: "Pending",
    value: stats.missingAgents,
    icon: Phone,
    color: "red",
  },
  {
    key: "reviews",
    title: "Reviews",
    value: stats.google + stats.trustpilot,
    icon: ShieldCheck,
    color: "yellow",
  },
  {
    key: "pnrs",
    title: "PNRs",
    value: stats.pnrs,
    icon: Ticket,
    color: "indigo",
  },
];
  return (
    <div className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="summary-card"
            onClick={() => onCardClick(card.key)}
          >
            <div className={`summary-icon ${card.color}`}>
              <Icon size={28} />
            </div>

            <div className="summary-content">
              <span>{card.title}</span>

              <h2>{card.value}</h2>

              <small>Click for details</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}