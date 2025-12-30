from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Initialize OpenAI LLM
llm = OpenAI(temperature=0.5)

prompt_template = """
You are an AI assistant for flight delays.
Explain in simple terms why the flight may be delayed:

Flight info: {flight_info}
"""

chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(input_variables=["flight_info"], template=prompt_template)
)

def get_explanation(flight_info: str):
    return chain.run(flight_info=flight_info)
