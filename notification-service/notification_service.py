import os, smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify

app = Flask(__name__)

SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')

@app.route("/send-otp", methods=['POST'])
def send_otp():
    data = request.json
    recipient_email, otp = data.get('email'), data.get('otp')
    if not all([recipient_email, otp, SENDER_EMAIL, SENDER_PASSWORD]):
        return jsonify({"error": "Service not configured or missing data"}), 400
    try:
        msg = MIMEText(f"Your Login Page verification code is: {otp}")
        msg['Subject'] = "Your Verification Code"
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, [recipient_email], msg.as_string())
        return jsonify({"message": "OTP sent"}), 200
    except Exception as e:
        print(f"Email failure: {e}")
        return jsonify({"error": "Failed to send email"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)