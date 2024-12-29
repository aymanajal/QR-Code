/// <reference path="./src/types/global.d.ts"/>

// 创建二维码容器
function createQRCodeContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'webpage-qrcode-container';
  
  const qrcodeContainer = document.createElement('div');
  qrcodeContainer.id = 'qrcode-container';
  
  const qrcodeElement = document.createElement('div');
  qrcodeElement.id = 'qrcode';
  
  const faviconElement = document.createElement('img');
  faviconElement.id = 'favicon';
  faviconElement.alt = '扫码图标';
  // 使用固定的图标
  faviconElement.src = chrome.runtime.getURL('icons/qr-icon.png');
  
  const siteNameElement = document.createElement('div');
  siteNameElement.id = 'site-name';
  
  qrcodeContainer.appendChild(qrcodeElement);
  qrcodeContainer.appendChild(faviconElement);
  container.appendChild(qrcodeContainer);
  container.appendChild(siteNameElement);

  // 添加点击事件，点击时放大显示
  container.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      cursor: pointer;
    `;

    const largeQRCode = container.cloneNode(true) as HTMLElement;
    largeQRCode.style.cssText = `
      position: static;
      transform: scale(2);
      opacity: 1;
      cursor: default;
      pointer-events: none;
      margin: 0;
      right: auto;
      bottom: auto;
      background: white;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;

    overlay.appendChild(largeQRCode);
    document.body.appendChild(overlay);

    // 点击遮罩层时关闭
    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // 阻止事件冒泡，防止点击二维码时关闭
    largeQRCode.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  
  return container;
}

// 创建开关按钮
function createToggleButton(): HTMLDivElement {
  const button = document.createElement('div');
  button.className = 'qrcode-toggle-btn active';
  
  // 从 localStorage 读取状态
  const isHidden = localStorage.getItem('qrcode-hidden') === 'true';
  if (isHidden) {
    button.classList.remove('active');
  }
  
  return button;
}

// 修改生成二维码函数
function generateQRCode() {
  const container = createQRCodeContainer();
  const toggleBtn = createToggleButton();
  
  // 从 localStorage 读取状态
  const isHidden = localStorage.getItem('qrcode-hidden') === 'true';
  if (isHidden) {
    container.classList.add('hidden');
  }
  
  document.body.appendChild(container);
  document.body.appendChild(toggleBtn);
  
  // 添加开关按钮点击事件
  toggleBtn.addEventListener('click', () => {
    const isCurrentlyHidden = container.classList.contains('hidden');
    
    if (isCurrentlyHidden) {
      container.classList.remove('hidden');
      toggleBtn.classList.add('active');
      localStorage.setItem('qrcode-hidden', 'false');
    } else {
      container.classList.add('hidden');
      toggleBtn.classList.remove('active');
      localStorage.setItem('qrcode-hidden', 'true');
    }
  });
  
  const qrcodeElement = container.querySelector('#qrcode');
  const siteNameElement = container.querySelector('#site-name');
  
  if (qrcodeElement && siteNameElement) {
    // 设置网站名称
    siteNameElement.textContent = document.title || '未知网站';
    
    // 生成二维码
    const qr = (window as any).qrcode(0, 'H');
    qr.addData(window.location.href);
    qr.make();
    qrcodeElement.innerHTML = qr.createSvgTag(6, 10);
  }
}

// 等待页面加载完成后生成二维码
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateQRCode);
} else {
  generateQRCode();
} 