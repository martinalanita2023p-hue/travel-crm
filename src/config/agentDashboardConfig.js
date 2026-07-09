const dashboardSections = [

  {
    type: "section",
    title: "Calls",
    icon: "📞",
    color: "#1976d2",

    fields: [

      { label: "Fresh Calls", name: "fresh_calls" },

      { label: "MAC Calls", name: "mac_calls" },

      { label: "Manager Calls", name: "manager_calls" },

      { label: "Airport Calls", name: "airport_calls" },

    ]

  },

  {

    type: "split",

    title: "Date Change",

    icon: "🔄",

    color: "#ff9800",

    leftLabel: "Calls",

    leftName: "dc_calls",

    rightLabel: "Sales",

    rightName: "dc_sales",

  },

  {

    type: "split",

    title: "Cancellation",

    icon: "❌",

    color: "#f44336",

    leftLabel: "Calls",

    leftName: "cancellation_calls",

    rightLabel: "Sales",

    rightName: "cancellation_sales",

  },

  {

    type: "section",

    title: "Bookings",

    icon: "🎫",

    color: "#8e24aa",

    fields: [

      { label: "Fresh Tickets", name: "fresh_tickets" },

      { label: "B2C Sales", name: "b2c_sales" },

      { label: "PNRs", name: "pnrs_created" },

    ]

  },

  {

    type: "section",

    title: "Customer Experience",

    icon: "⭐",

    color: "#43a047",

    fields: [

      { label: "Insurance", name: "insurance_sold" },

      { label: "Google Reviews", name: "google_reviews" },

      { label: "Trustpilot Reviews", name: "trustpilot_reviews" },

      { label: "TOA ($)", name: "token_appreciation" },

    ]

  }

];

export default dashboardSections;