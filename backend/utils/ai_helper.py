# backend/utils/ai_helper.py

def get_explanation(flight_info: str) -> str:
    """
    Mock AI explanation for testing.
    No OpenAI API key needed.
    """
    return f"Mock AI explanation: Your flight may be delayed due to {flight_info}."
