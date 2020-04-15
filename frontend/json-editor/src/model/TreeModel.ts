export interface JSONTreeNode {
    id: string; // '0.1.2'
    key: string | null; // '_1' 'name'
    text: string | boolean | number | null;
    type: JSONValueType;
    expand?: boolean;
    children: JSONTreeNode[] | null;
}

export enum JSONValueType {
    object = 'object',
    array = 'array',
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    null = 'null'
}

export interface LooseObject {
    [key: string]: any
}

function getJSONValueType(value: any) {
    const type = typeof value;
    switch (type) {
        case JSONValueType.object:
            if (value === null) return JSONValueType.null;
            if (Array.isArray(value)) return JSONValueType.array;
            return JSONValueType.object;
        default:
            return type as JSONValueType;
    }
}

interface NodeBasic {
    key?: string | null;
    text?: string | boolean | number | null;
}

function getTreeDataFromJSON(data: any, { key = null, id = '0', type } : { key?: string | null, id?: string, type?: JSONValueType}): JSONTreeNode {
    const dataType = getJSONValueType(data);
    switch (dataType) {
        case JSONValueType.array:
            return {
                    id,
                    key,
                    type: JSONValueType.array,
                    text: `[${data.length}]`,
                    expand: true,
                    children: data.map((v: any, i: number) => {
                        return getTreeDataFromJSON(v, {
                            id: `${id}.${i}`,
                            key: '_' + i,
                            type: getJSONValueType(v)
                        });
                    })
            };
        case JSONValueType.object:
            return ({
                id,
                key,
                type: JSONValueType.object,
                text: `{${Object.keys(data).length}}`,
                expand: true,
                children: Object.keys(data).map((k, i) => {
                    return getTreeDataFromJSON(data[k], {
                        id: `${id}.${i}`,
                        key: k,
                        type: getJSONValueType(data[k])
                    });
                })
            });
        default:
            return { id, key, text: data, type: dataType, children: null, expand: undefined };
    }
}

function getJSONFromTreeNode (node: JSONTreeNode): any {
    switch (node.type) {
        case JSONValueType.object:
            const obj: LooseObject = {};
            node.children!.forEach((item: JSONTreeNode) => {
                obj[item.key!] = getJSONFromTreeNode(item);
            });
            return obj;
        case JSONValueType.array:
            return node.children!.map((item: JSONTreeNode) => {
                return getJSONFromTreeNode(item);
            });
        default:
            return node.text;
    }
}

export class JSONTreeModel {
    constructor(node: JSONTreeNode) {
        this.treeData = node;
    }

    treeData: JSONTreeNode;

    static getJSONTreeModelFromJSON(data: any) {
        return new JSONTreeModel(getTreeDataFromJSON(data, {}));
    }

    static getJSONFromTreeNode = (treeData: JSONTreeNode) => {
        return JSON.stringify(getJSONFromTreeNode(treeData));
    }

    private get = (idsStr: string) => {
        const ids = idsStr.split('.');
        let res = this.treeData;
        ids.shift();
        while (res && ids.length) {
            let id = ids.shift();
            res = res.children![parseInt(id!)];
        }
        return res;
    }

    deleteById = (idsStr: string) => {
        const ids = idsStr.split('.');
        const parentId = ids.slice(0, ids.length - 1).join('.');
        const parentNode = this.get(parentId);
        const newChildren:JSONTreeNode[] = [];

        if (!parentNode.children) return;

        let index = 0;

        parentNode.children.forEach((v, i) => {
            if (v.id !== idsStr) {
                newChildren.push({
                    ...v,
                    id: `${parentNode.id}.${index}`,
                    key: parentNode.type === JSONValueType.object ? v.key : '_' + index
                });
                index++;
            }
        });
        parentNode.children = newChildren;
    }

    add = (id: string, type: JSONValueType) => {
        const current = this.get(id);
        const len = current.children!.length;
        current.children!.push({
            id: id + '.' + len,
            key: type === JSONValueType.object ? 'key' : '_' + len,
            text: 'value',
            type: JSONValueType.string,
            children: null
        });
    }

    modify = (id: string, { text, key, expand }: any) => {
        const current = this.get(id);
        if (!current) return;
        if (text !== undefined) {
            current.text = text;
            current.type = getJSONValueType(text);
        }
        if (key !== undefined) {
            current.key = key;
        }
        if (expand !== undefined) {
            current.expand = expand;
        }
    }
}
