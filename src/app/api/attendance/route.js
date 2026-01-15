import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { rfid_tag_id, proximity_status, device_id } = await req.json();
    const client = await clientPromise;
    const db = client.db("quicktap_db");

    // 1. Identify current student scanning the card
    const student = await db.collection("students").findOne({ rfid_tag_id: rfid_tag_id });

    let status = "Denied";
    let studentName = "Unknown";
    let roll = "N/A";
    let proxyProvider = null;
    let proxyProviderRoll = null;

    if (student) {
      studentName = student.name;
      roll = student.roll;

      // 2. Logic for Proxy Detection
      if (proximity_status === "WARN") {
        status = "Present (PROXY WARN!)";

        // Fetch the last record for this specific device to find the potential source
        const lastRecordArray = await db.collection("attendance_records")
          .find({ device_id: device_id || "ESP_01" })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();

        if (lastRecordArray.length > 0) {
          const lastRecord = lastRecordArray[0];
          const currentTime = new Date();
          const lastTime = new Date(lastRecord.timestamp);
          
          // Calculate time difference in minutes
          const timeDiffMinutes = (currentTime - lastTime) / 1000 / 60;

          // LOGIC: If the last scan was within 2 minutes, tag the provider.
          // If it's been longer than 2 minutes, assume sensor glitch/stale state (Warn only).
          if (timeDiffMinutes <= 2) {
            proxyProvider = lastRecord.student_name;
            proxyProviderRoll = lastRecord.roll; // Capture ID/Roll
          }
        }
      } else {
        status = "Present";
      }
    } else {
      status = "Denied - Unregistered";
    }

    // 3. Save the attendance record
    const newRecord = {
      timestamp: new Date(),
      rfid_tag_id,
      student_name: studentName,
      roll: roll,
      status: status,
      proximity_status: proximity_status, 
      proxy_provider: proxyProvider,
      proxy_provider_roll: proxyProviderRoll, 
      device_id: device_id || "ESP_01"
    };

    await db.collection("attendance_records").insertOne(newRecord);

    return NextResponse.json({ 
      success: true, 
      student_name: studentName, 
      status: status 
    });

  } catch (e) {
    console.error("Backend Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date'); 
    
    const client = await clientPromise;
    const db = client.db("quicktap_db");

    let query = {};
  
    if (dateParam) {
      const startDate = new Date(dateParam);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999);

      query = {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    const records = await db
      .collection("attendance_records")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ success: true, records: records });
  } catch (e) {
    console.error("Fetch Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}