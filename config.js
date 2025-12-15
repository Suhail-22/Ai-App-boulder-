// config.js
const CONFIG = {
    // إعدادات الذكاء الاصطناعي
    AI_PROVIDERS: {
        GEMINI: {
            name: 'Gemini Pro',
            apiKey: '',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            isAvailable: true
        },
        OPENAI: {
            name: 'GPT-4',
            apiKey: '',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            isAvailable: false
        },
        DEEPSEEK: {
            name: 'DeepSeek Coder',
            apiKey: '',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            isAvailable: false
        }
    },
    
    // إعدادات المحرر
    EDITOR_THEMES: ['vs-dark', 'vs-light', 'hc-black'],
    DEFAULT_THEME: 'vs-light',
    
    // قوالب المشاريع
    PROJECT_TEMPLATES: [
        {
            id: 'landing-page',
            name: 'صفحة هبوط',
            description: 'صفحة هبوط احترافية',
            icon: 'fa-rocket',
            category: 'web'
        },
        {
            id: 'portfolio',
            name: 'موقع شخصي',
            description: 'عرض أعمالك ومهاراتك',
            icon: 'fa-user-tie',
            category: 'web'
        },
        {
            id: 'dashboard',
            name: 'لوحة تحكم',
            description: 'لوحة إحصائيات وتقارير',
            icon: 'fa-chart-line',
            category: 'app'
        },
        {
            id: 'ecommerce',
            name: 'متجر إلكتروني',
            description: 'عرض المنتجات وسلة التسوق',
            icon: 'fa-shopping-cart',
            category: 'web'
        },
        {
            id: 'blog',
            name: 'مدونة',
            description: 'نظام تدوين المقالات',
            icon: 'fa-blog',
            category: 'web'
        },
        {
            id: 'todo-app',
            name: 'قائمة مهام',
            description: 'إدارة المهام اليومية',
            icon: 'fa-tasks',
            category: 'app'
        },
        {
            id: 'calculator',
            name: 'حاسبة',
            description: 'حاسبة علمية',
            icon: 'fa-calculator',
            category: 'app'
        },
        {
            id: 'weather-app',
            name: 'تطبيق الطقس',
            description: 'عرض حالة الطقس',
            icon: 'fa-cloud-sun',
            category: 'app'
        }
    ],
    
    // مكتبات CSS جاهزة
    CSS_FRAMEWORKS: [
        { id: 'tailwind', name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com' },
        { id: 'bootstrap', name: 'Bootstrap 5', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
        { id: 'bulma', name: 'Bulma', url: 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css' }
    ],
    
    // مكتبات JS جاهزة
    JS_LIBRARIES: [
        { id: 'jquery', name: 'jQuery', url: 'https://code.jquery.com/jquery-3.6.0.min.js' },
        { id: 'axios', name: 'Axios', url: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js' },
        { id: 'lodash', name: 'Lodash', url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js' }
    ]
};

export default CONFIG;