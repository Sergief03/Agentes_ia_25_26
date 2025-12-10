// ===== Configuración =====
const API_HOST = window.location.hostname || 'localhost';
const API_PROTOCOL = window.location.protocol === 'https:' ? 'https:' : 'http:';
const API_PORT = '3000';
const API_URL = `${API_PROTOCOL}//${API_HOST}:${API_PORT}`;

// ===== Elementos del DOM =====
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const statusElement = document.getElementById('status');
const statusText = statusElement.querySelector('.status-text');
const charCount = document.getElementById('charCount');
const fileInput = document.getElementById('fileInput');

// ===== Estado =====
let isProcessing = false;

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
    setupEventListeners();
    adjustTextareaHeight();
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Enviar mensaje al hacer clic
    sendButton.addEventListener('click', sendMessage);
    
    // Enviar mensaje con Enter (Shift+Enter para nueva línea)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize del textarea
    messageInput.addEventListener('input', () => {
        adjustTextareaHeight();
        updateCharCount();
        updateSendButton();
    });
    
    // Click en ejemplos
    document.addEventListener('click', (e) => {
        if (e.target.closest('.examples-list li')) {
            const example = e.target.closest('.examples-list li').textContent;
            messageInput.value = example;
            updateCharCount();
            updateSendButton();
            messageInput.focus();
        }
    });
}

// ===== Funciones de UI =====
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = count;
    charCount.style.color = count > 450 ? 'var(--warning-color)' : 'var(--text-tertiary)';
}

function updateSendButton() {
    const hasText = messageInput.value.trim().length > 0;
    sendButton.disabled = !hasText || isProcessing;
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== Verificar estado del servidor =====
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            statusElement.classList.add('connected');
            statusText.textContent = `Conectado (${data.servicios.qdrant.fragmentos} fragmentos)`;
        } else {
            setServerStatus('error', 'Error de conexión');
        }
    } catch (error) {
        setServerStatus('error', 'Servidor desconectado');
        console.error('Error conectando con el servidor:', error);
    }
}

function setServerStatus(status, text) {
    statusElement.classList.remove('connected');
    if (status === 'connected') {
        statusElement.classList.add('connected');
    }
    statusText.textContent = text;
}

// Enviar archivo
async function sendFile() {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('archivo', file);

    try {
        const response = await fetch(`${API_URL}/insertar`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        if (data.ok) {
            addMessage('Archivo cargado correctamente', 'bot');
        } else {
            addMessage('Error al cargar el archivo', 'bot');
        }
    } catch (error) {
        console.error('Error al enviar el archivo:', error);
        addMessage('Error al cargar el archivo', 'bot');
    }
}

fileInput.addEventListener('input', sendFile);

// ===== Enviar mensaje =====
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Agregar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    messageInput.value = '';
    updateCharCount();
    updateSendButton();
    adjustTextareaHeight();
    
    isProcessing = true;
    let botMessageDiv = null;
    let botContentElement = null;
    let botSourcesElement = null;
    let fullText = '';
    
    try {
        // Crear burbuja del bot vacía (con indicador de carga inicial si se desea, o simplemente vacía)
        const botMessageUI = createMessageUI('bot');
        botMessageDiv = botMessageUI.messageDiv;
        botContentElement = botMessageUI.contentElement;
        botSourcesElement = botMessageUI.sourcesElement;
        
        chatMessages.appendChild(botMessageDiv);
        scrollToBottom();

        // Llamar a la API
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje: message, limite: 3 })
        });
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                
                try {
                    const data = JSON.parse(line);
                    
                    if (data.type === 'sources') {
                        // Renderizar fuentes
                        if (data.data && data.data.length > 0) {
                            botSourcesElement.innerHTML = `
                                <div class="sources-title">📚 Fuentes consultadas:</div>
                                ${data.data.map(s => `
                                    <div class="source-item">
                                        ${truncateText(s.contenido, 120)}
                                        <span class="source-similarity">${(s.similitud * 100).toFixed(0)}% similar</span>
                                    </div>
                                `).join('')}
                            `;
                            botSourcesElement.style.display = 'block';
                        }
                    } else if (data.type === 'content') {
                        // Agregar texto
                        fullText += data.text;
                        botContentElement.innerHTML = formatMessage(fullText);
                        scrollToBottom();
                    } else if (data.type === 'error') {
                        throw new Error(data.text);
                    }
                } catch (e) {
                    console.error('Error procesando chunk:', e);
                }
            }
        }
        
    } catch (error) {
        if (botContentElement) {
            botContentElement.innerHTML += `<br><br><span class="error-text">❌ Error: ${error.message}</span>`;
        } else {
            addMessage(
                '❌ Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
                'bot',
                null,
                true
            );
        }
        console.error('Error:', error);
    } finally {
        isProcessing = false;
        updateSendButton();
    }
}

// ===== UI Helpers =====
function createMessageUI(type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    const avatarSVG = type === 'bot' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>';
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${type}-avatar">
            ${avatarSVG}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="message-text"></div>
                <div class="sources" style="display: none;"></div>
                <span class="message-time">${time}</span>
            </div>
        </div>
    `;
    
    return {
        messageDiv,
        contentElement: messageDiv.querySelector('.message-text'),
        sourcesElement: messageDiv.querySelector('.sources')
    };
}

// ===== Agregar mensaje simple (para usuario o errores) =====
function addMessage(content, type, sources = null, isError = false) {
    const ui = createMessageUI(type);
    
    if (isError) {
        ui.messageDiv.querySelector('.message-bubble').classList.add('error-message');
    }
    
    ui.contentElement.innerHTML = formatMessage(content);
    
    if (sources && sources.length > 0) {
        ui.sourcesElement.innerHTML = `
            <div class="sources-title">📚 Fuentes consultadas:</div>
            ${sources.map(s => `
                <div class="source-item">
                    ${truncateText(s.contenido, 120)}
                    <span class="source-similarity">${(s.similitud * 100).toFixed(0)}% similar</span>
                </div>
            `).join('')}
        `;
        ui.sourcesElement.style.display = 'block';
    }
    
    chatMessages.appendChild(ui.messageDiv);
    scrollToBottom();
}



// ===== Utilidades =====
function formatMessage(text) {
    // Convertir saltos de línea a <br>
    text = text.replace(/\n/g, '<br>');
    
    // Formatear texto en negrita
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Formatear listas
    text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul class="examples-list">$1</ul>');
    
    return text;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ===== Reconexión automática =====
setInterval(() => {
    if (!statusElement.classList.contains('connected')) {
        checkServerStatus();
    }
}, 10000); // Verificar cada 10 segundos
