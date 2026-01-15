import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Receive data (proximity is expected as 0 or 1)
    const { rfid_tag_id, proximity, device_id } = await req.json();
    const client = await clientPromise;
    const db = client.db("quicktap_db");

    // 2. Identify current student
    const student = await db.collection("students").findOne({ rfid_tag_id: rfid_tag_id });

    // Default values
    let status = "Denied"; 
    let studentName = "Unknown";
    let roll = "N/A";
    let proxyProvider = null;
    let proxyProviderRoll = null;

    if (student) {
      studentName = student.name;
      roll = student.roll;

      // 3. Logic: Check if proximity is 1 (Proxy Detected)
      if (proximity === 1) {
        status = "Proxy"; // Clean status for DB

        // Fetch the last record to find who is standing there
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

          // If last scan was within 2 minutes, tag the provider
          if (timeDiffMinutes <= 2) {
            proxyProvider = lastRecord.student_name;
            proxyProviderRoll = lastRecord.roll; 
          }
        }
      } else {
        // If proximity is 0 (Clear)
        status = "Present";
      }
    } else {
      status = "Denied"; // Clean status for unregistered
    }

    // 4. Save Record to Database
    const newRecord = {
      timestamp: new Date(),
      rfid_tag_id,
      student_name: studentName,
      roll: roll,
      status: status,
      proximity_val: proximity, 
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
  
    // Date Filtering Logic
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

    // Fetch latest 100 records
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