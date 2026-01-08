import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  // POST মেথড আগের মতোই থাকবে (শুধু ডাটা সেভ করার জন্য)
  try {
    const { rfid_tag_id, proximity_status, device_id } = await req.json();
    const client = await clientPromise;
    const db = client.db("quicktap_db");

    const student = await db.collection("students").findOne({ rfid_tag_id: rfid_tag_id });

    let status = "Denied";
    let studentName = "Unknown";
    let roll = "N/A";

    if (student) {
      studentName = student.name;
      roll = student.roll;
      if (proximity_status === "WARN") {
        status = "Present (PROXY WARN!)";
      } else {
        status = "Present";
      }
    } else {
      status = "Denied - Unregistered";
    }

    const newRecord = {
      timestamp: new Date(), // বর্তমান সময়
      rfid_tag_id,
      student_name: studentName,
      roll: roll,
      status: status,
      proximity_status: proximity_status,
      device_id: device_id || "ESP_01"
    };

    await db.collection("attendance_records").insertOne(newRecord);

    return NextResponse.json({ success: true, student_name: studentName, status: status });

  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date'); // URL থেকে তারিখ নেওয়া (YYYY-MM-DD)

    const client = await clientPromise;
    const db = client.db("quicktap_db");

    let query = {};

    // যদি তারিখ দেওয়া থাকে, তবে ওই দিনের শুরু (00:00) থেকে শেষ (23:59) পর্যন্ত খুঁজবে
    if (dateParam) {
      const startDate = new Date(dateParam);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999);

      query = {
        timestamp: {
          $gte: startDate, // Greater than or equal to start
          $lte: endDate    // Less than or equal to end
        }
      };
    }

    const records = await db
      .collection("attendance_records")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(100) // সেফটির জন্য ম্যাক্স ১০০ দেখালাম (বাড়াতে পারেন)
      .toArray();

    return NextResponse.json({ success: true, records: records });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}