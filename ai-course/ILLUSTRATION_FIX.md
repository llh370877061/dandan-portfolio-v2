# 配图重复问题修复

## 问题描述

第1集的配图显示重复——同一内容出现了两次。

## 根本原因

1. `getImageSVG`函数在查找配图时，优先使用`epId`作为key
2. 但data.js里的image section使用的是旧的content key（如"ai-everywhere"）
3. 由于新配图系统用episode id作为key，导致每次调用都返回同一个新配图

## 解决方案

修改`getImageSVG`函数的查找顺序：

1. **优先使用content key**：先检查`ILLUSTRATIONS[type]`（即data.js里的content字段）
2. **然后使用episode id**：如果没有找到，再用`ILLUSTRATIONS[epId]`
3. **最后使用fallback**：加回旧的fallback SVGs，确保向后兼容

## 修改的代码

```javascript
function getImageSVG(type, title, epId) {
  _imgIdx[epId] = (_imgIdx[epId] || 0) + 1;
  var idx = _imgIdx[epId];

  // First, try to find by content key (for backward compatibility)
  if (typeof ILLUSTRATIONS !== 'undefined') {
    if (ILLUSTRATIONS[type]) {
      return ILLUSTRATIONS[type];
    }
  }

  // Then try by episode ID
  if (typeof ILLUSTRATIONS !== 'undefined') {
    if (idx > 1 && ILLUSTRATIONS[epId + '_' + idx]) {
      return ILLUSTRATIONS[epId + '_' + idx];
    }
    if (ILLUSTRATIONS[epId]) {
      return ILLUSTRATIONS[epId];
    }
  }

  // Fallback SVGs for backward compatibility
  var fallbackSvgs = { ... };
  
  if (fallbackSvgs[type]) return fallbackSvgs[type];
  
  // Final fallback
  return '<svg ...>';
}
```

## 结果

现在每节课的配图会根据data.js里的content字段正确显示：
- 第1集的3个image section会显示不同的配图
- 不再出现重复内容
- 向后兼容旧的content key
