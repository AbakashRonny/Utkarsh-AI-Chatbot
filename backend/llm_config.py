# import os
# from dotenv import load_dotenv
# from langchain_openai import ChatOpenAI
# from langchain_core.prompts import ChatPromptTemplate

# load_dotenv()

# api_key = os.getenv("API_KEY")

# # Create LLM using OpenAI-compatible endpoint
# llm = ChatOpenAI(
#     model="openai/gpt-oss-20b:groq",
#     openai_api_key=api_key,
#     openai_api_base="https://router.huggingface.co/v1",
#     temperature=0.7,
# )

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

api_key = os.getenv("OLAMA_KEY")

# Create LLM using OpenAI-compatible endpoint
llm = ChatOpenAI(
    model="gpt-oss:120b-cloud",
    openai_api_key=api_key,
    # openai_api_base="https://router.huggingface.co/v1",
    temperature=0.7,
)
