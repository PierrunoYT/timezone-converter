from flask import Flask, render_template, request, jsonify
from datetime import datetime
import pytz
from typing import Dict, Any, Optional, Tuple

class TimezoneConverter:
    """Handles timezone conversion logic"""
    
    @staticmethod
    def convert(
        datetime_str: str,
        source_tz: str,
        target_tz: str
    ) -> Tuple[datetime, str, str, str]:
        """
        Convert datetime between timezones
        
        Args:
            datetime_str: ISO format datetime string
            source_tz: Source timezone name
            target_tz: Target timezone name
            
        Returns:
            Tuple of (converted datetime, timezone name, timezone offset, time difference)
            
        Raises:
            ValueError: If inputs are invalid
        """
        # Validate inputs
        if not all([datetime_str, source_tz, target_tz]):
            raise ValueError("All fields are required")

        try:
            # Parse datetime
            dt = datetime.fromisoformat(datetime_str)
            
            # Get timezone objects
            src_tz = pytz.timezone(source_tz)
            target_tz = pytz.timezone(target_tz)
            
            # Handle timezone-aware vs naive datetime
            if dt.tzinfo is None:
                # Naive datetime - localize to source timezone
                src_dt = src_tz.localize(dt)
            else:
                # Already timezone-aware - convert to source timezone first
                src_dt = dt.astimezone(src_tz)
            
            # Convert to target timezone
            target_dt = src_dt.astimezone(target_tz)
            
            # Calculate time difference
            src_offset = src_dt.utcoffset().total_seconds() / 3600
            target_offset = target_dt.utcoffset().total_seconds() / 3600
            diff_hours = target_offset - src_offset
            
            # Format the difference string
            diff_str = f"{'+' if diff_hours > 0 else ''}{int(diff_hours):d}h"
            if diff_hours % 1:
                diff_str += f" {int(abs(diff_hours % 1 * 60))}m"
            
            return (
                target_dt,
                str(target_dt.tzinfo),
                target_dt.strftime('%z'),
                diff_str
            )
            
        except pytz.exceptions.UnknownTimeZoneError:
            raise ValueError("Invalid timezone specified")
        except ValueError as e:
            raise ValueError(f"Invalid datetime format: {e}")
        except Exception as e:
            raise ValueError(f"Conversion error: {e}")

class APIResponse:
    """Handles API response formatting"""
    
    @staticmethod
    def success(data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """Format successful response"""
        return {
            'success': True,
            'result': data
        }, 200
    
    @staticmethod
    def error(message: str, status_code: int = 400) -> Tuple[Dict[str, Any], int]:
        """Format error response"""
        return {
            'success': False,
            'error': str(message)
        }, status_code

# Initialize Flask app
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index() -> str:
    """Render the main page"""
    timezones = sorted(pytz.all_timezones)
    return render_template('index.html', timezones=timezones)

@app.route('/convert', methods=['POST'])
def convert() -> Tuple[Dict[str, Any], int]:
    """Handle timezone conversion requests"""
    
    try:
        # Get request data
        data = request.json
        if not data:
            raise ValueError("No data provided")
            
        # Extract parameters
        datetime_str = data.get('datetime')
        source_tz = data.get('source_timezone')
        target_tz = data.get('target_timezone')
        
        # Convert timezone
        target_dt, tz_name, tz_offset, diff_str = TimezoneConverter.convert(
            datetime_str,
            source_tz,
            target_tz
        )
        
        # Format response
        return APIResponse.success({
            'datetime': target_dt.strftime('%Y-%m-%d %H:%M:%S'),
            'timezone': tz_name,
            'offset': tz_offset,
            'difference': diff_str
        })
        
    except ValueError as e:
        return APIResponse.error(str(e))
    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        return APIResponse.error(
            "An unexpected error occurred",
            status_code=500
        )

if __name__ == '__main__':
    app.run(debug=True)