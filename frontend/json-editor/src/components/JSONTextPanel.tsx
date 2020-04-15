import React from 'react';
import './JSONTextPanel.scss';

interface TextPanelProps {
    className: string,
    textData: string,
    onTextChange: (text: string) => void,
    onFormat: () => void,
    onCompact: () => void,
}

function TextPanel (props: TextPanelProps) {
    const cls = props.className;

    const handleTextareaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = ev.currentTarget.value;
        props.onTextChange(val);
    };

    return (
        <div className={cls}>
            <div className={`${cls}-tool`}>
                <button
                    title="格式化代码"
                    className="btn"
                    onClick={props.onFormat}
                >
                    格式化
                </button>
                <button
                    title="清除空格"
                    className="btn"
                    onClick={props.onCompact}
                >
                    清除空格
                </button>
            </div>
            <div className={`${cls}-text-wp`}>
                <textarea
                    spellCheck={false}
                    className={`${cls}-textarea`}
                    value={props.textData}
                    onChange={handleTextareaChange}
                />
            </div>
        </div>
    );
}

TextPanel.displayName = 'TextPanel';

export default TextPanel;
