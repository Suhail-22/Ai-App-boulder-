// AI Development Platform - منصة التطوير بالذكاء الاصطناعي
class AIDevPlatform {
    constructor() {
        this.currentProject = {
            id: 'project-' + Date.now(),
            name: 'مشروع جديد',
            files: [
                {
                    id: 'file-1',
                    name: 'index.html',
                    path: '/index.html',
                    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مشروعي الأول</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>مرحباً بالعالم! 👋</h1>
        <p>هذا مشروعك الأول في منصة التطوير بالذكاء الاصطناعي</p>
        <button id="myButton">اضغط علي</button>
        <div id="output"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                    language: 'html',
                    isOpen: true
                },
                {
                    id: 'file-2',
                    name: 'style.css',
                    path: '/style.css',
                    content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: #333;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 100%;
    text-align: center;
}

h1 {
    color: #4f46e5;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
}

#myButton {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 1.5rem;
}

#myButton:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(79, 70, 229, 0.4);
}

#output {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 2px dashed #cbd5e1;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
}`,
                    language: 'css',
                    isOpen: false
                },
                {
                    id: 'file-3',
                    name: 'script.js',
                    path: '/script.js',
                    content: `document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('myButton');
    const output = document.getElementById('output');
    let clickCount = 0;
    
    button.addEventListener('click', function() {
        clickCount++;
        output.innerHTML = \`
            <div style="color: #10b981; font-weight: bold;">
                <i class="fas fa-check-circle"></i>
                تم النقر \${clickCount} مرة
            </div>
            <div style="font-size: 0.9rem; color: #64748b; margin-top: 8px;">
                التاريخ: \${new Date().toLocaleString('ar-SA')}
            </div>
        \`;
        
        // تأثير بسيط
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
    
    console.log('المشروع يعمل بنجاح! 🎉');
});`,
                    language: 'javascript',
                    isOpen: false
                }
            ],
            createdAt: new Date()
        };
        
        this.editor = null;
        this.currentFile = null;
        this.terminalHistory = [];
        this.chatHistory = [];
        this.init();
    }
    
    init() {
        // تهيئة Monaco Editor
        this.initEditor();
        
        // تحميل شجرة الملفات
        this.loadFileTree();
        
        // إعداد الأحداث
        this.setupEvents();
        
        // تحديث المعاينة
        this.updatePreview();
        
        // إعداد Terminal
        this.setupTerminal();
    }
    
    initEditor() {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(document.getElementById('editor-container'), {
                value: this.currentProject.files[0].content,
                language: 'html',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: { enabled: true },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true
            });
            
            this.currentFile = this.currentProject.files[0];
            
            // تحديث الموقع
            this.editor.onDidChangeCursorPosition((e) => {
                this.updateCursorPosition(e.position.lineNumber, e.position.column);
            });
            
            // حفظ التغييرات
            this.editor.onDidChangeModelContent(() => {
                this.saveCurrentFile();
                this.updatePreview();
            });
        });
    }
    
    loadFileTree() {
        const fileTree = document.getElementById('file-tree');
        fileTree.innerHTML = '';
        
        this.currentProject.files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = `file-item ${file.id === this.currentFile?.id ? 'active' : ''}`;
            fileElement.innerHTML = `
                <i class="fas fa-file${this.getFileIcon(file.name)}"></i>
                <span>${file.name}</span>
                ${file.isOpen ? '<i class="fas fa-circle" style="color: #10b981; font-size: 8px;"></i>' : ''}
            `;
            
            fileElement.addEventListener('click', () => this.openFile(file));
            fileTree.appendChild(fileElement);
        });
    }
    
    getFileIcon(filename) {
        if (filename.endsWith('.html')) return '-code';
        if (filename.endsWith('.css')) return '-css';
        if (filename.endsWith('.js')) return '-js';
        if (filename.endsWith('.json')) return '-json';
        return '';
    }
    
    openFile(file) {
        this.currentFile = file;
        this.editor.setValue(file.content);
        
        // تغيير لغة المحرر
        const model = this.editor.getModel();
        monaco.editor.setModelLanguage(model, file.language || 'plaintext');
        
        // تحديث التبويب
        this.updateEditorTab(file);
        
        // تحديث شجرة الملفات
        this.loadFileTree();
        
        // تحديث المعاينة
        this.updatePreview();
    }
    
    updateEditorTab(file) {
        const tabs = document.getElementById('editor-tabs');
        tabs.innerHTML = '';
        
        // إضافة تبويبات للملفات المفتوحة
        this.currentProject.files.filter(f => f.isOpen).forEach(f => {
            const tab = document.createElement('div');
            tab.className = `tab ${f.id === file.id ? 'active' : ''}`;
            tab.dataset.file = f.name;
            tab.innerHTML = `
                <i class="fab fa-${this.getTabIcon(f.name)}"></i>
                ${f.name}
                <button class="tab-close"><i class="fas fa-times"></i></button>
            `;
            
            tab.addEventListener('click', (e) => {
                if (!e.target.closest('.tab-close')) {
                    this.openFile(f);
                }
            });
            
            const closeBtn = tab.querySelector('.tab-close');
            closeBtn.addEventListener('click', () => this.closeFile(f));
            
            tabs.appendChild(tab);
        });
    }
    
    getTabIcon(filename) {
        if (filename.endsWith('.html')) return 'html5';
        if (filename.endsWith('.css')) return 'css3-alt';
        if (filename.endsWith('.js')) return 'js';
        if (filename.endsWith('.json')) return 'node-js';
        return 'file-code';
    }
    
    closeFile(file) {
        file.isOpen = false;
        if (this.currentFile.id === file.id) {
            // افتح ملف آخر
            const nextFile = this.currentProject.files.find(f => f.isOpen);
            if (nextFile) {
                this.openFile(nextFile);
            } else {
                this.currentFile = null;
                this.editor.setValue('// لا يوجد ملف مفتوح');
            }
        }
        this.updateEditorTab(this.currentFile);
    }
    
    saveCurrentFile() {
        if (this.currentFile && this.editor) {
            this.currentFile.content = this.editor.getValue();
            
            // تحديث الملف في المشروع
            const fileIndex = this.currentProject.files.findIndex(f => f.id === this.currentFile.id);
            if (fileIndex !== -1) {
                this.currentProject.files[fileIndex] = this.currentFile;
            }
        }
    }
    
    updatePreview() {
        const previewFrame = document.getElementById('live-preview');
        const htmlFile = this.currentProject.files.find(f => f.name === 'index.html');
        const cssFile = this.currentProject.files.find(f => f.name === 'style.css');
        const jsFile = this.currentProject.files.find(f => f.name === 'script.js');
        
        let htmlContent = htmlFile ? htmlFile.content : '<h1>لا يوجد ملف HTML</h1>';
        
        // إضافة CSS و JS داخلياً
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <style>
                    ${cssFile ? cssFile.content : ''}
                    body { font-family: system-ui; padding: 20px; }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body>
                ${htmlContent}
                <script>
                    ${jsFile ? jsFile.content : ''}
                </script>
            </body>
            </html>
        `;
        
        previewFrame.srcdoc = fullHtml;
    }
    
    setupTerminal() {
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.querySelector('.terminal-output');
        const clearBtn = document.getElementById('clear-terminal');
        const runBtn = document.getElementById('run-terminal');
        
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    this.executeTerminalCommand(command);
                    terminalInput.value = '';
                }
            }
        });
        
        clearBtn.addEventListener('click', () => {
            terminalOutput.innerHTML = '';
        });
        
        runBtn.addEventListener('click', () => {
            this.executeTerminalCommand('npm start');
        });
    }
    
    executeTerminalCommand(command) {
        const terminalOutput = document.querySelector('.terminal-output');
        
        // إضافة الأمر إلى السجل
        this.terminalHistory.push(command);
        
        // عرض الأمر
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `
            <span class="prompt">$</span>
            <span class="command">${command}</span>
        `;
        terminalOutput.appendChild(commandLine);
        
        // تنفيذ الأمر
        let output = '';
        
        if (command === 'ls' || command === 'dir') {
            output = this.currentProject.files.map(f => f.name).join('<br>');
        } else if (command === 'pwd') {
            output = '/projects/' + this.currentProject.name;
        } else if (command === 'node --version') {
            output = 'v18.17.0';
        } else if (command === 'npm init') {
            output = 'تم إنشاء package.json بنجاح';
        } else if (command === 'npm start') {
            output = 'جاري تشغيل المشروع...<br>الخادم يعمل على http://localhost:3000';
        } else if (command.startsWith('echo ')) {
            output = command.substring(5);
        } else {
            output = `أمر غير معروف: ${command}<br>جرب: ls, pwd, node --version, npm init`;
        }
        
        // عرض الناتج
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line output';
        outputLine.innerHTML = output;
        terminalOutput.appendChild(outputLine);
        
        // التمرير للأسفل
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    updateCursorPosition(line, column) {
        const lineInfo = document.getElementById('line-info');
        lineInfo.innerHTML = `<i class="fas fa-align-left"></i> سطر ${line}، عمود ${column}`;
    }
    
    setupEvents() {
        // أحداث الملفات الجديدة
        document.getElementById('new-file').addEventListener('click', () => {
            this.createNewFile();
        });
        
        document.getElementById('new-folder').addEventListener('click', () => {
            this.createNewFolder();
        });
        
        // تشغيل المشروع
        document.getElementById('run-project').addEventListener('click', () => {
            this.runProject();
        });
        
        // تحديث المعاينة
        document.getElementById('refresh-preview').addEventListener('click', () => {
            this.updatePreview();
        });
        
        // محادثة AI
        document.getElementById('send-ai-message').addEventListener('click', () => {
            this.sendAIMessage();
        });
        
        const aiInput = document.getElementById('ai-chat-input');
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });
        
        // إجراءات AI السريعة
        document.querySelectorAll('.ai-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                aiInput.value = prompt;
                this.sendAIMessage();
            });
        });
    }
    
    createNewFile() {
        const fileName = prompt('اسم الملف الجديد (مثال: app.js):', 'newfile.js');
        if (fileName) {
            const newFile = {
                id: 'file-' + Date.now(),
                name: fileName,
                path: '/' + fileName,
                content: '// ملف جديد\n',
                language: this.getFileLanguage(fileName),
                isOpen: true
            };
            
            this.currentProject.files.push(newFile);
            this.openFile(newFile);
        }
    }
    
    getFileLanguage(filename) {
        if (filename.endsWith('.html')) return 'html';
        if (filename.endsWith('.css')) return 'css';
        if (filename.endsWith('.js')) return 'javascript';
        if (filename.endsWith('.json')) return 'json';
        if (filename.endsWith('.py')) return 'python';
        return 'plaintext';
    }
    
    createNewFolder() {
        const folderName = prompt('اسم المجلد الجديد:', 'new-folder');
        if (folderName) {
            alert(`تم إنشاء المجلد "${folderName}"`);
        }
    }
    
    runProject() {
        this.executeTerminalCommand('npm start');
        
        const chatMessages = document.getElementById('ai-chat-messages');
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><strong>جاري تشغيل المشروع...</strong></p>
                <p>✓ تم تحميل جميع الملفات</p>
                <p>✓ جاري بدء الخادم المحلي</p>
                <p>👉 افتح <a href="#" onclick="alert('http://localhost:3000')">http://localhost:3000</a></p>
            </div>
        `;
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendAIMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        const chatMessages = document.getElementById('ai-chat-messages');
        
        // إضافة رسالة المستخدم
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        chatMessages.appendChild(userMessage);
        
        // محاكاة رد AI
        setTimeout(() => {
            this.simulateAIResponse(message, chatMessages);
        }, 1000);
        
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    simulateAIResponse(message, chatMessages) {
        let response = '';
        
        if (message.includes('صفحة') || message.includes('HTML')) {
            response = `✅ لقد قمت بإنشاء صفحة HTML جديدة لك!<br>
                    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;صفحتي&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;مرحباً!&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                    <button class="btn-small" onclick="platform.applyAICode('html')">تطبيق الكود</button>`;
        } else if (message.includes('زر') || message.includes('button')) {
            response = `🎨 إليك كود زر جميل:<br>
                    <pre><code>&lt;button style="
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
"&gt;
    اضغط هنا
&lt;/button&gt;</code></pre>`;
        } else {
            response = `🤖 فهمت طلبك: "${message}"<br>
                    أنا أقوم الآن بمعالجة طلبك وإنشاء الكود المناسب.<br>
                    هل تريد أن أضيف أي ميزات خاصة؟`;
        }
        
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${response}
            </div>
        `;
        
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    applyAICode(type) {
        if (type === 'html') {
            const newContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحة تم إنشاؤها بواسطة AI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f0f2f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1a73e8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 تم إنشاء هذه الصفحة بواسطة الذكاء الاصطناعي</h1>
        <p>مرحباً! هذه صفحة HTML تم إنشاؤها تلقائياً بواسطة مساعد الذكاء الاصطناعي.</p>
        <p>يمكنك تعديل هذا الكود كما تريد!</p>
    </div>
</body>
</html>`;
            
            this.editor.setValue(newContent);
            this.saveCurrentFile();
            this.updatePreview();
        }
    }
}

// تهيئة المنصة عند تحميل الصفحة
let platform;
window.addEventListener('DOMContentLoaded', () => {
    platform = new AIDevPlatform();
    window.platform = platform; // لجعلها متاحة عالمياً
});