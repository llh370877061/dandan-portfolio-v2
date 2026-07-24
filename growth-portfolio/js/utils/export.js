// ============================================
// 成长档案 - 数据导出工具
// ============================================

import { store } from '../store.js';
import { formatDate } from './helpers.js';

// 导出为 JSON
export function exportAsJSON() {
  const data = store.exportData();
  downloadFile(data, `成长档案_${formatDate(new Date().toISOString(), 'iso')}.json`, 'application/json');
}

// 导出为 CSV
export function exportAsCSV(type = 'all') {
  const children = store.getChildren();
  let csv = '';

  if (type === 'all' || type === 'activities') {
    csv += '=== 活动记录 ===\n';
    csv += '孩子,日期,标题,分类,描述,技能,心情,标签\n';
    store.getActivities().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.description || ''}","${(record.skills || []).join('、')}","${record.mood || ''}","${(record.tags || []).join('、')}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'readings') {
    csv += '=== 阅读记录 ===\n';
    csv += '孩子,日期,书名,作者,状态,进度,评分,感想,反思\n';
    store.getReadings().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.author || ''}","${record.status || ''}","${record.progress || 0}%","${record.rating || 0}","${record.thoughts || ''}","${record.reflection || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'confusions') {
    csv += '=== 困惑记录 ===\n';
    csv += '孩子,日期,标题,分类,状态,描述,解决方案\n';
    store.getConfusions().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.status || ''}","${record.description || ''}","${record.resolution || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'progresses') {
    csv += '=== 进步记录 ===\n';
    csv += '孩子,日期,标题,分类,描述,成长领域\n';
    store.getProgresses().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      csv += `"${child?.name || ''}","${record.date}","${record.title || ''}","${record.category || ''}","${record.description || ''}","${record.growthArea || ''}"\n`;
    });
    csv += '\n';
  }

  if (type === 'all' || type === 'assessments') {
    csv += '=== 成长评估 ===\n';
    csv += '孩子,日期,周期,认知发展,社会性发展,情绪发展,身体发展,艺术素养,品德发展,优势,待提升\n';
    store.getAssessments().forEach(record => {
      const child = children.find(c => c.id === record.childId);
      const s = record.scores || {};
      csv += `"${child?.name || ''}","${record.date}","${record.period || ''}","${s.cognitive || 0}","${s.social || 0}","${s.emotional || 0}","${s.physical || 0}","${s.artistic || 0}","${s.moral || 0}","${(record.strengths || []).join('、')}","${(record.areasToImprove || []).join('、')}"\n`;
    });
  }

  // 添加 BOM 以支持中文
  const bom = '﻿';
  downloadFile(bom + csv, `成长档案_${formatDate(new Date().toISOString(), 'iso')}.csv`, 'text/csv;charset=utf-8');
}

// 下载文件
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 导入 JSON
export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = store.importData(e.target.result);
      if (success) {
        resolve(true);
      } else {
        reject(new Error('导入失败，数据格式不正确'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
}

export default { exportAsJSON, exportAsCSV, importJSON };
