let currentEntries = {};
let currentEditDate = null;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadEntries();
    
    // 绑定事件监听器
    document.getElementById('addNewBtn').addEventListener('click', () => showDialog());
    document.getElementById('entryForm').addEventListener('submit', handleSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
});

// 加载所有条目
async function loadEntries() {
    try {
        const response = await fetch('/api/entries');
        currentEntries = await response.json();
        displayEntries(currentEntries);
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

// 显示条目
function displayEntries(entries) {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';
    
    Object.entries(entries)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .forEach(([date, entry]) => {
            const card = createEntryCard(date, entry);
            entriesList.appendChild(card);
        });
}

// 创建条目卡片
function createEntryCard(date, entry) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.addEventListener('click', (e) => {
        // 防止点击按钮时触发详情
        if (!e.target.classList.contains('btn')) {
            showDetailDialog(date);
        }
    });
    card.innerHTML = `
        <div class="entry-date">${formatDate(date)}</div>
        <div class="entry-summary">${entry.summary}</div>
        <div class="entry-content">${entry.content.substring(0, 100)}...</div>
        <div class="entry-controls">
            <button class="btn primary" onclick="showDialog('${date}')">编辑</button>
            <button class="btn danger" onclick="showDeleteDialog('${date}')">删除</button>
        </div>
    `;
    return card;
}

// 添加显示详情对话框函数
function showDetailDialog(date) {
    const entry = currentEntries[date];
    const detailDialog = document.getElementById('detailDialog');
    const detailContent = document.getElementById('entryDetail');
    
    detailContent.innerHTML = `
        <div class="entry-detail-section">
            <h3>日期</h3>
            <p>${formatDate(date)}</p>
        </div>
        <div class="entry-detail-section">
            <h3>摘要</h3>
            <p>${entry.summary}</p>
        </div>
        <div class="entry-detail-section">
            <h3>详细内容</h3>
            <p>${entry.content}</p>
        </div>
        <div class="entry-detail-section">
            <h3>学习来源</h3>
            <p>${entry.学习来源 ? `<a href="${entry.学习来源}" target="_blank">${entry.学习来源}</a>` : '无'}</p>
        </div>
        <div class="entry-detail-section">
            <h3>学习收获</h3>
            <p>${entry.学习收获}</p>
        </div>
    `;
    
    detailDialog.style.display = 'block';
}
// 添加关闭详情对话框函数
function closeDetailDialog() {
    document.getElementById('detailDialog').style.display = 'none';
}

// 添加ESC键关闭对话框功能
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDialog();
        closeDeleteDialog();
        closeDetailDialog();
    }
});

// 显示对话框
function showDialog(date = null) {
    const dialog = document.getElementById('entryDialog');
    const form = document.getElementById('entryForm');
    const title = document.getElementById('dialogTitle');
    
    currentEditDate = date;
    
    if (date) {
        const entry = currentEntries[date];
        title.textContent = '编辑学习记录';
        form.date.value = date;
        form.date.disabled = true;
        form.summary.value = entry.summary;
        form.content.value = entry.content;
        form.source.value = entry.学习来源;
        form.gains.value = entry.学习收获;
    } else {
        title.textContent = '新增学习记录';
        form.reset();
        form.date.value = new Date().toISOString().split('T')[0];
        form.date.disabled = false;
    }
    
    dialog.style.display = 'block';
}

// 关闭对话框
function closeDialog() {
    document.getElementById('entryDialog').style.display = 'none';
    currentEditDate = null;
}

// 处理表单提交
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        date: document.getElementById('date').value,
        summary: document.getElementById('summary').value,
        content: document.getElementById('content').value,
        source: document.getElementById('source').value,
        gains: document.getElementById('gains').value
    };
    
    try {
        const url = currentEditDate 
            ? `/api/entry/${currentEditDate}`
            : '/api/entry';
        
        const method = currentEditDate ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            closeDialog();
            loadEntries();
        }
    } catch (error) {
        console.error('Error saving entry:', error);
    }
}

// 显示删除确认对话框
function showDeleteDialog(date) {
    currentEditDate = date;
    document.getElementById('deleteDialog').style.display = 'block';
}

// 关闭删除确认对话框
function closeDeleteDialog() {
    document.getElementById('deleteDialog').style.display = 'none';
    currentEditDate = null;
}

// 确认删除
async function confirmDelete() {
    if (!currentEditDate) return;
    
    try {
        const response = await fetch(`/api/entry/${currentEditDate}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            closeDeleteDialog();
            loadEntries();
        }
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredEntries = Object.entries(currentEntries)
        .filter(([date, entry]) => {
            return (
                entry.summary.toLowerCase().includes(searchTerm) ||
                entry.content.toLowerCase().includes(searchTerm) ||
                entry.学习来源.toLowerCase().includes(searchTerm) ||
                entry.学习收获.toLowerCase().includes(searchTerm)
            );
        })
        .reduce((acc, [date, entry]) => {
            acc[date] = entry;
            return acc;
        }, {});
    
    displayEntries(filteredEntries);
}

// 格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
} 