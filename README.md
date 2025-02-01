# Timezone Converter

A modern, user-friendly web application for converting times between different timezones. Features a clean interface, dark mode support, and instant timezone search.

## Features

- 🌍 Convert between any timezone
- 🔍 Quick timezone search
- 🌓 Dark/Light mode
- ⚡ Real-time conversion
- 📱 Responsive design
- 🔄 Time difference display

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Windows

```batch
# Clone the repository
git clone https://github.com/PierrunoYT/timezone-converter.git
cd timezone-converter

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

### macOS/Linux

```bash
# Clone the repository
git clone https://github.com/PierrunoYT/timezone-converter.git
cd timezone-converter

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The application will be available at `http://localhost:5000`

## Usage

1. Select the date and time you want to convert
2. Choose the source timezone ("From Timezone")
3. Choose the target timezone ("To Timezone")
4. Click "Convert"
5. View the converted time and time difference

### Quick Tips

- Use the search box in timezone dropdowns to quickly find your timezone
- Click the swap button (↕️) to quickly swap source and target timezones
- Toggle dark/light mode using the switch in the top-right corner

## Development

### Project Structure

```
timezone-converter/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css  # Styles
│   └── js/
│       └── app.js     # Frontend logic
└── templates/
    ├── index.html     # Main template
    └── components/    # Reusable components
        └── timezone_select.html
```

### Running in Development Mode

```bash
# Enable debug mode
export FLASK_ENV=development  # Unix/macOS
set FLASK_ENV=development    # Windows

python app.py
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**PierrunoYT** - [GitHub](https://github.com/PierrunoYT)

## Acknowledgments

- [pytz](https://pythonhosted.org/pytz/) for timezone calculations
- [Flask](https://flask.palletsprojects.com/) for the web framework 