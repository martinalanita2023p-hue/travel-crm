import supabase from "../supabase/client";


/* =======================================
   GENERATE REQUEST NUMBER
======================================= */

function generateRequestNumber() {

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  const time =
    String(
      now.getHours()
    ).padStart(2, "0") +
    String(
      now.getMinutes()
    ).padStart(2, "0") +
    String(
      now.getSeconds()
    ).padStart(2, "0");

  const random =
    Math.floor(
      100 +
      Math.random() * 900
    );

  return `SR-${year}${month}${day}-${time}-${random}`;

}


/* =======================================
   SAVE SERVICE REQUEST
======================================= */

export async function saveServiceRequest(
  request
) {

  const requestData = {

    request_number:
      request.request_number ||
      generateRequestNumber(),

    customer_id:
      request.customer_id ||
      null,

    source:
      request.source,

    request_type:
      request.request_type,

    disposition_type:
      request.disposition_type ||
      null,

    travel_type:
      request.travel_type,

    requested_agent:
      request.requested_agent,

    remarks:
      request.remarks ||
      null,

    status:
      request.status ||
      "Pending",

    reception_user:
      request.reception_user ||
      null,

  };


  console.log(
    "Saving service request:",
    requestData
  );


  const {
    data,
    error,
  } = await supabase

    .from("service_requests")

    .insert([
      requestData
    ])

    .select();


  if (error) {

    console.error(
      "Service Request Error:",
      error
    );

    throw error;

  }


  return data;

}


/* =======================================
   GET TODAY'S RECEPTION REQUESTS
======================================= */

export async function getTodayReceptionRequests() {

  const today =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/New_York",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());


  const tomorrowDate =
    new Date(
      `${today}T00:00:00`
    );


  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  );


  const tomorrow =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/New_York",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      tomorrowDate
    );


  const {
    data,
    error,
  } = await supabase

    .from("service_requests")

    .select("*")

    .gte(
      "created_at",
      `${today}T00:00:00`
    )

    .lt(
      "created_at",
      `${tomorrow}T00:00:00`
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    );


  if (error) {

    console.error(
      "Failed to load Reception requests:",
      error
    );

    throw error;

  }


  return data || [];

}