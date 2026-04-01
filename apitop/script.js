// 主标签切换
document.addEventListener('DOMContentLoaded', function() {
    // 主标签切换功能
    const mainTabBtns = document.querySelectorAll('.main-tab-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    mainTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 移除所有活动状态
            mainTabBtns.forEach(b => b.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
    
    // 平台标签切换功能
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('platform-tab')) {
            const platform = e.target.getAttribute('data-platform');
            const section = e.target.closest('.content-section');
            
            // 移除当前section内所有平台标签的活动状态
            section.querySelectorAll('.platform-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 移除当前section内所有平台内容的活动状态
            section.querySelectorAll('.platform-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加活动状态
            e.target.classList.add('active');
            section.querySelector(`.platform-content.${platform}`).classList.add('active');
        }
    });
});
