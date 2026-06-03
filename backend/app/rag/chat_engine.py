from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

# List of high-performance FREE models on OpenRouter
FREE_MODELS = [
    "qwen/qwen3-coder:free",         # Best for coding tasks
    "google/gemini-2.0-flash-exp:free", # Fast and reliable
    "deepseek/deepseek-v4-flash:free",  # Great reasoning
    "openrouter/free"               # Dynamic free model router
]

def ask_llm(question, context):
    last_error = ""
    for model_id in FREE_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_id,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an Advanced AI Codebase Architect (FREE TIER). 
                        Your mission is to answer questions about the repository's logic and architecture using ONLY the provided code snippets.
                        
                        Rules:
                        1. **Deep Context**: Use the provided code snippets to explain implementation details.
                        2. **No Paid Services**: You are part of a 100% free AI analysis pipeline.
                        3. **Architectural Insight**: Tracing logic across files is your specialty.
                        4. **Markdown Formatting**: Use headers, lists, and code blocks for a professional response.
                        
                        If the answer isn't in the context, provide a logical deduction based on standard patterns."""
                    },
                    {
                        "role": "user",
                        "content": f"THE REPOSITORY CONTEXT:\n{context}\n\nUSER QUESTION:\n{question}"
                    }
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Model {model_id} failed: {str(e)}")
            last_error = str(e)
            continue # Try the next free model
            
    return f"I'm sorry, I encountered an issue with all available free AI models: {last_error}. Please ensure your OpenRouter API key is valid and try again later."
