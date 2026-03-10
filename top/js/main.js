/**
 * AI Tools Tutorial - Main JavaScript
 * 交互逻辑实现
 */

(function() {
    'use strict';

    // =========================================
    // Constants
    // =========================================
    const PARENT_THEME_KEY = 'theme-mode'; // 父页面使用的 localStorage key
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    const THEME_AUTO = 'auto';

    // =========================================
    // Site Mode (CN / Global)
    // =========================================

    /**
     * Apply site mode: show/hide mode-specific elements,
     * replace hardcoded domain references for global mode.
     */
    function applySiteMode() {
        var config = window.CONFIG;
        var isGlobal = window.IS_GLOBAL;
        if (!config) return;

        // Show/hide mode-specific elements
        document.querySelectorAll('.mode-cn').forEach(function(el) {
            el.style.display = isGlobal ? 'none' : '';
        });
        document.querySelectorAll('.mode-global').forEach(function(el) {
            el.style.display = isGlobal ? '' : 'none';
        });

        if (!isGlobal) return; // CN mode needs no replacements

        // Replace all hardcoded domain references in links
        document.querySelectorAll('a[href*="api.augmentproxy.top"]').forEach(function(a) {
            a.href = a.href.replace(/api\.augmentproxy\.top/g, config.domain);
        });

        // Replace text content in code blocks, notices, etc.
        // Use textContent check (handles Prism.js span-split tokens)
        document.querySelectorAll('code, pre, .notice a, .notice').forEach(function(el) {
            if (el.textContent.includes('api.augmentproxy.top')) {
                // Build regex that matches the domain even with HTML tags between chars
                // e.g. api<span>.</span>aiclaude<span>.</span>xyz
                var domainRegex = 'api'
                    + '(?:<[^>]*>)*\\.(?:<\\/[^>]*>)*(?:<[^>]*>)*'
                    + 'augmentproxy'
                    + '(?:<[^>]*>)*\\.(?:<\\/[^>]*>)*(?:<[^>]*>)*'
                    + 'top';
                el.innerHTML = el.innerHTML.replace(new RegExp(domainRegex, 'g'), config.domain);
            }
        });

        // Replace in inline style img src attributes that contain the domain
        document.querySelectorAll('img[src*="api.augmentproxy.top"]').forEach(function(img) {
            img.src = img.src.replace(/api\.augmentproxy\.top/g, config.domain);
        });

        // Walk all text nodes for remaining references
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            if (walker.currentNode.textContent.includes('api.augmentproxy.top')) {
                walker.currentNode.textContent = walker.currentNode.textContent.replace(/api\.augmentproxy\.top/g, config.domain);
            }
        }

        // Update page title
        document.title = 'AI Coding Tools Tutorial - KissAPI';
    }

    // =========================================
    // DOM Elements
    // =========================================
    const productTabs = document.querySelectorAll('.product-tab');
    const platformTabs = document.querySelectorAll('.platform-tab');
    const productContents = document.querySelectorAll('.product-content');
    const faqItems = document.querySelectorAll('.faq-item');
    const codeBlocks = document.querySelectorAll('.code-block');
    const supportQr = document.getElementById('supportQr');
    const qrModal = document.getElementById('qrModal');
    const modalClose = document.getElementById('modalClose');
    const toast = document.getElementById('toast');

    // =========================================
    // Theme Management (跟随父页面主题)
    // =========================================

    /**
     * 检测父页面的主题设置
     * 父页面使用 localStorage['theme-mode'] 存储主题
     * 值为 'dark', 'light', 'auto'
     * 当暗黑模式激活时，父页面的 <html> 会有 'dark' class
     */
    function getParentTheme() {
        try {
            // 方法1: 检查父页面的 HTML class (iframe 嵌入时最可靠)
            if (window.parent !== window) {
                const parentHtml = window.parent.document.documentElement;
                if (parentHtml && parentHtml.classList.contains('dark')) {
                    return THEME_DARK;
                }
            }

            // 方法2: 读取 localStorage (共享存储)
            const parentTheme = localStorage.getItem(PARENT_THEME_KEY);
            if (parentTheme === THEME_DARK) {
                return THEME_DARK;
            } else if (parentTheme === THEME_LIGHT) {
                return THEME_LIGHT;
            } else if (parentTheme === THEME_AUTO || !parentTheme) {
                // auto 模式或未设置，跟随系统
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? THEME_DARK
                    : THEME_LIGHT;
            }

            return THEME_LIGHT;
        } catch (e) {
            // 跨域访问失败时，尝试读取 localStorage
            const parentTheme = localStorage.getItem(PARENT_THEME_KEY);
            if (parentTheme === THEME_DARK) {
                return THEME_DARK;
            } else if (parentTheme === THEME_LIGHT) {
                return THEME_LIGHT;
            }
            // 最后使用系统偏好
            console.log('Cannot access parent theme, using system preference');
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? THEME_DARK
                : THEME_LIGHT;
        }
    }

    /**
     * Apply theme to the document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * 同步父页面主题
     */
    function syncParentTheme() {
        const theme = getParentTheme();
        applyTheme(theme);
    }

    /**
     * Initialize theme from parent page
     */
    function initTheme() {
        // 初始同步
        syncParentTheme();

        // 监听 localStorage 变化（父页面主题切换时触发）
        window.addEventListener('storage', (e) => {
            if (e.key === PARENT_THEME_KEY) {
                syncParentTheme();
            }
        });

        // 监听系统主题变化（当父页面设置为 auto 时）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            syncParentTheme();
        });

        // 定期检查父页面主题（处理 iframe 内无法捕获的变化）
        setInterval(syncParentTheme, 1000);
    }

    // =========================================
    // Product Tab Management
    // =========================================

    /**
     * Switch to a product tab
     */
    function switchProduct(productId) {
        // Update tab active states
        productTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.product === productId);
        });

        // Update content visibility
        productContents.forEach(content => {
            const isActive = content.id === `content-${productId}`;
            content.classList.toggle('active', isActive);
        });

        // Reset platform to Windows when switching products
        switchPlatform('windows', productId);
    }

    /**
     * Handle product tab click
     */
    function handleProductClick(e) {
        const productId = e.currentTarget.dataset.product;
        switchProduct(productId);
    }

    // =========================================
    // Platform Tab Management
    // =========================================

    /**
     * Switch to a platform within the current product
     */
    function switchPlatform(platformId, productId) {
        // Get the current product content
        const currentProduct = productId
            ? document.getElementById(`content-${productId}`)
            : document.querySelector('.product-content.active');

        if (!currentProduct) return;

        // Update tab active states
        platformTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.platform === platformId);
        });

        // Update platform content visibility within current product
        const platformContents = currentProduct.querySelectorAll('.platform-content');
        platformContents.forEach(content => {
            content.classList.toggle('active', content.dataset.platform === platformId);
        });
    }

    /**
     * Handle platform tab click
     */
    function handlePlatformClick(e) {
        const platformId = e.currentTarget.dataset.platform;
        switchPlatform(platformId);
    }

    // =========================================
    // Environment Variable Tabs
    // =========================================

    /**
     * Initialize environment variable tab switching
     */
    function initEnvTabs() {
        document.querySelectorAll('.env-tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.env-tab');
            const parent = tabContainer.parentElement;
            const contents = parent.querySelectorAll('.env-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const envId = tab.dataset.env;

                    // Update tab active states
                    tabs.forEach(t => t.classList.toggle('active', t.dataset.env === envId));

                    // Update content visibility
                    contents.forEach(content => {
                        content.classList.toggle('active', content.dataset.env === envId);
                    });
                });
            });
        });
    }

    // =========================================
    // FAQ Accordion
    // =========================================

    /**
     * Toggle FAQ item open/closed
     */
    function toggleFaq(e) {
        const faqItem = e.currentTarget.closest('.faq-item');
        faqItem.classList.toggle('open');
    }

    // =========================================
    // Code Block Copy
    // =========================================

    /**
     * Copy code to clipboard
     */
    async function copyCode(codeBlock) {
        const code = codeBlock.querySelector('code');
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code.textContent);
            codeBlock.classList.add('copied');
            showToast('代码已复制到剪贴板');

            setTimeout(() => {
                codeBlock.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('复制失败，请手动选择复制');
        }
    }

    /**
     * Initialize code block copy functionality
     */
    function initCodeCopy() {
        codeBlocks.forEach(block => {
            block.addEventListener('click', (e) => {
                // Only trigger on the ::after pseudo-element area (top-right corner)
                const rect = block.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                // Check if click is in the copy button area (top-right 60x30 pixels)
                if (clickX > rect.width - 70 && clickY < 40) {
                    copyCode(block);
                }
            });
        });
    }

    // =========================================
    // QR Code Modal
    // =========================================

    /**
     * Open QR modal
     */
    function openQrModal() {
        qrModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close QR modal
     */
    function closeQrModal() {
        qrModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Initialize QR modal
     */
    function initQrModal() {
        if (supportQr) {
            supportQr.addEventListener('click', openQrModal);
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeQrModal);
        }

        if (qrModal) {
            qrModal.addEventListener('click', (e) => {
                if (e.target === qrModal) {
                    closeQrModal();
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && qrModal.classList.contains('active')) {
                closeQrModal();
            }
        });
    }

    // =========================================
    // Toast Notification
    // =========================================

    let toastTimeout;

    /**
     * Show a toast notification
     */
    function showToast(message) {
        if (!toast) return;

        // Clear any existing timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toast.textContent = message;
        toast.classList.add('active');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    // =========================================
    // Syntax Highlighting Enhancement
    // =========================================

    /**
     * Add JSONC support to Prism
     * JSONC = JSON with Comments
     */
    function initJsoncSupport() {
        if (typeof Prism !== 'undefined') {
            // Clone JSON definition and add comment support
            Prism.languages.jsonc = Prism.languages.extend('json', {});
            Prism.languages.insertBefore('jsonc', 'property', {
                'comment': {
                    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
                    greedy: true
                }
            });
        }
    }

    /**
     * Re-highlight code blocks after content change
     */
    function rehighlight() {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    // =========================================
    // Initialization
    // =========================================

    function init() {
        // Apply site mode (CN/Global) first
        applySiteMode();

        // Initialize theme (跟随父页面)
        initTheme();

        // Product tabs event listeners
        productTabs.forEach(tab => {
            tab.addEventListener('click', handleProductClick);
        });

        // Platform tabs event listeners
        platformTabs.forEach(tab => {
            tab.addEventListener('click', handlePlatformClick);
        });

        // FAQ accordion event listeners
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', toggleFaq);
            }
        });

        // Initialize other features
        initEnvTabs();
        initCodeCopy();
        initQrModal();
        initJsoncSupport();

        // Re-highlight after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', rehighlight);
        } else {
            rehighlight();
        }

        console.log('AI Tools Tutorial initialized');
    }

    // =========================================
    // Start Application
    // =========================================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose showToast for external use
    window.showToast = showToast;

    // Expose switchProduct for external use (e.g., CC-Switch links)
    window.switchToProduct = switchProduct;

})();

