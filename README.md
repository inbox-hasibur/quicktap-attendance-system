# 🚀 QuickTap IoT - Smart Attendance System

![Status](https://img.shields.io/badge/Status-Live-success)
![Tech](https://img.shields.io/badge/Stack-Next.js%20%7C%20MongoDB%20%7C%20IoT-blue)
![Hardware](https://img.shields.io/badge/Hardware-ESP32%20%7C%20RFID%20%7C%20Ultrasonic-orange)

**QuickTap** is an advanced IoT-based attendance monitoring system designed to prevent "proxy" attendance using Ultrasonic gap detection logic. It features a secure, real-time web dashboard for administration, reporting, and intelligent fraud detection.

### 🔗 Live Demo: [https://quicktapp.vercel.app](https://quicktapp.vercel.app)
*(Admin Passcode: `admin`)*

---

## 🌟 Key Features

### 📡 Hardware & IoT
*   **RFID Authentication:** Instant identification using RC522 RFID module.
*   **Anti-Proxy Logic:** Ultrasonic sensor (HC-SR04) detects distance gaps to ensure only one person enters per scan.
*   **Real-time Sync:** ESP32 sends data instantly to the cloud via HTTPS.
*   **Visual Feedback:** LCD 16x2 Display & Buzzer/LEDs for success/error/warning status.

### 💻 Software & Dashboard
*   **Live Monitoring:** Real-time updates via SWR polling.
*   **Intelligent Proxy Tracing:** Identifies *who* provided the proxy based on timestamp logic.
*   **Advanced Reporting:** Filter attendance records by specific **Dates**.
*   **Data Export:** Download daily attendance reports as **CSV** files.
*   **UI/UX:** Responsive design with **Dark/Light Mode** toggle.

---

## 🛠️ Tech Stack

*   **Hardware:** ESP32 NodeMCU, RC522 RFID, HC-SR04, LCD 16x2 (I2C).
*   **Firmware:** C++ (Arduino IDE).
*   **Frontend:** Next.js (React), Tailwind CSS.
*   **Backend:** Next.js API Routes (Serverless).
*   **Database:** MongoDB Atlas (NoSQL).
*   **Deployment:** Vercel.

---

## ⚙️ System Architecture

1.  **Input:** User taps RFID Card + Ultrasonic Sensor checks for human presence gap.
2.  **Processing:** ESP32 validates the sensor logic (Gap Detection).
3.  **Transmission:** Data sent via HTTP POST to Vercel API.
4.  **Storage:** MongoDB logs the entry and checks for previous proxy providers.
5.  **Visualization:** React Dashboard fetches and displays data in real-time.

---

## 🔌 Hardware Pinout (ESP32 30-Pin)

| Component | Pin Name | ESP32 GPIO | Note |
| :--- | :--- | :--- | :--- |
| **RC522 RFID** | SDA (SS) | **D5** | SPI |
| | SCK | **D18** | SPI |
| | MOSI | **D23** | SPI |
| | MISO | **D19** | SPI |
| | RST | **D4** | Reset |
| **LCD (I2C)** | SDA | **D21** | I2C Data |
| | SCL | **D22** | I2C Clock |
| **Ultrasonic** | Trig | **D25** | *Changed for Boot Safety* |
| | Echo | **D26** | *Changed for Boot Safety* |
| **Indicators** | Green LED | **D2** | Success |
| | Red LED | **D15** | Error |
| | Buzzer | **D27** | Active Buzzer |

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
*   **Body Structure:**
    ```json
    {
      "rfid_tag_id": "8C84FC5B",
      "proximity": 0,       // 0 = Clear/Present, 1 = Proxy Detected
      "device_id": "GATE_01"
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
