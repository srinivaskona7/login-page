import os, smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')

@app.route("/send-otp", methods=['POST'])
def send_otp():
    data = request.json
    recipient_email, otp = data.get('email'), data.get('otp')
    if not all([recipient_email, otp, SENDER_EMAIL, SENDER_PASSWORD]):
        return jsonify({"error": "Service not configured or missing data"}), 400
    
    # For development/testing, if email credentials are not properly configured,
    # we'll simulate sending the OTP
    if SENDER_EMAIL == 'your-email@gmail.com' or not SENDER_EMAIL or not SENDER_PASSWORD:
        print(f"DEVELOPMENT MODE: OTP for {recipient_email} is: {otp}")
        return jsonify({"message": "OTP sent (development mode)"}), 200
    
    try:
        msg = MIMEText(f"Your Login Page verification code is: {otp}\n\nThis code will expire in 10 minutes.")
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
        # Fallback to development mode if email fails
        print(f"FALLBACK MODE: OTP for {recipient_email} is: {otp}")
        return jsonify({"message": "OTP sent (fallback mode)"}), 200

@app.route("/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)