from flask import Flask, request, jsonify, render_template
import validators
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# Route to serve the front-end HTML file
@app.route('/')
def home():
    return render_template('safeZone.html')

# Function to check if a website is phishing
def check_website(url):
    report = {"is_phishing": False, "reasons": []}

    # Validate URL
    if not validators.url(url):
        report["is_phishing"] = True
        report["reasons"].append("Invalid URL format.")
        return report

    try:
        # Fetch website content
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            report["is_phishing"] = True
            report["reasons"].append("Website is not accessible or returned an error.")
            return report

        # Analyze website content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Check for suspicious keywords in the title or meta tags
        title = soup.title.string if soup.title else ""
        if any(keyword in title.lower() for keyword in ["login", "verify", "update", "secure"]):
            report["is_phishing"] = True
            report["reasons"].append("Suspicious keywords found in the website title.")

        # Check for forms with password fields
        forms = soup.find_all('form')
        for form in forms:
            if form.find('input', {'type': 'password'}):
                report["is_phishing"] = True
                report["reasons"].append("Website contains a form requesting sensitive information.")

        # Check for HTTPS
        if not url.startswith("https://"):
            report["is_phishing"] = True
            report["reasons"].append("Website does not use HTTPS.")

    except Exception as e:
        report["is_phishing"] = True
        report["reasons"].append(f"Error occurred while analyzing the website: {str(e)}")

    return report

# API endpoint to check if a website is phishing
@app.route('/check', methods=['POST'])
def check():
    data = request.json
    url = data.get('url', '')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    report = check_website(url)
    return jsonify(report)

if __name__ == '__main__':
    app.run(debug=True)