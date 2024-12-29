/// <reference types="chrome"/>
/// <reference path="./src/types/global.d.ts"/>

// 等待 QRCode 库加载
const waitForQRCode = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (typeof window.qrcode !== 'undefined') {
      console.log('QRCode 已加载');
      window.QRCodeLoaded = true;
      resolve();
      return;
    }

    console.log('等待 QRCode 加载...');

    const timeout = setTimeout(() => {
      console.error('QRCode 加载超时');
      reject(new Error('QRCode 库加载超时'));
    }, 5000);

    const checkInterval = setInterval(() => {
      console.log('检查 QRCode 状态:', {
        QRCodeLoaded: window.QRCodeLoaded,
        QRCodeDefined: typeof window.qrcode !== 'undefined'
      });

      if (typeof window.qrcode !== 'undefined') {
        window.QRCodeLoaded = true;
      }

      if (window.QRCodeLoaded) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        console.log('QRCode 加载完成');
        resolve();
      }
    }, 100);
  });
};

// 当文档加载完成时执行
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('开始生成二维码...');
    
    // 等待 QRCode 库加载
    await waitForQRCode();
    console.log('QRCode 库加载成功');
    
    // 获取当前标签页信息
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    console.log('当前标签页:', currentTab);

    // 获取网页元素
    const qrcodeElement = document.getElementById('qrcode');
    const faviconElement = document.getElementById('favicon') as HTMLImageElement;
    const siteNameElement = document.getElementById('site-name');

    if (!qrcodeElement) console.error('找不到 qrcode 元素');
    if (!faviconElement) console.error('找不到 favicon 元素');
    if (!siteNameElement) console.error('找不到 site-name 元素');

    if (currentTab.url && qrcodeElement && faviconElement && siteNameElement) {
      console.log('准备生成二维码，URL:', currentTab.url);
      
      // 设置网站图标
      faviconElement.src = currentTab.favIconUrl || 'icons/default-favicon.png';

      // 设置网站名称
      siteNameElement.textContent = currentTab.title || '未知网站';

      // 清空已有的二维码
      qrcodeElement.innerHTML = '';

      // 生成二维码
      const qr = window.qrcode(0, 'H');
      qr.addData(currentTab.url);
      qr.make();
      qrcodeElement.innerHTML = qr.createSvgTag(5, 10);

      console.log('二维码生成完成');
    }
  } catch (error: any) {
    console.error('生成二维码时发生错误:', error);
    // 在页面上显示错误信息
    const container = document.querySelector('.container');
    if (container) {
      const errorMessage = error.message || '未知错误';
      container.innerHTML = `<div style="color: red;">生成二维码时发生错误: ${errorMessage}</div>`;
    }
  }
}); 