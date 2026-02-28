import os
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    """
    Returns LLM instance based on LLM_PROVIDER env variable.
    LLM_PROVIDER=1 → Ollama (local, free, unlimited)
    LLM_PROVIDER=2 → Groq (free API, faster)
    """
    provider = os.getenv("LLM_PROVIDER", "1")

    if provider == "2":
        # ── Groq ──────────────────────────────────────────────────────────────
        from langchain_groq import ChatGroq
        print("[LLM] Using Groq (llama-3.3-70b-versatile)")
        return ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
    else:
        # ── Ollama (default) ───────────────────────────────────────────────────
        from langchain_ollama import ChatOllama
        print("[LLM] Using Ollama (llama3.2 local)")
        return ChatOllama(
            model="llama3.2",
            temperature=0.3,
            base_url="http://localhost:11434",
            format="json"
        )