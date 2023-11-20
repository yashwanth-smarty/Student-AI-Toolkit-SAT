import React from 'react';
import ReactMarkdown from 'react-markdown';
import './CodeAssistant.css';
const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    components={{
      pre: ({ node, ...props }) => (
        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
          <pre {...props} />
        </div>
      ),
      code: ({ node, ...props }) => (
        <code className="bg-black/10 rounded-lg" {...props} />
      ),
    }}
    className="text-sm overflow-hidden leading-7"
  >
    {content || ''}
  </ReactMarkdown>
);

export default MarkdownRenderer;
