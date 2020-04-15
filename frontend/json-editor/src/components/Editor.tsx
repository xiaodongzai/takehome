import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import TextPanel from './JSONTextPanel';
import TreePanel from './JSONTreePanel';
import { JSONTreeModel } from '../model/TreeModel';
import './Editor.scss';

const prefixCls = 'jsoneditor';

const defaultValue = '{"page":"88","isNonProfit":true,"address":{"street":"科技园路.","city":"江苏苏州","country":"中国"},"links":[{"name":"Google","url":"http://www.google.com"},{"name":"Baidu","url":"http://www.baidu.com"},{"name":"SoSo","url":"http://www.SoSo.com"}]}';

function Editor () {
    const [textData, setTextData] = useState(defaultValue);
    const [treeModel, setTreeModel] = useState<JSONTreeModel|null>(null);
    const [errorStatus, setErrorStatus] = useState(false);

    const handleTextToTree = debounce((data: string) => {
        try{
            const json = JSON.parse(data);
            setTreeModel(JSONTreeModel.getJSONTreeModelFromJSON(json));
            setErrorStatus(false);
        } catch(err) {
            console.log(err);
            setErrorStatus(true);
        }
    }, 100);

    const handleTreeToText = debounce((model: JSONTreeModel) => {
        const jsonStr = JSONTreeModel.getJSONFromTreeNode(model!.treeData);
        setTextData(format(jsonStr, 4));
    }, 100);

    const format = (jsonStr: string, space: number) => {
        return JSON.stringify(JSON.parse(jsonStr), null, space);
    }

    const handleFormat = () => {
        setTextData(format(textData, 4));
    }

    const handleCompact = () => {
        setTextData(format(textData, 0));
    }

    const handleModelChange = (model: JSONTreeModel) => {
        setTreeModel(model);
        handleTreeToText(model);
    };

    const handleTextChange = (textData: string) => {
        setTextData(textData);
        handleTextToTree(textData);
    }

    useEffect(() => {
        handleTextToTree(textData);
    }, []);

    return (
        <div className={prefixCls}>
            <div className={`${prefixCls}-error ${errorStatus ? '' : 'hide'}`}>
                JSON数据格式错误！
            </div>
            <TextPanel
                className={`${prefixCls}-text`}
                textData={textData}
                onTextChange={handleTextChange}
                onFormat={handleFormat}
                onCompact={handleCompact}
            />
            <TreePanel
                className={`${prefixCls}-tree`}
                treeModel={treeModel}
                onChange={handleModelChange}
            />
        </div>
    );
}

Editor.displayName = 'JSONEditor';
export default Editor;
