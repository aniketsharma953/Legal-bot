import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import elastic_vector_search, pinecone, weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
import PyPDF2

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
API_KEY = os.getenv('API_KEY')
os.environ['OPENAI_API_KEY'] = API_KEY


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


def ask(question):

    docs = docsseach.similarity_search(question)
    print(chain.run(input_document=docs, question=question))


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
