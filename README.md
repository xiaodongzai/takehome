# Frontend take-home

## JSON 编辑器

### 功能实现

- [x] 可以解析用户输入的 JSON 文本   
- [x] 友好地展示解析后的 JSON 数据   done
- [x] 可以让用户编辑解析后的数据   done
- [ ] 编辑能力需尽可能完善，包括但不限于改变类型、增减字段等  done(改变类型没做)
- [x] 随着用户编辑适时更新 JSON 文本，便于用户取用   done（onchange触发，防抖）
- [x] 根据你的理解，适当增加提升用户体验的功能并使界面简洁美观  JSON压缩与格式化

### 整体设计
添加一个JSONTree Model层，对应编辑视图的UI
关键点：
1. JSONTree Model层与JSONText之间数据的转换
2. JSONTree Model与编辑视图转换
