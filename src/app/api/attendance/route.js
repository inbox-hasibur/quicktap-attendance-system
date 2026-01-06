import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { rfid_tag_id, proximity_status, device_id } = await req.json();
    const client = await clientPromise;
    const db = client.db("quicktap_db");

    // 1. Check Student
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

    // 2. Log Attendance
    const newRecord = {
      timestamp: new Date(),
      rfid_tag_id,
      student_name: studentName,
      roll: roll,
      status: status,
      proximity_status: proximity_status,
      device_id: device_id || "ESP_01"
    };

    await db.collection("attendance_records").insertOne(newRecord);

    return NextResponse.json({
      success: true,
      student_name: studentName,
      status: status
    });

  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("quicktap_db");
    const records = await db
      .collection("attendance_records")
      .find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ success: true, records: records });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}