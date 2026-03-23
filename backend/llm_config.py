import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

# Use the HuggingFace API Key for the Router
# Ensure your Render environment variables have API_KEY set to your hf_... token
api_key = os.getenv("API_KEY")

# Create LLM using HuggingFace Router (OpenAI-compatible)
# We use a reliable, high-performance model like Llama 3.1 70B
llm = ChatOpenAI(
    model="meta-llama/Meta-Llama-3-70B-Instruct",
    openai_api_key=api_key,
    openai_api_base="https://router.huggingface.co/v1",
    temperature=0.7,
)
