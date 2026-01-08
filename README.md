# 🚀 QuickTap IoT - Smart Attendance System

![Status](https://img.shields.io/badge/Status-Live-success)
![Tech](https://img.shields.io/badge/Stack-Next.js%20%7C%20MongoDB%20%7C%20IoT-blue)
![Hardware](https://img.shields.io/badge/Hardware-ESP32%20%7C%20RFID%20%7C%20Ultrasonic-orange)

**QuickTap** is an advanced IoT-based attendance monitoring system designed to prevent "proxy" attendance using Ultrasonic gap detection logic. It features a secure, real-time web dashboard for administration and reporting.

### 🔗 Live Demo: [https://quicktapp.vercel.app](https://quicktapp.vercel.app)
*(Admin Passcode: `admin`)*

---

## 🌟 Key Features

### 📡 Hardware & IoT
*   **RFID Authentication:** Instant identification using RC522 RFID module.
*   **Anti-Proxy Logic:** Ultrasonic sensor (HC-SR04) detects distance gaps to ensure only one person enters per scan.
*   **Real-time Sync:** ESP32 sends data instantly to the cloud via HTTPS.
*   **Visual Feedback:** OLED Display & LEDs for success/error/warning status.

### 💻 Software & Dashboard
*   **Live Monitoring:** Real-time updates without refreshing the page.
*   **Secure Login:** Admin-only access protection.
*   **Advanced Reporting:** Filter attendance records by specific **Dates**.
*   **Data Export:** Download daily attendance reports as **CSV** files.
*   **UI/UX:** Responsive design with **Dark/Light Mode** toggle.

---

## 🛠️ Tech Stack

*   **Hardware:** ESP32 / ESP8266 NodeMCU, RC522 RFID, HC-SR04, OLED Display.
*   **Firmware:** C++ (Arduino IDE).
*   **Frontend:** Next.js (React), Tailwind CSS.
*   **Backend:** Next.js API Routes (Serverless).
*   **Database:** MongoDB Atlas (NoSQL).
*   **Deployment:** Vercel.

---

## ⚙️ System Architecture

1.  **Input:** User taps RFID Card + Ultrasonic Sensor checks for human presence.
2.  **Processing:** ESP32 validates the sensor logic (Gap Detection).
3.  **Transmission:** Data sent via HTTP POST to Vercel API.
4.  **Storage:** MongoDB validates RFID Tag and logs the entry.
5.  **Visualization:** React Dashboard fetches and displays data in real-time.

---

## 🔌 Hardware Pinout (ESP32)

| Component | Pin Name | ESP32 GPIO |
| :--- | :--- | :--- |
| **RC522 RFID** | SDA (SS) | GPIO 5 |
| | SCK | GPIO 18 |
| | MOSI | GPIO 23 |
| | MISO | GPIO 19 |
| | RST | GPIO 4 |
| **OLED (I2C)** | SDA | GPIO 21 |
| | SCL | GPIO 22 |
| **Ultrasonic** | Trig | GPIO 12 |
| | Echo | GPIO 13 |
| **Indicators** | Green LED | GPIO 2 |
| | Red LED | GPIO 15 |

---

## 🚀 Getting Started (Local Development)

To run the software side locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/quicktap-attendance-system.git
    cd quicktap-attendance-system
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env.local` file and add your MongoDB connection string:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Documentation

### 1. Log Attendance (Hardware -> Cloud)
*   **Endpoint:** `POST /api/attendance`
*   **Body:**
    ```json
    {
      "rfid_tag_id": "CARD_UID_HERE",
      "proximity_status": "OK",  // or "WARN"
      "device_id": "ESP32_01"
    }
    ```

### 2. Fetch Records (Cloud -> Dashboard)
*   **Endpoint:** `GET /api/attendance?date=YYYY-MM-DD`
*   **Returns:** Array of attendance objects for the selected date.

---

## 👨‍💻 Developed By
**Hasibur Rahman**  
*System Architect & Full Stack Developer*  
&copy; 2026 QuickTap IoT System. All rights reserved.
