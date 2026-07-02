import type { ExpenseCategory, Language, PaymentMethod } from '../types';

type NavPage = 'dashboard' | 'list' | 'schedule' | 'stats' | 'settings';

type Translation = {
  appName: string;
  nav: Record<NavPage, string>;
  categories: Record<ExpenseCategory, string>;
  paymentMethods: Record<PaymentMethod, string>;
  dashboard: {
    title: string;
    monthTotal: string;
    recent: string;
    empty: string;
    add: string;
  };
  form: {
    createTitle: string;
    editTitle: string;
    amount: string;
    category: string;
    date: string;
    time: string;
    storeName: string;
    note: string;
    notePlaceholder: string;
    paymentMethod: string;
    receipt: string;
    receiptHelp: string;
    saveCreate: string;
    saveEdit: string;
    cancel: string;
    recognizing: string;
    recognized: string;
    unclear: string;
    required: string;
    autoClassifiedByMemory: string;
  };
  list: {
    title: string;
    empty: string;
    receipt: string;
  };
  detail: {
    title: string;
    back: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    receipt: string;
    noReceipt: string;
  };
  schedule: {
    title: string;
    addTitle: string;
    editTitle: string;
    detailTitle: string;
    deleteTitle: string;
    todayTitle: string;
    selectedScheduleTitle: string;
    selectedExpenseTitle: string;
    empty: string;
    noExpenses: string;
    titleField: string;
    dateField: string;
    startTimeField: string;
    endTimeField: string;
    noteField: string;
    syncField: string;
    addToPhoneCalendar: string;
    addToGoogleCalendar: string;
    saveCreate: string;
    saveEdit: string;
    requiredTitle: string;
    synced: string;
    notSynced: string;
    deleteConfirm: string;
  };
  stats: {
    title: string;
    month: string;
    monthTotal: string;
    todayTotal: string;
    monthCount: string;
    byCategory: string;
    last7Days: string;
    empty: string;
  };
  storeMemory: {
    title: string;
    entry: string;
    empty: string;
    useCount: string;
    lastUsedAt: string;
    delete: string;
  };
  settings: {
    title: string;
    language: string;
    chinese: string;
    japanese: string;
    storageNote: string;
  };
  install: {
    addToHome: string;
    iosHint: string;
    dismiss: string;
  };
  common: {
    yen: string;
    noStore: string;
  };
};

export const categoryKeys: ExpenseCategory[] = [
  'food',
  'clothing',
  'transport',
  'daily',
  'rent',
  'utilities',
  'entertainment',
  'medical',
  'other',
];

export const paymentMethodKeys: PaymentMethod[] = ['cash', 'creditCard', 'electronic'];

export const translations: Record<Language, Translation> = {
  zh: {
    appName: '极简记账',
    nav: {
      dashboard: '首页',
      list: '记账',
      schedule: '日程',
      stats: '统计',
      settings: '设置',
    },
    categories: {
      food: '吃饭',
      clothing: '穿衣',
      transport: '出行',
      daily: '日用品',
      rent: '房租',
      utilities: '水电煤',
      entertainment: '娱乐',
      medical: '医疗',
      other: '其他',
    },
    paymentMethods: {
      cash: '现金',
      creditCard: '信用卡',
      electronic: '电子支付',
    },
    dashboard: {
      title: '本月支出',
      monthTotal: '本月支出',
      recent: '最近记录',
      empty: '还没有记录，先记一笔吧。',
      add: '+ 记一笔',
    },
    form: {
      createTitle: '新增记录',
      editTitle: '编辑记录',
      amount: '金额',
      category: '分类',
      date: '日期',
      time: '时间',
      storeName: '店铺名',
      note: '备注',
      notePlaceholder: '例如：便利店、咖啡、交通',
      paymentMethod: '支付方式',
      receipt: '小票图片',
      receiptHelp: '选择图片后会自动识别金额、日期、店铺和分类。',
      saveCreate: '保存记录',
      saveEdit: '保存修改',
      cancel: '取消',
      recognizing: '正在识别小票...',
      recognized: '已自动填入识别结果',
      unclear: '小票识别不清楚，请手动确认金额和分类。',
      required: '请填写金额。',
      autoClassifiedByMemory: '已根据你的历史记录自动分类',
    },
    list: {
      title: '记账',
      empty: '暂无记录。',
      receipt: '有小票',
    },
    detail: {
      title: '记录详情',
      back: '返回',
      edit: '编辑',
      delete: '删除',
      deleteConfirm: '确定删除这条记录吗？',
      receipt: '小票图片',
      noReceipt: '没有小票图片',
    },
    schedule: {
      title: '日程',
      addTitle: '新增日程',
      editTitle: '编辑日程',
      detailTitle: '日程详情',
      deleteTitle: '删除日程',
      todayTitle: '今天的日程',
      selectedScheduleTitle: '当天日程',
      selectedExpenseTitle: '当天消费',
      empty: '没有日程',
      noExpenses: '没有消费记录',
      titleField: '标题',
      dateField: '日期',
      startTimeField: '开始时间',
      endTimeField: '结束时间',
      noteField: '备注',
      syncField: '同步到手机日历',
      addToPhoneCalendar: '添加到手机日历',
      addToGoogleCalendar: '添加到 Google Calendar',
      saveCreate: '保存日程',
      saveEdit: '保存修改',
      requiredTitle: '请填写标题。',
      synced: '已同步',
      notSynced: '未同步',
      deleteConfirm: '确定删除这条日程吗？',
    },
    stats: {
      title: '统计',
      month: '月份',
      monthTotal: '本月总支出',
      todayTotal: '今天支出',
      monthCount: '本月消费笔数',
      byCategory: '按分类',
      last7Days: '最近 7 天',
      empty: '本月暂无支出。',
    },
    storeMemory: {
      title: '店铺分类记忆',
      entry: '店铺分类记忆',
      empty: '还没有记住任何店铺分类。',
      useCount: '使用次数',
      lastUsedAt: '最后使用',
      delete: '删除',
    },
    settings: {
      title: '设置',
      language: '语言',
      chinese: '中文',
      japanese: '日本語',
      storageNote: '记录、小票图片、日程和店铺记忆只保存在当前浏览器本地。',
    },
    install: {
      addToHome: '添加到手机桌面',
      iosHint: '点击 Safari 底部分享按钮，然后选择「添加到主屏幕」',
      dismiss: '稍后',
    },
    common: {
      yen: '¥',
      noStore: '未填写',
    },
  },
  ja: {
    appName: 'シンプル家計簿',
    nav: {
      dashboard: 'ホーム',
      list: '記録',
      schedule: 'カレンダー',
      stats: '統計',
      settings: '設定',
    },
    categories: {
      food: '食費',
      clothing: '衣類',
      transport: '交通',
      daily: '日用品',
      rent: '家賃',
      utilities: '光熱費',
      entertainment: '娯楽',
      medical: '医療',
      other: 'その他',
    },
    paymentMethods: {
      cash: '現金',
      creditCard: 'クレジットカード',
      electronic: '電子決済',
    },
    dashboard: {
      title: '今月の支出',
      monthTotal: '今月の支出',
      recent: '最近の記録',
      empty: 'まだ記録がありません。',
      add: '+ 記録する',
    },
    form: {
      createTitle: '記録を追加',
      editTitle: '記録を編集',
      amount: '金額',
      category: 'カテゴリ',
      date: '日付',
      time: '時間',
      storeName: '店名',
      note: 'メモ',
      notePlaceholder: '例：コンビニ、カフェ、交通',
      paymentMethod: '支払い方法',
      receipt: 'レシート画像',
      receiptHelp: '画像を選ぶと金額、日付、店名、カテゴリを認識します。',
      saveCreate: '保存',
      saveEdit: '変更を保存',
      cancel: 'キャンセル',
      recognizing: 'レシートを認識中...',
      recognized: '認識結果を入力しました',
      unclear: 'レシートの認識が不明瞭です。金額とカテゴリを確認してください。',
      required: '金額を入力してください。',
      autoClassifiedByMemory: '過去の記録に基づいて自動分類しました',
    },
    list: {
      title: '記録',
      empty: '記録はまだありません。',
      receipt: 'レシートあり',
    },
    detail: {
      title: '記録詳細',
      back: '戻る',
      edit: '編集',
      delete: '削除',
      deleteConfirm: 'この記録を削除しますか？',
      receipt: 'レシート画像',
      noReceipt: 'レシート画像はありません',
    },
    schedule: {
      title: 'カレンダー',
      addTitle: '予定を追加',
      editTitle: '予定を編集',
      detailTitle: '予定詳細',
      deleteTitle: '予定を削除',
      todayTitle: '今日の予定',
      selectedScheduleTitle: '当日の予定',
      selectedExpenseTitle: '当日の支出',
      empty: '予定はありません',
      noExpenses: '支出はありません',
      titleField: 'タイトル',
      dateField: '日付',
      startTimeField: '開始時間',
      endTimeField: '終了時間',
      noteField: 'メモ',
      syncField: 'スマホカレンダーに同期',
      addToPhoneCalendar: 'スマホカレンダーに追加',
      addToGoogleCalendar: 'Google カレンダーに追加',
      saveCreate: '保存',
      saveEdit: '変更を保存',
      requiredTitle: 'タイトルを入力してください。',
      synced: '同期済み',
      notSynced: '未同期',
      deleteConfirm: 'この予定を削除しますか？',
    },
    stats: {
      title: '統計',
      month: '月',
      monthTotal: '今月の合計',
      todayTotal: '今日の支出',
      monthCount: '今月の記録数',
      byCategory: 'カテゴリ別',
      last7Days: '直近 7 日',
      empty: '今月の支出はありません。',
    },
    storeMemory: {
      title: '店舗カテゴリ記憶',
      entry: '店舗カテゴリ記憶',
      empty: '記憶した店舗カテゴリはまだありません。',
      useCount: '使用回数',
      lastUsedAt: '最終使用',
      delete: '削除',
    },
    settings: {
      title: '設定',
      language: '言語',
      chinese: '中文',
      japanese: '日本語',
      storageNote: '記録、画像、予定、店舗記憶はこのブラウザ内にのみ保存されます。',
    },
    install: {
      addToHome: 'ホーム画面に追加',
      iosHint: 'Safari の共有ボタンをタップし、「ホーム画面に追加」を選択してください',
      dismiss: 'あとで',
    },
    common: {
      yen: '¥',
      noStore: '未入力',
    },
  },
};
