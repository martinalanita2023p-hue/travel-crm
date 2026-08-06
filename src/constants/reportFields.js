const reportFields = [

  {
    key: "fresh_calls",
    label: "Fresh Calls",
    short: "Calls",
    icon: "📞",
    type: "number",
    category: "calls",
    showInForm: true,
    showInTable: true,
    showInSummary: true,
    order: 1,
  },

  {
    key: "sc_calls",
    label: "SC Calls",
    short: "SC",
    icon: "📅",
    type: "number",
    category: "calls",
    showInForm: true,
    showInTable: true,
    showInSummary: false,
    order: 2,
  },

  {
    key: "fresh_tickets",
    label: "Fresh Tickets",
    short: "Tickets",
    icon: "🎫",
    type: "number",
    category: "sales",
    showInForm: true,
    showInTable: true,
    showInSummary: true,
    order: 3,
  },

  {
    key: "insurance_sold",
    label: "Insurance",
    short: "Insurance",
    icon: "🛡",
    type: "number",
    category: "sales",
    showInForm: true,
    showInTable: true,
    showInSummary: true,
    order: 4,
  },

  {
    key: "pnrs_created",
    label: "PNRs",
    short: "PNRs",
    icon: "📋",
    type: "number",
    category: "operations",
    showInForm: true,
    showInTable: true,
    showInSummary: false,
    order: 5,
  },

  {
    key: "google_reviews",
    label: "Google Reviews",
    short: "Google",
    icon: "⭐",
    type: "number",
    category: "reviews",
    showInForm: true,
    showInTable: true,
    showInSummary: false,
    order: 6,
  },

  {
    key: "trustpilot_reviews",
    label: "Trustpilot Reviews",
    short: "Trustpilot",
    icon: "⭐",
    type: "number",
    category: "reviews",
    showInForm: true,
    showInTable: true,
    showInSummary: false,
    order: 7,
  },

  {
    key: "token_appreciation",
    label: "Token of Appreciation",
    short: "TOA",
    icon: "💰",
    type: "currency",
    category: "finance",
    showInForm: true,
    showInTable: true,
    showInSummary: true,
    order: 8,
  },

];

export default reportFields;