import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
from langchain_openai import ChatOpenAI
import PyPDF2

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
os.environ['OPENAI_API_KEY'] = os.getenv('API_KEY')

chats = ChatOpenAI(
    openai_api_key=os.environ['OPENAI_API_KEY'],
    model='gpt-3.5-turbo'
)

script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the PDF file
pdf_path = os.path.join(script_dir, "data/Law.pdf")

# Load data from PDF


def load_data_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
        return text


data_text = load_data_from_pdf(pdf_path)

text_splitter = CharacterTextSplitter(
    separator=u'\n',
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

texts = text_splitter.split_text(data_text)

embeddings = OpenAIEmbeddings()
docsseach = FAISS.from_texts(texts, embeddings)

chain = load_qa_chain(OpenAI(), chain_type="stuff")

# Dictionary to store previous questions and answers
memory = {'question': None, 'answer': None}


def ask(question):
    # Adjusted question
    docs = docsseach.similarity_search(question)
    if not docs:
        if question.lower() == 'explain the above question' and memory['question'] and memory['answer']:
            return memory['answer']
        # If the question is not found in the document, ask ChatGPT
        answer = chats.ask(question)
        memory['question'] = question
        memory['answer'] = answer
        return answer

    # Ensure 'input_documents' is passed instead of 'input_document'
    answer = chain.run(input_documents=docs, question=question)

    # Save the answer to memory
    memory['question'] = question
    memory['answer'] = answer

    return answer

# Route to render the HTML template


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/newpage")
def chatpage():
    return render_template("newpage.html")


@app.route("/chat", methods=["POST"])
def chat():
    msg = request.form["msg"]
    answer = ask(msg)
    return jsonify({"content": answer})


if __name__ == "__main__":
    app.run(debug=True)
