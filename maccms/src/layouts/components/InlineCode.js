import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import {useEffect} from "react";

export default function InlineCode({type, code, lines}) {

  useEffect(() => {
   // Prism.highlightAll();
  }, []);

    return (
        <div className="inline-code">
          {type == "" ? (
            <>
              <pre>
                <code>{code}</code>
              </pre>
              <div className="code-line-numbers">
                {Array.from({length: lines}, (_, index) => (
                  <div key={index + 1} className="text-[14px] leading-[22.74px] font-primary">{index + 1}</div>
                ))}
              </div>
            </>
          ) : (
            <>
              <SyntaxHighlighter
                language={type}
                style={oneLight}
                customStyle={{
                  backgroundColor: '#fff', // Custom background
                  padding: '10px 10px 10px 70px',
                  borderRadius: '5px',
                  overflow: 'auto',
                  fontSize: '14px',
                  lineHeight: '16px'
                }}
              >
                {code}
              </SyntaxHighlighter>
              <div className="code-line-numbers">
                {Array.from({length: lines}, (_, index) => (
                  <div key={index + 1} className="text-[14px] leading-[21px] font-primary">{index + 1}</div>
                ))}
              </div>
            </>
          )}
            <div className={'code-type'}>{type}</div>
        </div>
    )
}