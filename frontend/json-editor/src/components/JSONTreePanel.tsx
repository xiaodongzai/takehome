import React from 'react';
import ContentEditable from 'react-contenteditable';
import { JSONTreeNode, JSONTreeModel, JSONValueType } from '../model/TreeModel';

import './JSONTreePanel.scss';

interface  TreePanelProps {
    className: string;
    treeModel: JSONTreeModel | null;
    onChange: (model: JSONTreeModel) => void;
}

class TreePanel extends React.Component<TreePanelProps> {
    handleChange = () => {
        this.forceUpdate();
        this.props.onChange(this.props.treeModel!);
    }

    handleKeyModify = (id: string, key: string) => {
        this.props.treeModel!.modify(id, { key });
        this.handleChange();
    }

    handleTextModify = (id: string, text: string) => {
        this.props.treeModel!.modify(id, { text });
        this.handleChange();
    }

    handleAddBtnClick = (parentId: string, type: JSONValueType) => {
        this.props.treeModel!.add(parentId, type);
        this.handleChange();
    }

    handleExpand = (id: string, expand: boolean) => {
        this.props.treeModel!.modify(id, { expand: !expand });
        this.handleChange();
    }

    handleDelete = (id: string) => {
        this.props.treeModel!.deleteById(id);
        this.handleChange();
    }

    renderKey(item: JSONTreeNode) {
        if (item.key === null || item.key[0] === '_') {
            return (
                <span className="readonly item-key">
                    {item.key && item.key.slice(1) || item.type }
                </span>
            );
        }
        return (
            <span className="item-key">
                <ContentEditable
                    spellCheck={false}
                    tagName="span"
                    html={item.key}
                    onChange={ (ev) => this.handleKeyModify(item.id, ev.target.value)}
                />
            </span>
        );
    }

    renderJSONTree(treeData: JSONTreeNode[]) {
        return treeData.map((item: JSONTreeNode) => {
            const type = item.type;
            switch (type) {
                case 'array':
                case 'object':
                    return (
                        <div style={{ paddingLeft: 40 }} >
                            <div className="line-wp">
                                <span className="icon-wp">
                                    <i
                                        className={`iconfont ${ item.expand ? 'icon-sanjiaoxia' : 'icon-triangle-right'}`}
                                        onClick={() => this.handleExpand(item.id, item.expand!)}
                                    />
                                </span>
                                {this.renderKey(item)}
                                <span className="readonly item-text">
                                    {item.text}
                                </span>
                                <div className="action-wp">
                                    {/* <i className="iconfont">A</i> */}
                                    <i
                                        className="iconfont icon-delete"
                                        onClick={() => this.handleDelete(item.id)}
                                    />
                                </div>
                            </div>
                            <div className={item.expand ? '' : 'hide'}>
                                {this.renderJSONTree(item.children!)}
                            </div>
                            <i
                                className="iconfont icon-add"
                                onClick={() => this.handleAddBtnClick(item.id, type)}
                            />
                        </div>
                    );
                default:
                    return (
                        <div className="line-wp">
                            {this.renderKey(item)}
                            :
                            <span className={`item-text ${type}`}>
                                <ContentEditable
                                    spellCheck={false}
                                    tagName="span"
                                    html={String(item.text)}
                                    onChange={ (ev) => this.handleTextModify(item.id, ev.target.value)}
                                />
                            </span>
                            <div className="action-wp">
                                {/* <i className="iconfont">A</i> */}
                                <i
                                    className="iconfont icon-delete"
                                    onClick={() => this.handleDelete(item.id)}
                                />
                            </div>
                        </div>
                    );
            }
        });
    }

    render() {
        if (this.props.treeModel) {
            return (
                <div className={this.props.className}>
                    {this.renderJSONTree([this.props.treeModel.treeData])}
                </div>
            );
        }
        return <div className={this.props.className}></div>;
    }
}

export default TreePanel;
