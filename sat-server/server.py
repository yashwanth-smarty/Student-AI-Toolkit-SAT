from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import docx

app = Flask(__name__)
CORS(app)

@app.route('/api/extract-text', methods=['POST'])
def extract_text():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        if uploaded_file.filename.endswith(('.pdf', '.PDF')):
            text = extract_text_from_pdf(uploaded_file)
        elif uploaded_file.filename.endswith(('.doc', '.docx', '.txt', '.DOC', '.DOCX', '.TXT')):
            text = extract_text_from_docx_or_txt(uploaded_file)
        else:
            return jsonify({'error': 'Unsupported file format'})
        
        return jsonify({'text': text}), 200, {'Content-Type': 'text/html'}
    
    return jsonify({'error': 'No file uploaded'})

def extract_text_from_pdf(pdf_file):
    text = ""
    pdf_reader = PdfReader(pdf_file)

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        extracted_page_text = page.extract_text()
        
        # Split by spaces and join with a single space to normalize word spacing
        word_list = extracted_page_text.split()
        cleaned_text = ' '.join(word_list)
        text += cleaned_text + '<br>'  # Use <br> for line breaks

    return text

def extract_text_from_docx_or_txt(docx_file):
    text = ""
    if docx_file.filename.endswith(('.doc', '.docx', '.DOC', '.DOCX')):
        doc = docx.Document(docx_file)
        for paragraph in doc.paragraphs:
            if paragraph.style.name.startswith('List'):
                text += '<li>' + paragraph.text + '</li>'
            else:
                text += paragraph.text + '<br>'
    elif docx_file.filename.endswith(('.txt', '.TXT')):
        text = docx_file.read().decode('utf-8').replace('\n', '<br>')  # Handle line breaks in text

    return text

if __name__ == '__main__':
    app.run(debug=True)
